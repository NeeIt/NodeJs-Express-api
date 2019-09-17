const express = require('express');
const parser = require('body-parser');
const fs = require('fs');

const jsonParser = parser.json();
const app = express();

app.use(express.static(__dirname + "/public"));

app.use((req,res,next)=>{

    next();
    });

app.get('/api/users', (req, res) => {

    let jsonContent = readUsers();
    let content = JSON.parse(jsonContent);
    res.send(content);
})

app.get('/api/user/:id', (req, res) => {

    let id = req.params.id;
    let jsonContent = readUsers();
    let content = JSON.parse(jsonContent);
    let user = content.find(user => user.id == id);
    
    if (user) res.send(user);
    else res.sendStatus(404);

})

app.post('/api/users', jsonParser, (req, res) => {

    if (!req.body) return res.sendStatus(400);
    let jsonContent = readUsers();
    let content = JSON.parse(jsonContent);
    let lastId = Math.max.apply(Math, content.map(user => user.id));
    let id = lastId + 1 || 0;
    let user = {
        name: req.body.name,
        age: req.body.age,
        id
    }
    content.push(user);
    writeUsers(content);
    res.send(user);

})

app.put('/api/user/:id', jsonParser, (req, res) => {
    console.log(1);
    if (!req.body) return res.sendStatus(400);
    let id = req.params.id;
    let jsonContent = readUsers();
    let content = JSON.parse(jsonContent);
    let user = content.find(user => user.id == id);
    if (user) {
        user.name = req.body.name;
        user.age = req.body.age;
        writeUsers(content);
        res.send(user);
    }
    else {
        res.sendStatus(404);
    }


})

app.delete('/api/user/:id', (req, res) => {

    let id = req.params.id;
    let jsonContent = readUsers();
    let content = JSON.parse(jsonContent);
    let index = -1;
    for (let ind = 0; ind < content.length; ind++) {
        if (content[ind]['id'] == id) index = ind;
    }
    if (index > -1 || index==0) {
        let user = content.splice(index, 1)[0];
        writeUsers(content);
        res.send(user);
    }
    else {
        res.sendStatus(404);
    }

})

function readUsers() {
    return fs.readFileSync("users.json", "utf8");
}
function writeUsers(data) {
    data = JSON.stringify(data);
    return fs.writeFileSync("users.json", data);
}




app.listen(3000);