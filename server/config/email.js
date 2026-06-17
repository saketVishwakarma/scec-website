const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host:   process.env.EMAIL_HOST,
  port:   Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send an email
 * @param {Object} opts - { to, subject, html, text? }
 */
const sendEmail = async ({ to, subject, html, text }) => {
  const info = await transporter.sendMail({
    from:    process.env.EMAIL_FROM,
    to,
    subject,
    text:    text || '',
    html,
  });
  if (process.env.NODE_ENV === 'development') {
    console.log('📧 Email sent:', info.messageId);
  }
  return info;
};

// ── Email templates ──────────────────────────────────────────────

const enquiryConfirmationHTML = (name, course) => `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
    <div style="background:#0B1F4A;padding:24px;border-radius:8px 8px 0 0;text-align:center">
      <h1 style="color:#F5C842;margin:0;font-size:22px">SCEC Allahabad</h1>
      <p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:13px">SCEC Allahabad</p>
    </div>
    <div style="background:#fff;padding:28px;border:1px solid #e2dfd8;border-top:none">
      <h2 style="color:#0B1F4A;margin:0 0 12px">Thank you, ${name}!</h2>
      <p style="color:#444;line-height:1.6">We have received your enquiry about <strong>${course}</strong>. Our admissions team will contact you within 24–48 hours.</p>
      <p style="color:#444;line-height:1.6">If you have any urgent questions, please call us directly.</p>
      <div style="background:#f8f7f4;border-radius:8px;padding:16px;margin:20px 0">
        <p style="margin:0;color:#0B1F4A;font-weight:600">SCEC Allahabad</p>
        <p style="margin:4px 0 0;color:#666;font-size:13px">SCEC Allahabad<br>A unit of Prayagraj Educom Pvt. Ltd.</p>
      </div>
    </div>
    <div style="background:#f8f7f4;padding:14px;text-align:center;border-radius:0 0 8px 8px;border:1px solid #e2dfd8;border-top:none">
      <p style="margin:0;color:#999;font-size:11px">© ${new Date().getFullYear()} SCEC Allahabad. All rights reserved.</p>
    </div>
  </div>
`;

const enquiryAdminHTML = (data) => `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
    <div style="background:#0B1F4A;padding:20px 24px;border-radius:8px 8px 0 0">
      <h2 style="color:#F5C842;margin:0;font-size:18px">🔔 New Enquiry Received</h2>
    </div>
    <div style="background:#fff;padding:24px;border:1px solid #e2dfd8;border-top:none">
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:8px 0;color:#666;width:130px">Name</td><td style="padding:8px 0;font-weight:600">${data.name}</td></tr>
        <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0">${data.email}</td></tr>
        <tr><td style="padding:8px 0;color:#666">Phone</td><td style="padding:8px 0">${data.phone}</td></tr>
        <tr><td style="padding:8px 0;color:#666">Course</td><td style="padding:8px 0">${data.course}</td></tr>
        <tr><td style="padding:8px 0;color:#666;vertical-align:top">Message</td><td style="padding:8px 0">${data.message || '—'}</td></tr>
        <tr><td style="padding:8px 0;color:#666">Submitted</td><td style="padding:8px 0">${new Date().toLocaleString('en-IN')}</td></tr>
      </table>
    </div>
  </div>
`;

module.exports = { sendEmail, enquiryConfirmationHTML, enquiryAdminHTML };
