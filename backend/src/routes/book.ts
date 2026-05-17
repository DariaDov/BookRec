import { Router, Request, Response } from "express";
import { pool } from "../db"
import { getChannel, SEARCH_QUEUE } from "../rabbitmq";
import * as Minio from 'minio';

export interface SearchRequest extends Request {
    line?: string;
}

export interface SearchResultRequest extends Request {
    uuid?: string;
}

export interface BookRequest extends Request {
    id?: number;
}

const minioClient = new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: 'Okos1JtnoNjWBPfZ7UwO',
    secretKey: 'PgYSOTeKzrPzPIzctkIWiirIA3YWeFeVlpJJQNRR'
});

const searchBookRouter = Router();

searchBookRouter.get("/start", async (req: SearchRequest, res: Response) => {
    const search_line = req.body.line;

    const searchUuid = crypto.randomUUID();

    const result = await pool.query(
        'INSERT INTO "search_result"(uuid) VALUES($1)',
        [searchUuid]
    );

    const channel = getChannel();
    channel.sendToQueue(
        SEARCH_QUEUE,
        Buffer.from(JSON.stringify({
            uuid: searchUuid,
            search_line: search_line
        })), { persistent: true }
    );

    res.json({
        message: "Search started"
    });
});

searchBookRouter.get("/result", async (req: SearchResultRequest, res: Response) => {
    const uuid = req.body.uuid;

    const result = await pool.query(
        'SELECT * FROM search_result WHERE uuid = $1',
        [uuid]
    );

    const s_result = result.rows[0]
    if (!s_result) return res.status(400).json({ error: "No uuid" })
    if (!s_result.result) return res.status(102).json({ message: "Processing" })
    else res.json({
        ids: s_result.result
    });
});

searchBookRouter.get("/image", async (req: BookRequest, res: Response) => {
    const id = req.body.id;

    const result = await pool.query(
        'SELECT img FROM book WHERE id = $1',
        [id]
    );

    const img_result = result.rows[0]
    if (!img_result) return res.status(400).json({ error: "No book" })
    else {
        const img_file = img_result.img ? img_result.img.split("/").at(-1) : "default.jpg";
        console.log(img_file)
        const url = await minioClient.presignedUrl('GET', 'images', img_file, 3600)

        res.json({
            url: url
        } );
    }
});


export default searchBookRouter