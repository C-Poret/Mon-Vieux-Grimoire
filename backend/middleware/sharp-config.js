const sharp = require('sharp');

module.exports = (req, res, next) => {
    try {
        if(req.file) {
            sharp(req.file.path)
            .webp()
            .toFile(req.file.path.split('.')[0] + "_optimized.webp")
        }
    next()
    } catch(error) {
        res.status(500).json({ error });
    }
};