const express = require("express");
const fs = require("fs");
const jsonParser = express.json()
const app = express()

const GROUPS = 'groups'
const DICTIONARY = 'dictionary'

// https://expressjs.com/en/guide/using-middleware.html
// const router = express.Router()


//перед выгрузкой удалить!!! для устранения ошибки на локальном сервере
//CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); //указать конкретный домен
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res) => {
    res.send(`<h1>API is working</h1>`)
})

function getJSONFiles(path){
    app.post('/' + path, jsonParser, (req, res) => {
        const data = fs.readFileSync(__dirname + '/baseData/' + path + '.json', 'utf-8')
        res.send(JSON.parse(data))
    })
}
getJSONFiles(GROUPS)
getJSONFiles(DICTIONARY)

app.post('/vocabulary', jsonParser, (req, res) => {
    if(!req.body.id){
        return res.sendStatus(400)
    }
    const data = fs.readFileSync(__dirname + '/baseData/vocabulary.json', 'utf-8')
    const id = req.body.id
    const vocabulary = JSON.parse(data).find(el => el.userId == id)
    if(!vocabulary){
        return res.sendStatus(400)
    }
    res.send(vocabulary)
})

//Может быть добавить проверку на пароль?
app.post('/setVocabulary', jsonParser, (req, res) => {
    if(!req.body){
        return res.sendStatus(400)
    }
    //Добавить проверку на правильно метода
    //Сперва получить методы из массива и сравнить с входящим
    const filePath = __dirname + '/baseData/vocabulary.json'
    const data = fs.readFileSync(filePath, 'utf-8')
    const userId = req.body.userId
    const method = req.body.method
    const idWord = req.body.idWord
    let vocabulary = JSON.parse(data)
    let userVocabulary = vocabulary.find(el => el.userId == userId)
    if(!userVocabulary){
        res.sendStatus(400)
    }
    userVocabulary = {...userVocabulary, [method] : [...userVocabulary[method], idWord]}
    vocabulary = vocabulary.filter(el => el.userId !== userId)
    vocabulary.push(userVocabulary)
    fs.writeFileSync(filePath, JSON.stringify(vocabulary))
    res.sendStatus(200)
})

//Может быть добавить проверку на пароль?
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

//Может быть добавить проверку на пароль?
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
    groups = ([...groups.filter(el => el.id !== id), updatingGroup]).sort((a, b) => a.eng.localeCompare(b.eng)) //Сортировку по id?
    fs.writeFileSync(filePath, JSON.stringify(groups))
    res.sendStatus(200)
})


//Может быть добавить проверку на пароль?
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

//Может быть добавить проверку на пароль?
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
//Может быть добавить проверку на пароль?
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
//Может быть добавить проверку на пароль?
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

//Может быть добавить проверку на пароль?
app.post('/authorization', jsonParser, (req, res) => {
    if(!req.body){
        return res.sendStatus(400)
    }
    let authorization = false
    const filePath = __dirname + '/baseData/users.json'
    const data = fs.readFileSync(filePath, 'utf-8')
    const users = JSON.parse(data)
    const login = req.body.login
    const pwd = req.body.pwd
    const user = users.find(el => el.login === login && el.pwd === pwd)
    if(user){
        authorization = true
    }
    if(!authorization){
        return res.sendStatus(400)
    }
    //Правильно???
    res.send(user)
})
app.listen(3001, ()=>{
    console.log('Сервер ожидает запросов...')
})