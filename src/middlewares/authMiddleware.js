import { verifyToken } from "../utils/authService.js";

export const jwtValidation = async (req, res, next) => {
  console.log("Hola soy un middleware");
  req.body.middleware = true;

  const authHeader = req.header("Authorization");
  if (authHeader) {
    const token = authHeader.replace("Bearer ", "");
    const decoded = await verifyToken(token);

    if (decoded) {
      req.body.userId = decoded.id;
      next();
    } else {
      res.status(401).json({ message: "Access denied" });
    }
  } else {
    res.status(401).json({ message: "Access denied" });
  }
};
