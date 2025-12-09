import { Op } from 'sequelize';
import model from '../models/index.js';
import jwt from 'jsonwebtoken';

import { sendOTP } from '../services/emailService.js';

const { Users } = model;

export default {
    async register(req, res) {
        const { email, password, name, phone, address, captchaToken } = req.body;

        // Verify reCAPTCHA
        if (!captchaToken) {
            return res.status(400).send({ message: 'reCAPTCHA verification failed. Please try again.' });
        }

        try {
            const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY || 'YOUR_RECAPTCHA_SECRET_KEY'}&response=${captchaToken}`;
            const response = await fetch(verificationUrl, { method: 'POST' });
            const data = await response.json();

            if (!data.success) {
                return res.status(400).send({ message: 'reCAPTCHA verification failed. Please try again.' });
            }

            const user = await Users.findOne({ where: { [Op.or]: [{ phone }, { email }] } });
            if (user) {
                return res.status(422)
                    .send({ message: 'User with that email or phone already exists' });
            }

            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

            await Users.create({
                name,
                email,
                password,
                phone,
                address,
                role: 0, // Default to casual user
                status: 'active',
                otp_code: otp,
                otp_expiry: otpExpiry,
                is_verified: false
            });

            await sendOTP(email, otp);

            return res.status(201).send({ message: 'Account created. Please check your email for OTP.' });
        } catch (e) {
            console.log(e);
            return res.status(500).send({ message: 'Could not perform operation at this time, kindly try again later.' });
        }
    },

    async verifyOTP(req, res) {
        const { email, otp } = req.body;
        try {
            const user = await Users.findOne({ where: { email } });
            if (!user) {
                return res.status(404).send({ message: 'User not found.' });
            }

            if (user.otp_code !== otp) {
                return res.status(400).send({ message: 'Invalid OTP.' });
            }

            if (new Date() > user.otp_expiry) {
                return res.status(400).send({ message: 'OTP has expired.' });
            }

            user.is_verified = true;
            user.otp_code = null;
            user.otp_expiry = null;
            await user.save();

            return res.status(200).send({ message: 'Account verified successfully.' });
        } catch (e) {
            console.log(e);
            return res.status(500).send({ message: 'Error verifying OTP.' });
        }
    },

    async logIn(req, res) {
        const { email, password } = req.body;
        try {
            const user = await Users.findOne({ where: { email } });
            if (!user) {
                return res.status(404).send({ message: 'Invalid username or password!' });
            }

            const isMatch = await user.validPassword(password);

            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid username or password!' });
            }

            // Generate Tokens
            const accessToken = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET || 'access_secret',
                { expiresIn: '1d' }
            );

            const refreshToken = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET || 'refresh_secret',
                { expiresIn: '7d' }
            );

            // Update last_login_at
            const now = new Date();
            const gmt7Time = new Date(now.getTime() + (7 * 60 * 60 * 1000));
            user.last_login_at = gmt7Time;
            await user.save();

            // Set Refresh Token as HttpOnly Cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                sameSite: 'strict', // Prevent CSRF
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            return res.json({
                message: 'Login successful.',
                user,
                accessToken
            });
        } catch (e) {
            console.log(e);
            return res.status(500).send({ message: 'Could not perform operation at this time, kindly try again later.' });
        }
    },

    async refreshToken(req, res) {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).send({ message: 'Refresh Token is required!' });
        }

        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET || 'refresh_secret');
            const accessToken = jwt.sign(
                { id: decoded.id, email: decoded.email, role: decoded.role },
                process.env.JWT_SECRET || 'access_secret',
                { expiresIn: '15m' }
            );

            return res.json({ accessToken });
        } catch (e) {
            console.log(e);
            return res.status(403).send({ message: 'Invalid Refresh Token!' });
        }
    },

    async logout(req, res) {
        try {
            res.clearCookie('refreshToken');
            return res.status(200).send({ message: 'Logged out successfully.' });
        } catch (e) {
            console.log(e);
            return res.status(500).send({ message: 'Error logging out.' });
        }
    }
}