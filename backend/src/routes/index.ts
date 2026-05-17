import { Router } from "express";
import authRouter from "./auth"
import bookRouter from "./user_books"
import searchBookRouter from "./book"

const router = Router();

router.use("/auth", authRouter);
router.use("/user_books", bookRouter)
router.use("/search", searchBookRouter)

export default router;