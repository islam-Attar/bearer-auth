'use strict';

require('dotenv').config();
const JWT = require('jsonwebtoken');
const SECRET = process.env.SECRET || "i hate testing";


const user = (sequelize, DataTypes) => sequelize.define('user', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: {
        type:DataTypes.VIRTUAL,
        get() {return JWT.sign({ username: this.username }, SECRET);}

    }
})

module.exports = user;