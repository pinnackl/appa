var express = require('express'),
    bodyParser = require('body-parser'),
    app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.urlencoded(true));

app.use('/images', express.static('uploads'));

app.use('/theme', require('./theme/theme'));
app.use('/cdn', require('./cdn/cdn'));
app.use('/smtp', require('./smtp/smtp'));

app.listen(9000, function () {
    console.log('Appa Service listening on port 9000!');
});