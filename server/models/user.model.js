/* The line `import mongoose from "mongoose";` is importing the Mongoose library in JavaScript.
Mongoose is an Object Data Modeling (ODM) library for MongoDB and provides a higher-level
abstraction for interacting with MongoDB databases. By importing Mongoose, you can use its
functionalities to define schemas, models, and interact with MongoDB databases in your JavaScript
code. */
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    token: {
      type: String,
      default: null,
    }
  },
  /* In the Mongoose schema options, `{ timestamps: true }` is a configuration that automatically adds
  two fields to the schema: `createdAt` and `updatedAt`. These fields are automatically managed by
  Mongoose and are used to track the creation and last update times of documents in the MongoDB
  collection. */
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
