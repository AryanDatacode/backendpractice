import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// connecting mongoose
mongoose
  .connect("mongodb://127.0.0.1:27017/mongoose_demo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("mongodb connected"))
  .catch((err) => console.error(err));

// creating schema
const UserSchmea = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: false, required: true },
  age: { type: Number, min: 0 },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchmea);

// adding users
app.post("/api/users", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// sending users list
app.get("/api/users", async (req, res) => {
  try {
    const userList = await User.find();
    res.status(200).json(userList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// calculating and sending average age
app.get("/api/users/averageAge", async (req, res) => {
  try {
    const result = await User.aggregate([
      { $group: { _id: null, avgAge: { $avg: "$age" } } },
    ]);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get the top 3 youngest users
app.get("/api/youngestUsers", async (req, res) => {
  try {
    const youngest = await User.aggregate([
      { $sort: { age: 1 } }, // sort age in assending order
      { $limit: 3 },
    ]);
    res.status(200).json(youngest);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// get the users whose age is greater than average
app.get("/api/aboveAverageAgeUsers", async (req, res) => {
  try {
    // get the average of all users first
    const average = await User.aggregate([
      { $group: { _id: null, avg: { $avg: "$avg" } } },
    ]);
    // all the users whose age is greater than average age
    const aboveAverageUsers = await User.find({
      age: { $gt: average[0].avg },
    });
    res.status(200).json(aboveAverageUsers);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

const PORT = 5000;

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);