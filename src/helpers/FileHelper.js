const fs = require("fs");
const path = require('path');

class FileHelper {

    getRates() {
        try {
            return require(path.dirname(require.main.filename) + '/rate-response.json')
        } catch (error) {
            return null;
        }
    }

    writeRates(rates) {
        fs.writeFileSync(path.dirname(require.main.filename) + '/rate-response.json', JSON.stringify(rates));
    }
}

module.exports = new FileHelper();