'use strict';

const express = require ('express');
const { user } = require('../models/index.js');
const routers = express.Router();
const basicAuth = require('../middleware/basicAuth');
const bearerAuth = require('../middleware/bearerAuth');
const bcrypt = require('bcrypt');



routers.post('/signin',basicAuth,(req,res)=>{
    const userobj = {
        user: req.user,
        
        token: req.user.token,
        id: req.user.id
    }
    res.status(200).json(userobj);
    
})

routers.post('/secretstuff',bearerAuth(user),(req,res)=>{
    
    
    res.status(200).json(req.user);
})

routers.get('/users',bearerAuth(user),async (req,res)=>{
    
    const allUsers = await user.findAll({});
    const list = allUsers.map(user => user.username);
    res.status(200).json(list);
})


routers.post('/signup', async (req, res, next) => {
    let { username, password } = req.body;
    try {
        
        let hashedPassword = await bcrypt.hash(password,5)
        console.log(hashedPassword);
    
        const newUser = await user.create({
            username : username,
            password : hashedPassword
        }
        );
        res.status(201).json(newUser);
    } catch (error) {
        console.log(error);
        next('invalid signUp');
    }
});

module.exports = routers;