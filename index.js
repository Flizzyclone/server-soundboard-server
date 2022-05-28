const express = require('express');
const fs = require('fs');
const multer = require('multer')
const upload = multer();

const http = require('http');

const app = express();

const cors = require('cors');
app.use(cors());

// Routes
app.use('/auth', require('./auth'));
app.use('/sound', require('./sound'));

// Listen both http & https ports
const httpsServer = http.createServer(app);

httpsServer.listen(4001, () => {
    console.log('Running on port 4001');
});