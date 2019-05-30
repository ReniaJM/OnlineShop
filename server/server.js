const express = require('express');
const morgan = require('morgan');
// loguje requesty logger middleware
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const config = require('./config');

const app = express();

// łączenie sie z mongoose
mongoose.connect(config.database, {useNewUrlParser: true, useCreateIndex: true,
   }, err => {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to the database');
    }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// jest na false aby odczytywac tez image
app.use(morgan('dev'));
// loguje wszyste requesty w terminalu
app.use(cors());
//bezpieczne wykonywanie zapytań HTTP Cross-Origin od strony frontu

const userRoutes = require('./routes/account');
const mainRoutes = require('./routes/main');
const sellerRoutes = require('./routes/seller');

app.use('/api', mainRoutes);
app.use('/api/accounts', userRoutes);
app.use('/api/seller', sellerRoutes);


app.listen(config.port, err => {
    console.log('Magic happens on port ' + config.port);
});

