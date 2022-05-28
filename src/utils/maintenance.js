
let fs = require('fs');
config = {"settings":{"maintenance":true}}
fs.writeFile('/home/arnie/prod/coolkidbot/src/config.json', JSON.stringify(config), err => { })

