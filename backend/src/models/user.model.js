"use strict";
// Import the 'mongoose' module to create the database connection
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Create the 'users' collection schema
const userSchema = new mongoose.Schema(
  {

    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    
    departmentNumber: {
      type: Number,
      required: false
    },
    rut: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
  },
  {
    versionKey: false,
  },
);

/** Encrypts the user's password */
userSchema.statics.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/** Compares the user's password */
userSchema.statics.comparePassword = async (password, receivedPassword) => {
  return await bcrypt.compare(password, receivedPassword);
};

/** 'User' data model */
const User = mongoose.model("User", userSchema);

// Export the 'User' data model
export default User;
