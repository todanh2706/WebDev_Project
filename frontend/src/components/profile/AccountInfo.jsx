import { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

const AccountInfo = ({ profile, onUpdate }) => {
    const [formData, setFormData] = useState({ name: '', email: '' });

    useEffect(() => {
        if (profile) {
            setFormData({ name: profile.name || '', email: profile.email || '' });
        }
    }, [profile]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onUpdate(formData.name, formData.email);
    };

    return (
        <div className="glass-panel-dark p-4 rounded-3 mb-4">
            <h4 className="text-auction-primary mb-3">Personal Information</h4>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label className="text-white-50">Full Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={formData.name}
                        placeholder={profile.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-black border-secondary custom-placeholder-input"
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label className="text-white-50">Email Address</Form.Label>
                    <Form.Control
                        type="email"
                        value={formData.email}
                        placeholder={profile.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-black border-secondary custom-placeholder-input"
                    />
                </Form.Group>
                <Button type="submit" variant="warning" className="fw-bold">
                    Update Profile
                </Button>
            </Form>
        </div>
    );
};

export default AccountInfo;
