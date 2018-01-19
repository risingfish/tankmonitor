var Rpio = require('rpio'); //include rpio library

Rpio.init({mapping: 'gpio'});

var FloatSensor = function (config) {
    var conf = config;
    //var floatSensor = new Gpio(conf.pin, {mode: Gpio.INPUT, pullUpDown: Gpio.PUD_DOWN, edge: Gpio.EITHER_EDGE});
    var readInterval = null;


    function readFloat() { //function to start reading
        var callback = conf.floatRead || $.noop;
        callback(Rpio.read(conf.pin));
    }

    this.start = function () {
        Rpio.open(conf.pin, Rpio.INPUT, Rpio.PULL_DOWN);
        readInterval = setInterval(readFloat, conf.readInterval);
    };


    this.stop = function () {
        clearInterval(readInterval); // Clear read interval
        Rpio.close(conf.pin);
    };
};

module.exports = FloatSensor;

