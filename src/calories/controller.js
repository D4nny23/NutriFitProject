import Calorie from "./model.js";
import { verifyToken } from "../utils/authService.js";

const ACTIVITY_FACTOR = {
  sedentary: 1.2,
  lowActivity: 1.35,
  moderateActivity: 1.55,
  intenseActivity: 1.725,
  professionalAthletes: 1.9,
};

const coefficientForMale = {
  basicCalories: 66,
  coefficientForWeight: 13.75,
  coefficientForHeight: 5,
  coefficientAge: 6.75,
};

const coefficientForFemale = {
  basicCalories: 655,
  coefficientForWeight: 9.6,
  coefficientForHeight: 1.8,
  coefficientAge: 4.7,
};

export const calories = (req, res) => {
  const calories = getCalories(req.body);
  const objectives = req.body.objectives;
  if (objectives == "muscleGain") {
    res.status(200).json(getMuscleGainCalories(calories));
  } else if (objectives == "defineMuscle") {
    res.status(200).json(getDefineMuscle(calories));
  } else if (objectives == "mantenince") {
    res.status(200).json({ calories: calories.toFixed(2) });
  }
};

function getCalories(data) {
  const { gender, weight, height, age, activityFactor } = data;
  let calories = 0;

  if (gender.toLowerCase() == "hombre") {
    calories = getCaloriesByGender(
      activityFactor,
      weight,
      height,
      age,
      coefficientForMale.basicCalories,
      coefficientForMale.coefficientForWeight,
      coefficientForMale.coefficientForHeight,
      coefficientForMale.coefficientAge
    );
  } else {
    calories = getCaloriesByGender(
      activityFactor,
      weight,
      height,
      age,
      coefficientForFemale.basicCalories,
      coefficientForFemale.coefficientForWeight,
      coefficientForFemale.coefficientForHeight,
      coefficientForFemale.coefficientAge
    );
  }

  return calories;
}

function getCaloriesByGender(
  activityFactor,
  weight,
  height,
  age,
  basicCalories,
  coefficientForWeight,
  coefficientForHeight,
  coefficientAge
) {
  let calories = 0;

  calories = basicCalories + coefficientForWeight * weight;
  calories += coefficientForHeight * height - coefficientAge * age;
  calories *= ACTIVITY_FACTOR[typeOfActivity(activityFactor)];

  return calories;
}

function typeOfActivity(activity) {
  let activityFactor = "";
  switch (activity) {
    case "Sedentario":
      activityFactor = "sedentary";
      break;
    case "Poca Actividad":
      activityFactor = "lowActivity";
      break;
    case "Actividad Moderada":
      activityFactor = "intenseActivity";
      break;
    case "Actividad Intensa":
      activityFactor = "moderateActivity";
      break;
    case "Atletas Profesionales":
      activityFactor = "professionalAthletes";
      break;
    default:
      break;
  }
  return activityFactor;
}

function getMuscleGainCalories(calories) {
  const slightSurplus = calories + (calories * 10) / 100;
  const moderateSurplus = calories + (calories * 20) / 100;
  const aggressiveSurplus = calories + (calories * 30) / 100;
  return {
    slightSurplus: slightSurplus.toFixed(2),
    moderateSurplus: moderateSurplus.toFixed(2),
    aggressiveSurplus: aggressiveSurplus.toFixed(2),
  };
}

function getDefineMuscle(calories) {
  const slightDeficit = calories - (calories * 10) / 100;
  const moderateDeficit = calories - (calories * 20) / 100;
  const aggressiveDeficit = calories - (calories * 30) / 100;
  return {
    slightDeficit: slightDeficit.toFixed(2),
    moderateDeficit: moderateDeficit.toFixed(2),
    aggressiveDeficit: aggressiveDeficit.toFixed(2),
  };
}

export const createCalories = async (req, res) => {
  const { gender, weight, height, age, activityFactor, objectives } = req.body;
  const authHeader = req.header("Authorization");

  if (authHeader) {
    const token = authHeader.replace("Bearer ", "");
    const decoded = await verifyToken(token);
    if (gender && weight && height && age && activityFactor && objectives) {
      const calorie = new Calorie({
        gender: gender,
        weight: weight,
        height: height,
        age: age,
        activityFactor: activityFactor,
        objectives: objectives,
        userId: decoded.id,
      });

      try {
        let result = await calorie.save();
        res.json({ result: result });
      } catch (error) {
        res.json({ error: error });
      }
    } else {
      res.status(400).json({ result: "Falta parámetros en las calorías" });
    }
  } else {
    res.status(401).json({ message: "Access denied" });
  }
};

export const getCaloriesByUser = async (req, res) => {
  try {
    const authHeader = req.header("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const decoded = await verifyToken(token);
      const caloriesUser = await Calorie.findOne({ userId: decoded.id });
      res.send({
        caloriesUser: caloriesUser,
      });
    }
  } catch (error) {
    res.json({ error: error });
  }
};
