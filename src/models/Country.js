const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('country', {
    id: {
      type: DataTypes.STRING(3), 
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    img:{
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    continent:{
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    capital:{
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    subRegion:{
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    area:{
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    population:{
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });
};
