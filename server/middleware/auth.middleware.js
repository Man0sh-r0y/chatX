import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// work of middleware:

// middleware to protect routes that require user authentication


export const protectRoute = async (req, res, next) => {
  try {
    
    const token = req.cookies.jwt || req.header("Authorization").replace("Bearer ", "") || req.body.token; // finding the token from cookies or header or body

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided (in middleware)" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // decode the token

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password");
    // This tells Mongoose to exclude the password field from the result.
    // The - sign before "password" means "don't include this field" in the returned document.

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;

    /* `next();` is a function in Express.js middleware that is used to pass control to the next
    middleware function in the stack. When `next()` is called within a middleware function, it tells
    Express to move on to the next middleware in the chain. This is important for the flow of
    control in Express applications, allowing multiple middleware functions to be executed in
    sequence for a given route. */
    next();
  } 
  catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
