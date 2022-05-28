const fs = require('fs');
const express = require('express');
const router = express.Router();
const DBFunctions = require('./soundDB');
const authDBFunctions = require('./authDB');

const multer  = require('multer')
const upload = multer({ dest: './data/sounds/' })

router.post('/new', upload.single('file'), async (req, res) => {
    let token = req.headers.authorization.replace('Bearer ', '');
    if (await authDBFunctions.checkBearer(token)) {
        if(await DBFunctions.newSound(req.file.path,req.body.user,req.body.soundName)) {
            res.sendStatus(200);
        } else {
            res.sendStatus(500);
        }
    } else {
        fs.unlinkSync(req.file.path);
        res.sendStatus(401);
    }
});

module.exports = router;