const {Observable, Subject} = require("rxjs");
const axios = require("axios");

module.exports = function ({zwiftID, pullingInterval}) {

    const subject= new Subject();


    const power$ = new Observable(observer => {
        subject.subscribe(({power}) => observer.next(power))
    });
    const speed$ = new Observable(observer => {
        subject.subscribe(({speed}) => observer.next(speed))
    });
    const hr$ = new Observable(observer => {
        subject.subscribe(({hr}) => observer.next(hr))
    });


    setInterval(async () => {
        try {

            const response = await axios.get('https://www.zwiftgps.com/world/', {
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Cookie': 'zssToken=rider-'+zwiftID,
                }
            });
            const data = response.data.positions[0] || {};
            subject.next({
                power: data.powerOutput,
                speed: data.speedInMillimetersPerHour / (1000 * 1000), // to kmh
                hr: data.heartRateInBpm,
            })
        } catch (e) {
            console.error(e)
        }
    }, pullingInterval)

    return {
        power$,
        speed$,
        hr$,
    }
}
