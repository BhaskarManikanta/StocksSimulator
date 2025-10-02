const { Kafka } = require("kafkajs");

const dotenv = require('dotenv')

dotenv.config();

const kafka = new Kafka({
  clientId: "stock-app",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"], 
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "stock-group" });

module.exports = { kafka, producer, consumer };
