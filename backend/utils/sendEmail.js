const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    service: process.env.SMTP_SERVICE,
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  const mailOptions = { from: process.env.SMTP_MAIL, ...options };
  await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
