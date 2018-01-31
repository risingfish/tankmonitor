const Email = require('./src/Email.js');
const FloatSensor = require('./src/FloatSensor.js');
const TemperatureSensor = require('./src/TemperatureSensor.js');
const LogDataToFile = require('./src/LogDataToFile.js');

const TankMonitor = function (conf) {
    const config = conf;
    const email = new Email(config.mailRelay);
    const logOutput = new LogDataToFile(conf.dataHandling);
    let storedData = {};
    let waterLevel, tempSensor, runTimer;


    const handleReadOutput = (output) => {
        storedData[output.type] = output;
        logOutput.write(storedData);
    };

    /**
     * Configure the overall system stuff. Mainly just used to enable the SIGINT capturing for the time being.
     */
    const configSystem = () => {
        process.on('SIGINT', () => {
            console.log("\nCaught interrupt signal");
            this.stop();
            process.exit();
        });
    };

    /**
     * Configure the Float sensor. Reads from the stored configuration used to initialize this object.
     */
    const configWaterLevelSensor = () => {
        waterLevel = new FloatSensor({
            "pin": config.sensors.waterLevel.pin,
            "readInterval": config.sensors.waterLevel.readInterval,
            "emailProvider": email,
            "handleRead": handleReadOutput
        });
    };

    /**
     * Configure the Temperature sensor. Reads from the stored configuration used to initialize this object.
     */
    const configTempSensor = () => {
        tempSensor = new TemperatureSensor({
            "readInterval": config.sensors.waterLevel.readInterval,
            "handleRead": handleReadOutput
        });
    };


    /**
     * Initialization script that sets up the sensors this will read.
     */
    this.init = () => {
        configSystem();
        configWaterLevelSensor();
        configTempSensor();
    };


    this.start = () => {
        tempSensor.start();
        waterLevel.start();

        if (config.dev) {
            runTimer = setTimeout(() => {
                waterLevel.stop();
                tempSensor.stop();
                process.exit();
            }, 60000); //stop reading after 60 minutes
        }
    };

    this.stop = () => {
        tempSensor.stop();
        waterLevel.stop();
    };

};

// Load config data
var config = require('./config.json');

// Initialize the monitor and begin monitoring
var monitor = new TankMonitor(config);
monitor.init();
monitor.start();