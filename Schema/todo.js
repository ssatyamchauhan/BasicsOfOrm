module.exports = (Sequelize, sequelize) => {

    //Table Scehmea First ..........
    var Items = sequelize.define('item', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false
        },
        qty: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    },
        {
            freezeTableName: true,
            timestamps: false
        }
    );

    return Items;
}