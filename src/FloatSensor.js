var Gpio = require('pigpio').Gpio; //include pigpio to interact with the GPIO

var FloatSensor = function (config) {
    var conf = config;
    var floatSensor = new Gpio(conf.pin, {mode: Gpio.INPUT, pullUpDown: Gpio.PUD_DOWN, edge: Gpio.EITHER_EDGE});
    var readInterval = null;


    function readFloat() { //function to start reading
        var callback = conf.floatRead || $.noop;
        callback(floatSensor.digitalRead());
    }

    this.start = function () {
        readInterval = setInterval(readFloat, conf.readInterval);
    };


    this.stop = function () {
        clearInterval(readInterval); // Clear read interval
    };
};

module.exports = FloatSensor;

