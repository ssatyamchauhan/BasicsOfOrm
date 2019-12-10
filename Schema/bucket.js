module.exports = (Sequelize, sequelize) => {

    // Model/Table bucket
    var bucket = sequelize.define('bucket', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        filelink: {
            type: Sequelize.STRING(300),
            allowNull: false,

        }
    },
        {
            freezeTableName: true,
            timestamps: false
        })
    return bucket
}