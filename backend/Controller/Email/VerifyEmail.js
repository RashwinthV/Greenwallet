const nodemailer = require('nodemailer');
const User = require('../../Models/userModel');

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_APP_MAILID,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// Send OTP to Email
exports.SendVerifyemail = async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: 'User not found.' });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP and expiration (5 minutes)
    existingUser.verificationCode = otp;
    existingUser.otpExpiresAt = Date.now() + 5 * 60 * 1000;
    await existingUser.save();

    // Send OTP email
    const mailOptions = {
      from: process.env.EMAIL_APP_MAILID,
      to: email,
      subject: 'Your Email Verification OTP',
      html: `
        <p>Hi ${existingUser.name},</p>
        <p>Your OTP to verify your email is:</p>
        <h2>${otp}</h2>
        <p>This OTP will expire in 5 minutes. Do not share it with anyone.</p>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending OTP email:', error);
        return res.status(500).json({ message: 'Failed to send OTP email.' });
      }
      return res.status(200).json({ success:true ,message: 'OTP sent successfully to your email.' });
    });
  } catch (error) {
    console.error('SendVerifyemail Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify the OTP
exports.Verifyemail = async (req, res) => {
  const { email, otp } = req.body;
  

  try {
    const user = await User.findOne({ email, verificationCode: otp });
    

    if (!user) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    if (Date.now() > user.otpExpiresAt) {
        
      return res.json({success:false, message: 'OTP has expired.' });
    }

    user.emailverified = true;
    user.verificationCode = null;
    user.otpExpiresAt = null;
    await user.save();

    res.status(200).json({ success:true, message: 'Email successfully verified!' });
  } catch (error) {
    console.error('Verifyemail Error:', error);
    res.status(500).json({ message: 'Error verifying OTP.' });
  }
};
