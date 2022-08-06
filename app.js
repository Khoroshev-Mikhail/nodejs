const express = require("express");
const fs = require("fs");
const jsonParser = express.json()
const app = express()

const VOCABULARY = 'vocabulary'
const GROUPS = 'groups'
const DICTIONARY = 'dictionary'

//перед выгрузкой удалить!!! для устранения ошибки на локальном сервере
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res) => {
    res.send(`<h1>API is working</h1>`)
})

function getJSONFiles(path){
    app.get('/' + path, (req, res) => {
        const data = fs.readFileSync(__dirname + '/baseData/' + path + '.json', 'utf-8')
        res.send(JSON.parse(data))
    })
}
getJSONFiles(VOCABULARY)
getJSONFiles(GROUPS)
getJSONFiles(DICTIONARY)

app.post('/setVocabulary', jsonParser, (req, res) => {
    if(!req.body){
        return res.sendStatus(400)
    }
    const filePath = __dirname + '/baseData/vocabulary.json'
    const method = req.body.method
    const idWord = req.body.idWord
    const data = fs.readFileSync(filePath, 'utf-8')
    let vocabulary = JSON.parse(data)
    vocabulary = {...vocabulary, [method] : [...vocabulary[method], idWord]}
    fs.writeFileSync(filePath, JSON.stringify(vocabulary))
    res.sendStatus(200)
})


app.listen(3001, ()=>{
    console.log('Сервер ожидает запросов...')
})