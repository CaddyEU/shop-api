require("dotenv").config()

const Sequelize = require("sequelize")
const sequelize = new Sequelize(
  process.env.DB_BASE,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mariadb",
    define: {
      timestamps: false,
    },
    logging: false
  }
)

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.items = require("./models/Item")(sequelize, Sequelize)
db.users = require("./models/User")(sequelize, Sequelize)
db.reviews = require("./models/Review")(sequelize, Sequelize, db.items,db.users)

async function Sync() {
  console.log("Begin sync");
  //await sequelize.sync({force:true}) // Erase all and recreate
  await sequelize.sync({ alter: true }) // Alter existing tables to match the model
  console.log("Sync Done")
}

module.exports = { db, Sync }