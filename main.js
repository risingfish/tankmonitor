var Email = require('./src/Email.js');
var FloatSensor = require('./src/FloatSensor.js');

var outputFloatLevel = function (output) {
    var timestamp = new Date();
    console.log(timestamp.toString() + " " + output);

    if (output > 0) {
        var email = new Email();
        email.sendEmail('', "Water levels are low!", Email.CARRIER_VERIZON)
    }
};

var waterLevel = new FloatSensor({
    "pin": 17,
    "readInterval": 1000,
    "floatRead": outputFloatLevel
});


waterLevel.start();

setTimeout(function () {
    waterLevel.stop();
}, 60000); //stop reading after 60 seconds