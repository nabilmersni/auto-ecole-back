const express = require('express');

const mongoose = require('../db/connect');

const User = require('../models/user');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const app = express();

app.post('/register', (req, res) => {
    //1 - nekhou les données
    let data = req.body;

    let salt = bcrypt.genSaltSync(10);
    let hashedpassword = bcrypt.hashSync(data._password, salt);
    //2 - creation d'un object <= data
    let user = new User({
        firstname: data._firstname,
        lastname: data._lastname,
        email: data._email,
        phone: data._phone,
        password: hashedpassword,
        role: "admin",
        etat: true
    });
    user.save()
        .then(() => {
            res.status(200).send({ message: "admin registred succefully !" });
        })
        .catch((e) => {
            res.status(400).send(e);
        });
});



module.exports = app;