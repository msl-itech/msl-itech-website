module.exports = async (req, res) => {
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

    console.log('[API] Requête reçue, token présent:', !!recaptcha_token);

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
      console.error('[API] Variable RECAPTCHA_SECRET_KEY manquante');
      return res.status(500).json({
        success: false,
        error: 'Configuration reCAPTCHA manquante',
        debug: 'RECAPTCHA_SECRET_KEY not set'
      });
    }

    console.log('[API] Validation reCAPTCHA en cours...');

    // Validation du token avec Google reCAPTCHA v2
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=${recaptcha_token}`;

    const recaptchaResponse = await fetch(verifyUrl, {
      method: 'POST'
    });

    const recaptchaResult = await recaptchaResponse.json();

    console.log('[API] Résultat reCAPTCHA:', recaptchaResult);

    // Vérifier la validité du token
    if (!recaptchaResult.success) {
      console.error('[API] Token reCAPTCHA invalide:', recaptchaResult['error-codes']);
      return res.status(403).json({
        success: false,
        error: 'Vérification reCAPTCHA échouée',
        details: recaptchaResult['error-codes']
      });
    }

    console.log('[API] reCAPTCHA validé, envoi vers Odoo...');

    // Token valide, transférer à l'API Odoo
    const ODOO_API_URL = process.env['ODOO_API_URL'] || 'https://api-connect-odoo.vercel.app/api';
    const X_SIGNATURE = process.env['X_SIGNATURE'];
    const X_CLIENT_ID = process.env['X_CLIENT_ID'] || 'client_mslitech';

    if (!X_SIGNATURE) {
      console.error('[API] Variable X_SIGNATURE manquante');
      return res.status(500).json({
        success: false,
        error: 'Configuration API Odoo manquante',
        debug: 'X_SIGNATURE not set'
      });
    }

    console.log('[API] Envoi vers:', ODOO_API_URL);

    const odooResponse = await fetch(`${ODOO_API_URL}/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-signature': X_SIGNATURE,
        'x-client-id': X_CLIENT_ID
      },
      body: JSON.stringify(leadData)
    });

    console.log('[API] Réponse Odoo status:', odooResponse.status);

    if (!odooResponse.ok) {
      const errorText = await odooResponse.text();
      console.error(`[API] Erreur API Odoo: ${odooResponse.status} - ${errorText}`);
      return res.status(odooResponse.status).json({
        success: false,
        error: `Erreur API Odoo: ${odooResponse.status}`,
        details: errorText
      });
    }

    const odooResult = await odooResponse.json();
    console.log('[API] Lead créé avec succès');

    return res.status(200).json({ success: true, data: odooResult });

  } catch (error) {
    console.error('[API] Erreur lors du traitement du lead:', error);
    return res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la création du lead',
      details: error.message,
      stack: process.env['NODE_ENV'] === 'development' ? error.stack : undefined
    });
  }
};
