import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { makePayment,getPayments } from "../controllers/payment";

const route = Router();

route.post("/",authenticate,makePayment);
route.get("/:id",authenticate,getPayments);


export default route;