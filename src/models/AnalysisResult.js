const logger = require("../helpers/Logger");

class AnalysisResult {
    constructor(vm, meter, spotMeter) {
        this.name = vm.name;

        this.vmLocation = vm.location;
        this.meterLocation = meter.MeterRegion;
        this.spotLocation = spotMeter.armRegionName;

        this.vmSize = vm.properties.hardwareProfile.vmSize;
        this.meterSize = meter.MeterName;
        this.spotSize = spotMeter.meterName;

        this.meterRate = meter.MeterRates[0];
        this.spotRate = spotMeter.retailPrice;

        this.productionHours = 730;
        this.developerHours = 180;

    }

    getMeterForProductionHours() {
        return this.meterRate * this.productionHours;
    }

    getSpotMeterForProductionHours() {
        return this.spotRate * this.productionHours;
    }

    getMeterForDeveloperHours() {
        return this.meterRate * this.developerHours;
    }

    getSpotMeterForDeveloperHours() {
        return this.spotRate * this.developerHours;
    }

    getSavingsUsingSpot() {
        return this.getMeterForProductionHours() - this.getSpotMeterForProductionHours();
    }

    getSavingsUsingSpotAndDeveloperHours() {
        return this.getMeterForProductionHours() - this.getSpotMeterForDeveloperHours();
    }

    show() {
        const meterForProduction = this.getMeterForProductionHours();
        const meterForDeveloper = this.getMeterForDeveloperHours();
        const spotForProduction = this.getSpotMeterForProductionHours();
        const spotForDeveloper = this.getSpotMeterForDeveloperHours();
        const savingsForSpot = this.getSavingsUsingSpot();
        const savingsForSpotAndDeveloper = this.getSavingsUsingSpotAndDeveloperHours();

        logger.printInfo("=== Details ===");
        logger.print(`\n- Name: `);
        logger.printSuccess(this.name);
        logger.print(`\n- Region: `);
        logger.printSuccess(`${this.vmLocation}/${this.meterLocation}/${this.spotLocation}`);
        logger.print(`\n- Size: `);
        logger.printSuccess(`${this.vmSize}/${this.meterSize}/${this.spotSize}`);

        logger.printInfo("\n=== Price Rates ===");
        logger.print(`\n- Rate: `);
        logger.printSuccess(this.meterRate);
        logger.print(`\n- Spot Rate: `);
        logger.printSuccess(this.spotRate);

        logger.printInfo("\n=== Estimated Costs ===");
        logger.print(`\n- Estimated Cost for ${this.productionHours} Hours: `)
        logger.printSuccess(`$${meterForProduction}`);
        logger.print(`\n- Estimated Cost for ${this.developerHours} Hours: `)
        logger.printSuccess(`$${meterForDeveloper}`);
        logger.print(`\n- Spot Estimated Cost for ${this.productionHours} Hours: `)
        logger.printSuccess(`$${spotForProduction}`);
        logger.print(`\n- Spot Estimated Cost for ${this.developerHours} Hours: `)
        logger.printSuccess(`$${spotForDeveloper}`);

        logger.printInfo("\n=== Possible Savings ===");
        logger.print(`\n- Savings Using Spot Instances: `)
        logger.printSuccess(`-$${savingsForSpot.toFixed(2)}`);
        logger.print(`\n- Savings Using Spot Instances and Developer Hours: `)
        logger.printSuccess(`-$${savingsForSpotAndDeveloper.toFixed(2)}`);

    }

}

module.exports = AnalysisResult;