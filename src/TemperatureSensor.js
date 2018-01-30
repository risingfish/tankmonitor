var Rpio = require('rpio'); //include rpio library
var DS18B20 = require('ds18b20-raspi'); //include rpio library

var TemperatureSensor = function (config) {
    var conf = config;
    //var floatSensor = new Gpio(conf.pin, {mode: Gpio.INPUT, pullUpDown: Gpio.PUD_DOWN, edge: Gpio.EITHER_EDGE});
    var readInterval = null;

    function readFloat(readSensor) { //function to start reading
        var callback = conf.handleRead || function () {};
        callback(DS18B20.readSimpleF());
    }

    this.start = function () {
        readInterval = setInterval(readFloat, conf.readInterval);
    };


    this.stop = function () {
        clearInterval(readInterval); // Clear read interval
    };
};

module.exports = TemperatureSensor;

