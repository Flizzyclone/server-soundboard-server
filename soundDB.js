const { Sequelize } = require('sequelize');
const crypto = require('crypto');

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
      defaultValue:"#FFFFFF"
    },
    imagePath: {
      type: Sequelize.STRING,
      unique: false,
      primaryKey: false,
      allowNull: false,
      defaultValue:"images\\default.svg"
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
  let id = path.replace('/data/sounds/');
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

async function getSounds(user) {
  try {
    let sounds = soundDB.findAll({
      where: {
        user:user
      }
    })
    return sounds;
  } catch(e) {
    return false;
  }
}

module.exports = { newSound, getSounds };