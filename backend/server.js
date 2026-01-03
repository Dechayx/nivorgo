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


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));