const colors = require('colors');


module.exports = {
    print: (message) => process.stdout.write(message),
    printSuccess: (message) => process.stdout.write(colors.green(message)),
    printInfo: (message) => process.stdout.write(colors.cyan(message)),
    printWarning: (message) => process.stdout.write(colors.yellow(message)),
    printError: (message) => process.stdout.write(colors.red(message)),
    log: (message) => console.log(message),
    logSuccess: (message) => console.log(colors.green(message)),
    logInfo: (message) => console.log(colors.cyan(message)),
    logWarning: (message) => console.log(colors.yellow(message)),
    logError: (message) => console.log(colors.red(message))
}