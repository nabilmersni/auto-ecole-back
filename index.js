const express = require('express');
//pour assurer que les données eli bch yjiw raw fi format mou3ayna
const bodyParser = require('body-parser');
//pour indiquer la base de donnée eli bch yekhdm aliha


const cors = require('cors');

const userController = require('./controllers/userController');
const adminController = require('./controllers/adminController');
const carController = require('./controllers/carController');
const monitorController = require('./controllers/monitorController');
const codeMeetController = require('./controllers/codeMeetController');
const conduiteMeetController = require('./controllers/conduiteMeetController');



const app = express();
//el format heya JSON
app.use(bodyParser.json());
app.use(cors());

app.use('/user', userController);
app.use('/admin', adminController);
app.use('/car', carController);
app.use('/monitor', monitorController);
app.use('/code_meet', codeMeetController);
app.use('/conduite_meet', conduiteMeetController);

app.get('/', (req, res) => {
    res.status(200).send({ message: "Welcome to the server !" });
});

let port = process.env.PORT || 3000

app.listen(port, () => console.log("server started"))