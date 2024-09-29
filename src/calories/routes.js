import { Router } from "express";
import { calories, createCalories, getCaloriesByUser } from "./controller.js";

const router = Router();

const caloriesRouter = (app) => {
  router.get("/", (req, res) => {
    res.status(200).send("<h1>Hola</h1>");
  });

  router.post("/", calories);
  router.post("/createCalories", createCalories);
  router.get("/caloriesByUser", getCaloriesByUser);


  app.use("/calories", router);
};

export default caloriesRouter;
