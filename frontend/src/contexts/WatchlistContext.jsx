import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from './ToastContext';
import { userService } from '../services/userService';

const WatchlistContext = createContext();

export const useWatchlist = () => {
    const context = useContext(WatchlistContext);
    if (!context) {
        throw new Error('useWatchlist must be used within a WatchlistProvider');
    }
    return context;
};

export const WatchlistProvider = ({ children }) => {
    const [watchlist, setWatchlist] = useState(new Set());
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const { showToast } = useToast();

    const fetchWatchlist = useCallback(async () => {
        if (!user) {
            setWatchlist(new Set());
            return;
        }

        try {
            const data = await userService.getWatchlist();
            // Assuming data is an array of products, we extract IDs
            const ids = new Set(data.map(item => item.id));
            setWatchlist(ids);
        } catch (error) {
            console.error('Error fetching watchlist:', error);
        }
    }, [user]);

    useEffect(() => {
        fetchWatchlist();
    }, [fetchWatchlist]);

    const addToWatchlist = async (productId) => {
        if (!user) {
            showToast('Please login to add items to watchlist', 'warning');
            return false;
        }

        try {
            await userService.addToWatchlist(productId);
            setWatchlist(prev => new Set(prev).add(productId));
            showToast('Added to watchlist', 'success');
            return true;
        } catch (error) {
            console.error('Error adding to watchlist:', error);
            showToast(error.response?.data?.message || 'Error adding to watchlist', 'error');
            return false;
        }
    };

    const removeFromWatchlist = async (productId) => {
        if (!user) return false;

        try {
            await userService.removeFromWatchlist(productId);
            setWatchlist(prev => {
                const newSet = new Set(prev);
                newSet.delete(productId);
                return newSet;
            });
            showToast('Removed from watchlist', 'info');
            return true;
        } catch (error) {
            console.error('Error removing from watchlist:', error);
            showToast(error.response?.data?.message || 'Error removing from watchlist', 'error');
            return false;
        }
    };

    const isInWatchlist = (productId) => {
        return watchlist.has(productId);
    };

    return (
        <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist, refreshWatchlist: fetchWatchlist }}>
            {children}
        </WatchlistContext.Provider>
    );
};
