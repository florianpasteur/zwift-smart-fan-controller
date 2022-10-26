const fs = require('fs');
const Ant = require('../ant-plus/ant-plus');
const Zwift = require('../zwift/zwift');
const SmartFan = require('../smart-fan/smart-fan');
const yargs = require("yargs");
const {hideBin} = require("yargs/helpers");

const options = yargs(hideBin(process.argv))
    .option('config', {
        type: 'string',
        description: 'path to JSON config file',
        default: '.',
    }).parseSync();


function getDataSource(config) {
    switch (config.dataSource) {
        case "ant":
            return  new Ant({wheelCircumference: config.antConfig.wheelCircumference});
        case "zwift":
            return new Zwift({zwiftID: config.zwiftConfig.zwiftID, pullingInterval: config.zwiftConfig.pullingInterval})
        default:
            throw new Error('Unsupported data source:  ' + config.dataSource);
    }
}

function getLevel(value, thresholds) {
    if (value >= thresholds.level3) {
        return 3
    }
    if (value >= thresholds.level2) {
        return 2
    }
    if (value >= thresholds.level1) {
        return 1
    }
    return 0;
}

if (fs.existsSync(options.config)) {
    const config = JSON.parse(fs.readFileSync(options.config).toString());
    const dataSource = getDataSource(config);
    const smartFan = SmartFan({fanIP: config.fanIP});

    switch (config.trigger) {
        case "power":
            dataSource.power$.subscribe(value => {
                console.log("Power", value);
                const thresholds = config.thresholds.power;
                const level = getLevel(value, thresholds);
                smartFan.fanLevel(level);
            })
            break;
        case "speed":
            dataSource.speed$.subscribe(value => {
                const thresholds = config.thresholds.speed;
                const level = getLevel(value, thresholds);
                smartFan.fanLevel(level);
            })
            break;
        case "hr":
            dataSource.hr$.subscribe(value => {
                const thresholds = config.thresholds.hr;
                const level = getLevel(value, thresholds);
                smartFan.fanLevel(level);
            })
            break;
    }
}
