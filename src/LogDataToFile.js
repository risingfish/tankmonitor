const fs = require('fs');

const LogDataToFile = function (config) {
    const conf = config;
    let filePath = false;

    if (conf.dataFilePath) {
        if (!fs.existsSync(conf.dataFilePath)) {
            fs.mkdirSync(conf.dataFilePath, (err, folder) => {
                if (err && err.code !== 'EEXIST') {
                    throw Error(err);
                }
                filePath = conf.dataFilePath;
            });
        }

        filePath = conf.dataFilePath;
    } else {
        fs.mkdtempSync(path.join(os.tmpdir(), 'tankmonitor-'), (err, folder) => {
            if (err && err.code !== 'EEXIST') {
                throw Error(err);
            }
            filePath = folder;
        });
    }

    this.write = (data) => {
        const localFilePath = filePath + '/' + conf.dataFileName;
        if (conf.append) {
            fs.appendFile(localFilePath, JSON.stringify(data), (err) => {
                if (err) {
                    throw new Error(err);
                }
                console.log('The file has been saved!');
            });
        } else {
            fs.writeFile(localFilePath, JSON.stringify(data), (err) => {
                if (err) {
                    throw new Error(err);
                }
                console.log('The file has been saved!');
            });
        }
    };

};

module.exports = LogDataToFile;
