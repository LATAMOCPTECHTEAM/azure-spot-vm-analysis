const azureService = require("./AzureService")
const retailRates = {};

class RetailRateService {

    async getRetailRates(meterName, vmLocation) {
        let key = `${meterName}-${vmLocation}`;
        if (!retailRates[key]) {
            var retailRate = await azureService.getRetailRates(vmLocation, meterName);
            retailRates[key] = retailRate.Items;
        }
        return retailRates[key];
    }

}

module.exports = new RetailRateService();