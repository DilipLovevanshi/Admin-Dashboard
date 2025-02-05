import mongoose, { Schema, models, model } from "mongoose";

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  license: [
    {
      licenseType: String,
      licenseNo: String,
      expiryDate: Date,
    },
  ],
});

const User = models.User || model("User", userSchema); // Fix: Prevent re-registering the model


export default User;

