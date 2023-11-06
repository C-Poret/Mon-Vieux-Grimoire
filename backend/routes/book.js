const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

const Book = require('../models/Book');

router.get('/', (req, res, next) => {

});

router.get('/:id', (req, res, next) => {

});

router.get('/bestrating', (req, res, next) => {

});

router.post('/', auth, (req, res, next) => {

});

router.put('/:id', auth, (req, res, next) => {

});

router.delete('/:id', auth, (req, res, next) => {

});

router.post('/:id/rating', auth, (req, res, next) => {

});

module.exports = router;