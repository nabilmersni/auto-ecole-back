const mongoose = require("mongoose");

const  CodeMeetSchema = new mongoose.Schema({

    date : {
        type: String,
        required : true,
        unique: true
    },

    time : {
        type: String,
        required : true,
    },

    user_id : {
        type: String,
        required : true,
    },

})


const CodeMeet = mongoose.model("codeMeet", CodeMeetSchema);

module.exports = CodeMeet;