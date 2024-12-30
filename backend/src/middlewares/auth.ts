import { Request, Response, NextFunction } from 'express';
import { auth } from '../configs/firebase';
import { log } from 'node:console';

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized: No token provided' });
        return;
    }
    
    const token = authorization.split('Bearer ')[1].trim();
    console.log(token);

    if (!token) {
        res.status(401).json({ error: 'Unauthorized: Invalid token format' });
        return
    }

    try {
        const decodedToken = await auth.verifyIdToken(token);
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email
        };
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};