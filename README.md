# Zwift Smart Fan Controller

<!-- command-documentation -->
```
> zwift-smart-fan-controller --help

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
  --config   path to JSON config file                                   [string]
 
```
<!-- end-command-documentation -->

# Config

To configure command use a JSON config file.

```json
{
  "fanIP": "192.168.1.127",
  "dataProvider": "zwift",
  "observedData": "power",
  "antConfig": {
    "wheelCircumference": 2.120
  },
  "zwiftConfig": {
    "zwiftID": 1231421,
    "pollingInterval": 2500
  },
  "thresholds": {
    "power": {
      "level1": 0,
      "level2": 10,
      "level3": 20
    },
    "speed": {
      "level1": 0,
      "level2": 20,
      "level3": 30
    },
    "hr": {
      "level1": 70,
      "level2": 120,
      "level3": 150
    }
  }
}
```

- `fanIP`: IP or hostname of the fan
- `dataProvider`: `zwift`, `ant`, `mock` select data provider for the `observedData`
- `observedData`: `power`, `speed`, `hr` select data thresholds that trigger fan level change

- `antConfig`: Specific configuration for `ant` data provider
  - `wheelCircumference`: size of the wheel in meters - [Size chart](https://www.bikecalc.com/wheel_size_math#:~:text=Wheel%20diameter%20%3D%20(rim%20diameter),circumference%20%3D%20Wheel%20diameter%20*%20PI.)
- `zwiftConfig`: Specific configuration for `zwift` data provider
  - `zwiftID`: Your zwift ID, more detail in the [Get Zwift ID](#get-zwift-id) Section
  - `pollingInterval`: Pulling interval in milliseconds, (keep a value not too high)


# Installation

```bash
npm install -g git+ssh://git@github.com:florianpasteur/zwift-smart-fan-controller.git
```


<a name="get-zwift-id"></a>
# Get Zwift ID

