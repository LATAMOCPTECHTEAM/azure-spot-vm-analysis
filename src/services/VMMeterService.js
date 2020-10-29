const azureService = require("./AzureService")
const fileHelper = require("../helpers/FileHelper");

class VMMeterService {

    async getVirtualMachineMeters(subscriptionId, offerId, location, authToken) {
        var rates = fileHelper.getRates()

        if (!rates) {
            rates = await azureService.getRates(subscriptionId, offerId, location, authToken);
            fileHelper.writeRates(rates);
        }

        return rates.Meters.filter(x => x.MeterCategory == "Virtual Machines");
    }
}

module.exports = new VMMeterService();