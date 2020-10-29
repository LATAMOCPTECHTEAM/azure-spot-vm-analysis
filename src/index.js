const azureService = require("./services/AzureService")
const retailRateService = require("./services/RetailRateService");
const AnalysisResult = require("./models/AnalysisResult");
const sizeMatch = require("./parsers/SizeMatch");
const regionMatch = require("./parsers/RegionMatch");
const vmMeterService = require("./services/VMMeterService");
const vmService = require("./services/VMService");
const logger = require("./helpers/Logger");
var options = require("./helpers/ArgumentParser");

const analysisResults = [];

async function main() {
    logger.printInfo(`\n- Getting Authentication Token: `);

    let authToken = await azureService.getToken(options.tenantId, options.clientId, options.clientSecret);

    logger.printSuccess(`Success`);

    logger.printInfo(`\n- Getting Virtual Machine Rate Meters: `);

    var vmMeters = await vmMeterService.getVirtualMachineMeters(options.subscription, options.offerId, options.location, authToken);

    logger.printSuccess(`Success. ${vmMeters.length} Meters Found`);

    logger.printInfo(`\n- Getting Azure Virtual Machine ${options.runningOnly ? "with Status = Running" : "with any status"}: `);

    var azVms = await vmService.getVirtualMachines(options.subscription, options.runningOnly, authToken);

    logger.printSuccess(`Success. ${azVms.length} VMs Found`);

    for (let vm of azVms) {
        logger.printInfo(`\n- Getting Results for Virtual Machine ${vm.name} (${vm.location}): `);

        var meter = vmMeters.find(getRateMatch(vm));

        if (!meter) {
            throw new Error("Meter not Found")
        } else {
            logger.printSuccess(`Rate Meter: Match.`);
        }

        let spotMeters = await retailRateService.getRetailRates(meter.MeterName, vm.location);
        var spotMeter = spotMeters.find(getSpotMeterMatch(meter));

        if (!spotMeter) {
            throw new Error("Spot Meter not Found")
        } else {
            logger.printSuccess(` Spot Rate Meter: Match`);
        }

        var analysisResult = new AnalysisResult(vm, meter, spotMeter);
        analysisResults.push(analysisResult);
    }
    logger.logSuccess(`\n\n========== Displaying Analysis Results ==========\n`);

    for (let analysisResult of analysisResults) {
        analysisResult.show();
        logger.printWarning(`\n${"=".repeat("50")}\n`);
    }
    let currentTotalCosts = analysisResults.reduce((value, result) => value + result.getMeterForProductionHours(), 0);
    let totalCostsWithDeveloperHours = analysisResults.reduce((value, result) => value + result.getMeterForDeveloperHours(), 0);
    let totalCostsWithSpot = analysisResults.reduce((value, result) => value + result.getSpotMeterForProductionHours(), 0);
    let totalCostsWithSpotSavings = currentTotalCosts - totalCostsWithSpot;
    let totalCostsWithSpotAndDeveloperHours = analysisResults.reduce((value, result) => value + result.getSpotMeterForDeveloperHours(), 0);
    let totalCostsWithSpotAndDeveloperHoursSavings = currentTotalCosts - totalCostsWithSpotAndDeveloperHours;

    console.log(`Current Total Costs: $${currentTotalCosts.toFixed(2)}`);
    console.log(`Possible Total Costs using Developer Hours: $${totalCostsWithDeveloperHours.toFixed(2)}`);
    console.log(`Possible Total Costs using Spot: $${totalCostsWithSpot} (Savings -$${totalCostsWithSpotSavings.toFixed(2)})`);
    console.log(`Possible Total Costs using Spot and Developer Hours: $${totalCostsWithSpotAndDeveloperHours.toFixed(2)} (Savings -$${totalCostsWithSpotAndDeveloperHoursSavings.toFixed(2)})`);
}

function getRateMatch(vm) {
    return x =>
        regionMatch.matchRegion(x.MeterRegion, vm.location)
        && sizeMatch.isVMandMeterMatch(vm.properties.hardwareProfile.vmSize, vm.properties.storageProfile.osDisk.osType, x.MeterName, x.MeterSubCategory)
}

function getSpotMeterMatch(meter) {
    return x => sizeMatch.isMeterAndSpotMatch(meter.MeterName, meter.MeterSubCategory, x.meterName, x.productName)
}

main()
    .catch(error => {
        if (error.request && error.request.path) {
            console.error(`${error.request.host} ${error.request.path}: ${error.message} `);
        } else {
            console.error(error.message);
        }
    });