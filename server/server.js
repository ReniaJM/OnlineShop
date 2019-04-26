const express = require('express');
const morgan = require('morgan');
// HTTP request logger middleware for node.js
const bodyPartser = require('body-parser');
const mongoose =  require('mongoose');

const app = express();
app.use(bodyPartser.json());
app.use(bodyPartser.urlencoded({extended:false}));
// jest na false ab ograniczyc czytanie innych formatow tj img
app.use(morgan('dev'));
// loguje wszystkie zapytania na terminalu

