import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getChannel, REGISTRATION_QUEUE, DELETE_QUEUE } from "../rabbitmq";

import { pool } from "../db"

import { AuthRequest } from "../middleware/auth";

const authRouter = Router();

authRouter.post("/register", async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    try {
        const result = await pool.query(
            'INSERT INTO "user"(name, email, password) VALUES($1, $2, $3) RETURNING id, email',
            [name, email, hashed]
        );

        res.json(result.rows[0]);

        const channel = getChannel();
        channel.sendToQueue(
            REGISTRATION_QUEUE,
            Buffer.from(JSON.stringify({
                userId: result.rows[0].id
            })), { persistent: true }
        );

    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "User exists" });
    }
});

authRouter.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const result = await pool.query(
        'SELECT * FROM "user" WHERE email = $1',
        [email]
    )

    const user = result.rows[0]
    if (!user) return res.status(400).json({ error: "Invalid credentials" })
    
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(400).json({ error: "Invalid credentials" })

    const token = jwt.sign({ id: user.id }, "supersecret" as string)

    res.json({ token })
});

authRouter.post("/updatename", async (req: AuthRequest, res: Response) => {
    const { name } = req.body;
    const userId = req.user?.id;

    if (!name) {
        return res.status(400).json({ error: "Enter new name" });
    }

    try {
        const query = 'UPDATE "user" SET name = $1 WHERE id = $2 RETURNING id, name';
        const values = [name, userId];
    
        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Can't find user" });
        }   

    res.json({
        message: "Name changed",
        user: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

authRouter.post("/deleteuserprofile", async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    try {
        const query = 'DELETE FROM "user" WHERE id = $1 RETURNING *';
        const values = [userId];
    
        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }   

    res.json({
        message: "User deleted",
        user: result.rows[0].email
    });

    const channel = getChannel();
    channel.sendToQueue(
        DELETE_QUEUE,
        Buffer.from(JSON.stringify({ userId: result.rows[0].id, email: result.rows[0].email })),
        { persistent: true }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default authRouter;