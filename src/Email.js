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

    };
};

Email.CARRIER_VERIZON = 'vtext.com';

module.exports = Email;

