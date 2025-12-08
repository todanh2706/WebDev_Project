import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Spinner } from 'react-bootstrap';
import { systemService } from '../../services/systemService';
import { useToast } from '../../contexts/ToastContext';
import Button from '../../components/common/Button';
import { FaCogs, FaSave } from 'react-icons/fa';

const AdminSettings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        auction_extension_minutes: '10',
        auction_threshold_minutes: '5'
    });
    const { showToast } = useToast();

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const data = await systemService.getSettings();
            // Merge with defaults if keys missing
            setSettings(prev => ({ ...prev, ...data }));
        } catch (error) {
            console.error('Error fetching settings:', error);
            showToast('Failed to load settings', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await systemService.updateSettings(settings);
            showToast('Settings updated successfully', 'success');
        } catch (error) {
            console.error('Error updating settings:', error);
            showToast('Failed to update settings', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center h-100">
                <Spinner animation="border" variant="warning" />
            </div>
        );
    }

    return (
        <div className="settings-page">
            <h2 className="text-white fw-bold mb-4 d-flex align-items-center gap-2">
                <FaCogs className="text-auction-primary" /> Expiration Management
            </h2>
            <Form onSubmit={handleSubmit} className="p-2">
                <Row className="mb-4">
                    <Col md={12} className="mb-2">
                        <p className="text-white-50">
                            Configure the automatic extension rules for auctions.
                            If a new bid is placed within the "Threshold" time before expiration,
                            the auction end time will be extended by the "Extension" duration.
                        </p>
                    </Col>
                </Row>

                <Row className="g-4">
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label className="text-auction-primary fw-bold">
                                Extension Duration (X minutes)
                            </Form.Label>
                            <Form.Control
                                type="number"
                                name="auction_extension_minutes"
                                value={settings.auction_extension_minutes}
                                onChange={handleChange}
                                min="0"
                                className="form-control-glass settings-input"
                                placeholder="e.g. 10"
                                required
                            />
                            <Form.Text className="text-white-50">
                                The amount of time to add to the auction ending time.
                            </Form.Text>
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group>
                            <Form.Label className="text-auction-primary fw-bold">
                                Threshold Time (Y minutes)
                            </Form.Label>
                            <Form.Control
                                type="number"
                                name="auction_threshold_minutes"
                                value={settings.auction_threshold_minutes}
                                onChange={handleChange}
                                min="0"
                                className="form-control-glass settings-input"
                                placeholder="e.g. 5"
                                required
                            />
                            <Form.Text className="text-white-50">
                                The time window before expiration when new bids trigger an extension.
                            </Form.Text>
                        </Form.Group>
                    </Col>
                </Row>

                <div className="mt-5 d-flex justify-content-end">
                    <Button
                        type="submit"
                        disabled={saving}
                        className="py-2 px-4 rounded-pill d-flex align-items-center gap-2"
                    >
                        {saving ? <Spinner size="sm" animation="border" /> : <FaSave />}
                        Save Configuration
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default AdminSettings;
