import amqplib, { Channel, ChannelModel } from "amqplib";

let connection: ChannelModel;
let channel: Channel;
export const REGISTRATION_QUEUE = "user_registration";
export const DELETE_QUEUE = "user_delete";
export const SEARCH_QUEUE = "search";

export const connectRabbitMQ = async () => {
    const connectionString = "amqp://user:password@localhost:5672";
    connection = await amqplib.connect(process.env.RABBITMQ_URL || connectionString);
    channel = await connection.createChannel();

    await channel.assertQueue(REGISTRATION_QUEUE, { durable: true });
    await channel.assertQueue(DELETE_QUEUE, { durable: true });
    await channel.assertQueue(SEARCH_QUEUE, { durable: true });

    console.log("RabbitMQ connected");
};

export const getChannel = (): Channel => {
    if (!channel) throw new Error("RabbitMQ channel not initialized");
    return channel;
};