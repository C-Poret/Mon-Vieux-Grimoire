const Book = require('../models/Book');
const fs = require('fs');

exports.getAllBook = (req, res, next) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ error }));
};

exports.bestRating = (req, res, next) => {
    Book.find().sort({ averageRating: -1 }).limit(3)
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
};

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename.split('.')[0] + "_optimized.webp"}`
    });
    book.save()
        .then(() => { res.status(201).json({message: 'Livre enregistré !'})})
        .catch(error => { res.status(400).json( { error })})
 };

exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename.split('.')[0] + "_optimized.webp"}`
    } : { ...req.body };
    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                const originalFilename = filename.split('_optimized')[0];
                fs.unlink(`images/${originalFilename}.png`, () => { });
                fs.unlink(`images/${originalFilename}.jpg`, () => { });
                fs.unlink(`images/${filename}`, () => { });
                Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
                    .then(() => res.status(200).json({message : 'Livre modifié !'}))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch(error => { res.status(400).json({ error })});
};

exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id})
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                const originalFilename = filename.split('_optimized')[0];
                fs.unlink(`images/${originalFilename}.png`, () => { });
                fs.unlink(`images/${originalFilename}.jpg`, () => { });
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Livre supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => { res.status(500).json({ error })});
};

exports.rateBook = (req, res, next) => {
    const userId = req.auth.userId;
    const grade = req.body.rating;
    Book.findOne({ _id: req.params.id })
        .then(book => {
            const alreadyRated = book.ratings.find(userRating => userRating.userId === userId);
            if (alreadyRated) {
                return res.status(400).json({ message: 'Livre déjà noté !' })
            }
            book.ratings.push({ userId, grade });
            const averageRating = book.ratings.reduce((accumulator, currentValue) => accumulator + currentValue.grade, 0) / book.ratings.length;
            const averageRatingRound = Math.round(averageRating * 100) / 100;
            book.averageRating = averageRatingRound;
            book.save();
            res.status(200).json(book)
        })
    .catch(error => res.status(500).json({ error }));
};