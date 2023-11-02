const express = require('express');
const mongoose = require('mongoose');

const usersRoutes = require('./routes/users');
const booksRoutes = require('./routes/books');

mongoose.connect('mongodb+srv://8JwazrZY43gNbJZL:8JwazrZY43gNbJZL@cluster0.zjchg4i.mongodb.net/?retryWrites=true&w=majority',
    { useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/auth', usersRoutes);
app.use('/api/books', booksRoutes);

module.exports = app;