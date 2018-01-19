var Rpio = require('rpio'); //include pigpio to interact with the GPIO

Rpio.init({mapping: 'gpio'});

var FloatSensor = function (config) {
    var conf = config;
    //var floatSensor = new Gpio(conf.pin, {mode: Gpio.INPUT, pullUpDown: Gpio.PUD_DOWN, edge: Gpio.EITHER_EDGE});
    Rpio.open(conf.pin, Rpio.INPUT, Rpio.PULL_DOWN);
    var readInterval = null;


    function readFloat() { //function to start reading
        var callback = conf.floatRead || $.noop;
        callback(Rpio.read(conf.pin));
    }

    this.start = function () {
        readInterval = setInterval(readFloat, conf.readInterval);
    };


    this.stop = function () {
        clearInterval(readInterval); // Clear read interval
    };
};

module.exports = FloatSensor;

