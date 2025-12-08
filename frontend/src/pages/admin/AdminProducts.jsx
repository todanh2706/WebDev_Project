import React, { useCallback } from 'react';
import { Spinner, Button } from 'react-bootstrap';
import Pagination from '../../components/common/Pagination';
import { productService } from '../../services/productService';
import { usePaginationData } from '../../hooks/usePaginationData';
import ProductTable from '../../components/admin/ProductTable';
import { BiPlus } from 'react-icons/bi';

const AdminProducts = () => {
    const transformResponse = useCallback((response) => {
        return {
            items: response.products || [],
            pages: response.totalPages || 1
        };
    }, []);

    const {
        data,
        loading,
        page,
        setPage,
        totalPages
    } = usePaginationData(productService.getAllProducts, transformResponse, 12);

    const products = data || [];

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await adminService.deleteProduct(productId);
                fetchData(); // Refresh list
            } catch (error) {
                console.error("Error deleting product:", error);
            }
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <Spinner animation="border" variant="warning" />
            </div>
        );
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="text-auction-primary m-0">Manage Products</h3>
                <Button variant="outline-warning" className="btn-sm">
                    <BiPlus className="me-2" />Add Product
                </Button>
            </div>

            {products.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <>
                    <ProductTable products={products} onDeleteProduct={handleDeleteProduct} />

                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </div>
    );
};


export default AdminProducts;
