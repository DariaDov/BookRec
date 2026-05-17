import express from "express";
import cors from "cors";
import { connectRabbitMQ } from "./rabbitmq";

import { startUserConsumer } from "./rabbitmqConsumer";

import auth from "./routes"
import user_books from "./routes"
import book from "./routes"
import { authenticate } from "./middleware/auth";

require('dotenv').config();

const port = process.env.PORT || 8080;
const client_url =  process.env.CLIENT_URL || 'http://localhost:8080';

const app = express();

app.use(cors({
    origin: client_url,
    credentials:true,
}));
app.use(express.json());

app.use("/api", authenticate, auth);
app.use("/api", authenticate, user_books);
app.use("/api", authenticate, book);

const start = async () => {
    await connectRabbitMQ();
    await startUserConsumer();
    app.listen(port);
    console.log(`Server started on port ${port}`)
};

start();