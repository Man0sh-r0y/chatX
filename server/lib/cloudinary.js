import { v2 as cloudinary } from "cloudinary"; // This allows you to access the functionalities provided by the v2 module of the Cloudinary package

import { config } from "dotenv";

config(); // tp use the configuration from the .env file

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
