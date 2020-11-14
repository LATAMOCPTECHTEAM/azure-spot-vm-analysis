const azureService = require("./AzureService")

class VMService {

    async getVirtualMachines(subscriptionId, runningOnly, authToken) {
        let azVms = await azureService.listVMs(subscriptionId, authToken);
        azVms = azVms.filter(this.filterNonSpotVMs());
        if (runningOnly) {
            let azVmsStatus = await azureService.listVMStatus(subscriptionId, authToken);
            azVms = azVms.filter(filterRunningVMs(azVmsStatus));
        }
        return azVms;
    }

    filterRunningVMs(azVmsStatus) {
        let runningVmIds = azVmsStatus
            .filter(vm => vm.properties.instanceView.statuses.find(status => status.code.includes("PowerState")).code == "PowerState/running")
            .map(vm => vm.id);
        return (vm => runningVmIds.includes(vm.id));
    }

    filterNonSpotVMs() {
        return (x => x.properties.billingProfile == null);
    }
}

module.exports = new VMService();