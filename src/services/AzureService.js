const axios = require('axios').default;
const qs = require('qs');

class AzureAPI {

    async getToken(tenantId, clientId, clientSecret) {
        let url = `https://login.microsoftonline.com/${tenantId}/oauth2/token`
        var data = qs.stringify({
            'grant_type': 'client_credentials',
            'resource': 'https://management.core.windows.net/',
            'client_id': clientId,
            'client_secret': clientSecret
        });

        var result = await axios({
            method: 'POST',
            contentType: 'application/x-www-form-urlencoded',
            url: url,
            data: data
        });

        return result.data.access_token;
    }

    async getRates(subscriptionId, offerId, regionInfo, token) {
        let url = `https://management.azure.com/subscriptions/${subscriptionId}/providers/Microsoft.Commerce/RateCard?api-version=2016-08-31-preview&$filter=OfferDurableId eq '${offerId}' and Currency eq 'USD' and Locale eq 'en-US' and RegionInfo eq '${regionInfo}'`

        var result = await axios({
            method: 'GET',
            url: url,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return result.data;
    }

    async getRetailRates(region, meterName) {
        var result = await axios({
            method: 'GET',
            url: `https://prices.azure.com/api/retail/prices?$filter=serviceName eq 'Virtual Machines' and armRegionName eq '${region}' and contains(meterName, '${meterName}')`
        });

        return result.data;
    }

    async listVMs(subscriptionId, token) {
        let url = `https://management.azure.com/subscriptions/${subscriptionId}/providers/Microsoft.Compute/virtualMachines?api-version=2020-06-01&statusOnly=false`

        var result = await axios({
            method: 'GET',
            url: url,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return result.data.value;
    }

    async listVMStatus(subscriptionId, token) {
        let url = `https://management.azure.com/subscriptions/${subscriptionId}/providers/Microsoft.Compute/virtualMachines?api-version=2020-06-01&statusOnly=true`

        var result = await axios({
            method: 'GET',
            url: url,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return result.data.value;
    }
}

module.exports = new AzureAPI();