const nodeMailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const USER_EMAIL = process.env.USER_EMAIL;
const USER_PASS = process.env.USER_PASS;

const templatePath = path.join(
  __dirname,
  "../templates/VerificationTemplate.html",
);
let htmlTemplate = fs.readFileSync(templatePath, "utf-8");

const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: USER_EMAIL,
    pass: USER_PASS,
  },
});

const sendMailwithGmailVerify = async (newUser, verifyUserToken) => {
  const verifyLink = `http://localhost:4000/api/auth/verify/${verifyUserToken}`;
  const personalizedHtml = htmlTemplate.replace(
    "{{verification_link}}",
    verifyLink,
  );

  await transporter.sendMail({
    from: `HelpX Support <${USER_EMAIL}>`,
    to: newUser.Email,
    subject: "Email Verification",
    html: personalizedHtml,
  });
};

const sendStatusEmail = async ({ to, userName, complaintTitle, status }) => {
  const isResolved = status === "resolved";

  const subject = isResolved
    ? `✅ Your complaint has been resolved — ${complaintTitle}`
    : `❌ Your complaint has been rejected — ${complaintTitle}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      
      <div style="background-color: ${isResolved ? "#16a34a" : "#dc2626"}; padding: 24px 32px;">
        <h1 style="color: #ffffff; margin: 0; font-size: 20px;">
          ${isResolved ? "✅ Complaint Resolved" : "❌ Complaint Rejected"}
        </h1>
      </div>

      <div style="padding: 32px;">
        <p style="color: #374151; font-size: 15px; margin: 0 0 16px;">
          Hi <strong>${userName}</strong>,
        </p>
        <p style="color: #374151; font-size: 15px; margin: 0 0 16px;">
          ${
            isResolved
              ? "We're happy to let you know that your complaint has been <strong>resolved</strong> by our team."
              : "We regret to inform you that your complaint has been <strong>rejected</strong> after review by our team."
          }
        </p>
        <div style="background-color: #f9fafb; border-left: 4px solid ${isResolved ? "#16a34a" : "#dc2626"}; padding: 16px; border-radius: 4px; margin: 24px 0;">
          <p style="margin: 0; font-size: 13px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Complaint</p>
          <p style="margin: 6px 0 0; font-size: 15px; font-weight: 600; color: #111827;">${complaintTitle}</p>
          <p style="margin: 6px 0 0; font-size: 13px; color: #6b7280;">
            Status: <span style="color: ${isResolved ? "#16a34a" : "#dc2626"}; font-weight: 600; text-transform: capitalize;">${status}</span>
          </p>
        </div>
        <p style="color: #6b7280; font-size: 13px; margin: 0;">
          ${
            isResolved
              ? "Thank you for reaching out to us. If you have any further issues, feel free to file a new complaint."
              : "If you believe this is a mistake or need further clarification, please contact our support team."
          }
        </p>
      </div>

      <div style="background-color: #f3f4f6; padding: 16px 32px; text-align: center;">
        <p style="margin: 0; font-size: 12px; color: #9ca3af;">
          This is an automated email from Helpx. Please do not reply to this email.
        </p>
      </div>

    </div>
  `;

  await transporter.sendMail({
    from: `"Helpx Support" <${USER_EMAIL}>`,
    to,
    subject,
    html,
  });
};

module.exports = { sendMailwithGmailVerify, sendStatusEmail };
