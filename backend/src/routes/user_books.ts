import { Router, Request, Response } from "express";
import { pool } from "../db"
import { AuthRequest } from "../middleware/auth";

const bookRouter = Router();

bookRouter.post("/liked", async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const { bookId } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO user_books(user_id, book_id) VALUES($1, $2)',
            [userId, bookId]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "User already liked this book" });
    }
});

bookRouter.post("/deletbookfromliked", async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const { bookId } = req.body;

    try {
        const query = 'DELETE FROM user_books WHERE user_id = $1 and book_id = $2';
        const values = [userId, bookId];
    
        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Can't find book" });
        }   

    res.json({
        message: "Book deleted from liked",
        user: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default bookRouter;