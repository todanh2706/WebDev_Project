import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../contexts/ToastContext';

export const usePaginationData = (fetchFunction, transformResponse, itemsPerPage = 12) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { showToast } = useToast();

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetchFunction(page, itemsPerPage);
            const { items, pages } = transformResponse(response);
            setData(items);
            setTotalPages(pages || 1);
        } catch (error) {
            console.error('Error fetching data:', error);
            showToast('Failed to load data', 'error');
        } finally {
            setLoading(false);
        }
    }, [fetchFunction, page, itemsPerPage, showToast, transformResponse]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, page, setPage, totalPages, refresh: fetchData };
};
