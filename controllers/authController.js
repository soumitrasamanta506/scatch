const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

const { generateToken } = require("../utils/generateToken");

module.exports.registerUser = async function(req, res){
    try{
        let {fullname, email, password} = req.body;

        let isAlreadyCreatedAccout = await userModel.findOne({email: email});
        if(isAlreadyCreatedAccout)  return res.status(401).send("Already have an account, please login");

        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(password, salt, async function(err, hash){
                if(err) res.send(err.message);
                let user = await userModel.create({
                    fullName: fullname,
                    email: email,
                    password: hash
                });
        
                let token = generateToken(user);
                res.cookie("token", token);
                res.send("user created successfully");
            })
        })
        
    }
    catch(err){
        console.log(err.message);
    }
}
module.exports.loginUser = async function(req, res){
    let {email, password} = req.body;
    
    let user = await userModel.findOne({email});
    if(!user)   return res.send("Email or password is incorrect");

    bcrypt.compare(password, user.password, function(err, result){
        if(result){
            let token = generateToken(user);
            res.cookie("token", token);
            res.send("You can login");
        }
        else return res.send("Email or password is incorrect");
    })
}
module.exports.logout = function(req, res){
    res.cookie("token", "");
    res.redirect("/");
}