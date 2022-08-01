let currentDate = new Date();
global.date = currentDate;
module.exports.name = "Alice";
module.exports.getMessage = function(name){
    let hour = currentDate.getHours();
        return "Hi " + global.name;
}