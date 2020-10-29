const azureService = require("./AzureService")

class VMService {

    async getVirtualMachines(subscriptionId, runningOnly, authToken) {
        let azVms = await azureService.listVMs(subscriptionId, authToken);
        if (runningOnly) {
            let azVmsStatus = await azureService.listVMStatus(subscriptionId, authToken);
            azVms = this.filterRunningVMs(azVms, azVmsStatus);
        }
        return azVms;
    }

    filterRunningVMs(vmList, vmStatusList) {
        let runningVmIds = vmStatusList
            .filter(vm => vm.properties.instanceView.statuses.find(status => status.code.includes("PowerState")).code == "PowerState/running")
            .map(vm => vm.id);
        return vmList.filter(vm => runningVmIds.includes(vm.id));
    }
}

module.exports = new VMService();