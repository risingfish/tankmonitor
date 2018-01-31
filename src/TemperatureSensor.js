const DS18B20 = require('ds18b20-raspi');
const moment = require('moment');

const TemperatureSensor = function (config) {
    const conf = config;
    let readInterval = null;

    /**
     * Wrapper method used to read data from the sensor and determine how to handle the resulting value.
     */
    const readFloat = () => {
        const output = DS18B20.readSimpleF();
        const json_output = {
            'type': 'temperature',
            'time': moment().format('YYYY/MM/DD hh:mm:ss a'),
            'unit': 'f',
            'data': output
        };
        const callback = conf.handleRead || function () {};
        callback(json_output);
    };

    /**
     * Method used to start reading from the temperature sensor
     */
    this.start = function () {
        readInterval = setInterval(readFloat, conf.readInterval);
    };

    /**
     * Method used ot stop reading from the temperature sensor
     */
    this.stop = function () {
        clearInterval(readInterval); // Clear read interval
    };
};

module.exports = TemperatureSensor;

