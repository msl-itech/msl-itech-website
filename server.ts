import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import AppServerModule from './src/main.server';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Middleware pour parser le JSON
  server.use(express.json());

  // API endpoint pour valider reCAPTCHA et créer des leads
  server.post('/api/leads', async (req, res): Promise<void> => {
    try {
      const { recaptcha_token, ...leadData } = req.body;

      // Vérification du token reCAPTCHA
      if (!recaptcha_token) {
        res.status(400).json({
          success: false,
          error: 'Token reCAPTCHA manquant'
        });
        return;
      }

      // Configuration reCAPTCHA Enterprise
      const RECAPTCHA_SECRET = process.env['RECAPTCHA_SECRET_KEY'];
      const RECAPTCHA_PROJECT_ID = process.env['RECAPTCHA_PROJECT_ID'];
      const RECAPTCHA_SITE_KEY = '6Ld59pgsAAAAAB50gGD8ei7IfKUPhsr9WyYPIro-';

      if (!RECAPTCHA_SECRET || !RECAPTCHA_PROJECT_ID) {
        console.error('Variables d\'environnement reCAPTCHA manquantes');
        res.status(500).json({
          success: false,
          error: 'Configuration reCAPTCHA manquante'
        });
        return;
      }

      // Validation du token avec Google reCAPTCHA Enterprise
      const assessmentUrl = `https://recaptchaenterprise.googleapis.com/v1/projects/${RECAPTCHA_PROJECT_ID}/assessments?key=${RECAPTCHA_SECRET}`;

      const recaptchaResponse = await fetch(assessmentUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: {
            token: recaptcha_token,
            siteKey: RECAPTCHA_SITE_KEY,
            expectedAction: 'submit'
          }
        })
      });

      const recaptchaResult = await recaptchaResponse.json();

      // Vérifier la validité du token
      if (!recaptchaResult.tokenProperties?.valid) {
        console.error('Token reCAPTCHA invalide:', recaptchaResult);
        res.status(403).json({
          success: false,
          error: 'Vérification reCAPTCHA échouée'
        });
        return;
      }

      // Vérifier le score (0.0 = bot, 1.0 = humain)
      const score = recaptchaResult.riskAnalysis?.score || 0;
      if (score < 0.5) {
        console.warn('Score reCAPTCHA trop faible:', score);
        res.status(403).json({
          success: false,
          error: 'Score de sécurité insuffisant'
        });
        return;
      }

      // Token valide, transférer à l'API Odoo
      const ODOO_API_URL = process.env['ODOO_API_URL'] || 'https://api-connect-odoo.vercel.app/api';
      const X_SIGNATURE = process.env['X_SIGNATURE'];
      const X_CLIENT_ID = process.env['X_CLIENT_ID'] || 'client_mslitech';

      const odooResponse = await fetch(`${ODOO_API_URL}/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-signature': X_SIGNATURE || '',
          'x-client-id': X_CLIENT_ID
        },
        body: JSON.stringify(leadData)
      });

      if (!odooResponse.ok) {
        throw new Error(`Erreur API Odoo: ${odooResponse.status}`);
      }

      const odooResult = await odooResponse.json();
      res.json({ success: true, data: odooResult });

    } catch (error) {
      console.error('Erreur lors du traitement du lead:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur serveur lors de la création du lead'
      });
    }
  });

  // Serve static files from /browser
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap: AppServerModule,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
