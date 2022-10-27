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
            console.log(`⚡️ Ant+ Power: ${data.Power}`);
            observer.next(data.Power)
        });
    });

    const speed$ = new Observable(observer => {
        speedSensor.setWheelCircumference(wheelCircumference || 2.120); //Wheel circumference in meters

        speedSensor.on('speedData', data => {
            console.log(`🏎️ Ant+ Speed: ${data.CalculatedSpeed}`);
            observer.next(data.CalculatedSpeed)
        });
    });

    const hr$ = new Observable(observer => {
        hrSensor.on('hbData', async function (data) {
            console.log(`🧡 Ant+ HR: ${data.ComputedHeartRate}`);
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
