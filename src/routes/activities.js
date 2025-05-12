const router = require('express').Router();
// const { prototype } = require('mocha');
// const { classToInvokable } = require('sequelize/types/lib/utils');
const { Country, Activity } = require('../db.js');

router.get('/', async function(req, res, next){
    res.send('hola')
});
router.post('/', async function(req, res, next){
    
    // el formulario se´ra controlado por lo que countryId será un arreglo de ids de paises,
    // todos bien escritos y como minimo conteniendo un elemento
    let {name, difficulty, duration, season, countries} = req.body;
    // console.log(req.body, 'despues');
    try{
        let activity = await Activity.create({name, difficulty, duration, season});
        countries.map(async (id) => {
            // buscamos el pais 
            let c = await Country.findByPk(id);
            // asignamos el pais a la actividad creada
            await activity.setCountries(c.id);
        });
        res.json({msg: 'actividad creada correctamente'});
    }catch(err){
        res.status(400).send('error al crear la actividad o al buscar el pais')
    }
});


module.exports = router;