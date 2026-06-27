const Enquiry = require('../models/Enquiry');
const { sendEmail, enquiryConfirmationHTML, enquiryAdminHTML } = require('../config/email');

// @desc    Submit enquiry (public)
// @route   POST /api/enquiries
// @access  Public
exports.createEnquiry = async (req, res) => {
  const { name, email, phone, course, message } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and phone are required',
    });
  }

  const enquiry = await Enquiry.create({ name, email, phone, course, message });

  // Send emails with proper error logging
  try {
    console.log('📧 Sending confirmation email to:', email);
    await sendEmail({
      to:      email,
      subject: 'Thank you for your enquiry — Saraswati Education Allahabad',
      html:    enquiryConfirmationHTML(name, course || 'General Enquiry'),
    });
    console.log('✅ Confirmation email sent to:', email);
  } catch (err) {
    console.error('❌ Failed to send confirmation email:', err.message);
  }

  try {
    console.log('📧 Sending admin notification to:', process.env.ADMIN_EMAIL);
    await sendEmail({
      to:      process.env.ADMIN_EMAIL,
      subject: `New Enquiry: ${name} — ${course || 'General'}`,
      html:    enquiryAdminHTML({ name, email, phone, course, message }),
    });
    console.log('✅ Admin notification sent to:', process.env.ADMIN_EMAIL);
  } catch (err) {
    console.error('❌ Failed to send admin email:', err.message);
  }

  res.status(201).json({
    success: true,
    message: 'Thank you! Your enquiry has been submitted. We will contact you soon.',
    data: { id: enquiry._id },
  });
};
// @desc    Get all enquiries (admin, supports ?status= filter)
// @route   GET /api/enquiries
// @access  Private (admin)
exports.getEnquiries = async (req, res) => {
  const query = {};
  if (req.query.status) query.status = req.query.status;

  const enquiries = await Enquiry.find(query).sort({ submittedAt: -1 });
  const unreadCount = await Enquiry.countDocuments({ status: 'new' });

  res.status(200).json({ success: true, count: enquiries.length, unreadCount, data: enquiries });
};

// @desc    Get single enquiry & mark as read
// @route   GET /api/enquiries/:id
// @access  Private (admin)
exports.getEnquiry = async (req, res) => {
  const enquiry = await Enquiry.findById(req.params.id);
  if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });

  if (enquiry.status === 'new') {
    enquiry.status = 'read';
    await enquiry.save();
  }

  res.status(200).json({ success: true, data: enquiry });
};

// @desc    Update enquiry status / send reply
// @route   PUT /api/enquiries/:id
// @access  Private (admin)
exports.updateEnquiry = async (req, res) => {
  const { status, reply } = req.body;
  const enquiry = await Enquiry.findById(req.params.id);
  if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });

  if (status) enquiry.status = status;

  if (reply) {
    enquiry.reply = reply;
    enquiry.repliedAt = new Date();
    enquiry.status = 'replied';

    await sendEmail({
      to: enquiry.email,
      subject: 'Response to your enquiry — SCEC Allahabad',
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#0B1F4A;padding:20px;border-radius:8px 8px 0 0">
          <h2 style="color:#F5C842;margin:0">SCEC Allahabad</h2>
        </div>
        <div style="background:#fff;padding:24px;border:1px solid #e2dfd8;border-top:none">
          <p>Dear ${enquiry.name},</p>
          <p style="line-height:1.6">${reply.replace(/\n/g, '<br>')}</p>
          <p style="margin-top:20px;color:#666">— SCEC Allahabad Admissions Team</p>
        </div>
      </div>`,
    }).catch(() => {});
  }

  await enquiry.save();
  res.status(200).json({ success: true, data: enquiry });
};

// @desc    Delete enquiry
// @route   DELETE /api/enquiries/:id
// @access  Private (admin)
exports.deleteEnquiry = async (req, res) => {
  const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
  if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });
  res.status(200).json({ success: true, message: 'Enquiry deleted', data: {} });
};

// @desc    Export enquiries as CSV
// @route   GET /api/enquiries/export/csv
// @access  Private (admin)
exports.exportCSV = async (req, res) => {
  const enquiries = await Enquiry.find().sort({ submittedAt: -1 });

  const header = 'Name,Email,Phone,Course,Status,Submitted At,Message\n';
  const rows = enquiries.map((e) => {
    const escape = (s = '') => `"${String(s).replace(/"/g, '""')}"`;
    return [
      escape(e.name), escape(e.email), escape(e.phone), escape(e.course),
      escape(e.status), escape(e.submittedAt.toISOString()), escape(e.message),
    ].join(',');
  }).join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="enquiries.csv"');
  res.send(header + rows);
};
