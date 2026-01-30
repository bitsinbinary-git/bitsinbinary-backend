import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send welcome email
export const sendWelcomeEmail = async (email, name) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `"BitsInBinary" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to BitsInBinary!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to BitsInBinary, ${name}!</h2>
        <p>Thank you for joining our community of developers, hackers, and tech enthusiasts.</p>
        <p>You'll receive updates about:</p>
        <ul>
          <li>Developer tips and coding hacks</li>
          <li>Automation tutorials</li>
          <li>Latest tech trends</li>
          <li>Open source projects</li>
        </ul>
        <p>Stay tuned for amazing content!</p>
        <p>Best regards,<br>The BitsInBinary Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw new Error('Failed to send welcome email');
  }
};