const bcrypt = require('bcrypt')
const User = require('../Models/userModel');
const jwt = require('jsonwebtoken')

const register = async(req,res,next)=>{
    try{
        const{name,email,password,preferences} = req.body;

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({error:"Email already exist"})
        }

        const hashedPassword =  await bcrypt.hash(password,10)
    
        const user = await User.create({
            name,
            email,
            password:hashedPassword,
            preferences:preferences|| [],
        });

        res.status(201).json({
            message:"User registerd successfully",
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                preferences:user.preferences
            }
        })
    
    
    
    }catch(err){
        next(err);
    }
};

const login = async (req ,res, next)=>{
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({error : 'Invaild email or password'});

        }

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(401).json({error:'Invaild email or password'})
        }
        const token = jwt.sign({id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:'1d'}
        );

        res.status(200).json({
            message:'Login successful',
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
            }
        })
    }catch(err){
        next(err);
    }
}
module.exports = {register,login}