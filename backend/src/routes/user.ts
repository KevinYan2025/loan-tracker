import { Router } from "express";
import {createUser} from "../controllers/user";
import { authenticate } from "../middlewares/auth";
const router = Router();

router.post("/",authenticate, createUser);

export default router;