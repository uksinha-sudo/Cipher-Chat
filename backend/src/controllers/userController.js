import { userModel } from "../models/user.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export async function createNewAccount(req, res) {
    const { username, email, password } = req.body;

    try {

        if (!username || !email || !password) {
            return res.status(404).json({
                message: "All fields are required",
                success: false
            })
        };

        const existingUser = await userModel.findOne({
            $or: [
                { username },
                { email }
            ]
        })
        if (existingUser) {
            const field = existingUser.email === email ? "Email" : "Username";
            return res.status(409).json({ message: `${field} is already in use`, success: false })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await userModel.create({
            username, email, password: hashedPassword
        });


        res.status(200).json({
            message: "Account Created",
            success: true
        });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error, Failed to create account", success: false });
    }

}

export async function login(req, res){

    const { username, email, password } = req.body;
    try{

        const existingUser = await userModel.findOne({
            $or:[
                { username },
                { email }
            ]
        });
        
        if(!existingUser){
            const field = existingUser.email === email ? "Email" : "Username";
            return res.status(404).json({message: `${field} is not found`, success: false});
        };
        
        const checkPass = await bcrypt.compare(password, existingUser.password);
        
        if(!checkPass){
            return res.status(401).json({
                message: "Incorrect Credentials",
                success: false
            })
        }
        
        const token = jwt.sign({
            id: existingUser._id.toString()
        }, process.env.JWT_SECRET, {expiresIn: "1d"});
        
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        })
        
        res.status(200).json({
            message: "Logged in",
            success: true
        })
    } catch(err){
        return res.status(500).json({message: "Internal server error, Failed to login", success: false})
    }

}