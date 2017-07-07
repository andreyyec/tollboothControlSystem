console.log('Executing npm start');

const Gpio = require('onoff').Gpio,
    piGpio = require('pigpio').Gpio,
    sMotor = new piGpio(18, {mode: Gpio.OUTPUT}),
    pSensorIn = new Gpio(4, 'in'),
    pSensorOut = new Gpio (22, 'in'),
    pButton = new Gpio(17, 'in'),
    stopLed = new Gpio(20, 'out'),
    goLed = new Gpio(21, 'out')
    closeCoordenate = 650,
    openCoordenate = 1600,
    pSensorOutActivated = false,
    isOpen = false;


let iv, self;

class TollBoothController {

    constructor(height, width) {
        self = this;
        self.attachHandlers();
        self.setup();
    }

    attachHandlers() {
        //do something when app is closing
        process.on('exit', self.exitHandler.bind(null,{cleanup:true}));

        //catches ctrl+c event
        process.on('SIGINT', self.exitHandler.bind(null, {exit:true}));

        //catches uncaught exceptions
        process.on('uncaughtException', self.exitHandler.bind(null, {exit:true}));
    }

    exitHandler(options, err) {
        console.log('Raspi pins clean up');
        if (err) console.log(err.stack);
        if (options.exit) process.exit();

        pSensorIn.unexport();
        pSensorOut.unexport();
        pButton.unexport();
        stopLed.writeSync(0);
        goLed.writeSync(0);
        clearInterval(iv);
    }

    toggleIndicatorLeds() {
        if(isOpen) {
            goLed.writeSync(1);
            stopLed.writeSync(0);
        } else {
            goLed.writeSync(0);
            stopLed.writeSync(1);
        }
    }

    toggleServoPosition() {
        if(isOpen) {
            sMotor.servoWrite(openCoordenate);
        } else {
            sMotor.servoWrite(closeCoordenate);
        }
    }

    toggleGate(delay = false) {
        self.toggleIndicatorLeds();
        if (!delay) {
            self.toggleServoPosition();    
        } else{
            setTimeout(self.toggleServoPosition, 1000);
        }
    }

    isVehiclePresent(sensor) {
        return !sensor.readSync();
    }

    tollboothCheckup() {
        if(self.isVehiclePresent(pSensorIn) && !isOpen && pButton.readSync()) {
            isOpen = true;
            self.toggleGate();
        } else if(isOpen && self.isVehiclePresent(pSensorOut)) {
            pSensorOutActivated = true;
        } else if(isOpen && pSensorOutActivated === true && !self.isVehiclePresent(pSensorOut)) {
            isOpen = false;
            pSensorOutActivated = false;
            self.toggleGate(true);
        }
    }

    setup() {
        //Settings to load before the loop execution
        sMotor.servoWrite(closeCoordenate);
        stopLed.writeSync(1);
        iv = setInterval(self.loop, 100);
    }

    loop() {
        //Loop execution
        self.tollboothCheckup();
    }
}

let tbc = new TollBoothController();
