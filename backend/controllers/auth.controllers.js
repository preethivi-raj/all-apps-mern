import User from "../models/user.model.js";

import bcrypt from "bcryptjs";
import crypto from "crypto";

import { generateVerficationToken } from "../utils/generateVerficationToken.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerficationEmail , sendWelcomeEmail ,sendForgotPasswordEmail , sendResetPasswordEmail} from "../mailtrap/email.js";


export const signup = async (req ,res)=>{
    const {name , email , password} = req.body;
    try {
        if(!name || !email || !password){
            throw new Error("Please fill all the fields");
        }
        const userIsAlreadyExist = await User.findOne({email});
        if(userIsAlreadyExist){
            return res.status(400).json({success : false,message:"User is already exist"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);


        const verficationToken = generateVerficationToken();
        const newUser = new User({
            name,
            email,
            password:hashedPassword,
            verficationToken:verficationToken,
            verficationTokenExpiresAt:Date.now() + 10 * 60 * 1000 
        });
        await newUser.save();

         generateTokenAndSetCookie(res , newUser._id);

        await sendVerficationEmail(newUser.email , verficationToken);

        res.status(201).json({
            success: true,
            message:"User is created successfully",
            user: {
                ...newUser._doc,
                password:undefined,
            }
        })

    } catch (error) {
        console.log(`Error in signup Controller : ${error.message}`)
        res.status(500).json({success: false,message:error.message})
    }
}

export const verifyEmail = async (req ,res)=>{
        const {code }= req.body;
        try {
            const user = await User.findOne({
                verficationToken:code,
                verficationTokenExpiresAt:{$gt:Date.now()}
            });
            if(!user){
                return res.status(400).json({success:false,message:"Invalid or Expired verification code"})
            }
            user.isVerified = true;
            user.verficationToken = undefined;
            user.verficationTokenExpiresAt = undefined;

            await user.save();

            await sendWelcomeEmail(user.email , user.name);

            res.status(200).json(
                {
                    success:true,
                    message:"Email is verified successfully",
                    user: {
                        ...user._doc,
                        password:undefined,
                    }
                }
            )
        } catch (error) {
            console.log(`Error in verifyEmail Controller : ${error.message}`)
            res.status(500).json({success: false,message:error.message})
        }
}

export const login = async (req ,res)=>{
    const {email , password} = req.body;
    try {
        const user = await  User.findOne({email});
        if(!user){
            return res.status(400).json({success:false,message:"Invalid email or password"})
        }
        const isPasswordMatched = await bcrypt.compare(password , user.password);

        if(!isPasswordMatched){
            return res.status(400).json({success:false,message:"Invalid email or password"})
        }

        generateTokenAndSetCookie(res , user._id);

        user.lastLogin = Date.now();
        await user.save();

        res.status(200).json({
            success:true,
            message:"User is logged in successfully",
            user: {
                ...user._doc,
                password:undefined,
            }
        })

    } catch (error) {
        console.log(`Error in login Controller : ${error.message}`)
        res.status(500).json({success: false,message:error.message})
    }
}


export const logout = async (req ,res)=>{
    res.clearCookie("token");
    res.status(200).json({success:true,message:"User is logged out successfully"})
}


export const forgotPassword = async (req ,res)=>{
     const {email} = req.body;
     try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success:false,message:"User is not found with this email"})
        }

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        await sendForgotPasswordEmail(user.email , `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
           
        res.status(200).json({success:true,message:"Reset password link is sent to your email"})

     } catch (error) {
        console.log(`Error in forgotPassword Controller : ${error.message}`)
        res.status(500).json({success: false,message:error.message})
     }
}


export const resetPassword =async(req , res)=>{
    
    try {
        const {token} = req.params;
        const {password} = req.body;

        const user = await User.findOne({
            resetPasswordToken:token,
            resetPasswordExpiresAt:{$gt:Date.now()}
        });

        if(!user){
            return res.status(400).json({success:false,message:"Invalid or Expired reset password token"})
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;

        await user.save();

        await sendResetPasswordEmail(user.email);

        res.status(200).json(
            {
            success:true,
            message:"Password is reset successfully"
            }
          )

    } catch (error) {
        console.log(`Error in resetPassword Controller : ${error.message}`)
        res.status(500).json({success: false,message:error.message})
    }
}

export const checkAuth = async (req , res)=>{
    try {
        const user = await User.findById(req.userId).select("-password");

        if(!user){
            return res.status(400).json({success:false,message:"User is not found"})
        }

        res.status(200).json({
            success:true,
            user
        })

    } catch (error) {
        console.log(`Error in checkAuth Controller : ${error.message}`)
        res.status(500).json({success: false,message:error.message})
    }
}