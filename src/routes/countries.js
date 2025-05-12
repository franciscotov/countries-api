const routerCountry = require("express").Router();
const { Country, Activity } = require("../db.js");
let axios = require("axios");
const { Op } = require("sequelize");

routerCountry.get("/", async function (req, res, next) {
  // Modificar para renderizar todas las páginas creadas que se encuentren
  // dento de la base de datos (Debe traer también las categorías a las que pertenece cada página)
  // Tu código acá:
  let { name, offset } = req.query,
    countries;
  // evitamos tomar el string 'undefined'
  // console.log(name, offset)
  name = name === "undefined" ? undefined : name;
  offset = offset === "undefined" ? undefined : offset;
  // verificamos si tenemos la data en la base de datos
  try {
    countries = await Country.findAll();
  } catch (err) {
    console.log(err, "error1");
  }
  console.log(countries.length, "length");
  if (countries.length === 0) {
    // tenemos que llenar la base de datos con los paises, para ello tratemos los objetos objetinos por
    // la api axios, es decir, limpiar solo con las propiedades que necesitamos
    let dat = await axios.get(`https://restcountries.com/v3.1/all`);
    const newCountries = dat.data.map((p, i) => ({
      name: p.name?.common,
      id: p.cca3,
      continent: p.region,
      subRegion: p.subregion,
      capital: p.capital ? p.capital[0] : "",
      population: p.population,
      area: p.area,
      img: p.flags.png,
    }));
    try {
      Country.bulkCreate(newCountries);
    } catch (err) {
      console.log(err, "error33333333333333");
    }
  }
  if (!name && !offset) {
    countries = await Country.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      limit: 10,
      include: Activity,
    });
  } else if (!name || name === "") {
    countries = await Country.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      offset: offset,
      limit: 10,
      include: Activity,
    });
  } else if (name) {
    try {
      countries = await Country.findAll({
        where: { name: { [Op.iLike]: `%${name}%` } },
        offset,
        limit: 10,
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: Activity,
      });
    } catch (err) {
      console.log(err);
    }
  }
  return res.status(200).send(countries);
});

routerCountry.get("/all", async function (req, res, next) {
  try {
    countries = await Country.findAll({ attributes: ["id", "name"] });
  } catch (err) {
    console(err);
  }
  return res.status(200).json(countries);
});

routerCountry.get("/:idCountry", async function (req, res, next) {
  let { idCountry } = req.params,
    country;
  try {
    country = await Country.findByPk(idCountry, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: Activity,
    });
  } catch (err) {
    console(err);
  }
  return res.json(country);
});

module.exports = routerCountry;
