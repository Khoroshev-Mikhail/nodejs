const express = require('express')
const fs = require('fs')
const app = express()

const JSONparser = express.json()

app.get("/",function (request, response) {
    response.sendFile(__dirname + '/index.html')
});
app.post('/user', JSONparser, (request, response) => {
    if(!request.body) response.sendStatus(400)
    response.json(request.body)
})
app.listen(3000)