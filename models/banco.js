const db = require('./db');

const animaisbd = db.sequelize.define('animal', {
    ID: {
        type: db.Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    tipo: {
        type: db.Sequelize.STRING
    },
    raca: {
        type: db.Sequelize.STRING
    },
    cor: {
        type: db.Sequelize.STRING
    },
    nomeDono: {
        type: db.Sequelize.STRING
    },
    FK_Id_Veterinario: {  // Chave estrangeira para associar veterinário
        type: db.Sequelize.INTEGER,
        references: {
            model: 'veterinario', // Nome da tabela de veterinários
            key: 'id'
        }
    }
}, {
    freezeTableName: true, // Impede a pluralização do nome da tabela
    timestamps: false
});

const veterinariobd = db.sequelize.define('veterinario', {
    ID: {
        type: db.Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: db.Sequelize.STRING
    },
    dataNascimento: {
        type: db.Sequelize.DATE
    },
    CFMV: {
        type: db.Sequelize.INTEGER
    }
}, {
    freezeTableName: true, // Impede a pluralização do nome da tabela
    timestamps: false
});

// Definindo a relação
animaisbd.belongsTo(veterinariobd, { foreignKey: 'FK_Id_Veterinario' });
veterinariobd.hasMany(animaisbd, { foreignKey: 'FK_Id_Veterinario' });

module.exports = {
    animaisbd,
    veterinariobd
};
