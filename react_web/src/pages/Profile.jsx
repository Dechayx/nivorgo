import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Using the same API base as App.jsx
const apiBase = 'http://localhost:5000';

const Profile = ({ user, setUser }) => { // Accept user and setUser to update local profile data
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [address, setAddress] = useState(user?.address || {});
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({
        street: '', city: '', zipCode: '', mobile_number: '', state: 'Maharashtra'
    });

    useEffect(() => {
        if (user?.email) {
            fetchOrders();
            // Sync address from user prop
            if (user.address) {
                setAddress(user.address);
                setEditData({
                    street: user.address.street || '',
                    city: user.address.city || '',
                    zipCode: user.address.zipCode || '',
                    mobile_number: user.address.mobile_number || '',
                    state: user.address.state || 'Maharashtra'
                });
            }
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const res = await axios.get(`${apiBase}/api/user/orders/${user.email}`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            setOrders(res.data);
        } catch (err) {
            console.error("Error fetching orders", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`${apiBase}/api/user/update`, {
                email: user.email,
                address: editData
            }, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });

            const newAddress = res.data.address;
            setAddress(newAddress);

            // Update local storage and parent state
            const updatedUser = { ...user, address: newAddress };
            localStorage.setItem('userAddress', JSON.stringify(newAddress));
            setUser(updatedUser); // Update App state

            alert("Address saved to your account! 🍃");
            setEditMode(false);
        } catch (err) {
            alert("Update failed.");
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    if (!user) {
        return (
            <div className="container py-5 text-center" style={{ marginTop: '100px' }}>
                <h3>Please Log In to view your profile.</h3>
            </div>
        );
    }

    return (
        <div className="container" style={{ marginTop: '120px', marginBottom: '60px' }}>
            <div className="row g-4">
                {/* Sidebar */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: '15px' }}>
                        <h4 className="font-serif mb-4" style={{ color: '#4A5D45' }}>Profile Details</h4>
                        <div className="mb-3">
                            <label className="text-muted small">Full Name</label>
                            <p className="fw-bold mb-0">{user.name}</p>
                        </div>
                        <div className="mb-4">
                            <label className="text-muted small">Email Address</label>
                            <p className="mb-0">{user.email}</p>
                        </div>
                        <hr />
                        <h5 className="font-serif mb-3">Saved Address</h5>
                        {address.street ? (
                            <div className="small text-muted">
                                <p className="mb-1">{address.street}</p>
                                <p className="mb-1">{address.city}, {address.state} - {address.zipCode}</p>
                                <p>Mobile: {address.mobile_number}</p>
                            </div>
                        ) : (
                            <p className="small text-muted">No address saved yet.</p>
                        )}
                        <button className="btn btn-sm btn-outline-success mt-3" onClick={() => setEditMode(true)}>
                            Edit Profile
                        </button>
                    </div>
                </div>

                {/* Orders */}
                <div className="col-lg-8">
                    <div className="card p-4 shadow-sm border-0">
                        <h4 className="font-serif mb-4">Order History</h4>
                        <div className="table-responsive">
                            <table className="table">
                                <thead className="table-light">
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Total</th>
                                        <th>Items</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="5" className="text-center">Loading orders...</td></tr>
                                    ) : orders.length === 0 ? (
                                        <tr><td colSpan="5" className="text-center">You haven't placed any orders yet.</td></tr>
                                    ) : (
                                        orders.map(order => {
                                            let badgeClass = 'bg-secondary';
                                            if (order.status === 'Pending') badgeClass = 'bg-warning text-dark';
                                            if (order.status === 'Completed') badgeClass = 'bg-success';

                                            return (
                                                <tr key={order._id}>
                                                    <td className="fw-bold">#{order._id.slice(-6).toUpperCase()}</td>
                                                    <td>{formatDate(order.createdAt)}</td>
                                                    <td><span className={`badge rounded-pill ${badgeClass}`}>{order.status}</span></td>
                                                    <td>₹{order.totalAmount}</td>
                                                    <td>
                                                        <ul className="list-unstyled small mb-0">
                                                            {order.items.map((item, i) => (
                                                                <li key={i}>{item.name} (x{item.quantity || 1})</li>
                                                            ))}
                                                        </ul>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal (Inline for Simplicity) */}
            {editMode && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title font-serif">Update Profile</h5>
                                <button type="button" className="btn-close" onClick={() => setEditMode(false)}></button>
                            </div>
                            <form onSubmit={handleUpdateProfile}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Street Address</label>
                                        <input
                                            type="text" className="form-control" required
                                            value={editData.street}
                                            onChange={(e) => setEditData({ ...editData, street: e.target.value })}
                                        />
                                    </div>
                                    <div className="row">
                                        <div className="col-6 mb-3">
                                            <label className="form-label">City</label>
                                            <input
                                                type="text" className="form-control" required
                                                value={editData.city}
                                                onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-6 mb-3">
                                            <label className="form-label">Zip Code</label>
                                            <input
                                                type="text" className="form-control" required
                                                value={editData.zipCode}
                                                onChange={(e) => setEditData({ ...editData, zipCode: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Mobile Number</label>
                                        <input
                                            type="tel" className="form-control" maxLength="10" pattern="\d{10}" required
                                            value={editData.mobile_number}
                                            onChange={(e) => setEditData({ ...editData, mobile_number: e.target.value.replace(/[^0-9]/g, '') })}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setEditMode(false)}>Close</button>
                                    <button type="submit" className="btn btn-success">Save Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
