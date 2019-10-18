
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');

require('./models/UrlShorten');
const route = require('./routes/urlshorten');

const mongoUri = 'mongodb://localhost/url-shortener';
const PORT = 7677;

const app = express();
app.use(bodyParser.json());
app.use(morgan('dev'));
route(app);

const connectOptions = {
    keepAlive: true,
    reconnectTries: Number.MAX_VALUE,
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

mongoose.Promise = global.Promise;

mongoose.connect(mongoUri, connectOptions, (err, db) => {
    if (err) console.log(`${err}`);
    console.log('Connected to db');
});


app.listen(PORT, () => console.log(`app listening on port ${PORT}`));
