import { Router } from "express";
import { validate } from "../middleware/validate";
import { signinSchema, signupSchema } from "../schemas/user.schema";
import { signinUser, signupUser } from "../controllers/auth.controller";

const userRouter: Router = Router();

userRouter.post("/signup",validate(signupSchema),signupUser);
userRouter.post("/signin",validate(signinSchema),signinUser);


export default userRouter;
