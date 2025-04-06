/* The line `import mongoose from "mongoose";` is importing the Mongoose library in JavaScript.
Mongoose is an Object Data Modeling (ODM) library for MongoDB and provides a higher-level
abstraction for interacting with MongoDB databases. By importing Mongoose, you can use its
functionalities to define schemas, models, and interact with MongoDB databases in your JavaScript
code. */
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
