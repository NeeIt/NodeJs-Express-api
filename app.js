const mongoose = require('mongoose');
const express = require('express');
const app = express();
const jsonParser= express.json();
const hbs=require('hbs');
const expressHbs=require('express-handlebars');


app.engine('hbs',expressHbs({
    layoutsDir:'views/layouts',
    defaultLayout:'simple',
    extname:'hbs'
}));
app.set('view engine','hbs');
hbs.registerPartials(__dirname+'/views/partials')

app.use(express.static(__dirname+"/public"));
mongoose.connect("mongodb://localhost:27017/", { useNewUrlParser: false,useFindAndModify:false },function(err){
    if(err)return console.log('ERROR' + err);
    app.listen(3000);
});

const Schema = mongoose.Schema;
const userSchema = new Schema({
    name:{
        type:String,
        default:'noName',
    },
    age:{
        default:0,
        min:0,
        max:100,
        type:Number
    }
},{
    versionKey:false
})
const User = mongoose.model("User",userSchema)

const apiRoute=express.Router();

app.use('/api',apiRoute);

apiRoute.get("/users",(req,res)=>{
    
    User.find({},(err,users)=>{
        if(err)return console.log(err);
        res.send(users);
    })
});
apiRoute.get("/user/:id",(req,res)=>{
    let id = req.params['id'];
    User.findById(id,(err,user)=>{
        if(err)return console.log(err);
        res.send(user);
    })
});
apiRoute.post("/users",jsonParser,(req,res)=>{
    if(!req.body)return res.sendStatus(400);
    let name = req.body.name;
    let age = req.body.age;
   
    User.create({name,age},(err,user)=>{
        if(err)return console.log(err);
        res.send(user);
    })
});
apiRoute.put("/user/:id",jsonParser,(req,res)=>{
    let id = req.params['id'];
    let name = req.body.name;
    let age = req.body.age;

    User.findOneAndUpdate({_id: id},{name,age},{new:true},(err,user)=>{
        if(err)return console.log(err);
        console.log(user);
        res.send(user);
    })
});
apiRoute.delete("/user/:id",(req,res)=>{
    let id = req.params['id'];
    User.findByIdAndDelete(id,(err,user)=>{
        if(err)return console.log(err);
        res.send(user);
    })
});

app.get('/',jsonParser,(req,res)=>{

    res.render('home');
});
app.get('/list',jsonParser,(req,res)=>{

    res.render('list');
});
app.get('/minlist',jsonParser,(req,res)=>{

    res.render('minList');
});
app.get('/user/:id',jsonParser,(req,res)=>{
    let user=null;
    let id = req.params['id'];
    User.findById(id,(err,result)=>{
        if(err)user=null;
        user=result;
        if(user)res.render('user',{user:user});
        else res.redirect('/');
    })
  
    
});