console.log('greeting noduel')
let currentTime = new Date()
module.exports.date = currentTime;
module.exports.getMessage = function(){
    let hour = currentTime.getHours()
    return hour > 16 ? 'Good evening' : 'Good moorning'
}