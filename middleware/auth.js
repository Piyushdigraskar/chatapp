const jwt = require('jsonwebtoken');
const Users = require('../models/user');

const authenticate = async (req, res, next) =>{
    try{
        const token = req.header('Authorization');
        const user = jwt.verify(token, 'secretkey');
        Users.findByPk(user.userId).then(user => {
            req.user = user; 
            next(); 
        })
    }catch(err){
        console.log(err);
    }
}

module.exports = {
    authenticate
}