# Azure Spot VM Analysis

Tooling to analyze Azure Virtual Machines for possible savings using Spot Instances

## Disclaimers

- This tool is made by Cloud Solution Architects from Microsoft OCP LATAM Team to assess partner environments, this is not a Microsoft Official Tool.
- All the prices presented here, are the ones provided by Azure APIs. For the final price, please contact your Cloud Provider.
- Before using Azure Spot Instances, please be sure you understand how it works, and what means to get a machine evicted. [Azure Spot Instances Docs](https://azure.microsoft.com/en-us/pricing/spot/)


## Required Software

- [NodeJS](https://nodejs.org/en/)

## How to use it

### 1. Creating the Azure Credentials
You need to create the credentials so the project can list your virtual machines in Azure.

1. Create the Azure Service Principal and save the credentials to a json file.

    ```az ad sp create-for-rbac --name "analyze-spot-vm" --sdk-auth true > my_credentials.json```

0. Give the Service Principal the Reader role in your subscription.

    ```az role assignment create --role Reader --assignee <<SP_CLIENT_ID>> --scope /subscriptions/<<SUBSCRIPTION_ID>>```

### 2. Gather the data necessary for running the project

To run the project you need the following data:

1. SubscriptionId
2. TenantId
3. Client Id (from the service principal)
4. Client Secret (from the service principal)
5. Subscription Offer Id (you can find it in your subscription overview. Ex: MS-AZR-0015P)
6. Your subscription Region (Ex: US)

### 3. Preparing the project
1. Clone this repository in your machine
2. Enter the src folder. ```cd src```
3. Run npm install to install the project dependencies. ```npm install```

### 4. Running the project

To run the project in your terminal run the command
```
 node index.js analyze \\
        --tenantId <<TENANT_ID>> \\
        --subscription <<SUBSCRIPTION_ID>> \\
        --client_id <<CLIENT_ID> \\
        --client_secret <<CLIENT_SECRET> \\
        --offerId <<OFFER_ID>> \\
        --location <<SUBSCRIPTION_REGION> \\
        --runningOnly <<true if you only want the running VMs>>
```        

### 5. Checking the results

After running the script you will get the following results per VM and also consolidated.

* **Estimated Cost for 730 Hours:** The current cost you're paying having this VM online for a full month.
* **Estimated Cost for 180 Hours:** The estimated costs if you get this machine running only in work-time hours (9 hours a day)
* **Spot Estimated Cost for 730 Hours:** The estimated costs if you use Spot Instances for a full month.
* **Spot Estimated Cost for 180 Hours:** The estimated costs if you use Spot Instances and get this machine running only in work-time hours (9 hours a day)

![](./docs/assets/results.png)

### Notes:

* The first time you run can take some time, as the Retail Rates API returns a big json with all the price meters from Azure. Those information are than cached in a local json file, so the following executions will take significatly less time.