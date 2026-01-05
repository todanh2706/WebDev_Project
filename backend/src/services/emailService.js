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

export const sendAuctionWonEmail = async (winnerEmail, winnerName, productName, price) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: winnerEmail,
        subject: `Congratulations! You won: ${productName}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #28a745;">You Won!</h2>
                <p>Hello ${winnerName},</p>
                <p>Congratulations! You have won the auction for <strong>${productName}</strong>.</p>
                <p>Winning Bid: <strong>$${price.toLocaleString()}</strong></p>
                <p>Please log in to your account to view the seller's contact information and arrange for payment/delivery.</p>
                <div style="text-align: center; margin-top: 30px;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/won-products" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Won Products</a>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Won email sent to ${winnerEmail}`);
    } catch (error) {
        console.error('Error sending won email:', error);
    }
};

export const sendAuctionSoldEmail = async (sellerEmail, sellerName, productName, price, winnerName) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: sellerEmail,
        subject: `Your product has been sold: ${productName}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #28a745;">Auction Success!</h2>
                <p>Hello ${sellerName},</p>
                <p>Your product <strong>${productName}</strong> has been sold to <strong>${winnerName}</strong>.</p>
                <p>Winning Bid: <strong>$${price.toLocaleString()}</strong></p>
                <p>Please log in to view the winner's details.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Sold email sent to ${sellerEmail}`);
    } catch (error) {
        console.error('Error sending sold email:', error);
    }
};

export const sendKickedNotification = async (email, productName) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Bid Rejected: ${productName}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #dc3545;">Bid Rejected</h2>
                <p>We regret to inform you that the seller has rejected your bid on <strong>${productName}</strong>.</p>
                <p>You have been restricted from placing further bids on this item.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Kick email sent to ${email}`);
    } catch (error) {
        console.error('Error sending kicked email:', error);
    }
};
