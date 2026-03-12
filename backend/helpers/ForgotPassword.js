const nodemailer = require("nodemailer");

const USER_EMAIL = process.env.USER_EMAIL;
const USER_PASS = process.env.USER_PASS;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: USER_EMAIL,
    pass: USER_PASS,
  },
});

exports.SendResetPasswordMail = async (otp, Email, username) => {
  

  await transporter.sendMail({
    from: `"HelpX Support" <${USER_EMAIL}>`,
    to: Email,
    subject: "Reset Password",
    html: `
      <div>
        <h2>Hello ${username}</h2>

        <p>Here's the OTP below:</p>
        ${otp}

        <p>This Link expires in 10 minutes.</p>
      </div>
    `,
  });
};
