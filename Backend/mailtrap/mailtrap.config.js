require('dotenv').config();
const { MailtrapClient } = require("mailtrap");

const TOKEN = "642152190b28acb522cf3e1bbd1f27d0";

const client = new MailtrapClient({
  token: TOKEN,
});

const sender = {
  email: "hello@demomailtrap.co",
  name: "Vikas Kumar",
};
// const recipients = [
//   {
//     email: "vikas12252@gmail.com",
//   }
// ];

// client
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     text: "Congrats for sending test email with Mailtrap!",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);

module.exports = {client, sender};