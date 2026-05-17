import { Channel } from "amqplib";
import { DELETE_QUEUE, getChannel, REGISTRATION_QUEUE } from "./rabbitmq";
import { pool } from "./db";

export const startUserConsumer = async () => {
    const channel = getChannel();
    console.log("Ready to consume")
    
    channel.consume(REGISTRATION_QUEUE, async (msg) => {
        if (!msg) return;

        const { userId } = JSON.parse(msg.content.toString());
        
        const result = await pool.query(
            'SELECT * FROM "user" WHERE id = $1',
            [userId]
        )
        console.log(`New user registered: ${result.rows[0].email}`);

        channel.ack(msg);
    });

    channel.consume(DELETE_QUEUE, async (msg) => {
        if (!msg) return;

        const { userId, email } = JSON.parse(msg.content.toString());
        console.log(`User deleted: ${userId}, ${email}`);

        channel.ack(msg);
    });
};