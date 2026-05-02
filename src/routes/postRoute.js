import express from "express";
import {
  getAllPosts,
  postController,
  getUserPosts,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import { checkRole } from "../middleware/roleCheck.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import { postSchema, postUpdateSchema } from "../utils/validators.js";

const postRouter = express.Router();

//Restricted to EDITOR and ADMIN
postRouter.post(
  "/",
  authMiddleware,
  checkRole(["EDITOR", "ADMIN"]),
  validate(postSchema),
  postController,
);

postRouter.get("/", authMiddleware, getAllPosts);

postRouter.get("/user/:id", authMiddleware, getUserPosts);

postRouter.patch(
  "/:id",
  authMiddleware,
  checkRole(["ADMIN", "EDITOR"]),
  validate(postUpdateSchema),
  updatePost,
);

postRouter.delete("/:id", authMiddleware, checkRole(["ADMIN"]), deletePost);

export default postRouter;
