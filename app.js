const express = require("express");
const fs = require("fs");
const { send } = require("process");
const jsonParser = express.json()
const app = express()

app.use(express.static(__dirname + '/public'))
const filePath = 'users.json'
app.get('/api/users', (req, res) => {
    const content = fs.readFileSync(filePath, 'utf-8')
    const users = JSON.parse(content)
    res.send(users)
})
app.get('/api/users/:id', (req, res) => {
    const id = req.params.id
    const content = fs.readFileSync(filePath, 'utf-8')
    const users = JSON.parse(content)
    const user = [...users.filter(el => el.id == id)]
    if(user !== undefined){
        res.status(404).send()
    } else{
        res.send(user)
    }
})
app.post('/api/users', jsonParser, (req, res) => {
    if(! req.body){
        return res.sendStatus(400)
    }
    let data = fs.readFileSync(filePath, 'utf-8')
    let users = JSON.parse(data)
    const userId = Math.max([...users.map(el => Number(el.id))])
    const userName = req.body.userName
    const userAge = req.body.userAge
    const user = {id: userId, name: userName, age: userAge}
    users.push(user)
    data = JSON.stringify(users)
    fs.writeFileSync('users.json', data)
    res.send(user)
})
app.delete('/api/users/:id', (req, res) => {
    const id = req.params.id
    let data = fs.readFileSync(filePath, 'utf-8')
    let users = JSON.parse(data)
    const index = users.findIndex(el => el.id === id)
    if(index > -1){
        const user = [...users.splice(index, 1)]
        data = JSON.stringify(users)
        fs.writeFileSync('users.json', data)
        res.send(user)
    } else{
        res.status(404).send()
    }
})
app.put('/api/users', jsonParser, (req, res) => {
    if(!req.body) return res.sendStatus(400);
      
    const userId = req.body.id;
    const userName = req.body.name;
    const userAge = req.body.age;
      
    let data = fs.readFileSync(filePath, "utf8");
    const users = JSON.parse(data);
    let user = false;
    for(var i=0; i<users.length; i++){
        if(users[i].id==userId){
            user = users[i];
            break;
        }
    }
    
    if(user){
        user.age = userAge;
        user.name = userName;
        data = JSON.stringify(users);
        fs.writeFileSync("users.json", data);
        res.send(user);
    }
    else{
        res.status(404).send(user);
    }
})

app.listen(3000, ()=>{
    console.log('Сервер ожидает запросов...')
})