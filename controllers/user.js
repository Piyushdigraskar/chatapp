const Users = require('../models/user');
const bcrypt = require('bcrypt');

function isStringInvalid(string){
    if(string === undefined || string.length === 0){
        return true;
    }else{
        return false;
    }
}

const signUp = async (req, res)=> {
    try{
        const {name, email, phone, password} = req.body;
        if(isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(phone) || isStringInvalid(password)){
            return res.status(400).json({err: 'Invalid parameters'});
        }
        const saltRounds =10;
        bcrypt.hash(password, saltRounds, async(err, hash)=>{
            console.log(err);
            await Users.create({ name, email, phone, password:hash});
            res.status(201).json({ message: 'Successfully created user'});
        })

    }catch(err){
        console.log('User already exists', JSON.stringify(err));
        console.log(err);
    }
}

module.exports = {
    signUp
}