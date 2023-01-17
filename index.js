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

const whitelist = [
    process.env.CLIENT_URL,
    process.env.GH_PAGE_URL,
    process.env.VERCEL_URL,
];
const corsOptions = {
    credentials: true,
    origin: 'http://localhost:3000',
    // origin: 'https://vitaliikutsenko.github.io',
};
app.use(cors(corsOptions));

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
