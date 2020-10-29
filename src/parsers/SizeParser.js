class SizeParser {

    /*
        VM Size = Virtual Machine size as returned from the VM List API. Ex: Standard_Ds2_v2
        Meter VM Size = Virtual Machine size as returned from the Rates API. Ex: D2 v2/Ds2 v2
        Common VM Size = Virtual Machine size normalized to match between the APIs. Ex: Ds2 v2
    */

    /**
    * Parse Virtual machine size name to common vm size. Ex: Parse 'Standard_Ds2_v2' to 'Ds2 v2'.
    * @param {string}   size Virtual Machine Size from the VMs response (Ex: Standard_Ds2_v2).
    * @returns {string}  VM Size to match with Meter VM Size
    */
    parseVMName(size) {
        return size.replace("Standard_", "").replace("_", " ");
    }

    /**
    * Parse Meter size name to common vm size, returning an Array of values. Ex: Parse 'D2 v2/Ds2 v2' to ['D2 v2', 'Ds2 v2'].
    * @param {string}   meterSize Meter VM Size from the VMs response (Ex: Standard_Ds2_v2).
    * @returns {array}  Array of values of Meter VM Sizes to match with VM Size
    */
    parseMeterName(meterSize) {
        return meterSize.split("/");
    }

}

module.exports = new SizeParser();