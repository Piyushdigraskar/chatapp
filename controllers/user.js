const Users = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secretkey = process.env.TOKEN_SECRET;

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

const generateAccessToken = (id) =>{
    return jwt.sign({userId:id}, 'secretkey');
}
  

const login = async (req, res) =>{
    try{
        const { email, password } = req.body;

        if(isStringInvalid(email) || isStringInvalid(password)){
            return res.status(400).json({ message: 'email or password is wrong', success: false });
        }

        const user = await Users.findAll({where:{ email}});
        if(user.length>0){
            bcrypt.compare(password, user[0].password, (err, result)=>{
                if (err) {
                    throw new Error('Something went wrong')
                  }
                if(result === true){
                    return res.status(200).json({success: true, message: 'User logged in successfully', token: generateAccessToken(user[0].id)});
                }
                else{
                    return res.status(400).json({success: false, message: 'Password is incorrect'});
                }
            })

        }else{
            return res.status(404).json({success: false, message: 'User does not exist'});
        }
    }
    catch(err){
        console.log(err);
    }
}

const getUsers = async (req, res, next) =>{
    try {
        const users = await Users.findAll();
        res.status(200).json({ users });
        
    } catch (err) {
        console.log(err);
    }
}

const getUserIdName = async (req,res,next) =>{
    try {
        const name = req.user.name;
        res.status(200).json({ name });
    } catch (err) {
        console.log(err);
    }
}

const deleteUser = async(req, res, next) =>{
    try {
        const userId = req.params.userId;
        const user = await Users.findOne({ where: {id: userId}});

        if(!user){
            return res.status(404).json({error: "User not found"});
        }

        await user.destroy();
        res.status(200).json({message: "user deleted successfully"});
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    signUp,
    login,
    generateAccessToken,
    getUsers,
    getUserIdName,
    deleteUser
}