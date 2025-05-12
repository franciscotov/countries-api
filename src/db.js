require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const {
  DB_USER, DB_PASSWORD, DB_HOST,
} = process.env;
let sequelize = null;
// postgres://mceijriqoeodsx:f98c2aa2ea906b7925c3c4ff8aaa0224b1fd8dda00417603b6656cbdb95f0734@ec2-54-225-190-241.compute-1.amazonaws.com:5432/dbro7em9rn0kne
if(process.env.DATABASE_URL){
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    logging: false, // set to console.log to see the raw SQL queries
    native: false, // lets Sequelize know we can use pg-native for ~30% more speed
    dialect: "postgres",
    protocol: "postgres",
      dialectOptions: {
       native: true,
       ssl: process.env.DATABASE_URL? {
      require: true,
      rejectUnauthorized: false
       }:"",
       }
});
}
else{
  sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/countries`, {
  logging: false, // set to console.log to see the raw SQL queries
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
});
}

const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades 
// Para relacionarlos hacemos un destructuring
const { Country, Activity } = sequelize.models;

// Aca vendrian las relaciones
// Product.hasMany(Reviews);
Country.belongsToMany(Activity, {through: 'Country_Activity'});
Activity.belongsToMany(Country, {through: 'Country_Activity'});

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize,     // para importart la conexión { conn } = require('./db.js');
};
