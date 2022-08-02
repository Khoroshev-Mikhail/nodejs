const http = require('http')
const fs = require('fs')
http.createServer(async(request, response) => {
   fs.readFile('index.html', 'utf-8', (error, data) => {
    response.end(data.replace('{title}', 'ZAGOLOVOK'))
   })
}).listen(3000);