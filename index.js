// EXPRESS
const express = require('express');
const app = express();
// MIDDLEWARE
const cors = require('cors');
const cookieParser = require('cookie-parser');
const router = require('./router/index.js');
const errorMiddleware = require('./middlewares/error-middleware');

// MONGO
const mongoose = require('mongoose');
require('dotenv').config();
// CONNECT MIDDLEWARE
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        credentials: true,
        origin: process.env.CLIENT_URL,
    })
);
app.use('/api/uploads', express.static('uploads'));
app.use('/api', router);
// RUN SERVER
(async () => {
    try {
        mongoose
            .connect(process.env.MONGO_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            .then((res) => {
                console.log('connected to db');
            })
            .catch((err) => console.log(err));

        app.listen(process.env.PORT, () =>
            console.log(`Run server on PORT:${process.env.PORT}`)
        );
    } catch (error) {
        console.log(error);
    }
})();
app.use(errorMiddleware);
