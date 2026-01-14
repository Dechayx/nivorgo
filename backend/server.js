const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
// --- VIEW ENGINE SETUP ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'frontend', 'views')); // We will make this folder

// Route for About Page
app.get('/about', (req, res) => {
    res.render('aboutus'); // Looks for about.ejs
});

// Route for Why Ayurveda Page
app.get('/why-ayurveda', (req, res) => {
    res.render('ayurveda'); // Looks for why-ayurveda.ejs
});



// --- 1. MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// --- 2. EMAIL CONFIGURATION ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'nivorgo@gmail.com', 
        // Your 16-character App Password
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
        state: { type: String, default: "" }
    },
    cart: [ { name: String, price: Number, quantity: { type: Number, default: 1 } } ]
});
const User = mongoose.model('User', UserSchema);

const Order = mongoose.model('Order', new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: { type: Array, required: true },
    totalAmount: { type: Number, required: true },
    shippingAddress: { street: String, city: String, zipCode: String, state: String },
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
}));

// --- 5. AUTH & OTP ROUTES ---

app.post('/register', async (req, res) => {
    try {
        let { name, email, password } = req.body;
        email = email.toLowerCase();

        // 1. Check if a VERIFIED user already exists
        const existingVerifiedUser = await User.findOne({ email, isVerified: true });
        if (existingVerifiedUser) {
            return res.status(400).json({ message: "Email already registered. Please Login." });
        }

        // 2. CLEANUP: Delete any unverified user with this email 
        await User.deleteOne({ email, isVerified: false });

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const newUser = new User({ 
            name, email, password: hashedPassword, otp, isVerified: false 
        });

        await newUser.save();

        // 3. Send Email
        try {
            await transporter.sendMail({
                from: '"Nivorgo Ayurveda" <nivorgo@gmail.com>',
                to: email,
                subject: 'Verify your Nivorgo Account',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;">
                        <h2 style="color: #4A5D45;">Welcome to Nivorgo</h2>
                        <p>Your verification code is:</p>
                        <h1 style="color: #B4846C; letter-spacing: 2px;">${otp}</h1>
                        <p>This code is valid for 10 minutes.</p>
                    </div>
                `
            });
            console.log("✅ Email sent successfully to:", email);
            res.status(201).json({ message: "OTP sent to email!" });

        } catch (mailErr) {
            await User.deleteOne({ email }); 
            console.error("❌ NODEMAILER ERROR:", mailErr.message);
            res.status(500).json({ message: "Email failed. Check server logs." });
        }

    } catch (err) {
        console.error("❌ Database/Server Error:", err);
        res.status(500).json({ message: "Registration error." });
    }
});

app.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(404).json({ message: "User not found." });

        if (user.otp === otp) {
            user.isVerified = true;
            user.otp = undefined; 
            await user.save();
            res.status(200).json({ message: "Verified successfully!" });
        } else {
            res.status(400).json({ message: "Invalid OTP." });
        }
    } catch (err) { res.status(500).json({ message: "Verification failed." }); }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) return res.status(400).json({ message: "User not found." });
        if (!user.isVerified) return res.status(401).json({ message: "Please verify your email first." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect password." });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
        res.status(200).json({ token, user: { name: user.name, email: user.email, cart: user.cart, address: user.address } });
    } catch (err) { res.status(500).json({ message: "Login error." }); }
});

// --- 6. PRODUCT ROUTE (ADDED BACK) ---
app.get('/products', (req, res) => {
    const products = [
        { name: 'Keshypushti Hair Oil', price: 1609, desc: 'Deep nourishment.', benefits: ['Volume', 'Vitality'] },
        { name: 'Prati Darunaka Hair Oil', price: 1699, desc: 'Combats dandruff.', benefits: ['Anti-Dandruff', 'Scalp Care'] },
        { name: 'Prati Palitya Hair Oil', price: 1699, desc: 'Premature greying care.', benefits: ['Restores Pigment', 'Shine'] },
        { name: 'Shirodhara Hair Oil', price: 1609, desc: 'Stress relief.', benefits: ['Better Sleep', 'Calming'] },
        { name: 'Keshyadharni Hair Oil', price: 1609, desc: 'Growth formula.', benefits: ['Strength', 'Reduced Breakage'] }
    ];
    res.json(products);
});

// --- 7. ORDER & ADMIN ROUTES ---
app.post('/place-order', async (req, res) => {
    try {
        const { email, items, total, address } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });
        const newOrder = new Order({ userId: user._id, items, totalAmount: total, shippingAddress: address });
        await newOrder.save();
        await User.findOneAndUpdate({ email: email.toLowerCase() }, { $set: { cart: [], address: address } });
        res.status(201).json({ message: "Order placed!" });
    } catch (err) { res.status(500).json({ message: "Order failed." }); }
});

app.get('/api/admin/orders', async (req, res) => {
    try {
        const orders = await Order.find().populate('userId', 'name email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) { res.status(500).json({ message: "Error fetching orders" }); }
});

app.delete('/api/admin/orders/:id', async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) { res.status(500).json({ message: "Error deleting order" }); }
});

app.get('/admin-portal', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'admin.html'));
});

app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});
// --- 8. CONTACT FORM ROUTE ---
app.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;
    try {
      
        await transporter.sendMail({
            from: '"Nivorgo Website" <nivorgo@gmail.com>', // Sender (Must be your authenticated email)
            to: 'nivorgo@gmail.com', // Recipient (Where YOU want to receive the inquiries)
            replyTo: email, // This lets you simply hit "Reply" to email the customer back
            subject: `🌿 New Inquiry from ${name}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #4A5D45;">New Customer Message</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <hr>
                    <p><strong>Message:</strong></p>
                    <blockquote style="background: #f9f9f9; padding: 15px; border-left: 4px solid #4A5D45;">
                        ${message}
                    </blockquote>
                </div>
            `
        });
        console.log("✅ Contact message sent from:", email);
        res.json({ message: "Message sent successfully!" });

    } catch (err) {
        console.error("❌ Contact Email Error:", err);
        res.status(500).json({ message: "Failed to send message." });
    }
});
app.listen(5000, () => console.log(`🚀 Server on http://localhost:5000`));