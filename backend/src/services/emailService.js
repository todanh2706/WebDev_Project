import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendOTP = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}. It will expire in 10 minutes.`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${email}`);
    } catch (error) {
        console.error('Error sending email:', error);
        // For development/testing without valid credentials, log the OTP
        console.log(`[DEV] OTP for ${email}: ${otp}`);
    }
};

export const sendCommentNotification = async (sellerEmail, sellerName, commenterName, productName, commentContent) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: sellerEmail,
        subject: `New comment on your product: ${productName}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">New Comment Notification</h2>
                <p>Hello ${sellerName},</p>
                <p><strong>${commenterName}</strong> has commented on your product <strong>${productName}</strong>.</p>
                <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0;">
                    <p style="margin: 0; font-style: italic;">"${commentContent}"</p>
                </div>
                <p>Login to your account to reply.</p>
                <p style="font-size: 12px; color: #888; margin-top: 30px;">This is an automated message from your Auction Website.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Comment notification sent to ${sellerEmail}`);
    } catch (error) {
        console.error('Error sending comment notification email:', error);
    }
};
