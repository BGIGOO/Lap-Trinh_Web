  // utils/mailer.js
  const nodemailer = require('nodemailer');

  let transporter = null;
  function getTransporter() {
    if (transporter) return transporter;

    const {
      SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS
    } = process.env;

    if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: String(SMTP_SECURE || '').toLowerCase() === 'true',
        auth: { user: SMTP_USER, pass: SMTP_PASS }
      });
    } else {
      // Dev fallback: log ra console
      transporter = {
        sendMail: async (opts) => {
          console.log('[MAIL:DEV] To:', opts.to);
          console.log('[MAIL:DEV] Subject:', opts.subject);
          console.log('[MAIL:DEV] Text:', opts.text);
          console.log('[MAIL:DEV] HTML:', opts.html);
          return { messageId: 'dev' };
        }
      };
    }
    return transporter;
  }

const styles = {
  container: `font-family: Arial, sans-serif; max-width: 560px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;`,
  heading: `font-size: 24px; color: #00473e;`,
  paragraph: `font-size: 16px; color: #475d5b; line-height: 1.5;`,
  button: `display: inline-block; padding: 12px 20px; border-radius: 6px; background-color: #faae2b; color: #00473e; text-decoration: none; font-weight: bold;`,
  highlight: `font-weight: bold; color: #00473e;`,
  footer: `color: #64748b; font-size: 12px; margin-top: 20px; border-top: 1px solid #eee; padding-top: 15px;`
};

function resetHtmlTemplate({ name, resetUrl, expiresMinutes, requesterIp }) {
  return `
  <div style="${styles.container}">
    <h2 style="${styles.heading}">Đặt lại mật khẩu</h2>
    <p style="${styles.paragraph}">Xin chào ${name || 'bạn'},</p>
    <p style="${styles.paragraph}">
      Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của bạn. 
      Vui lòng nhấn vào nút bên dưới để tiếp tục.
    </p>
    <p style="margin: 25px 0;">
      <a href="${resetUrl}" style="${styles.button}">
        Đặt lại mật khẩu
      </a>
    </p>
    <p style="${styles.paragraph}">
      Liên kết này sẽ hết hạn trong <span style="${styles.highlight}">${expiresMinutes} phút</span>.
    </p>
    <div style="${styles.footer}">
      <p>Yêu cầu này được gửi từ địa chỉ IP: ${requesterIp || 'unknown'}.</p>
      <p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này. Tài khoản của bạn vẫn an toàn.</p>
    </div>
  </div>
  `;
}

  module.exports = {
    async sendPasswordReset(toEmail, { name, resetUrl, expiresMinutes, requesterIp }) {
      const from = process.env.SMTP_FROM || 'no-reply@example.com';
      const subject = 'Đặt lại mật khẩu';
      const text =
  `Xin chào ${name || ''},
  Bạn vừa yêu cầu đặt lại mật khẩu.
  Link: ${resetUrl}
  Hết hạn trong ${expiresMinutes} phút.
  Nếu không phải bạn, vui lòng bỏ qua.
  (IP: ${requesterIp || 'unknown'})`;

      const html = resetHtmlTemplate({ name, resetUrl, expiresMinutes, requesterIp });

      const t = getTransporter();
      await t.sendMail({ from, to: toEmail, subject, text, html });
    }
  };
