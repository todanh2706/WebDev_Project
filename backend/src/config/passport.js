import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import db from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

const Users = db.Users;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await Users.findByPk(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

const getProfileData = (profile) => {
    const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
    const photo = profile.photos && profile.photos[0] ? profile.photos[0].value : null;
    return { email, photo };
};

const authCallback = async (accessToken, refreshToken, profile, done, provider) => {
    try {
        const { email } = getProfileData(profile);
        const authId = profile.id;

        // 1. Check if user exists with this auth_provider and auth_id
        let user = await Users.findOne({
            where: {
                auth_provider: provider,
                auth_id: authId
            }
        });

        if (user) {
            return done(null, user);
        }

        // 2. If not, check if user exists by email
        if (email) {
            user = await Users.findOne({ where: { email } });
            if (user) {
                // Link account
                user.auth_provider = provider;
                user.auth_id = authId;

                // Update name if requested (and if available from provider)
                // User asked to use the provider's name.
                const providerName = profile.displayName || profile.username;
                if (providerName) {
                    user.name = providerName;
                }

                await user.save();
                return done(null, user);
            }
        }

        // 3. Create new user
        // Note: Phone and address are required by some internal logic maybe, but database allows null (modified).
        // Name is required.
        const newUserData = {
            name: profile.displayName || profile.username || 'User',
            email: email, // If email is missing from provider, this might fail validation. GitHub can have private emails.
            auth_provider: provider,
            auth_id: authId,
            role: 0, // Bidder
            status: 'active',
            is_verified: true // Trusted provider
        };

        if (!email) {
            // Handle case without email (e.g. GitHub no public email)
            // We could generate a placeholder or ask user later. For now, let's assume we get it or fail.
            // GitHub strategy needs scope: ['user:email']
            return done(new Error('No email found from provider'), null);
        }

        user = await Users.create(newUserData);
        done(null, user);

    } catch (err) {
        console.error('OAuth Error:', err);
        done(err, null);
    }
};

// Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback"
    }, (accessToken, refreshToken, profile, done) => authCallback(accessToken, refreshToken, profile, done, 'google')));
}

// GitHub Strategy
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "/api/auth/github/callback",
        scope: ['user:email']
    }, (accessToken, refreshToken, profile, done) => authCallback(accessToken, refreshToken, profile, done, 'github')));
}

export default passport;
