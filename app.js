const express = require("express");
const fs = require("fs");
const jsonParser = express.json()
const app = express()

const VOCABULARY = 'vocabulary'
const GROUPS = 'groups'
const DICTIONARY = 'dictionary'

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
    const method = req.body.params.method
    const idWord = req.body.params.idWord
    const data = fs.readFileSync(filePath, 'utf-8')
    let vocabulary = JSON.parse(data)
    vocabulary = {...vocabulary, [method] : [...vocabulary[method], idWord]}
    fs.writeFileSync(filePath, JSON.stringify(vocabulary))
})
app.get('/setVocabulary', jsonParser, (req, res) => {
    res.send('tut')
    if(!req.body){
        return res.sendStatus(400)
    }
    const filePath = __dirname + '/baseData/vocabulary.json'
    const method = 'spell'
    const idWord = 999
    const data = fs.readFileSync(filePath, 'utf-8')
    let vocabulary = JSON.parse(data)
    vocabulary = {...vocabulary, [method] : [...vocabulary[method], idWord]}
    fs.writeFileSync(filePath, JSON.stringify(vocabulary))
})

app.listen(3001, ()=>{
    console.log('Сервер ожидает запросов...')
})