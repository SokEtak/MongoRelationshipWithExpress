const mongoose = require('mongoose');

// MongoDB connection setup
mongoose.connect('mongodb://127.0.0.1:27017/farmStand')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Connection error:', err));

const Product = require('./models/product')  

const p = new Product({
    name:"Rice",
    price:1.5,
    category:'food'
})

// p.save().then(data=>{
//     console.log(data)
// })

const seedProducts = [
    { name: 'Coca Cola', price: 1.99, category: 'drinks' },
    { name: 'Pepsi', price: 1.89, category: 'drinks' },
    { name: 'Orange Juice', price: 2.49, category: 'drinks' },
    { name: 'Chicken Sandwich', price: 5.99, category: 'food' },
    { name: 'Veggie Wrap', price: 4.99, category: 'food' },
    { name: 'Espresso', price: 2.99, category: 'drinks' },
    { name: 'Green Tea', price: 1.49, category: 'drinks' },
    { name: 'Chocolate Bar', price: 0.99, category: 'snack' },
    { name: 'Chips Pack', price: 1.29, category: 'snack' },
    { name: 'Bottle of Water', price: 0.79, category: 'drinks' }
  ];
  
Product.insertMany(seedProducts)
.then(p=>{
    console.log(p);
})
.catch(err=>{
    console.log(err);
})
  