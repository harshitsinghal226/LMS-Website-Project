import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks } from "./controllers/webhooks.js";

// Configure dotenv at the top!
dotenv.config();

//Initialize Express
const app = express();

// Connect to Database
await connectDB();

//Middlewares
app.use(cors());

//Routes
app.get("/", (req, res) => res.send("API Working"));

app.post('/clerk', express.json(), clerkWebhooks)

// Port
// we will get port number from environment
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
