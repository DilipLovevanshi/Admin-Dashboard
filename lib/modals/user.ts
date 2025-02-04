import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  license: [
    {
      licenseType: String,
      licenseNo: String,
      expiryDate: Date,
      // unique: true,
    },
  ],
});

const User = models.User || model("User", userSchema);

export default User;
