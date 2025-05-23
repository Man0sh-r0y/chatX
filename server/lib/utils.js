import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {

  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "7d", // token will expire in 7 days
    });
  
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days represented in mili seconds
      httpOnly: true, // prevent XSS attacks cross-site scripting attacks
      sameSite: "strict", // CSRF attacks cross-site request forgery attacks
      //secure: process.env.NODE_ENV !== "development",
    });
  
    console.log('cookie have created successfully');
  
    return token;
  } 
  catch (error) {
    console.log("Error in generateToken: ", error);
    return null;
  }
};
