import nodemailer from 'nodemailer';
import logger from './logger.config.js';

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'MSJ Hackathon API <noreply@msj.com>',
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);

    logger.info(
      {
        messageId: info.messageId,
        to: options.email,
      },
      'Email sent successfully'
    );

    if (process.env.NODE_ENV !== 'production') {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        logger.info(`Preview URL: ${previewUrl}`);
      }
    }

    return info;
  } catch (error) {
    logger.error({ err: error }, 'Failed to send email');
    throw new Error('Email could not be sent');
  }
};

const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

  const message = `
Hi ${user.name},

We received a request to reset your password for your MSJ account.

Click the link below to reset your password:
${resetUrl}

This link will expire in 10 minutes for security reasons.

If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.

Best regards,
The MSJ Team
  `;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
                🔐 Password Reset
              </h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 16px; color: #333333; font-size: 16px; line-height: 24px;">
                Hi <strong>${user.name}</strong>,
              </p>
              
              <p style="margin: 0 0 24px; color: #555555; font-size: 15px; line-height: 24px;">
                We received a request to reset your password for your MSJ account. Click the button below to create a new password:
              </p>
              
              <table role="presentation" style="margin: 32px 0; width: 100%;">
                <tr>
                  <td align="center">
                    <a href="${resetUrl}" 
                       style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">
                      Reset My Password
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 24px 0 0; color: #666666; font-size: 13px; line-height: 20px;">
                Or copy and paste this link into your browser:
              </p>
              <p style="margin: 8px 0 0; padding: 12px; background-color: #f8f9fa; border-radius: 4px; color: #667eea; font-size: 13px; word-break: break-all; border: 1px solid #e9ecef;">
                ${resetUrl}
              </p>
              
              <table role="presentation" style="margin: 32px 0; width: 100%; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
                <tr>
                  <td style="padding: 16px;">
                    <p style="margin: 0; color: #856404; font-size: 14px; line-height: 20px;">
                      ⏱️ <strong>This link will expire in 10 minutes</strong> for security reasons.
                    </p>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 24px 0 0; color: #666666; font-size: 14px; line-height: 22px;">
                If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.
              </p>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 32px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; border-top: 1px solid #e9ecef;">
              <p style="margin: 0 0 8px; color: #999999; font-size: 13px; line-height: 20px;">
                Best regards,<br>
                <strong>The MSJ Team</strong>
              </p>
              <p style="margin: 16px 0 0; color: #aaaaaa; font-size: 12px; line-height: 18px;">
                This is an automated message, please do not reply to this email.
              </p>
            </td>
          </tr>
        </table>
        
        <p style="margin: 24px 0 0; color: #999999; font-size: 12px; text-align: center;">
          © ${new Date().getFullYear()} MSJ. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  await sendEmail({
    email: user.email,
    subject: '🔐 Reset Your MSJ Password',
    message,
    html,
  });
};

export { sendEmail, sendPasswordResetEmail };
