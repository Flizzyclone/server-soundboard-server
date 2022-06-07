const { Sequelize } = require('sequelize');
const fs = require('fs');

const historicaldata = new Sequelize('server', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: './data/DBs/soundDB.sqlite',
})

const soundDB = historicaldata.define('sounds', {
    user: {
      type: Sequelize.STRING,
      unique: false,
      primaryKey: false,
      allowNull: false
    },
    id: {
      type: Sequelize.STRING,
      unique: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      unique: false,
      primaryKey: false,
      allowNull: false
    },
    color: {
      type: Sequelize.STRING,
      unique: false,
      primaryKey: false,
      allowNull: false,
      defaultValue:"#121212"
    },
    imagePath: {
      type: Sequelize.STRING,
      unique: false,
      primaryKey: false,
      allowNull: false,
      defaultValue:"data\\images\\default.png"
    },
    audioPath: {
      type: Sequelize.STRING,
      unique: false,
      primaryKey: false,
      allowNull: false
    },
  },{
    freezeTableName: true
  });

soundDB.sync();

async function newSound(path, user, name) {
  let id = path.replace('data\\sounds\\','');
  try {
    await soundDB.create({
      audioPath: path,
      id:id,
      user:user,
      name:name
    })
    return true;
  } catch(e) {
    return false;
  }
}

async function deleteSound(id) {
  let soundEntry = await soundDB.findByPk(id);
  if (soundEntry == null) {
    return false;
  } else {
    soundDB.destroy({
      where: {id: id}
    });
    fs.unlinkSync(soundEntry.dataValues.audioPath);
    if(soundEntry.dataValues.imagePath != "data\\images\\default.png") {
      fs.unlinkSync(soundEntry.dataValues.imagePath);
    }
    return true;
  }
}

async function getSounds(user) {
  try {
    let sounds = await soundDB.findAll({
      where: {
        user:user
      }
    })
    return sounds;
  } catch(e) {
    return false;
  }
}

async function getSoundImage(id) {
  let soundEntry = await soundDB.findByPk(id);
  if (soundEntry == null) {
    return false;
  } else {
    let buffer = fs.readFileSync(soundEntry.dataValues.imagePath);
    return buffer;
  }
}

async function getSoundAudio(id) {
  let soundEntry = await soundDB.findByPk(id);
  if (soundEntry == null) {
    return false;
  } else {
    let buffer = fs.readFileSync(soundEntry.dataValues.audioPath);
    return buffer;
  }
}

async function setProp(id, prop, val) {
  let entry = await soundDB.findByPk(id);
  if (entry == null) {
    return false;
  }
  try {
    soundDB.update(
      {[prop]: val},
      {where: {id: id}}
    )
    return true;
  } catch(e) {
    return false;
  }
}

async function setSoundImage(id, val) {
  let entry = await soundDB.findByPk(id);
  if (entry == null) {
    return false;
  }
  try {
    soundDB.update(
      {imagePath: val},
      {where: {id: id}}
    )
    if(entry.dataValues.imagePath != "data\\images\\default.png") {
      fs.unlinkSync(entry.dataValues.imagePath);
    }
    return true;
  } catch(e) {
    return false;
  }
}

module.exports = { newSound, deleteSound, getSounds, getSoundImage, getSoundAudio, setProp, setSoundImage };