const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Configure nodemailer with your email service
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'linxford7@gmail.com',
    pass: 'linx@icb4'
  }
});

exports.onNewFeedback = functions.firestore
  .document('feedback/{feedbackId}')
  .onCreate(async (snap, context) => {
    const feedback = snap.data();

    const mailOptions = {
      from: 'FlutterPeak <your-email@gmail.com>',
      to: 'admin@flutterpeak.com',
      subject: `New Feedback: ${feedback.type}`,
      html: `
        <h2>New Feedback Received</h2>
        <p><strong>Type:</strong> ${feedback.type}</p>
        <p><strong>Message:</strong> ${feedback.message}</p>
        ${feedback.email ? `<p><strong>Contact:</strong> ${feedback.email}</p>` : ''}
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Email notification sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  });
