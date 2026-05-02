import express from "express";
import dotenv from "dotenv";
import postRouter from "./routes/postRoute.js";
import authRouter from "./routes/authRoute.js";
import { connectDB } from "./config/db.js";
dotenv.config();

connectDB();

const app = express();
app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/posts", postRouter);

console.log(process.env.DATABASE_URL);

app.listen(process.env.PORT, () => {
  console.log(`Server is running  on port ${process.env.PORT}`);
});
