const express = require('express');
const app = express();
const cors = require('cors');


app.use(cors());
app.use(express.json());

const path = require('path');
app.use(express.static(path.join(__dirname, '..', 'frontend')));


app.get('/', (req, res) => {
  res.send('NIVORGO Backend is Running');
});


app.get('/products', (req, res) => {
  res.json([
    { name: 'Keshypushti Hair Oil', price: 1609 },
    { name: 'Prati Darunaka Hair Oil', price: 1699 },
      { name: 'Prati Palitya Hair Oil', price: 1699 },
    { name: 'Shirodhara Hair Oil', price: 1699 },
      { name: 'Keshyadharni Hair Oil', price: 1609 }
  ]);
});


app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});


// This matches the form action="/search" we added above
app.get('/search', async (req, res) => {
    const query = req.query.q; // Gets the text user typed
    
    // Example: Searching your database (modify for your specific DB logic)
    // If using MongoDB/Mongoose:
    const products = await Product.find({ 
        name: { $regex: query, $options: 'i' } // 'i' makes it case-insensitive
    });

    // Render your product page with the results
    res.render('/products', { 
        products: products, 
        searchQuery: query 
    });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));