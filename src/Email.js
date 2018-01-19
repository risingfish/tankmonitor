var nodemailer = require('nodemailer');

/**
 *
 * @constructor
 */
var Email = function(config) {
    var sender = null;
    var conf = config;
    var defaultCarrier = null;
    var rxPhoneNumber = new RegExp("^[0-9]{10}$");

    if (conf.carrier) {
        switch (conf.carrier) {
            case 'verizon':
                console.log('setting carrier to ' + Email.CARRIER_VERIZON);
                defaultCarrier = Email.CARRIER_VERIZON;
                break;
            case 'att':
                console.log('setting carrier to ' + Email.CARRIER_ATT);
                defaultCarrier = Email.CARRIER_ATT;
                break;
            default:
                throw new Error('Invalid Carrier')
        }
    }


    this.setCarrier = function (carrier) {
        defaultCarrier = carrier;
    };

    this.setSender = function (newSender) {
        sender = newSender;
    };

    this.sendEmail = function (address, message, carrier) {
        var transporter, mailOptions;
        var carrier = carrier || defaultCarrier;
        var smsRecipients = '';

        if (address && address instanceof Array) {
            // Looks like we got an array of contacts. Lets loop through them an build a string of SMS recipients.
            address.forEach(function (val) {
                if (rxPhoneNumber.test(val)) {
                    if (smsRecipients.length > 0) {
                        smsRecipients += ',';
                    }
                    smsRecipients += val + '@' + carrier;
                } else {
                    console.log('Invalid contact number')
                }
            });
        } else if (address && rxPhoneNumber.test(address)) {
            smsRecipients = address + '@' + carrier;
        } else {
            throw new Error('Invalid SMS number.');
        }

        if (smsRecipients.length === 0) {
            throw new Error('Invalid SMS number.');
        }

        // Setup the nodemailer object to point to the mail relay
        transporter = nodemailer.createTransport({
            host: conf.hostname,
            port: conf.port,
            secure: conf.secure // true for 465, false for other ports
        });

        mailOptions = {
            from: conf.senderAddress, // sender address
            to: smsRecipients, // list of receivers
            subject: '', // Subject line
            text: message // plain text body
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

