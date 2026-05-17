import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken"

export interface AuthRequest extends Request {
    user?: {
        id: string;
        name: string;
    }
}

const notGuardEndpoints = ["/auth/register", "/auth/login"];

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
    
    const path: string = req.path;
    if (notGuardEndpoints.includes(path)) {
        return next();
    }
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({ error: "No token" })
    }

    const token = authHeader.split(" ")[1]
    try {
        const decoded = jwt.verify(token, "supersecret");
        if (typeof decoded == "string") {
            return res.status(401).json({ error: "Invalid token"});
        }
        const { id, name } = decoded as { id: string; name: string};
        req.user = { id, name };
        next();
    } catch {
        return res.status(401).json({ error: "Invalid token" });
    }
}