import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { makePayment,getPayments ,deleteAllPayments} from "../controllers/payment";

const route = Router();

route.post("/",authenticate,makePayment);
route.get("/:id",authenticate,getPayments);
route.delete("/:id",authenticate,deleteAllPayments);


export default route;