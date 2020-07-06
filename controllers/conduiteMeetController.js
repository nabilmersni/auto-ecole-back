const express = require('express');

const mongoose = require('../db/connect');

const ConduiteMeet = require('../models/conduiteMeet');
const User = require('../models/user');
const Car = require('../models/car');


const isAdmin = require('../middleWares/middleWare');

const app = express();

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
    let conduiteMeet = new ConduiteMeet({
        date: data._date,
        time: data._time,
        user_id: data._user_id,
        monitor_id: data._monitor_id,
        car_id: data._car_id,
    });
    console.log(conduiteMeet);
    conduiteMeet.save()
        .then(() => {
            res.status(200).send({ message: "conduiteMeet added succefully !" });
        })
        .catch((e) => {
            res.status(400).send(e);
        });
});


//Get
app.get('/all',async (req,res) =>{

    try {
        newConduiteMeets = [];
        let conduiteMeets = await ConduiteMeet.find();

        for(var i =0; i<conduiteMeets.length; i++ ){
            let user = await User.findOne({_id: conduiteMeets[i].user_id});
            let monitor = await User.findOne({_id: conduiteMeets[i].monitor_id});
            let car = await Car.findOne({_id: conduiteMeets[i].car_id});

            
            newConduiteMeets.push({
                _id: conduiteMeets[i]._id,
                date: conduiteMeets[i].date,
                time: conduiteMeets[i].time,
                user_id: user.firstname +" "+user.lastname,
                monitor_id: monitor.firstname +" "+monitor.lastname,
                car_id : car.marque
            })

        }
        res.status(200).send(newConduiteMeets);

        
    } catch (error) {
        res.status(400).send({message: "error !"})
    }
})


app.get('/all/:userId',async (req,res) =>{

    try {
        let userId = req.params.userId;
        let upcomingconduiteMeet = await ConduiteMeet.find({user_id: userId,date :{$gte: today}})
        let passedconduiteMeet = await ConduiteMeet.find({user_id: userId,date :{$lt: today}})

        res.status(200).send({upcoming: upcomingconduiteMeet, passed : passedconduiteMeet})
        
    } catch (error) {
        res.status(400).send({message: "error !"})
    }

})


//----------------------------
app.get('/all/monitor/upcoming/:userId', (req,res) =>{
    let userId = req.params.userId;

    ConduiteMeet.find({monitor_id: userId,date :{$gte: today}})
    .then((CodeMeets) => {
        res.status(200).send(CodeMeets);
    })
    .catch(()=>{
        res.status(400).send({message: "error !"})
    })
})

app.get('/all/monitor/passed/:userId', (req,res) =>{
    let userId = req.params.userId;

    ConduiteMeet.find({monitor_id: userId,date :{$lt: today}})
    .then((CodeMeets) => {
        res.status(200).send(CodeMeets);
    })
    .catch(()=>{
        res.status(400).send({message: "error !"})
    })
})
//---------------------------


app.get('/one/:idConduiteMeet', (req,res) =>{

    let idConduiteMeet = req.params.idConduiteMeet;

    ConduiteMeet.findOne({_id : idConduiteMeet})
    .then((conduiteMeet) => {
        res.status(200).send(conduiteMeet);
    })
    .catch(()=>{
        res.status(400).send({message: "error !"})
    })
})

app.delete('/delete/:idConduiteMeet',isAdmin, (req,res) =>{

    let id = req.params.idConduiteMeet;

    ConduiteMeet.findOneAndRemove({_id:id})
    .then((conduiteMeet) => {
        if(!conduiteMeet){
            res.status(400).send({message: "conduiteMeet not found !"})
        }else{
            res.status(200).send(conduiteMeet);
        }
    })
    .catch(()=>{
        res.status(400).send({message: "error !"})
    })
})

app.patch('/update/:idConduiteMeet', (req, res) => {

    let id = req.params.idConduiteMeet;
    let data = req.body;

    //2 - creation d'un object <= data
    let conduiteMeetUpdated = new ConduiteMeet({
        date: data._date,
        time: data._time,
        user_id: data._user_id,
        monitor_id: data._monitor_id,
        car_id: data._car_id,
    });

    ConduiteMeet.findOne({_id:id})
    .then((conduiteMeet) => {
        if(!conduiteMeet){
            res.status(400).send({message: "conduiteMeet not found !"})
        }else{
            conduiteMeet.date = conduiteMeetUpdated.date;
            conduiteMeet.time = conduiteMeetUpdated.time;
            conduiteMeet.user_id = conduiteMeetUpdated.user_id;
            conduiteMeet.monitor_id = conduiteMeetUpdated.monitor_id;
            conduiteMeet.car_id = conduiteMeetUpdated.car_id;
            conduiteMeet.save();
            res.status(200).send({message: "conduiteMeet Info updated !"});
        }
    })
    .catch(()=>{
        res.status(400).send({message: "error !"})
    })
});

module.exports = app;