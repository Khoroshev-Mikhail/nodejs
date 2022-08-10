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
    const data = fs.readFileSync(filePath, 'utf-8')
    const method = req.body.method
    const idWord = req.body.idWord
    let vocabulary = JSON.parse(data)
    vocabulary = {...vocabulary, [method] : [...vocabulary[method], idWord]}
    fs.writeFileSync(filePath, JSON.stringify(vocabulary))
    res.sendStatus(200)
})

app.post('/setGroups', jsonParser, (req, res) => {
    if(!req.body){
        return res.sendStatus(400)
    }
    const filePath = __dirname + '/baseData/groups.json'
    const data = fs.readFileSync(filePath, 'utf-8')
    let groups = JSON.parse(data)
    const eng = req.body.eng
    const title = req.body.title
    const id = Math.max(...groups.map(el => el.id)) + 1
    const newGroup = {id, eng, title}
    groups = [...groups, newGroup]
    fs.writeFileSync(filePath, JSON.stringify(groups))
    res.sendStatus(200)
})

app.post('/updateGroups', jsonParser, (req, res) => {
    if(!req.body){
        return res.sendStatus(400)
    }
    const filePath = __dirname + '/baseData/groups.json'
    const data = fs.readFileSync(filePath, 'utf-8')
    let groups = JSON.parse(data)
    const id = req.body.id
    const eng = req.body.eng
    const title = req.body.title
    const updatingGroup = {id, eng, title}
    groups = ([...groups.filter(el => el.id !== id), updatingGroup]).sort((a, b) => a.eng.localeCompare(b.eng))
    fs.writeFileSync(filePath, JSON.stringify(groups))
    res.sendStatus(200)
})


app.post('/deleteGroups', jsonParser, (req, res) => {
    if(!req.body){
        return res.sendStatus(400)
    }
    const filePath = __dirname + '/baseData/groups.json'
    const data = fs.readFileSync(filePath, 'utf-8')
    const eng = req.body.eng
    let groups = JSON.parse(data)
    groups = groups.filter(el => el.eng !== eng)
    fs.writeFileSync(filePath, JSON.stringify(groups))
    res.sendStatus(200)
})

app.post('/setDictionary', jsonParser, (req, res) => {
    if(!req.body){
        return res.sendStatus(400)
    }
    const filePath = __dirname + '/baseData/dictionary.json'
    const data = fs.readFileSync(filePath, 'utf-8')
    let dictionary = JSON.parse(data)
    const eng = req.body.eng
    const rus = req.body.rus
    const groups = req.body.groups
    const id = Math.max(...dictionary.map(el => el.id)) + 1
    const newWord = {id, eng, rus, groups}
    dictionary = ([...dictionary, newWord]).sort((a, b) => a.eng.localeCompare(b.eng))
    fs.writeFileSync(filePath, JSON.stringify(dictionary))
    res.sendStatus(200)
})
app.post('/deleteDictionary', jsonParser, (req, res) => {
    if(!req.body){
        return res.sendStatus(400)
    }
    const filePath = __dirname + '/baseData/dictionary.json'
    const data = fs.readFileSync(filePath, 'utf-8')
    let dictionary = JSON.parse(data)
    const id = req.body.id
    dictionary = dictionary.filter(el => el.id !== id)
    fs.writeFileSync(filePath, JSON.stringify(dictionary))
    res.sendStatus(200)
})
app.post('/updateDictionary', jsonParser, (req, res) => {
    if(!req.body){
        return res.sendStatus(400)
    }
    const filePath = __dirname + '/baseData/dictionary.json'
    const data = fs.readFileSync(filePath, 'utf-8')
    let dictionary = JSON.parse(data)
    const eng = req.body.eng
    const rus = req.body.rus
    const groups = req.body.groups
    const id = req.body.id
    const newWord = {id, eng, rus, groups}
    dictionary = ([...dictionary.filter(el => el.id !== id), newWord]).sort((a, b) => a.eng.localeCompare(b.eng))
    fs.writeFileSync(filePath, JSON.stringify(dictionary))
    res.sendStatus(200)
})


app.listen(3001, ()=>{
    console.log('Сервер ожидает запросов...')
})