import bcryp from 'bcrypt'
import User  from '../models/user.model.js';
import jwt from 'jsonwebtoken';

export const userAuth = async (req, res, next) => {
    try{
        const {token} = req.cookies;
        console.log("In userAuth middlweare", token)
        if(!token){
            return res.status(401).send("Please login");
            console.log("token not found")
        }
        const decodedObj = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodedObj.id);
        if(!user){
            throw new Error("user not found");
        }
        req.user = user;
        console.log(user, "printing in the userAuth middleware")
        next();
    }catch(err){
        console.log(err)
        res.status(400).send("ERROR :", err);
    }
}