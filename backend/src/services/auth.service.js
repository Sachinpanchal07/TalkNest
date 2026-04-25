import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


// register user
export const registerUser = async ({ username, email, password, avatar }) => {
  try{
    const existingUser = await User.findOne({$or : [{ email }, { username }]});
    // console.log("hello in regiseter user")
    if (existingUser) {
      const error = new Error("User already exists with this email or username");
      throw error;
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      avatar: avatar
    });
  
     // generate JWT
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
  
    return { user: newUser, token };
  }catch(err){
    console.log("Error in service :", err);
    throw err;
  }
};


// login user
export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  
  if (!user) {
    const error = new Error("Invalid email or password");
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Invalid email or password");
    throw error;
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return { user, token };
};
