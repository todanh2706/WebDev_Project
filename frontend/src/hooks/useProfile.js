import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../contexts/ToastContext';
import { userService } from '../services/userService';
import { authService } from '../services/authService';

export const useProfile = () => {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState({ name: '', email: '' });
    const [watchlist, setWatchlist] = useState([]);
    const [participating, setParticipating] = useState([]);
    const [won, setWon] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [upgradeRequest, setUpgradeRequest] = useState(null);
    const { showToast } = useToast();

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [profileData, watchlistData, participatingData, wonData, ratingsData, upgradeRequestData] = await Promise.all([
                authService.getProfile(),
                userService.getWatchlist(),
                userService.getParticipating(),
                userService.getWonAuctions(),
                userService.getRatings(),
                userService.getUpgradeRequest()
            ]);

            setProfile(profileData);
            setWatchlist(watchlistData);
            setParticipating(participatingData);
            setWon(wonData);
            setRatings(ratingsData);
            setUpgradeRequest(upgradeRequestData);

        } catch (error) {
            console.error('Error fetching profile data:', error);
            showToast('Failed to load profile data', 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const updateProfile = async (name, email) => {
        try {
            await userService.updateProfile({ name, email });
            setProfile(prev => ({ ...prev, name, email }));
            showToast('Profile updated successfully', 'success');
            return true;
        } catch (error) {
            showToast(error.message || 'Failed to update profile', 'error');
            return false;
        }
    };

    const changePassword = async (oldPassword, newPassword) => {
        try {
            await userService.changePassword({ oldPassword, newPassword });
            showToast('Password changed successfully', 'success');
            return true;
        } catch (error) {
            showToast(error.message || 'Failed to change password', 'error');
            return false;
        }
    };

    const submitFeedback = async (productId, rating, comment) => {
        try {
            await userService.submitFeedback({ product_id: productId, rating, comment });
            showToast('Feedback submitted successfully', 'success');
            // Refresh ratings and won list
            fetchData();
            return true;
        } catch (error) {
            showToast(error.message || 'Failed to submit feedback', 'error');
            return false;
        }
    };

    const submitUpgradeRequest = async (reason) => {
        try {
            const data = await userService.requestUpgrade(reason);
            setUpgradeRequest(data.request);
            showToast('Upgrade request submitted successfully', 'success');
            return true;
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to submit upgrade request', 'error');
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
        upgradeRequest,
        updateProfile,
        changePassword,
        submitFeedback,
        submitUpgradeRequest,
        refreshData: fetchData
    };
};
