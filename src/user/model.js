import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: String,
    surnames: String,
    userName: String,
    password: String,
  },
  { timestamps: true }
);

const User = model("User", UserSchema);

export default User;
