const { Kafka } = require("kafkajs");
require("dotenv").config();

const kafka = new Kafka({
  clientId: "my-node-app",
  brokers: [process.env.KAFKA_BROKER],
});

const producer = kafka.producer();

const consumer = kafka.consumer({
  groupId: "stock-group",
});

const admin = kafka.admin();

const createTopics = async () => {
  try {

    await admin.connect();

    const topics = await admin.listTopics();

    if (!topics.includes("stock-prices")) {

      await admin.createTopics({
        topics: [
          {
            topic: "stock-prices",
            numPartitions: 1,
            replicationFactor: 1,
          },
        ],
        waitForLeaders: true,
      });

      console.log("✅ Topic created");

    } else {

      console.log("✅ Topic exists");
    }

    await admin.disconnect();

  } catch (err) {

    console.error(err);
  }
};

module.exports = {
  producer,
  consumer,
  createTopics,
};