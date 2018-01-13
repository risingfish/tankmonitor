var Gpio = require('pigpio').Gpio; //include onoff to interact with the GPIO
var floatSensor = new Gpio(17, {mode: Gpio.INPUT, pullUpDown: Gpio.PUD_DOWN, edge: Gpio.EITHER_EDGE});

var readInterval = setInterval(readFloat, 1000);

function readFloat() { //function to start blinking
    console.log(floatSensor.digitalRead());
}

function endRead() { //function to stop blinking
    clearInterval(readInterval); // Stop blink intervals
    floatSensor.unexport(); // Unexport GPIO to free resources
}

setTimeout(endRead, 20000); //stop blinking after 5 seconds