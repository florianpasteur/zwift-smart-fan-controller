const {interval, map} = require("rxjs");
const configExample = require("../../config-example.json");

function getThresholds(index, thresholds) {
    if (index % 3 === 0) {
        return thresholds.level3
    }
    if (index % 2 === 0) {
        return thresholds.level2
    }
    if (index % 1 === 0) {
        return thresholds.level1
    }
}
module.exports = function ({pollingInterval}) {
    const power$ = interval(pollingInterval).pipe(
        map(index => {
            const value = getThresholds(index, configExample.thresholds.power);
            console.log(`⚡️ Mock Power: ${value}`);
            return value;
        })
    )
    const speed$ = interval(pollingInterval).pipe(
        map(index => {
            const value = getThresholds(index, configExample.thresholds.speed);
            console.log(`🏎️ Mock Speed: ${value}`);
            return value;
        })
    )
    const hr$ = interval(pollingInterval).pipe(
        map(index => {
            const value = getThresholds(index, configExample.thresholds.hr);
            console.log(`🧡 Mock HR: ${value}`);
            return value;
        })
    )

    return {
        power$,
        speed$,
        hr$,
    }
}
