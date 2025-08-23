import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks } from "./controllers/webhooks.js";
import educatorRouter from "./routes/educatorRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./configs/cloudinary.js";

//Initialize Express
const app = express();

// Connect to Database
connectDB();
connectCloudinary();
// await connectDB();
// await connectCloudinary();

//Middlewares
app.use(cors());
app.use(clerkMiddleware());

//Routes
app.get("/", (req, res) => res.send("API Working"));
// app.post('/clerk', express.json(), clerkWebhooks)
app.post(
  "/clerk",
  express.raw({ type: "application/json" }), // raw body for Clerk
  clerkWebhooks
);

app.use("/api/educator", express.json(), educatorRouter);

// Port
// we will get port number from environment
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
