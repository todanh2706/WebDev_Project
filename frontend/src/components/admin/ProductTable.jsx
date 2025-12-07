import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import { BiPencil, BiTrash } from 'react-icons/bi';

const ProductTable = ({ products, onDelete }) => {
    return (
        <div className="table-responsive">
            <Table hover variant="dark" className="align-middle bg-transparent">
                <thead>
                    <tr className="text-auction-primary border-bottom border-secondary">
                        <th>ID</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id || product._id}>
                            <td>#{String(product.id || product._id).slice(-6)}</td>
                            <td>
                                <img
                                    src={product.images?.[0] || 'https://via.placeholder.com/50'}
                                    alt={product.name}
                                    className="rounded"
                                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                />
                            </td>
                            <td>{product.name}</td>
                            <td>{product.category?.name || 'N/A'}</td>
                            <td className="text-auction-primary fw-bold">${product.currentPrice || product.startingPrice}</td>
                            <td>
                                <Badge bg={product.status === 'active' ? 'success' : 'secondary'}>
                                    {product.status || 'Active'}
                                </Badge>
                            </td>
                            <td>
                                <Button variant="link" className="text-info p-0 me-3">
                                    <BiPencil />
                                </Button>
                                <Button variant="link" className="text-danger p-0" onClick={() => onDelete(product.id || product._id)}>
                                    <BiTrash />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default ProductTable;
