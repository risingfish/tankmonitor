var fs = require('fs');

var LogToFile = function (config) {
    var conf = config;

    this.write = function (data) {
        fs.writeFile(conf.file, JSON.stringify(data), function (err) {
            if (err) {
                throw err;
            }
            console.log('The file has been saved!');
        });
    };

};

module.exports = LogToFile;
