const fs = require('fs');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const DBFunctions = require('./authDB');

router.get('/login', async (req, res) => {
    let username = req.headers.authorization.match(/[^:]*/)[0];
    username = username.replace("Basic ","").replace(" ", "");
    let pwd = req.headers.authorization.replace(/[^:]*/,"");
    pwd = pwd.replace(": ","");
    let userHash = await DBFunctions.getHash(username);
    if (userHash === false) {
        res.sendStatus(401);
    } else {
        let bearer = DBFunctions.newBearer();
        if(bcrypt.compareSync(pwd, userHash)) {
            res.status(200);
            res.send({ token: bearer })
        } else {
            res.sendStatus(401);
        }
    }
});

router.get('/check', async (req, res) => {
    let tok = req.headers.authorization.replace("Bearer ","");
    let valid = await DBFunctions.checkBearer(tok);
    if (valid) {
        res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }
});

module.exports = router;