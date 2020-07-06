const express = require('express');

const mongoose = require('../db/connect');

const Car = require('../models/car');

const isAdmin = require('../middleWares/middleWare');

const app = express();

app.post('/add', (req, res) => {
    //1 - nekhou les données
    let data = req.body;

    //2 - creation d'un object <= data
    let car = new Car({
        matricule: data._matricule,
        marque: data._marque,
        color: data._color,
    });
    console.log(car);
    car.save()
        .then(() => {
            res.status(200).send({ message: "car added succefully !" });
        })
        .catch((e) => {
            res.status(400).send(e);
        });
});


//Get
app.get('/all', (req,res) =>{

    Car.find()
    .then((cars) => {
        res.status(200).send(cars);
    })
    .catch(()=>{
        res.status(400).send({message: "error !"})
    })
})

app.get('/one/:idCar', (req,res) =>{

    let idCar = req.params.idCar;

    Car.findOne({_id : idCar})
    .then((car) => {
        res.status(200).send(car);
    })
    .catch(()=>{
        res.status(400).send({message: "error !"})
    })
})

app.delete('/delete/:idCar',isAdmin, (req,res) =>{

    let id = req.params.idCar;

    Car.findOneAndRemove({_id:id})
    .then((car) => {
        if(!car){
            res.status(400).send({message: "car not found !"})
        }else{
            res.status(200).send(car);
        }
    })
    .catch(()=>{
        res.status(400).send({message: "error !"})
    })
})

app.patch('/update/:idCar', (req, res) => {

    let id = req.params.idCar;
    let data = req.body;

    //2 - creation d'un object <= data
    let carUpdated = new Car({
        matricule: data._matricule,
        marque: data._marque,
        color: data._color,

    });

    Car.findOne({_id:id})
    .then((car) => {
        if(!car){
            res.status(400).send({message: "car not found !"})
        }else{
            car.matricule = carUpdated.matricule;
            car.marque = carUpdated.marque;
            car.color = carUpdated.color;
            car.save();
            res.status(200).send({message: "car Info updated !"});
        }
    })
    .catch(()=>{
        res.status(400).send({message: "error !"})
    })
});





module.exports = app;