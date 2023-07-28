const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Messages = sequelize.define('message', {
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    msg:{
        type:Sequelize.STRING,
        allowNull:false
    },
    userId:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    groupId:{
        type:Sequelize.INTEGER,
        allowNull:true
    }
    
})

module.exports = Messages;