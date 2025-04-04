import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {

    console.log("Req body: ", req.body)

    console.log("Req header: ", req.header("Authorization"))
    
    const token = req.cookies.jwt || req.header("Authorization").replace("Bearer ", "") || req.body.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided (in middleware)" });
    }

    console.log("Token found in middleware: ", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
