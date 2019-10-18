
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');

require('./models/UrlShorten');
const route = require('./routes/urlshorten');

const mongoUri = `mongodb://${process.env.DB_SERVER}/url-shortener`;
const { PORT } = process.env;

const app = express();
app.use(bodyParser.json());
app.use(morgan(process.env.LOG_LEVEL));
route(app);

const connectOptions = {
    keepAlive: true,
    reconnectTries: Number.MAX_VALUE,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
};

mongoose.Promise = global.Promise;

mongoose.connect(mongoUri, connectOptions, (err, db) => {
    if (err) console.log(`${err}`);
    console.log('Connected to db');
});


app.listen(PORT, () => console.log(`app listening on port ${PORT}`));
