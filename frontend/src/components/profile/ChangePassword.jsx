import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { FaLock } from 'react-icons/fa';
import { useToast } from '../../contexts/ToastContext';

const ChangePassword = ({ onChangePassword }) => {
    const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const { showToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            showToast('New passwords do not match', 'error');
            return;
        }

        const success = await onChangePassword(passwords.oldPassword, passwords.newPassword);
        if (success) {
            setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
        }
    };

    return (
        <div className="glass-panel-dark p-4 rounded-3">
            <h4 className="text-auction-primary mb-3"><FaLock className="me-2" />Change Password</h4>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label className="text-white-50">Old Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={passwords.oldPassword}
                        onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                        className="bg-black text-white border-secondary"
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label className="text-white-50">New Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                        className="bg-black text-white border-secondary"
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label className="text-white-50">Confirm New Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={passwords.confirmPassword}
                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                        className="bg-black text-white border-secondary"
                        required
                    />
                </Form.Group>
                <Button type="submit" variant="outline-warning">
                    Change Password
                </Button>
            </Form>
        </div>
    );
};

export default ChangePassword;
