import { createUserService } from "../services/user";
import { Request,Response } from "express";
export const createUser = async (req: Request, res: Response) => {
    const { uid, email } = req.body;
    try {
        const user = await createUserService(uid, email);
        res.json(user);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}