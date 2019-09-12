import express from 'express';
import bodyParser from 'body-parser';

import RootRouter from './routers/RootRouter';

const app = express();

const PORT = process.env.PORT || 4000;

// Parse post requests to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    // Headers to fix CORS error when running API and App on same host with different ports
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

// Pass on requests to RootRouter
app.use('/', RootRouter);

app.listen(PORT, () => {
    console.log('API Server started on port 4000');
});