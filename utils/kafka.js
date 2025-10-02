const { Kafka } = require('kafkajs');
const fs = require('fs');
require('dotenv').config();

// Load CA certificate
const ssl = {
  rejectUnauthorized: true,
  ca: [fs.readFileSync('./ca.pem', 'utf-8')],
  cert: fs.readFileSync("./service.cert", "utf-8"),
  key: fs.readFileSync("./service.key", "utf-8"),
};

const kafka = new Kafka({
  clientId: 'my-node-app',
  brokers: [process.env.KAFKA_URI],
  ssl,
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "stock-group" });

module.exports = { kafka, producer, consumer };
