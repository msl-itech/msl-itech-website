import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    const { recaptcha_token, ...leadData } = req.body;

    // Vérification du token reCAPTCHA
    if (!recaptcha_token) {
      return res.status(400).json({
        success: false,
        error: 'Token reCAPTCHA manquant'
      });
    }

    // Configuration reCAPTCHA v2
    const RECAPTCHA_SECRET = process.env['RECAPTCHA_SECRET_KEY'];

    if (!RECAPTCHA_SECRET) {
      console.error('Variable RECAPTCHA_SECRET_KEY manquante');
      return res.status(500).json({
        success: false,
        error: 'Configuration reCAPTCHA manquante'
      });
    }

    // Validation du token avec Google reCAPTCHA v2
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=${recaptcha_token}`;

    const recaptchaResponse = await fetch(verifyUrl, {
      method: 'POST'
    });

    const recaptchaResult = await recaptchaResponse.json();

    // Vérifier la validité du token
    if (!recaptchaResult.success) {
      console.error('Token reCAPTCHA invalide:', recaptchaResult['error-codes']);
      return res.status(403).json({
        success: false,
        error: 'Vérification reCAPTCHA échouée',
        details: recaptchaResult['error-codes']
      });
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
      const errorText = await odooResponse.text();
      console.error(`Erreur API Odoo: ${odooResponse.status} - ${errorText}`);
      throw new Error(`Erreur API Odoo: ${odooResponse.status}`);
    }

    const odooResult = await odooResponse.json();
    return res.status(200).json({ success: true, data: odooResult });

  } catch (error) {
    console.error('Erreur lors du traitement du lead:', error);
    return res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la création du lead'
    });
  }
}
