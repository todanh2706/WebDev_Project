import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from './useAuth';

export const useProfile = () => {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState({ name: '', email: '' });
    const [watchlist, setWatchlist] = useState([]);
    const [participating, setParticipating] = useState([]);
    const [won, setWon] = useState([]);
    const [ratings, setRatings] = useState([]);
    const { showToast } = useToast();
    const { fetchWithAuth } = useAuth();

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [profileRes, watchlistRes, participatingRes, wonRes, ratingsRes] = await Promise.all([
                fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/user/profile`),
                fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/user/watchlist`),
                fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/user/participating`),
                fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/user/won`),
                fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/user/ratings`)
            ]);

            if (profileRes.ok) setProfile(await profileRes.json());
            if (watchlistRes.ok) setWatchlist(await watchlistRes.json());
            if (participatingRes.ok) setParticipating(await participatingRes.json());
            if (wonRes.ok) setWon(await wonRes.json());
            if (ratingsRes.ok) setRatings(await ratingsRes.json());

        } catch (error) {
            console.error('Error fetching profile data:', error);
            showToast('Failed to load profile data', 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast, fetchWithAuth]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const updateProfile = async (name, email) => {
        try {
            const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/user/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email })
            });

            if (response.ok) {
                setProfile(prev => ({ ...prev, name, email }));
                showToast('Profile updated successfully', 'success');
                return true;
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (error) {
            showToast(error.message, 'error');
            return false;
        }
    };

    const changePassword = async (oldPassword, newPassword) => {
        try {
            const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/user/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ oldPassword, newPassword })
            });

            const data = await response.json();
            if (response.ok) {
                showToast('Password changed successfully', 'success');
                return true;
            } else {
                throw new Error(data.message || 'Failed to change password');
            }
        } catch (error) {
            showToast(error.message, 'error');
            return false;
        }
    };

    return {
        loading,
        profile,
        watchlist,
        participating,
        won,
        ratings,
        updateProfile,
        changePassword,
        refreshData: fetchData
    };
};
