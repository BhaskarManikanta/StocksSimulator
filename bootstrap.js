const {
  createTopics,
} = require("./utils/kafka");

const startProducer =
  require("./producers/stockProducer");

const startConsumer =
  require("./consumers/stockConsumer");

const start = async () => {

  try {

    await createTopics();

    await Promise.all([
      startProducer(),
      startConsumer(),
    ]);

  } catch (err) {

    console.error(err);
  }
};

start();