const { transporter, sender } = require("./nodemailer.config");
const {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
} = require("./emailTemplates");

const sendVerificationEmail = async (email, verificationToken) => {
  const mailOptions = {
    from: `"${sender.name}" <${sender.email}>`,
    to: email,
    subject: "Verify your Email",
    html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent:", info.response);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Error sending email");
  }
};

const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: `"${sender.name}" <${sender.email}>`,
    to: email,
    subject: "🎉 Welcome to StoreFlick!",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; color: #333;">
        <div style="max-width: 600px; margin: auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #2f855a;">Hey ${name}, welcome to <span style="color: #3182ce;">StoreFlick</span>! 👋</h2>
          
          <p>We're thrilled to have you on board. StoreFlick is your one-stop shop to explore and discover amazing products tailored just for you.</p>
          
          <p>Here’s what you can do right now:</p>
          <ul>
            <li>🛍️ Explore trending products</li>
            <li>🔐 Manage your profile and preferences</li>
            <li>💬 Reach out to our support anytime</li>
          </ul>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://storeflick.com/login" style="padding: 12px 24px; background-color: #3182ce; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Go to Your Dashboard
            </a>
          </div>

          <p>If you have any questions, just reply to this email—we’re always here to help 😊</p>

          <p>Cheers,<br/>The StoreFlick Team</p>

          <hr style="margin: 40px 0;">
          <small style="font-size: 12px; color: #999;">
            You're receiving this email because you signed up for StoreFlick.<br/>
            If this wasn't you, please ignore this message.
          </small>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Welcome email sent:", info.response);
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Error sending welcome email");
  }
};


const sendPasswordResetEmail = async (email, resetURL) => {
  const mailOptions = {
    from: `"${sender.name}" <${sender.email}>`,
    to: email,
    subject: "Reset your Password",
    html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent:", info.response);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Error sending password reset email");
  }
};

const sendResetSuccessEmail = async (email) => {
  const mailOptions = {
    from: `"${sender.name}" <${sender.email}>`,
    to: email,
    subject: "Password Reset Successful",
    html: PASSWORD_RESET_SUCCESS_TEMPLATE,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset success email sent:", info.response);
  } catch (error) {
    console.error("Error sending password reset success email:", error);
    throw new Error("Error sending password reset success email");
  }
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
};
