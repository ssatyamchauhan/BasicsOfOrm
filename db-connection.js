
const Sequelize = require('sequelize');
// const schema = require('./schema/todo.js/index.js.js.js')

module.exports = () => {

    var sequelize = new Sequelize("orm", 'root', 'Navgurukul', {
        host: "127.0.0.1",
        dialect: "mysql",
        define: {
            underscored: true
        }
        // operatorAliases: false
    });

    sequelize.query('CREATE DATABASE IF NOT EXISTS orm')
        .then(() => {
            console.log('Database is created successfully!')
        })
        .catch(err => {
            console.log('ERROR in DATABASE CREATION!', err)
        })

    sequelize.authenticate()
        .then(function () {
            console.log("CONNECTED! ");
        })
        .catch(function (err) {
            console.log("SOMETHING DONE GOOFED");
        })
        .done();


    // Connect all the models/tables in the database to a db object, 
    //so everything is accessible via one object
    const db = {}
    db.Sequelize = Sequelize;
    db.sequelize = sequelize;

    // Models/Tables
    db.Items = require('./Schema/todo.js')(Sequelize, sequelize)
    db.bucket = require('./Schema/bucket.js')(Sequelize, sequelize)
    // console.log(db)
    
    //Syncing the modification into the database;
    db.sequelize.sync()
        .then(() => {
            console.log('modification has been implemented to the database')
        })
        .catch(err => {
            console.log('Modification failed due to some weird errors',err)
        })
    
    return db;
}