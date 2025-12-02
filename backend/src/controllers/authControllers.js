import { Op } from 'sequelize';
import model from '../models/index.js';
import jwt from 'jsonwebtoken';

const { User } = model;

export default {
    async register(req, res) {
        const { email, password, name, phone } = req.body;
        try {
            const user = await User.findOne({ where: { [Op.or]: [{ phone }, { email }] } });
            if (user) {
                return res.status(422)
                    .send({ message: 'User with that email or phone already exists' });
            }

            await User.create({
                name,
                email,
                password,
                phone,
            });
            return res.status(201).send({ message: 'Account created successfully' });
        } catch (e) {
            console.log(e);
            return res.status(500).send({ message: 'Could not perform operation at this time, kindly try again later.' });
        }
    },

    async logIn(req, res) {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(404).send({ message: 'Invalid username or password!' });
            }

            const isMatch = await user.validPassword(password);

            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid username or password!' });
            }

            // Generate Tokens
            const accessToken = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET || 'access_secret',
                { expiresIn: '15m' }
            );

            const refreshToken = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET || 'refresh_secret',
                { expiresIn: '7d' }
            );

            return res.json({
                message: 'Login successful.',
                user,
                accessToken,
                refreshToken
            });
        } catch (e) {
            console.log(e);
            return res.status(500).send({ message: 'Could not perform operation at this time, kindly try again later.' });
        }
    },

    async refreshToken(req, res) {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).send({ message: 'Refresh Token is required!' });
        }

        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET || 'refresh_secret');
            const accessToken = jwt.sign(
                { id: decoded.id, email: decoded.email },
                process.env.JWT_SECRET || 'access_secret',
                { expiresIn: '15m' }
            );

            return res.json({ accessToken });
        } catch (e) {
            console.log(e);
            return res.status(403).send({ message: 'Invalid Refresh Token!' });
        }
    }
}