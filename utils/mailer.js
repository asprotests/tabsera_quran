const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendEmail = async ({ to, subject, text, html }) => {
  const msg = {
    to,
    from: process.env.SENDGRID_EMAIL,
    subject,
    text,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log(`📨 Email sent to ${to}`);
  } catch (error) {
    console.error("Email error:", error.response?.body || error.message);
  }
};
