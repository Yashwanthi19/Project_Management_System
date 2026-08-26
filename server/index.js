import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import projectRoutes from "./routes/project.js";
import teamRoutes from "./routes/teams.js";
import cors from "cors";
import morgan from "morgan";

const app = express();
const port = process.env.PORT || 8700;

const connect = () => {
  const mongoURI = process.env.MONGO_URL;

  if (!mongoURI) {
    console.error(
      "MongoDB URI is undefined. Check your environment variables.",
    );
    process.exit(1);
  }

  mongoose.set("strictQuery", true);

  mongoose
    .connect(mongoURI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));
};

/** Middlewares */
app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);

app.use(morgan("tiny"));
app.disable("x-powered-by");

/** Routes */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/team", teamRoutes);

/** Error Handling */
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";

  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

/** Start Server */
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
  connect();
});
