const morning = require('./morning')
const evening = require('./evening')

module.exports = {
    getMorningMessage: () => { console.log(morning)},
    getEveningMessage: () => { console.log(evening)}
}