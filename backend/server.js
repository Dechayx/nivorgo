const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

// --- 1. VIEW ENGINE & MIDDLEWARE ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'frontend', 'views'));

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// --- 2. EMAIL CONFIGURATION ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'nivorgo@gmail.com', 
        pass: 'wbtwxmxbfkbdxaee'     
    }
});

// --- 3. MONGODB CONNECTION ---
const dbURI = 'mongodb+srv://Nivorgo_user:kaK7Mn6juueJhjcQ@nivorgo.lergdu3.mongodb.net/?appName=Nivorgo';
mongoose.connect(dbURI)
  .then(() => console.log("🍃 Nivorgo Database Connected"))
  .catch(err => console.error("❌ DB Error:", err));

// --- 4. MODELS ---
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
        validator: function(v) {
            // Returns true only if the string is exactly 10 digits (0-9)
            return /^\d{10}$/.test(v) || v === ""; 
        },
        message: props => `${props.value} is not a valid 10-digit phone number!`
    }
}
    },
    cart: [ { name: String, price: Number, quantity: { type: Number, default: 1 } } ]
});
const User = mongoose.model('User', UserSchema);

const Order = mongoose.model('Order', new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: { type: Array, required: true },
    totalAmount: { type: Number, required: true },
    shippingAddress: { street: String, city: String, zipCode: String, state: String ,mobile_number:Number},
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
}));    

// --- 5. AUTH & OTP ROUTES ---
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
    } catch (err) { res.status(500).json({ message: "Registration error." }); }
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

// --- 6. USER DATA & PROFILE API ---
app.get('/api/user/orders/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email.toLowerCase() });
        if (!user) return res.status(404).json({ message: "User not found" });
        const orders = await Order.find({ userId: user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) { res.status(500).json({ message: "Error fetching orders" }); }
});

app.put('/api/user/update', async (req, res) => {
    try {
        const { email, address } = req.body;
        const updatedUser = await User.findOneAndUpdate(
            { email: email.toLowerCase() },
            { $set: { address: address } },
            { new: true }
        );
        console.log(`✅ Profile Updated: ${email}`);
        res.json({ message: "Success", address: updatedUser.address });
    } catch (err) { res.status(500).json({ message: "Update failed" }); }
});

// --- 7. ADMIN API ROUTES ---
app.get('/api/admin/orders', async (req, res) => {
    try {
        // Populates name/email from User model for the Admin Dashboard
        const orders = await Order.find().populate('userId', 'name email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) { res.status(500).json({ message: "Error fetching admin orders" }); }
});

// Change from app.delete to app.patch
// --- ADMIN: Update Order Status ---
app.patch('/api/admin/orders/:id', async (req, res) => {
    try {
        const { status } = req.body; // Expecting { "status": "Completed" }
        
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: { status: status } }, 
            { new: true }
        );

        if (!updatedOrder) return res.status(404).json({ message: "Order not found" });

        res.json({ message: "Order updated successfully", order: updatedOrder });
    } catch (err) {
        res.status(500).json({ message: "Server error during update" });
    }
});
// --- 8. PRODUCT & ORDER ROUTES ---
app.get('/products', (req, res) => {
    const products = [
        { name: 'Keshypushti Hair Oil', price: 1609 },
        { name: 'Prati Darunaka Hair Oil', price: 1699 },
        { name: 'Prati Palitya Hair Oil', price: 1699 },
        { name: 'Shirodhara Hair Oil', price: 1609 },
        { name: 'Keshyadharni Hair Oil', price: 1609 }
    ];
    res.json(products);
});

app.post('/place-order', async (req, res) => {
    try {
        const { email, items, total, address } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(404).json({ message: "User not found" });

        const newOrder = new Order({ 
            userId: user._id, 
            items, 
            totalAmount: total, 
            shippingAddress: address 
        });
        
        await newOrder.save();
        
        // Also update the user's default address and clear cart
        await User.findOneAndUpdate(
            { email: email.toLowerCase() }, 
            { $set: { cart: [], address: address } }
        );

        res.status(201).json({ message: "Order placed successfully" });
    } catch (err) { res.status(500).json({ message: "Order failed" }); }
});

// --- 9. CONTACT FORM ---
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

// --- 10. PAGE RENDERING ROUTES ---
app.get('/about', (req, res) => res.render('aboutus'));
app.get('/why-ayurveda', (req, res) => res.render('ayurveda'));
app.get('/profile', (req, res) => res.render('profile'));

// Protected Admin Portal
app.get('/admin-portal', (req, res) => {
    // Optional: Add a password check via query param like /admin-portal?pass=123
    res.sendFile(path.join(__dirname, '..', 'frontend', 'admin.html'));
});

// --- 11. THE CATCH-ALL (MUST BE LAST) ---

app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// At the bottom of server.js
app.set('views', path.join(process.cwd(), 'frontend', 'views'));

// IMPORTANT: Export for Vercel
module.exports = app;