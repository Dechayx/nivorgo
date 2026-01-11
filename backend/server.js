const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// --- 1. MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// --- 2. MONGODB CONNECTION ---
// --- 2. MONGODB CONNECTION ---
const dbURI = 'mongodb+srv://Nivorgo_user:kaK7Mn6juueJhjcQ@nivorgo.lergdu3.mongodb.net/?appName=Nivorgo';

mongoose.connect(dbURI, {
    serverSelectionTimeoutMS: 5000 // Fails faster if the IP is blocked
})
  .then(() => console.log("🍃 Nivorgo Database Connected & Schema Synced"))
  .catch(err => {
    console.error("❌ DB Error: Check your IP Whitelist in MongoDB Atlas!");
    console.error(err.message);
  });

// --- 3. MODELS ---
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
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

// --- 4. AUTH ROUTES ---

// REGISTER
app.post('/register', async (req, res) => {
    try {
        let { name, email, password } = req.body;
        email = email.toLowerCase();
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already exists." });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "User created!" });
    } catch (err) { res.status(500).json({ message: "Registration error." }); }
});

// LOGIN
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(400).json({ message: "User not found." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect password." });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
        res.status(200).json({ token, user: { name: user.name, email: user.email, cart: user.cart, address: user.address } });
    } catch (err) { res.status(500).json({ message: "Login error." }); }
});

// --- 5. CART & ORDER API ---

app.post('/sync-cart', async (req, res) => {
    try {
        const { email, cartItems } = req.body;
        await User.findOneAndUpdate({ email: email.toLowerCase() }, { cart: cartItems });
        res.status(200).json({ message: "Synced" });
    } catch (err) { res.status(500).json({ message: "Sync error" }); }
});

app.post('/place-order', async (req, res) => {
    try {
        const { email, items, total, address } = req.body;
        console.log("📦 Processing order for:", email);

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(404).json({ message: "User not found" });

        const newOrder = new Order({
            userId: user._id,
            items,
            totalAmount: total,
            shippingAddress: address
        });

        await newOrder.save();
        console.log("✅ Order saved to 'orders' collection");

        // Update user: Clear cart and save address
        await User.findOneAndUpdate(
            { email: email.toLowerCase() },
            { $set: { cart: [], address: address } }
        );

        res.status(201).json({ message: "Order placed successfully!" });
    } catch (err) {
        console.error("❌ Order error:", err);
        res.status(500).json({ message: "Order processing failed" });
    }
});

// --- 6. ADMIN API ---


// --- 7. PRODUCTS & NAVIGATION ---
app.get('/products', (req, res) => {
    res.json([
        { name: 'Keshypushti Hair Oil', price: 1609, desc: 'Deep nourishment.', benefits: ['Volume', 'Vitality'] },
        { name: 'Prati Darunaka Hair Oil', price: 1699, desc: 'Combats dandruff.', benefits: ['Anti-Dandruff', 'Scalp Care'] },
        { name: 'Prati Palitya Hair Oil', price: 1699, desc: 'Premature greying care.', benefits: ['Restores Pigment', 'Shine'] },
        { name: 'Shirodhara Hair Oil', price: 1609, desc: 'Stress relief.', benefits: ['Better Sleep', 'Calming'] },
        { name: 'Keshyadharni Hair Oil', price: 1609, desc: 'Growth formula.', benefits: ['Strength', 'Reduced Breakage'] }
    ]);
});

// --- 6. ADMIN API (MUST BE ABOVE NAVIGATION) ---
app.get('/api/admin/orders', async (req, res) => {
    try {
        const orders = await Order.find().populate('userId', 'name email').sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (err) { res.status(500).json({ message: "Error" }); }
});
// DELETE ORDER (Mark as Completed/Remove)
app.delete('/api/admin/orders/:id', async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Order removed." });
    } catch (err) {
        res.status(500).json({ message: "Delete failed." });
    }
});

// --- 7. NAVIGATION (ALWAYS LAST) ---
// This route is a 'catch-all'. If an API isn't found above, it sends the HTML.
app.get('/admin-portal', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'admin.html'));
});
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));