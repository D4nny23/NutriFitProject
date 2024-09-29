import { Schema, model } from "mongoose";

const CalorieSchema = new Schema(
  {
    weight: Number,
    gender: String,
    height: Number,
    age: Number,
    activityFactor: String,
    objectives: String,
    userId: String,
  },
  { timestamps: true }
);

const Calorie = model("Calorie", CalorieSchema);

export default Calorie;
