module.exports = ({ env }) => ({
  email: {
    provider: 'nodemailer',
    providerOptions: {
      host: env('SMTP_HOST'),
      port: env('SMTP_PORT'),
      secure: env('SMTP_SECURE'),
      username: env('SMTP_USERNAME'),
      password: env('SMTP_PASSWORD'),
      auth: {
        user: env('SMTP_USERNAME'),
        pass: env('SMTP_PASSWORD')
      }
    },
    settings: {
      defaultFrom: env('MAIL', 'local@localhost.localhost'),
      defaultReplyTo: env('MAIL', 'local@localhost.localhost')
    }
  }
});
