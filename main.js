var Email = require('./src/Email.js');
var FloatSensor = require('./src/FloatSensor.js');
var moment = require('moment');

var config = require('./config.json');
var lastSMS = null;

var outputFloatLevel = function (output) {
    var timestamp = moment();
    console.log(timestamp.format('YYYY/MM/DD hh:mm:ss a') + " " + output);

    if (output > 0) {
        if (lastSMS === null || lastSMS.isAfter(timestamp.add('1', 'm'))) {
            var email = new Email(config);

            if (config.dev) {
                console.log('would of sent email to ')
            } else {

                if (!config.notify.waterLevel) {
                    throw new Error("No waterLevel contacts to notify")
                } else {
                    email.sendEmail(config.notify.waterLevel, "Water levels are low!");
                }

            }

            lastSMS = moment();
        } else {
            console.log('Skipping SMS. Not enough time elapsed since last one');
        }
    }
};

var waterLevel = new FloatSensor({
    "pin": 17,
    "readInterval": 1000,
    "floatRead": outputFloatLevel
});


waterLevel.start();

process.on('SIGINT', function() {
    console.log("\nCaught interrupt signal");
    process.exit();
});

setTimeout(function () {
    waterLevel.stop();
    process.exit();
}, 60000); //stop reading after 60 seconds