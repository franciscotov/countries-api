const { Router } = require('express');
const { Country, Activity } = require('../db.js');
let { conn } = require('../db.js');
let routerCountry = require('./countries.js');
let routerActivity= require('./activities.js');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
// se importan las rutas(divididas por archivos) y asociamos todo al router pasando 
// como primer parametro la ruta a la que vamos
router.get('/', (req, res) =>{
    res.send('paguina principal')
})
router.use('/countries', routerCountry);
router.use('/activity', routerActivity);

module.exports = router;
