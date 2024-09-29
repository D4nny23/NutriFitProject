import { Router } from "express";
import { createUser, getUsers, login } from "./controller.js";
import { jwtValidation } from "../middlewares/authMiddleware.js";

const router = Router();

const userRouter = (app) => {
  router.post("/", createUser);
  router.post("/login", login);
  router.get("/all", jwtValidation, getUsers);

  app.use("/user", router);
};

export default userRouter;
