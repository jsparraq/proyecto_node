
require('./config/config');
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session')
const MemoryStore = require('memorystore')(session)

const directorioPublico = path.join(__dirname, '../public');

app.use(session({
    store: new MemoryStore({
        checkPeriod: 86400000
    }),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

app.use(express.static(directorioPublico));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, respuesta) => {
    if (err) {
        return console.log(err)
    }
    console.log('Conectado');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando en el puerto ' + process.env.PORT)
});

