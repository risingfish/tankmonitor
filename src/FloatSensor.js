const Rpio = require('rpio'); //include rpio library
const moment = require('moment');

Rpio.init({mapping: 'gpio'});

const FloatSensor = function (config) {
    const conf = config;
    let readInterval = null;
    let lastSMS = null;


    /**
     * Wrapper method used to read data from the sensor and determine how to handle the resulting value.
     */
    const readFloat = () => { //function to start reading
        const output = Rpio.read(conf.pin);
        const json_output = {
            'type': 'waterLevel',
            'time': moment().format('YYYY/MM/DD hh:mm:ss a'),
            'data': output
        };
        const callback = conf.handleRead || handleFloatRead;
        callback(json_output);
    };

    /**
     * Start reading from the float sensor using the given config settings.
     */
    this.start = () => {
        Rpio.open(conf.pin, Rpio.INPUT, Rpio.PULL_DOWN);
        readInterval = setInterval(readFloat, conf.readInterval);
    };

    /**
     * Stop reading from the float sensor.
     */
    this.stop = () => {
        clearInterval(readInterval); // Clear read interval
        Rpio.close(conf.pin);
    };

    /**
     * Built in read handler. By default this method will email supplied contact information.
     *
     * @param output
     */
    const handleFloatRead = (output) => {
        console.log(output);

        if (output > 0) {
            // Lets check to see if we sent an SMS in the last minute. If we have we should hold off for a while.
            if (lastSMS === null || lastSMS.isAfter(timestamp.add('1', 'm'))) {
                const email = config.emailProvider;

                // If we're running in dev mode, don't actually send the SMS
                if (config.dev) {
                    console.log('Would of sent email to' + config.notify.waterLevel.length + " contacts")
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
};

module.exports = FloatSensor;

