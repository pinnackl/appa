const nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars'),
    bodyParser = require('body-parser'),
    express = require('express'),
    router = express.Router();

/**
 * Configure templates
 */
var options = {
    viewEngine: {
        extname: '.hbs',
        layoutsDir: __dirname + '/views/email/',
        defaultLayout: 'template',
        partialsDir: __dirname + '/views/partials/'
    },
    viewPath: __dirname + '/views/email/',
    extName: '.hbs'
};

/**
 * Send Email
 */
router.post('/:route', bodyParser.urlencoded(true), function (req, res) {
    var route = req.params.route;
    var data = req.body;

    var transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "pinnakle.work@gmail.com",
            pass: "Icge0ylb!"
        }
    });
    transporter.use('compile', hbs(options));

    var mailOptions = {};

    switch (route) {
        case 'inscription':
            mailOptions = {
                from: "pinnakle.work@gmail.com",
                to: data.recipient,
                subject: "Welcome",
                template: route + '/' + route + '.body',
                context: {
                    username: data.username
                }
            }
            break;
        case 'contact':
            mailOptions = {
                from: "pinnakle.work@gmail.com",
                to: data.recipient,
                subject: data.subject,
                template: data.request + '/' + data.request + '.body',
                context: {
                    username: data.username,
                    message: data.message
                }
            }
            break;
        default:
            return res.status(404).end('Not Found');
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            return res.status(400).end("Error during sending email");
        } else {
            console.log('Message %s sent: %s', info.messageId, info.response);
            transporter.close();
            return res.status(200).end("Email sent");
        }

    });

});

module.exports = router;
