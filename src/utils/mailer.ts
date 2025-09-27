import nodemailer from 'nodemailer';

// Configurazione SMTP Brevo
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, // true per 465
  auth: {
    user: '96a954001@smtp-brevo.com', // controlla che sia l'username SMTP corretto
    pass: 'EgS0ALZ1bMHfyaFj',         // chiave SMTP generata in Brevo
  },
  tls: {
    rejectUnauthorized: false, // utile se hai problemi con certificati
  },
});

// Verifica connessione
transporter.verify(function (error, success) {
  if (error) {
    console.error('Errore SMTP:', error);
  } else {
    console.log('Server SMTP pronto a inviare');
  }
});

export async function sendMail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  const mailOptions = {
    from: '"Todo-App" <todo@stackhorizon.it>', // deve essere verificata su Brevo!
    to,
    subject,
    text,
    html,
  }; 

  return transporter.sendMail(mailOptions);
}
