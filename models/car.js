const mongoose = require("mongoose");

const  CarSchema = new mongoose.Schema({

    matricule : {
        type: String,
        required : true,
        unique: true
    },

    marque : {
        type: String,
        required : true,
    },

    color : {
        type: String,
        required : true,
    },

})


const Car = mongoose.model("car", CarSchema);

module.exports = Car;