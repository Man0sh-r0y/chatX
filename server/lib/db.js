import mongoose from "mongoose"; 
// Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. 
// Think of it as a tool that makes it easier to work with MongoDB in your JavaScript or Node.js applications.

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI); 
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } 
  catch (error) {
    console.log("MongoDB connection error:", error);
  }
};
