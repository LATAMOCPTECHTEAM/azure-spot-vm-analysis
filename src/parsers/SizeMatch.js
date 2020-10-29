const sizeParser = require("./SizeParser");

class SizeMatch {
    isMeterAndSpotMatch(meterSize, meterSubCategory, spotSize, spotProductName) {
        let isMeterWindows = meterSubCategory.includes("Windows");
        let isSpotWindows = spotProductName.includes("Windows");

        if (isMeterWindows != isSpotWindows) {
            return false;
        }

        return (meterSize + " Spot") == spotSize;
    }

    isVMandMeterMatch(vmSize, vmOSType, meterSize, meterSubCategory) {

        if (meterSize.includes("Expired") || meterSize.includes("Low Priority")) {
            return false;
        }

        let isVMWindows = vmOSType != "Linux";
        let isMeterWindows = meterSubCategory.includes("Windows");

        let commomVMSize = sizeParser.parseVMName(vmSize);
        let commonMeterSizes = sizeParser.parseMeterName(meterSize);

        if (isVMWindows != isMeterWindows) {
            return false;
        }

        return commonMeterSizes.includes(commomVMSize);
    }
}

module.exports = new SizeMatch();