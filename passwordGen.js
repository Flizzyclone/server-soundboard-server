let pwdJson = require('./passwordGen.json');
let username = pwdJson.username;
let password = pwdJson.password;
let bcrypt = require('bcryptjs');

const { Sequelize } = require('sequelize');

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
    primaryKey: false,
    allowNull: false
  },
},{
  freezeTableName: true
});

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

function PwdGen() {
    let hash = bcrypt.hashSync(password, 10)
    loginDB.create({
      username: username,
      password: hash
    });
    console.log('Done!');
}

async function checkPwd() {
    let userEntry = await loginDB.findByPk(username);
    bcrypt.compare(password, userEntry.dataValues.password, function(err, res) {
      if (res) {
        console.log('True!')
      }
    })
}

loginDB.sync();

bearerDB.sync();

checkPwd();
