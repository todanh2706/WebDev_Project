import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import { BiUser, BiPencil, BiTrash } from 'react-icons/bi';

const UserTable = ({ users, onDelete }) => {
    return (
        <div className="table-responsive">
            <Table hover variant="dark" className="align-middle bg-transparent">
                <thead>
                    <tr className="text-auction-primary border-bottom border-secondary">
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id || user._id}>
                            <td>#{String(user.id || user._id).slice(-6)}</td>
                            <td>
                                <div className="d-flex align-items-center gap-2">
                                    <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                                        <BiUser className="text-white" />
                                    </div>
                                    {user.name}
                                </div>
                            </td>
                            <td>{user.email}</td>
                            <td>
                                <Badge bg={
                                    user.role === 'ADMIN' ? 'danger' :
                                        user.role === 'SELLER' ? 'warning' : 'info'
                                }>
                                    {user.role}
                                </Badge>
                            </td>
                            <td>
                                <Badge bg={user.status === 'active' ? 'success' : 'secondary'}>
                                    {user.status || 'Active'}
                                </Badge>
                            </td>
                            <td>
                                <Button variant="link" className="text-info p-0 me-3">
                                    <BiPencil />
                                </Button>
                                <Button variant="link" className="text-danger p-0" onClick={() => onDelete(user.id)}>
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

export default UserTable;
