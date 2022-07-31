const http = require('http');
const greeting = require('./greeting')
const os = require('os')
const User = require('./user')
http.createServer(function(request, response){
    let ara = new User('ara', 32)
    ara.sayHi()
    response.end(ara.sayHi())
}).listen(3000, '127.0.0.1', function(){
    console.log('сервер начал прослушивание запросов на порту 3000')
})