const { Sequelize } = require('sequelize');
const crypto = require('crypto');

const historicaldata = new Sequelize('server', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: './data/DBs/authDB.sqlite',
})

const loginDB = historicaldata.define('creds', {
    username: {
      type: Sequelize.STRING,
      unique: true,
      primaryKey: true,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      unique: false,
      primaryKey: true,
      allowNull: false
    },
  },{
    freezeTableName: true
  });

loginDB.sync();

const bearerDB = historicaldata.define('bearers', {
  token: {
    type: Sequelize.STRING,
    unique: true,
    primaryKey: true,
    allowNull: false
  },
  expiration: {
    type: Sequelize.DATE,
    unique: false,
    primaryKey: false,
    allowNull: false
  },
},{
  freezeTableName: true
});

bearerDB.sync();

async function getHash(username) {
    let userEntry = await loginDB.findByPk(username);
    if (userEntry == null) {
        return false;
    } else {
        return userEntry.dataValues.password;
    }
}

function newBearer() {
  let bearer = crypto.randomBytes(32).toString('base64')
  let expDate = Date.now()
  expDate = new Date(expDate.valueOf() + 900000);
  bearerDB.create({
    token:bearer,
    expiration:expDate
  })
  return bearer;
}

async function checkBearer(token) {
  let entry = await bearerDB.findByPk(token);
  if (entry.dataValues.expiration.valueOf() > Date.now()) {
    updateBearer(token);
    return true;
  } else {
    return false;
  }
}

function updateBearer(token) {
  let expDate = Date.now()
  expDate = new Date(expDate.valueOf() + 900000);
  bearerDB.update(
    {expiration: expDate},
    {where: {token: token}}
  )
}

module.exports = {getHash, newBearer, checkBearer};