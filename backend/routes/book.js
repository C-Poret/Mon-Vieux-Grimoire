const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sharp = require('../middleware/sharp-config');

const bookCtrl = require('../controllers/book');

router.get('/', bookCtrl.getAllBook);

router.get('/:id', bookCtrl.getOneBook);

router.get('/bestrating', bookCtrl.bestRating);

router.post('/', auth, multer, sharp, bookCtrl.createBook);

router.put('/:id', auth, multer, sharp, bookCtrl.modifyBook);

router.delete('/:id', auth, multer, bookCtrl.deleteBook);

router.post('/:id/rating', auth, bookCtrl.rateBook);

module.exports = router;