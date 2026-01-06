import { useState, useEffect, useRef } from 'react';
import { Form, ListGroup, Button } from 'react-bootstrap';
import { orderService } from '../../services/orderService';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../hooks/useAuth';

const OrderChat = ({ orderId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);
    const { user } = useAuth();
    const { showToast } = useToast();

    const fetchMessages = async () => {
        try {
            const data = await orderService.getMessages(orderId);
            setMessages(data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        if (orderId) {
            fetchMessages();
            const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds
            return () => clearInterval(interval);
        }
    }, [orderId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setSending(true);
        try {
            await orderService.sendMessage(orderId, newMessage);
            setNewMessage('');
            fetchMessages();
        } catch (error) {
            showToast('Failed to send message', 'error');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="h-100 border-0 shadow-sm glass-panel text-white rounded-4 d-flex flex-column">
            <div className="bg-transparent border-bottom border-secondary border-opacity-25 p-3">
                <h5 className="mb-0 text-auction-primary fw-bold">Order Chat</h5>
                <small className="text-white-50">Secure communication with the other party</small>
            </div>
            <div className="d-flex flex-column p-3" style={{ height: '400px' }}>
                <ListGroup variant="flush" className="flex-grow-1 overflow-auto mb-3 pe-2 custom-scrollbar">
                    {messages.length === 0 && (
                        <div className="text-center text-white-50 mt-5">
                            <p>No messages yet. Start the conversation!</p>
                        </div>
                    )}
                    {messages.map((msg) => {
                        const isMe = msg.sender_id === user?.id;
                        return (
                            <div
                                key={msg.message_id}
                                className={`d-flex mb-3 ${isMe ? 'justify-content-end' : 'justify-content-start'}`}
                            >
                                <div
                                    className={`p-3 rounded-4 ${isMe
                                        ? 'bg-auction-primary text-dark rounded-br-0'
                                        : 'bg-dark bg-opacity-50 text-white rounded-bl-0'
                                        }`}
                                    style={{ maxWidth: '85%' }}
                                >
                                    <div className="d-flex justify-content-between align-items-baseline mb-1 gap-2">
                                        <small className={`fw-bold text-nowrap text-truncate ${isMe ? 'text-dark' : 'text-auction-primary'}`} style={{ maxWidth: '70%' }}>
                                            {msg.sender?.name}
                                        </small>
                                        <small className={`text-nowrap ${isMe ? 'text-black-50' : 'text-white-50'}`} style={{ fontSize: '0.7em' }}>
                                            {new Date(msg.send_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </small>
                                    </div>
                                    <p className="mb-0 text-break">{msg.message}</p>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </ListGroup>

                <Form onSubmit={handleSend}>
                    <div className="d-flex gap-2">
                        <Form.Control
                            type="text"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="form-control-glass border-secondary border-opacity-25 text-white rounded-pill px-3"
                            disabled={sending}
                        />
                        <Button
                            className="btn-auction rounded-circle d-flex align-items-center justify-content-center"
                            type="submit"
                            disabled={sending || !newMessage.trim()}
                            style={{ width: '40px', height: '40px' }}
                        >
                            {sending ? '...' : '➤'}
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default OrderChat;
