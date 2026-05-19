import { Router } from "express";
import { auth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createWebsiteSchema, generateWebsiteSchema, updateWebsiteSchema } from "../schemas/website.schema";
import { createWebsite, deleteWebsite, generateWebsite, getWebsite, getWebsites, updateWebsite } from "../controllers/website.controller";


const websiteRouter = Router();

websiteRouter.post("/generate",auth,validate(generateWebsiteSchema),generateWebsite);
websiteRouter.post("/",auth,validate(createWebsiteSchema),createWebsite);

websiteRouter.get("/",auth,getWebsites);
websiteRouter.get("/:id",auth,getWebsite);
websiteRouter.put("/:id",auth,validate(updateWebsiteSchema),updateWebsite);
websiteRouter.delete("/:id",auth,deleteWebsite);

export default websiteRouter;