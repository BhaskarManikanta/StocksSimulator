const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "stock-app",
  brokers: ["localhost:9094"], 
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "stock-group" });

module.exports = { kafka, producer, consumer };
