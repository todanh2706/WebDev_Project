import React from 'react';
import { NavLink } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { BiPackage, BiGroup, BiUpArrowCircle } from 'react-icons/bi';

const AdminSidebar = () => {
    return (
        <div className="glass-panel-dark p-3 rounded h-100">
            <h5 className="text-auction-primary mb-4 px-3">Admin Dashboard</h5>
            <Nav className="flex-column gap-2">
                <NavLink
                    to="/admin/edit/products"
                    className={({ isActive }) =>
                        `nav-link-auction px-3 py-2 rounded text-decoration-none ${isActive ? 'active bg-auction-primary text-dark' : ''}`
                    }
                >
                    <BiPackage className="me-2" />
                    Products
                </NavLink>
                <NavLink
                    to="/admin/edit/users"
                    className={({ isActive }) =>
                        `nav-link-auction px-3 py-2 rounded text-decoration-none ${isActive ? 'active bg-auction-primary text-dark' : ''}`
                    }
                >
                    <BiGroup className="me-2" />
                    Users
                </NavLink>
                <NavLink
                    to="/admin/manage/upgraderequests"
                    className={({ isActive }) =>
                        `nav-link-auction px-3 py-2 rounded text-decoration-none ${isActive ? 'active bg-auction-primary text-dark' : ''}`
                    }
                >
                    <BiUpArrowCircle className="me-2" />
                    Upgrade Requests
                </NavLink>
            </Nav>
        </div>
    );
};

export default AdminSidebar;
