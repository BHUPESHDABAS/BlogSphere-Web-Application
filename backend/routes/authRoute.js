import express from "express";
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

//Signup Request

router.post("/signup", async (req,res)=>{
    try{
        const {name, email, password} = req.body;

        const existingUser = await User.findOne({ email});
        if(existingUser) return res.status(400).json({ message: "User already exists, try with another E-mail" });

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new User({name, email, password: hashPassword});
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });

    }catch(error){
        res.status(500).json({ message: "Error from Backend Server", error });
    }
})

//Login Request

router.post("/login", async (req,res) =>{
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if(!user) return res.status(400).json({ message: "Invalid E-mail, Login with registered mail!" });

        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch) return res.status(400).json({ message:"Invalid password, try again!"});

        const token = jwt.sign({id: user._id}, process.env.JWT_KEY , {expiresIn: "1d"});

        res.status(200).json({ token, user: {name: user.name , id: user._id} , message:"Login Successfull" });
    }catch(error){
        res.status(500).json({ message: "Error while login, try again !", error})
    }
})

export default router;