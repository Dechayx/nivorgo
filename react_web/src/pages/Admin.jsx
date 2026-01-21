import React, { useState, useEffect } from 'react';
import axios from 'axios';

const apiBase = 'http://localhost:5000';

const Admin = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isHovering, setIsHovering] = useState(false);
    const [view, setView] = useState('active'); // 'active' or 'history'

    useEffect(() => {
        fetchOrders();
    }, [view]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${apiBase}/api/admin/orders?type=${view}`);
            setOrders(res.data);
        } catch (err) {
            console.error("Error fetching admin orders", err);
        } finally {
            setLoading(false);
        }
    };

    const completeOrder = async (orderId) => {
        if (!window.confirm("Mark this order as Completed?")) return;
        try {
            await axios.patch(`${apiBase}/api/admin/orders/${orderId}`, { status: 'Completed' });
            alert("Order Status Updated! ✅");
            fetchOrders();
        } catch (err) {
            alert("Failed to update status.");
        }
    };

    const clearAllActive = async () => {
        if (!window.confirm("Are you sure? This will move ALL active orders to History.")) return;
        try {
            await axios.post(`${apiBase}/api/admin/orders/clear-all`);
            alert("All active orders moved to History! 🧹");
            fetchOrders();
        } catch (err) {
            alert("Failed to clear orders.");
        }
    };

    // Filter orders based on search term
    const filteredOrders = orders.filter(order =>
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.userId && order.userId.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.userId && order.userId.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div style={{ backgroundColor: '#382e15', minHeight: '100vh', paddingBottom: '50px' }}>
            <nav className="shadow-sm mb-5" style={{ backgroundColor: '#1a1a1a', padding: '1rem 0', borderBottom: '2px solid #4A5D45' }}>
                <div className="container d-flex justify-content-between align-items-center">
                    <h3 className="text-white font-serif mb-0" style={{ letterSpacing: '2px' }}>NIVORGO ADMIN</h3>

                    <div className="d-flex align-items-center gap-3">
                        {/* Search Input */}
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search Order ID, Name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ maxWidth: '250px', backgroundColor: '#F9F7F2', border: 'none' }}
                        />

                        <button
                            className="btn btn-sm"
                            onClick={fetchOrders}
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                            style={{
                                border: '1px solid #4A5D45',
                                color: isHovering ? 'white' : '#4A5D45',
                                backgroundColor: isHovering ? '#4A5D45' : 'transparent',
                                transition: '0.3s'
                            }}
                        >
                            🔄 REFRESH ORDERS
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container">
                {/* Tabs & Actions Header */}
                <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-3">
                    <div>
                        <div className="btn-group mb-2">
                            <button
                                className={`btn ${view === 'active' ? 'btn-success' : 'btn-outline-light'}`}
                                onClick={() => setView('active')}
                            >
                                Active Orders
                            </button>
                            <button
                                className={`btn ${view === 'history' ? 'btn-success' : 'btn-outline-light'}`}
                                onClick={() => setView('history')}
                            >
                                Order History
                            </button>
                        </div>
                        <h2 className="text-white font-serif mb-0">
                            {view === 'active' ? 'Incoming Orders' : 'Past Orders'}
                        </h2>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                        <span className="text-white small">Showing {filteredOrders.length} orders</span>
                        {view === 'active' && filteredOrders.length > 0 && (
                            <button className="btn btn-danger btn-sm" onClick={clearAllActive}>
                                ⚠️ CLEAR ALL ORDERS
                            </button>
                        )}
                    </div>
                </div>

                <div>
                    {loading ? (
                        <div className="text-center py-5 text-white">
                            <div className="spinner-border text-light" role="status"></div>
                            <p className="mt-2">Loading orders...</p>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="alert alert-light text-center py-5 shadow-sm">
                            {view === 'active' ? "No active orders pending." : "No history found."}
                        </div>
                    ) : (
                        filteredOrders.map(order => (
                            <div key={order._id} className="card mb-4 shadow-sm animate-fade-in" style={{ borderRadius: '15px', overflow: 'hidden', backgroundColor: '#F9F7F2', border: 'none' }}>
                                <div className="card-header d-flex justify-content-between align-items-center py-3" style={{ backgroundColor: '#fff', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                    <div>
                                        <span className="text-muted small fw-bold">ORDER ID:</span>
                                        <strong className="ms-1">{order._id}</strong>
                                    </div>
                                    <div className="d-flex align-items-center gap-3">
                                        <span className={`badge px-3 py-2 text-uppercase ${order.status === 'Completed' ? 'bg-success' : ''}`}
                                            style={order.status !== 'Completed' ? { backgroundColor: '#B4846C', color: 'white' } : {}}>
                                            {order.status}
                                        </span>
                                        {order.status !== 'Completed' && (
                                            <button className="btn btn-danger btn-sm rounded-pill px-3" onClick={() => completeOrder(order._id)}>
                                                Complete & Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="card-body p-4">
                                    <div className="row">
                                        <div className="col-md-6 border-end">
                                            <h6 className="text-uppercase small fw-bold text-muted mb-3">Customer Details</h6>
                                            <p className="mb-1"><strong>Name:</strong> {order.userId ? order.userId.name : 'Guest User'}</p>
                                            <p className="mb-1"><strong>Email:</strong> {order.userId ? order.userId.email : 'N/A'}</p>
                                            <p className="mb-0 text-muted small">Placed on: {new Date(order.createdAt).toLocaleString()}</p>
                                        </div>
                                        <div className="col-md-6 ps-md-4">
                                            <h6 className="text-uppercase small fw-bold text-muted mb-3">Shipping Address</h6>
                                            <p className="mb-0 small">{order.shippingAddress?.street}</p>
                                            <p className="mb-0 small">{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                                            <p className="mb-0 small">Zip: {order.shippingAddress?.zipCode}</p>
                                            <p className="mb-0 small">Mobile Number: {order.shippingAddress?.mobile_number}</p>
                                        </div>
                                    </div>
                                    <hr className="my-4" />
                                    <h6 className="text-uppercase small fw-bold text-muted mb-3">Products Requested:</h6>
                                    <ul className="list-group list-group-flush mb-3">
                                        {order.items.map((item, index) => (
                                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent border-0">
                                                <span>🌿 {item.name}</span>
                                                <span className="fw-bold">₹{item.price}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="text-end mt-3 border-top pt-3">
                                        <h4 className="font-serif fw-bold" style={{ color: '#4A5D45' }}>Total Amount: ₹{order.totalAmount}</h4>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Admin;
