var Email = require('./src/Email.js');
var FloatSensor = require('./src/FloatSensor.js');
var moment = require('moment');

var config = require('./config.json');
var lastSMS = null;

var outputFloatLevel = function (output) {
    var timestamp = moment();
    console.log(timestamp.format('YYYY/MM/DD hh:mm:ss a') + " " + output);

    if (output > 0) {
        // Lets check to see if we sent an SMS in the last minute. If we have we should hold off for a while.
        if (lastSMS === null || lastSMS.isAfter(timestamp.add('1', 'm'))) {
            var email = new Email(config.mailRelay);

            // If we're running in dev mode, don't actually send the SMS
            if (config.dev) {
                console.log('Would of sent email to', config.notify.waterLevel)
            } else {
                // If we don't have SMS recipients setup, we throw an error. This isn't much good without them!
                if (!config.notify.waterLevel || !config.messages.waterLevel) {
                    throw new Error("No waterLevel contacts to notify or no message to send!")
                } else {
                    email.sendEmail(config.notify.waterLevel, config.messages.waterLevel);
                }

            }

            lastSMS = moment();
        } else {
            console.log('Skipping SMS. Not enough time elapsed since last one');
        }
    }
};

// Configure the RPi GPIO to read the correct pin for the float sensor.
var waterLevel = new FloatSensor({
    "pin": config.sensors.waterLevel.pin,
    "readInterval": config.sensors.waterLevel.readInterval,
    "floatRead": outputFloatLevel
});

// Begin polling the float sensor
waterLevel.start();

process.on('SIGINT', function() {
    console.log("\nCaught interrupt signal");
    process.exit();
});

setTimeout(function () {
    waterLevel.stop();
    process.exit();
}, 60000); //stop reading after 60 seconds