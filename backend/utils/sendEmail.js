const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`Email skipped (SMTP not configured): ${subject} -> ${to}`);
    return;
  }

  const transporter = createTransporter();

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
  });
};

const emailTemplates = {
  welcome: (name) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to Job Portal, ${name}!</h2>
      <p>Your account has been created successfully. Start exploring opportunities today.</p>
    </div>
  `,
  applicationSubmitted: (candidateName, jobTitle) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Application Submitted</h2>
      <p>Hi ${candidateName}, your application for <strong>${jobTitle}</strong> has been submitted successfully.</p>
    </div>
  `,
  statusUpdate: (candidateName, jobTitle, status) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Application Status Update</h2>
      <p>Hi ${candidateName}, your application for <strong>${jobTitle}</strong> has been updated to: <strong>${status.replace(/_/g, ' ')}</strong>.</p>
    </div>
  `,
  newApplication: (recruiterName, candidateName, jobTitle) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>New Application Received</h2>
      <p>Hi ${recruiterName}, ${candidateName} has applied for <strong>${jobTitle}</strong>.</p>
    </div>
  `,
};

module.exports = { sendEmail, emailTemplates };
