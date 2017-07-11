const express = require('express'),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    path = require('path'),
    base64Img = require('base64-img'),
    Jimp = require('jimp'),
    randomstring = require("randomstring"),
    Promise = require('bluebird'),
    multer = require('multer'),
    router = express.Router();

/**
 * upload configuration
 */
var fileBaseName = null,
    minifyBaseName = null,
    newFileName = null,
    filePath = null,
    minifyPath = null;

/**
 * files configuration.
 * To determine if a file is an valid we can read the first bytes of the stream and compare it with magic numbers
 */
var MAGIC_NUMBERS = {
    jpg: 'ffd8ffe0',
    jpg1: 'ffd8ffe1',
    png: '89504e47',
    gif: '47494638'
}

function checkMagicNumbers(magic) {
    if (magic == MAGIC_NUMBERS.jpg || magic == MAGIC_NUMBERS.jpg1 || magic == MAGIC_NUMBERS.png || magic == MAGIC_NUMBERS.gif)
        return true;
}

/**
 * multer storage configuration
 */
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, '/../uploads'));
    },
    filename: function (req, file, callback) {
        fileBaseName = path.basename(file.originalname, path.extname(file.originalname));
        fileBaseName = randomstring.generate(7);

        newFileName = fileBaseName + path.extname(file.originalname);

        filePath = path.join(__dirname, '/../uploads', newFileName);
        minifyPath = path.join(__dirname, '/../uploads', "m_" + newFileName);

        callback(null, newFileName);
    }
});

/**
 * Upload image
 * return base64 to minify image & image name
 */
router.post('/upload', function (req, res) {
    var upload = multer({
        storage: storage
    }).any();

    upload(req, res, function (err) {

        var bitmap = fs.readFileSync('./uploads/' + req.files[0].filename).toString('hex', 0, 4);
        if (!checkMagicNumbers(bitmap)) {
            fs.unlinkSync('./uploads/' + req.files[0].filename);
            res.status(403).end('File is not valid');
        }

        var minifyOriginalImage = new Promise(function (resolve, reject) {
            Jimp.read(filePath).then(function (image) {
                image.scale(0.1)
                    .write(minifyPath, resolve);
            }).catch(function (err) {
                console.error(err);
                return res.status(400).end("Error during minify process");
            });
        });

        minifyOriginalImage.then(function () {
            dataImage = base64Img.base64Sync(minifyPath);
            res.status(200).json({
                imageName: newFileName,
                imageBase64: dataImage
            });
        });

    })
});

module.exports = router;
