const routerCountry = require('express').Router();
const { Country, Activity } = require('../db.js');
// import axios from 'axios';
let axios = require('axios');
const { Op } = require('sequelize');
// console.log('tttttttttt')
routerCountry.get('/', async function(req, res, next){
    // Modificar para renderizar todas las páginas creadas que se encuentren
    // dento de la base de datos (Debe traer también las categorías a las que pertenece cada página)
    // Tu código acá:
    let {name, offset} = req.query, countries;
    // console.log('hola', name)
    // evitamos tomar el string 'undefined'
    // console.log(name, offset)
    name = name === 'undefined'? undefined: name;
    offset = offset === 'undefined'? undefined: offset;
    // console.log(name, 'tarsrarsras', offset)
    // verificamos si tenemos la data en la base de datos
    try{
      countries = await Country.findAll();
    }catch(err){
      console.log(err, 'error1')
    }
    if(countries.length === 0){
      // tenemos que llenar la base de datos con los paises, para ello tratemos los objetos objetinos por
      // la api axios, es decir, limpiar solo con las propiedades que necesitamos
      let dat = await axios.get(`https://restcountries.eu/rest/v2/all`);
      countries =  await dat.data.map( async (p, i) => {
        try{
          var newCountry = await Country.findOrCreate({where: {id: p.alpha3Code}, defaults: {
            name: p.name, 
            id: p.alpha3Code, 
            continent : p.region, 
            subRegion: p.subregion, 
            capital: p.capital,
            population : p.population,
            area : p.area,
            img : p.flag
          }});
          // if(i == dat.data.length -1 ) console.log(newCountry[0].dataValues)
          return newCountry[0].dataValues;
        }catch(err){
          res.status(400).send('Error');
          // if (i == dat.data.length -1) console.log(err)
          // console.log('error')
        }
      });
    }
    if(!name && !offset){
      // console.log('11111111111111111111')
      countries = await Country.findAll({attributes: {exclude: ['createdAt','updatedAt']}, limit: 10, include: Activity});
    }
    else if(!name || name === '') {
      // console.log('00000000000000000')
      countries = await Country.findAll({attributes: {exclude: ['createdAt','updatedAt']}, offset: offset, limit: 10, include: Activity});
    }
    else if(name ) {
      // console.log('aquioo', name);
      try{
        // console.log(offset, '555555', typeof name, 'iiiiiiiiii', !name, name)
        countries = await Country.findAll({where: {name: {[Op.iLike]: `%${name}%`}}, offset, 
        limit: 10, attributes: {exclude: ['createdAt','updatedAt']}, include: Activity});
        // console.log(countries, 'yyyyy')
      }catch(err){
        console.log(err);
      }
    }
    // console.log(countries)
    return res.status(200).send(countries);
  });

  routerCountry.get('/all', async function(req, res, next){
    console.log('all')
    try{
      countries = await Country.findAll({attributes: ['id', 'name']}); 
      // console.log(country)
    }catch(err){
      console(err);
    }
    return res.status(200).json(countries);
  });

  routerCountry.get('/:idCountry', async function(req, res, next){ 
    let {idCountry} = req.params, country;
    // console.log(idCountry, 'ajajajajja')
    try{
      country = await Country.findByPk(
        idCountry, 
        {attributes: {exclude: ['createdAt','updatedAt']}, include: Activity}
      );
      // console.log(country)
    }catch(err){
      console(err);
    }
    return res.json(country);
  });

 
  module.exports = routerCountry;