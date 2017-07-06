console.log('Executing npm start');

const Gpio = require('onoff').Gpio,
    pSensor = new Gpio(4, 'in'),
    pButton = new Gpio(17, 'in');

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
        if (options.cleanup) console.log('clean');
        if (err) console.log(err.stack);
        if (options.exit) process.exit();

        pSensor.unexport();
        pButton.unexport();
	clearInterval(iv);
    }

    setup() {
        //Settings to load before the loop execution
        iv = setInterval(self.loop, 100);
    }

    loop() {
        //Loop execution
        console.log('Sensor Value: '+pSensor.readSync());
        console.log('Button Value: '+pButton.readSync());
    }
}

let tbc = new TollBoothController();
