import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const generateToken = (id) => {
  console.log("generate Token")
  const signedJWT= jwt.sign({ id: id }, JWT_SECRET, { expiresIn: "3h" })
  return signedJWT;
};

export const verifyToken = async (token) => {
  console.log("verify Token")
  try {
    return await jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.log(error);
    return null;
  }
};
