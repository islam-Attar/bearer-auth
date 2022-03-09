'use strict';

require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET;

const UsersModel = (sequelize,DataTypes) =>{
const Users =  sequelize.define('user', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: {
        type: DataTypes.VIRTUAL,
        get() {   return jwt.sign({ username: this.username }, SECRET);  }
    }
})
Users.authenticateBasic = async function (username,password) {
    
    try {
        console.log('username:', username);
        const user = await this.findOne({where:{username:username}});
        console.log('user:', user);
        const valid = await bcrypt.compare(password,user.password);
        
        if(valid) {
            // generate a new token
            let newToken = jwt.sign({username:user.username},SECRET, {expiresIn : "900000ms"}); //set Token timer.900000 millisecond = 15 minutes
            user.token = newToken;
            
            return user;
        } else {
            console.log('user is not valid');
            // return;
            throw new Error('Invalid password');
        }
    } catch(error) {
       console.log('error ',error);
    }
}

Users.validateToken = async function(token) {
    const parsedToken = jwt.verify(token,SECRET);
    console.log('llllllll',parsedToken);
    const user = await this.findOne({where:{username:parsedToken.username}});
    if(user) {
        return user
    }
    throw new Error('invalid token')
}



return Users;
}
module.exports = UsersModel;