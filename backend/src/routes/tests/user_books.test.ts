import request from 'supertest';
import express from 'express';
import { AuthRequest } from '../../middleware/auth';
import bookRouter from '../user_books';
import { pool } from '../../db';
import { Request, Response, NextFunction } from 'express';

jest.mock('../../db', () => ({
  pool: {
    query: jest.fn(),
  },
}));

jest.mock('../../middleware/auth', () => ({
  authenticate: (req: AuthRequest, res: Response, next: NextFunction) => {
    req.user = { id: "1", name: "test" };
    next();
  },
}));

const app = express();
app.use(express.json());
app.use((req: AuthRequest, res, next) => {
  req.user = { id: "1", name : "test" }; 
  next();
}, bookRouter);

describe('Book Router', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /liked', () => {
    it('should add a book to liked', async () => {
      const mockResult = { rows: [{ user_id: "1", book_id: 10 }] };
      (pool.query as jest.Mock).mockResolvedValue(mockResult);

      const res = await request(app)
        .post('/liked')
        .send({ bookId: 10 });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockResult.rows[0]);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), ["1", 10]);
    });

    it('should return 400 if user already liked that book', async () => {
      (pool.query as jest.Mock).mockRejectedValue(new Error('Unique constraint'));

      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      const res = await request(app)
        .post('/liked')
        .send({ bookId: 10 });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('User already liked this book');

      logSpy.mockRestore();
    });
  });

  describe('POST /deletbookfromliked', () => {

    it('should delete a book from liked', async () => {
      (pool.query as jest.Mock).mockResolvedValue({ rowCount: 1, rows: [] });

      const res = await request(app)
        .post('/deletbookfromliked')
        .send({ bookId: 10 });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Book deleted from liked');
    });

    it('should return 404 if book was not found in liked', async () => {
      (pool.query as jest.Mock).mockResolvedValue({ rowCount: 0 });

      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      const res = await request(app)
        .post('/deletbookfromliked')
        .send({ bookId: 100 });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Can't find book");

      logSpy.mockRestore();
    });
  });
});