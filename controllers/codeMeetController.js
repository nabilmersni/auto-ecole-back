const express = require('express');

const mongoose = require('../db/connect');

const CodeMeet = require('../models/codeMeet');
const User = require('../models/user');

const isAdmin = require('../middleWares/middleWare');

const app = express();

const currentTime = new Date().toLocaleDateString();

//---------------------------------------------------------------

var today = new Date();
var dd = today.getDate();

var mm = today.getMonth()+1; 
var yyyy = today.getFullYear();
if(dd<10) 
{
    dd='0'+dd;
} 

if(mm<10) 
{
    mm='0'+mm;
} 
today = yyyy+'-'+mm+'-'+dd;
//----------------------------------------------------------------



app.post('/add', (req, res) => {
    //1 - nekhou les données
    let data = req.body;

    //2 - creation d'un object <= data
    let codeMeet = new CodeMeet({
        date: data._date,
        time: data._time,
        user_id: data._user_id,
    });
    console.log(codeMeet);
    codeMeet.save()
        .then(() => {
            res.status(200).send({ message: "CodeMeet added succefully !" });
        })
        .catch((e) => {
            res.status(400).send(e);
        });
});

//Get
app.get('/all',async (req,res) =>{

    try {
        newCodeMeets = [];
        let codeMeets = await CodeMeet.find();

        for(var i =0; i<codeMeets.length; i++ ){

            let user = await User.findOne({_id: codeMeets[i].user_id});
            
            newCodeMeets.push({
                _id: codeMeets[i]._id,
                date: codeMeets[i].date,
                time: codeMeets[i].time,
                user_id: user.firstname +" "+user.lastname
            })

        }
        res.status(200).send(newCodeMeets);

        
    } catch (error) {
        res.status(400).send({message: "error !"})
    }

})

app.get('/all/upcoming/:userId', (req,res) =>{
    let userId = req.params.userId;

    CodeMeet.find({user_id: userId,date :{$gte: today}})
    .then((CodeMeets) => {
        res.status(200).send(CodeMeets);
    })
    .catch(()=>{
        res.status(400).send({message: "error !"})
    })
})

app.get('/all/passed/:userId', (req,res) =>{
    let userId = req.params.userId;

    CodeMeet.find({user_id: userId,date :{$lt: today}})
    .then((CodeMeets) => {
        res.status(200).send(CodeMeets);
    })
    .catch(()=>{
        res.status(400).send({message: "error !"})
    })
})

app.get('/one/:idCodeMeet', (req,res) =>{

    let idCodeMeet = req.params.idCodeMeet;

    CodeMeet.findOne({_id : idCodeMeet})
    .then((CodeMeet) => {
        res.status(200).send(CodeMeet);
    })
    .catch(()=>{
        res.status(400).send({message: "error !"})
    })
})

app.delete('/delete/:idCodeMeet',isAdmin, (req,res) =>{

    let id = req.params.idCodeMeet;

    CodeMeet.findOneAndRemove({_id:id})
    .then((codeMeet) => {
        if(!codeMeet){
            res.status(400).send({message: "codeMeet not found !"})
        }else{
            res.status(200).send(codeMeet);
        }
    })
    .catch(()=>{
        res.status(400).send({message: "error !"})
    })
})

app.patch('/update/:idCodeMeet', (req, res) => {

    let id = req.params.idCodeMeet;
    let data = req.body;

    //2 - creation d'un object <= data
    let codeMeetUpdated = new CodeMeet({
        date: data._date,
        time: data._time,
        user_id: data._user_id,
    });

    CodeMeet.findOne({_id:id})
    .then((codeMeet) => {
        if(!codeMeet){
            res.status(400).send({message: "CodeMeet not found !"})
        }else{
            codeMeet.date = codeMeetUpdated.date;
            codeMeet.time = codeMeetUpdated.time;
            codeMeet.user_id = codeMeetUpdated.user_id;
            codeMeet.save();
            res.status(200).send({message: "CodeMeet Info updated !"});
        }
    })
    .catch(()=>{
        res.status(400).send({message: "error !"})
    })
});

module.exports = app;