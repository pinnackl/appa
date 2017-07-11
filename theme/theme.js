var express = require('express'),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    replace = require('stream-replace'),
    path = require('path'),
    router = express.Router();

/**
 * Download app-theme file
 */
router.post('/download', bodyParser.urlencoded(true), function (req, res) {
    var file = path.join(__dirname, '/template/app-theme.example.html');
    var rstream = fs.createReadStream(file);

    var obj = req.body;
    res.writeHead(200, { "Content-Type": "application/force-download", "Content-Disposition": "filename='app-theme.html'" });

    for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
            var re = new RegExp(property, "g");
            rstream = rstream.pipe(replace(re, obj[property]));
        }
    }
    rstream.pipe(replace(/(#.*#)+/gmi, "inherit"))
        .pipe(res);

});

module.exports = router;
