import request from 'supertest';
import express from 'express';
import auth from '../auth'; 
import { pool } from '../../db';
import { authenticate } from "../../middleware/auth";

const client_url =  process.env.CLIENT_URL || 'http://localhost:8080';
const app = express();

app.use(express.json());
app.use('/api', authenticate, auth);

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

describe('Integration Tests', () => {
  describe('Access control', () => {
    it('should return 401 for /updatename without JWT token', async () => {
      const response = await request(app)
        .post('/api/auth/updatename')
        .send({ name: 'New Name' });
      
      expect(response.status).toBe(401);
    });

    it('should ignore fake JWT token', async () => {
      const response = await request(app)
        .post('/api/auth/updatename')
        .set('Authorization', 'fake_token')
        .send({ name: 'New Name' });
      
      expect(response.status).toBe(401);
    });
  });

  describe('Data Integrity', () => {
    it('should contain hashed password only', async () => {
      const testEmail = 'test@security.com';
      const testPassword = 'Password123!';

      await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test', email: testEmail, password: testPassword });

      const res = await pool.query('SELECT password FROM "user" WHERE email = $1', [testEmail]);
      const storedPassword = res.rows[0].password;

      expect(storedPassword).not.toBe(testPassword);
      expect(storedPassword.startsWith('$2b$')).toBe(true);
    });
  });
});