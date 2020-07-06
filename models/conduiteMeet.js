const mongoose = require("mongoose");

const  ConduiteMeetSchema = new mongoose.Schema({

    date : {
        type: String,
        required : true,
    },

    time : {
        type: String,
        required : true,
    },

    user_id : {
        type: String,
        required : true,
    },
    monitor_id : {
        type: String,
        required : true,
    },
    car_id : {
        type: String,
        required : true,
    },

})


const ConduiteMeet = mongoose.model("conduiteMeet", ConduiteMeetSchema);

module.exports = ConduiteMeet;