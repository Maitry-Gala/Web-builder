import { Router } from "express";
import { validate } from "../middleware/validate";
import { signinSchema, signupSchema, updateUserSchema } from "../schemas/user.schema";
import { deleteUser, getUserDetail, logoutUser, signinUser, signupUser, updateUser } from "../controllers/auth.controller";
import { auth } from "../middleware/auth";

const userRouter: Router = Router();

userRouter.post("/signup",validate(signupSchema),signupUser);
userRouter.post("/signin",validate(signinSchema),signinUser);
userRouter.get("/me",auth,getUserDetail);
userRouter.put("/me",auth,validate(updateUserSchema),updateUser);
userRouter.delete("/me",auth,deleteUser);
userRouter.post("/logout",auth,logoutUser);

export default userRouter;
