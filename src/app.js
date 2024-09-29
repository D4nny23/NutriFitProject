import express from "express";
import caloriesRouter from "./calories/routes.js";
import userRouter from "./user/routes.js";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 4000;

const app = express();

app.set("port", port);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
.then(()=>console.log('Conected to MongoDB Atlas'))
.catch((error)=>{
    console.error(error)
    process.exit(-1)
});

caloriesRouter(app);
userRouter(app);

app.use((req, res) => {
  res.status(404).send("<h1>404</h1>");
});

app.listen(port, () => {
  console.log("Servidor escuchando en el puerto", port);
});
