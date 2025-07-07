const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // Or use another SMTP provider like Outlook, Zoho, etc.
  auth: {
    user: process.env.SMTP_EMAIL, // e.g. your Gmail
    pass: process.env.SMTP_PASSWORD, // app password for Gmail
  },
});

const sender = {
  name: "Vikas Kumar",
  email: process.env.SMTP_EMAIL,
};

module.exports = { transporter, sender };
