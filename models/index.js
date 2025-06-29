const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const config = require("../config/config");
// eslint-disable-next-line no-undef
const basename = path.basename(__filename);

const db = {};
const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    port: config.development.port,
    dialect: config.development.dialect,
    logging: config.development.logging,
  }
);

// eslint-disable-next-line no-undef
fs.readdirSync(__dirname)
  .filter((file) => file !== basename && file.endsWith(".js"))
  .forEach((file) => {
    // eslint-disable-next-line no-undef
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) db[modelName].associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
