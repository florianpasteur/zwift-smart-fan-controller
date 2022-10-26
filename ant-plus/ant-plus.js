const Ant = require('ant-plus');
const {Observable} = require("rxjs");

module.exports = function ({wheelCircumference}) {
    const stick = new Ant.GarminStick3;

    const hrSensor = new Ant.HeartRateSensor(stick);
    const speedSensor = new Ant.SpeedCadenceSensor(stick);
    const powerSensor = new Ant.BicyclePowerSensor(stick);

    stick.on('startup', async function () {
        hrSensor.attach(0, 0);
        speedSensor.attach(0, 0);
        powerSensor.attach(0, 0);
    });

    const power$ = new Observable(observer => {
        powerSensor.on('powerData', data => {
            observer.next(data.Power)
            console.log(`id: ${data.DeviceID}, cadence: ${data.Cadence}, power: ${data.Power}`);
        });
    });

    const speed$ = new Observable(observer => {
        speedSensor.setWheelCircumference(wheelCircumference || 2.120); //Wheel circumference in meters

        speedSensor.on('speedData', data => {
            observer.next(data.CalculatedSpeed)
        });
        speedSensor.on('spe', async function (data) {
            observer.next(data.ComputedHeartRate)
        });
    });

    const hr$ = new Observable(observer => {
        hrSensor.on('hbData', async function (data) {
            observer.next(data.ComputedHeartRate)
        });
    });

    if (!stick.open()) {
        console.log('Stick not found!');
    }

    return {
        power$,
        speed$,
        hr$,
    }
}
