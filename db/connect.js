const mongoose = require("mongoose");


const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/AutoEcole'
mongoose.connect(MONGODB_URI);

module.exports = mongoose;