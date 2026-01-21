const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = 5000;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION ---
// Using the URI from your previous backend
const dbURI = 'mongodb+srv://Nivorgo_user:kaK7Mn6juueJhjcQ@nivorgo.lergdu3.mongodb.net/?appName=Nivorgo';
mongoose.connect(dbURI)
    .then(() => console.log("🍃 Nivorgo Database Connected"))
    .catch(err => console.error("❌ DB Error:", err));

// --- MODELS ---
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    address: {
        street: { type: String, default: "" },
        city: { type: String, default: "" },
        zipCode: { type: String, default: "" },
        state: { type: String, default: "" },
        mobile_number: {
            type: String,
            default: "",
            validate: {
                validator: function (v) {
                    return /^\d{10}$/.test(v) || v === "";
                },
                message: props => `${props.value} is not a valid 10-digit phone number!`
            }
        }
    },
    cart: [{ name: String, price: Number, quantity: { type: Number, default: 1 } }]
});
const User = mongoose.model('User', UserSchema);

const Order = mongoose.model('Order', new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: { type: Array, required: true },
    totalAmount: { type: Number, required: true },
    shippingAddress: { street: String, city: String, zipCode: String, state: String, mobile_number: String },
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
}));

// --- EMAIL CONFIGURATION ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: 'nivorgo@gmail.com', pass: 'wbtwxmxbfkbdxaee' }
});

// --- ROUTES ---

// 1. Auth & OTP
app.post('/register', async (req, res) => {
    try {
        let { name, email, password } = req.body;
        email = email.toLowerCase();
        const existingVerifiedUser = await User.findOne({ email, isVerified: true });
        if (existingVerifiedUser) return res.status(400).json({ message: "Email already registered." });

        await User.deleteOne({ email, isVerified: false });
        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const newUser = new User({ name, email, password: hashedPassword, otp, isVerified: false });
        await newUser.save();

        await transporter.sendMail({
            from: '"Nivorgo Ayurveda" <nivorgo@gmail.com>',
            to: email,
            subject: 'Verify your Nivorgo Account',
            html: `<div style="font-family: Arial; padding: 20px;"><h2>Your OTP is: ${otp}</h2></div>`
        });
        res.status(201).json({ message: "OTP sent!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Registration error." });
    }
});

app.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });
        if (user && user.otp === otp) {
            user.isVerified = true;
            user.otp = undefined;
            await user.save();
            res.status(200).json({ message: "Verified successfully!" });
        } else { res.status(400).json({ message: "Invalid OTP." }); }
    } catch (err) { res.status(500).json({ message: "Verification failed." }); }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user || !user.isVerified) return res.status(401).json({ message: "User not verified." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect password." });

        const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '24h' });
        res.json({ token, user: { name: user.name, email: user.email, address: user.address, cart: user.cart } });
    } catch (err) { res.status(500).json({ message: "Login error." }); }
});

// --- AUTH MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) return res.status(401).json({ message: "Access Denied. No Token." });

    jwt.verify(token, 'secret', (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid Token." });
        req.user = user;
        next();
    });
};

// 2. User Data
app.get('/api/user/orders/:email', authenticateToken, async (req, res) => {
    try {
        // Optional: specific check to ensure user only sees their own orders
        const user = await User.findOne({ email: req.params.email.toLowerCase() });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Security check: ensure token user ID matches route user ID
        if (req.user.id !== user._id.toString()) {
            return res.status(403).json({ message: "Access Forbidden: Not your account." });
        }

        const orders = await Order.find({ userId: user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) { res.status(500).json({ message: "Error fetching orders" }); }
});

// 3. Products
app.get('/products', (req, res) => {
    // Serving simplified product data compatible with the React frontend
    const products = [
        { name: 'Keshypushti Hair Oil', price: 1609, desc: 'Deep nourishment & strengthening.', benefits: ['Volume', 'Vitality'] },
        { name: 'Prati Darunaka Hair Oil', price: 1699, desc: 'Combats dandruff effectively.', benefits: ['Anti-Dandruff', 'Scalp Care'] },
        { name: 'Prati Palitya Hair Oil', price: 1699, desc: 'Prevents premature greying.', benefits: ['Restores Pigment', 'Shine'] },
        { name: 'Shirodhara Hair Oil', price: 1609, desc: 'Stress relief & relaxation.', benefits: ['Better Sleep', 'Calming'] },
        { name: 'Keshyadharni Hair Oil', price: 1609, desc: 'Promotes healthy hair growth.', benefits: ['Strength', 'Reduced Breakage'] }
    ];
    res.json(products);
});

// 4. Orders
app.post('/place-order', authenticateToken, async (req, res) => {
    try {
        const { email, items, total, address } = req.body;

        // Security check
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(404).json({ message: "User not found" });
        if (req.user.id !== user._id.toString()) return res.status(403).json({ message: "Forbidden" });

        const newOrder = new Order({
            userId: user._id,
            items,
            totalAmount: total,
            shippingAddress: address
        });

        await newOrder.save();

        await User.findOneAndUpdate(
            { email: email.toLowerCase() },
            { $set: { cart: [], address: address } }
        );

        res.status(201).json({ message: "Order placed successfully" });
    } catch (err) { res.status(500).json({ message: "Order failed" }); }
});

// ... (Contact and Admin routes remain same)

// 7. User Update API
app.put('/api/user/update', authenticateToken, async (req, res) => {
    try {
        const { email, address } = req.body;
        // Verify User
        const userCheck = await User.findOne({ email: email.toLowerCase() });
        if (req.user.id !== userCheck._id.toString()) return res.status(403).json({ message: "Forbidden" });

        const user = await User.findOneAndUpdate(
            { email: email.toLowerCase() },
            { $set: { address: address } },
            { new: true }
        );
        res.json({ message: "Profile updated", address: user.address });
    } catch (err) { res.status(500).json({ message: "Update failed" }); }
});

// 5. Contact
app.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;
    try {
        await transporter.sendMail({
            from: '"Nivorgo Website" <nivorgo@gmail.com>',
            to: 'nivorgo@gmail.com',
            subject: `🌿 Inquiry from ${name}`,
            html: `<h3>New Message</h3><p><b>From:</b> ${name} (${email})</p><p><b>Message:</b> ${message}</p>`
        });
        res.json({ message: "Sent!" });
    } catch (err) { res.status(500).json({ message: "Error" }); }
});

// 6. Admin API
app.get('/api/admin/orders', async (req, res) => {
    try {
        const { type } = req.query;
        let filter = {};

        if (type === 'active') {
            filter = { status: 'Pending' };
        } else if (type === 'history') {
            filter = { status: 'Completed' };
        }

        const orders = await Order.find(filter).populate('userId', 'name email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) { res.status(500).json({ message: "Error fetching admin orders" }); }
});

app.patch('/api/admin/orders/:id', async (req, res) => {
    try {
        const { status } = req.body;
        await Order.findByIdAndUpdate(req.params.id, { status });
        res.json({ message: "Order updated" });
    } catch (err) { res.status(500).json({ message: "Update failed" }); }
});

app.post('/api/admin/orders/clear-all', async (req, res) => {
    try {
        // Mark all 'Pending' orders as 'Completed' (Move to History)
        await Order.updateMany({ status: 'Pending' }, { $set: { status: 'Completed' } });
        res.json({ message: "All active orders moved to history" });
    } catch (err) { res.status(500).json({ message: "Clear all failed" }); }
});

// 7. User Update API (Combined above)

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Nivorgo Backend running on http://localhost:${PORT}`);
});
