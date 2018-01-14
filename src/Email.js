var nodemailer = require('nodemailer');

/**
 *
 * @constructor
 */
var Email = function() {
    var sender = null;

    this.setSender = function (newSender) {
        sender = newSender;
    };

    this.sendEmail = function (address, message, carrier) {
        var transporter = nodemailer.createTransport({
            host: 'homestor',
            port: 25,
            secure: false // true for 465, false for other ports
        });

        var mailOptions = {
            from: '"Zac" <risingfish@gmail.com>', // sender address
            to: '2087249509@vtext.com, 2082837091@vtext.com', // list of receivers
            subject: '', // Subject line
            text: 'The quarantine tank is low! Please check the water levels!' // plain text body
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        });
    };
};

Email.CARRIER_VERIZON = 'vtext.com';
Email.CARRIER_ATT = 'txt.att.net';

module.exports = Email;

