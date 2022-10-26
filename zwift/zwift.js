const {Observable, Subject} = require("rxjs");
const axios = require("axios");

module.exports = function ({zwiftId, pullingInterval}) {

    const subject= new Subject();


    const power$ = new Observable(observer => {
        subject.subscribe(({watts}) => observer.next(watts))
    });
    const speed$ = new Observable(observer => {
        subject.subscribe(({speed}) => observer.next(speed))
    });
    const hr$ = new Observable(observer => {
        subject.subscribe(({hr}) => observer.next(hr))
    });


    setInterval(async () => {
        const response = await axios.get('https://www.zwiftgps.com/world/', {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Cookie': 'zssToken=rider-'+zwiftId,
            }
        });
        const data = response.data;
        subject.next({
            watts: data.powerOutput,
            speed: data.speedInMillimetersPerHour / (1000 * 1000), // to kmh
            hr: data.heartRateInBpm,
        })
    }, pullingInterval)

    return {
        hr$,
        speed$,
        power$
    }
}
