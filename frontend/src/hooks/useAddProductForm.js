import { useState, useEffect, useRef } from 'react';
import { useToast } from '../contexts/ToastContext';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';

const useAddProductForm = (show, onProductAdded, onHide) => {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [fetchedCategories, setFetchedCategories] = useState(false);

    // Editor Ref
    const editorRef = useRef(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        category_id: '',
        description: '',
        starting_price: '',
        step_price: '',
        buy_now_price: '',
        is_auto_extend: true
    });

    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    // Fetch categories when modal opens
    useEffect(() => {
        if (show && !fetchedCategories) {
            const fetchCategories = async () => {
                try {
                    const data = await categoryService.getCategories();
                    setCategories(data);
                    setFetchedCategories(true);
                } catch (error) {
                    console.error('Error fetching categories', error);
                    showToast('Failed to load categories', 'error');
                }
            };
            fetchCategories();
        }
    }, [show, fetchedCategories, showToast]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleEditorChange = (content) => {
        setFormData(prev => ({ ...prev, description: content }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length > 10) {
            showToast('Maximum 10 images allowed', 'warning');
            return;
        }

        const newImages = [...images, ...files];
        setImages(newImages);

        // Generate previews
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);

        const newPreviews = [...imagePreviews];
        URL.revokeObjectURL(newPreviews[index]); // Cleanup
        newPreviews.splice(index, 1);
        setImagePreviews(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (images.length < 3) {
            showToast('Please upload at least 3 photos', 'error');
            return;
        }

        if (!formData.description) {
            showToast('Description is required', 'error');
            return;
        }

        setLoading(true);

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });

            images.forEach(image => {
                data.append('images', image);
            });

            await productService.createProduct(data);
            showToast('Product added successfully!', 'success');
            onProductAdded();
            onHide();

            // Reset form
            setFormData({
                name: '',
                category_id: '',
                description: '',
                starting_price: '',
                step_price: '',
                buy_now_price: '',
                is_auto_extend: true
            });
            setImages([]);
            setImagePreviews([]);
        } catch (error) {
            console.error(error);
            showToast(error.response?.data?.message || 'Failed to add product', 'error');
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        categories,
        loading,
        images,
        imagePreviews,
        editorRef,
        handleChange,
        handleEditorChange,
        handleImageChange,
        removeImage,
        handleSubmit
    };
};

export default useAddProductForm;
