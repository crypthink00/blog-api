import express from "express";
import { register, login } from "../controllers/authController.js";
import { validate } from "../middleware/validateMiddleware.js";
import { loginSchema, registerSchema } from "../utils/validators.js";

const authRouter = express.Router();

authRouter.post("/register", validate(registerSchema), register);

authRouter.post("/login", validate(loginSchema), login);

export default authRouter;
