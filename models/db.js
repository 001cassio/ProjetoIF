const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect:'sqlite',
    storage:'./petshow.sqlite'
})

module.exports={
    Sequelize:Sequelize,
    sequelize:sequelize
};

