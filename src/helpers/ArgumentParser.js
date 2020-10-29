const yargs = require('yargs');

const argv = yargs
    .command('analyze', `Analyze current VMs with Rate Card Price Rate and Spot VM Price Rate
    
    Example: 
        node index.js analyze \\
        --tenantId ffdcc66a-c651-4409-a1e9-22713f5a817d \\
        --subscription 3d38dcd5-ddb7-4001-93c9-8913ca1d90b2 \\
        --client_id bff9b3c4-472f-4c70-9ef6-e8fa59f853f5 \\
        --client_secret 95677cd4-0dab-4f51-9c8f-aa616cec9666 \\
        --offerId MS-AZR-0015p \\
        --location US \\
        --runningOnly true

    `
    )
    .option('tenantId', {
        alias: 't', description: 'Azure TenantId', type: 'string', demandOption: true
    })
    .option('subscription', {
        alias: 's', description: 'Azure SubscriptionId', type: 'string', demandOption: true
    })
    .option('client_id', {
        alias: 'cid', description: 'Service Principal Client Id', type: 'string', demandOption: true
    })
    .option('client_secret', {
        alias: 'cse', description: 'Service Principal Client Secret', type: 'string', demandOption: true
    })
    .option('offerId', {
        alias: 'o', description: 'The currency in which the resource rates need to be provided.', type: 'string', demandOption: true
    })
    .option('location', {
        alias: 'l', description: 'The 2 letter ISO code where the offer was purchased.', type: 'string', demandOption: true
    })
    .option('runningOnly', {
        alias: 'r', description: 'Get only running Virtual Machines', type: 'boolean'
    })
    .help()
    .alias('help', 'h')
    .argv;

module.exports = {
    clientId: argv.client_id,
    clientSecret: argv.client_secret,
    subscription: argv.subscription,
    tenantId: argv.tenantId,
    offerId: argv.offerId,
    location: argv.location,
    runningOnly: argv.runningOnly
}