const express = require('express');
const morgan = require('morgan');
// HTTP request logger middleware for node.js
const bodyPartser = require('body-parser');
const mongoose =  require('mongoose');
const cors = require('cors');

const app = express();
const config = require('./config');

mongoose.connect(config.database,{ useNewUrlParser: true } ,err => {
   if(err){
       console.log(err);
   }else{
        console.log('connected to database');
    }
});

app.use(bodyPartser.json());
app.use(bodyPartser.urlencoded({extended:true}));
// jest na false ab ograniczyc czytanie innych formatow tj img
app.use(morgan('dev'));
// loguje wszystkie zapytania na terminalu
app.use(cors());-

app.get('/', (req, res, next ) => {
    res.json({
        user:"jnfkjdfn"
    })
});

app.listen(config.port, err =>{
    console.log("serwer is working on port " + config.port)
});



