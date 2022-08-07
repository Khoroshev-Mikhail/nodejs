const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/";
const express = require('express')
const objectId = require('mongodb').ObjectId
const app = express()
const jsonParser = express.json()
const mongoClient = new MongoClient('mongodb://localhost:27017/');
let dbClient;
//app.use(express.static(__dirname + '/public'))

mongoClient.connect((error, client) => {
    if(error) return console.log(error)
    dbClient = client;
    app.locals.collection = client.db('userdb').collection('users')
    app.listen(3000, ()=> console.log('Сервер ожидает подключений'))
}) 

app.get('/api/users', (req, res) => {
    const collection = req.app.locals.collection
    collection.find({}).toArray((err, users) => {
        if(err) return console.log(err)
        res.send(users)
    })
})

/*
const mongoClient = new MongoClient( url, { useUnifiedTopology: true});


async function run(){
    await mongoClient.connect()
    const db = mongoClient.db('userdb')
    const collection = db.collection('users')
    const result = await collection.find().toArray()
    console.log(result)
    await mongoClient.close()
}
run()
*/