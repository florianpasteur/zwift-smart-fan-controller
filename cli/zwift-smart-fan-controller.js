const fs = require('fs');
const Ant = require('../ant-plus/ant-plus');
const Zwift = require('../zwift/zwift');
const SmartFan = require('../smart-fan/smart-fan');

const options = await yargs(hideBin(process.argv))
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
            return new Zwift()
        default:
            throw new Error('Unsupported data source:  ' + config.dataSource);
    }
}

function getLevel(value, thresholds) {
    if (thresholds.level3 >= value) {
        return 3
    }
    if (thresholds.level2 >= value) {
        return 2
    }
    if (thresholds.level1 >= value) {
        return 1
    }
    return 0;
}

if (fs.existsSync(options.config)) {
    const config = JSON.parse(fs.readFileSync(options.config).toString());
    const dataSource = getDataSource(config);
    const smartFan = SmartFan({fanIP: config.fanIP});

    switch (config.trigger) {
        case "watts":
            dataSource.watts$.subscribe(value => {
                const thresholds = config.thresholds.watts;
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
