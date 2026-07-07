const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./connect_db');
const protect = require('./middleware/auth');
const cors = require('cors');
const { getProducts, getProductById, createProduct, deleteProduct, updateProduct } = require('./routes/product');
const { register, login, getUsers, getUserById, deleteUser, profile, logout } = require('./routes/user');
require('dotenv').config();

const app = express();
const PORT = 4000;
const server = '/api/v1'

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.get('/', (req, res) => {
  res.json({ message: 'Hello Express!' });
});

// Product routes
app.get(`${server}/products`, getProducts);
app.get(`${server}/products/:id`, getProductById);
app.post(`${server}/products`, createProduct);
app.delete(`${server}/products/:id`, deleteProduct);
app.put(`${server}/products/:id`, updateProduct);

// User routes
app.post(`${server}/register`, register);
app.post(`${server}/login`, login);
app.get(`${server}/users`, getUsers);
app.get(`${server}/users/:id`, getUserById);
app.delete(`${server}/users/:id`, deleteUser);
app.get(`${server}/profile`, protect, profile);
app.post(`${server}/logout`, logout);

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on :${PORT}`);
});
