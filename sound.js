const fs = require('fs');
const express = require('express');
const router = express.Router();
const DBFunctions = require('./soundDB');
const authDBFunctions = require('./authDB');

const multer  = require('multer');
const soundUpload = multer({ dest: './data/sounds/' });
const imageUpload = multer({ dest: './data/images'});

router.get('/', async (req, res) => {
    let token = req.headers.authorization.replace('Bearer ', '');
    if (await authDBFunctions.checkBearer(token)) {
        let userSounds = await DBFunctions.getSounds(req.headers.username);
        if(userSounds) {
            res.status = 200;
            res.send({sounds: {userSounds}})
        } else {
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(401);
    }
});

router.get('/image', async (req, res) => {
    let token = req.headers.authorization.replace('Bearer ', '');
    if (await authDBFunctions.checkBearer(token)) {
        let soundImage = await DBFunctions.getSoundImage(req.headers.id);
        if(soundImage) {
            res.status = 200;
            res.send(soundImage);
        } else {
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(401);
    }
});

router.get('/audio', async (req, res) => {
    let token = req.headers.authorization.replace('Bearer ', '');
    if (await authDBFunctions.checkBearer(token)) {
        let soundAudio = await DBFunctions.getSoundAudio(req.headers.id);
        if(soundAudio) {
            res.status = 200;
            res.send(soundAudio);
        } else {
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(401);
    }
})

router.post('/new', soundUpload.single('file'), async (req, res) => {
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

router.post('/delete', async (req, res) => {
    let token = req.headers.authorization.replace('Bearer ', '');
    if (await authDBFunctions.checkBearer(token)) {
        if(await DBFunctions.deleteSound(req.headers.id)) {
            res.sendStatus(200);
        } else {
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(401);
    }
});

router.post('/name', async(req, res) => {
    let token = req.headers.authorization.replace('Bearer ', '');
    if (await authDBFunctions.checkBearer(token)) {
        if(await DBFunctions.setProp(req.headers.id, 'name', req.headers.name)) {
            res.sendStatus(200);
        } else {
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(401);
    }
});

router.post('/color', async(req, res) => {
    let token = req.headers.authorization.replace('Bearer ', '');
    if (await authDBFunctions.checkBearer(token)) {
        if(await DBFunctions.setProp(req.headers.id, 'color', req.headers.color)) {
            res.sendStatus(200);
        } else {
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(401);
    }
});

router.post('/image', imageUpload.single('file'), async (req, res) => {
    let token = req.headers.authorization.replace('Bearer ', '');
    let newPath = 'data\\images\\' + req.headers.id + req.file.originalname;
    fs.renameSync(req.file.path, newPath);
    if (await authDBFunctions.checkBearer(token)) {
        if(await DBFunctions.setSoundImage(req.headers.id,newPath)) {
            res.sendStatus(200);
        } else {
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(401);
    }
});

module.exports = router;