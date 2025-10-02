const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: "bhaskarabbisetti9@gmail.com",   
    pass: "zbwo vcfw dsoj vddk",      
  },
});

async function sendEmail(to, subject, text) {
  await transporter.sendMail({
    from: '"Stock Alerts" <your-email@gmail.com>',
    to,
    subject,
    text,
  });
}

module.exports = { sendEmail };
