import { loginUser, registerUser } from "../services/auth.service.js";

// signup
export async function signupController(req, res, next){
    const {userName : username, email, password, avatar} = req.body;
    try {
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide username, email, password" 
      });
    }
    const { user } = await registerUser({
      username,
      email,
      password,
      avatar,
    });

    // console.log(user, "user")

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user
    });

  } catch (error) {
    console.log("Error in controller: smtg");
    console.log(error.message)

    res.status(400).json({
      "success ": false,
      "message" : error.message
    })
  //   next(error);
  }
}

// login
export async function loginController(req, res, next) {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password",
      });
    }
    // console.log(email, password)
    const { user, token } = await loginUser({ email, password });
    res.cookie('token', token, {
      httpOnly : true
    })

    res.status(200).json({
      success: true,
      message: "Login successful",
      user
    });
  } catch (error) {
    res.status(400).json({message : error.message})
    next(error);
  }
}

// logout
export function logoutController(req, res) {
    try {
        res.cookie("token", "");
        console.log("In logout service")

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        console.error("Logout Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}