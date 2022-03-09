
'use strict';


const { user } = require('../models/index.js')
const base64 = require('base-64');

module.exports = async (req, res, next) => {

  if (!req.headers.authorization) { next('Unauthorized User'); };
  
  let basic = req.headers.authorization.split(' ')[1];
  let [username, password] = base64.decode(basic).split(':');

  try {
    req.user = await user.authenticateBasic(username, password);
    next();
  } catch (e) {
    res.status(403).send('Invalid Login');
  }

}