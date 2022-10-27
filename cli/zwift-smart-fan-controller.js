#!/usr/bin/env node

const fs = require('fs');
const Ant = require('../data-provider/ant-plus/ant-plus');
const Zwift = require('../data-provider/zwift/zwift');
const Mock = require('../data-provider/mock/mock');
const SmartFan = require('../device-controller/smart-fan/smart-fan');
const yargs = require("yargs");
const {hideBin} = require("yargs/helpers");

const options = yargs(hideBin(process.argv))
    .option('config', {
        type: 'string',
        description: 'path to JSON config file',
        default: '.',
    }).parseSync();


function getDataSource(config) {
    switch (config.dataProvider) {
        case "ant":
            return  new Ant({wheelCircumference: config.antConfig.wheelCircumference});
        case "zwift":
            return new Zwift({zwiftID: config.zwiftConfig.zwiftID, pullingInterval: config.zwiftConfig.pullingInterval})
        case "mock":
            return new Mock({pullingInterval: 5000})
        default:
            throw new Error('Unsupported data provider:  ' + config.dataProvider);
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
    const dataProvider = getDataSource(config);
    const smartFan = SmartFan({fanIP: config.fanIP});

    switch (config.observedData) {
        case "power":
            dataProvider.power$.subscribe(value => smartFan.fanLevel(getLevel(value, config.thresholds.power)))
            break;
        case "speed":
            dataProvider.speed$.subscribe(value => smartFan.fanLevel(getLevel(value, config.thresholds.speed)))
            break;
        case "hr":
            dataProvider.hr$.subscribe(value => smartFan.fanLevel(getLevel(value, config.thresholds.hr)))
            break;
    }
}
