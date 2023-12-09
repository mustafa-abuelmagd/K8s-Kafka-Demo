/****************************************************** 
Logging Microservice:
  - Responsible for receiving logs for all possible events
  - Consumer to the following topics:
    - logging-events
*******************************************************/
const { Kafka } = require("kafkajs");

async function run() {
  try {
    ///////////////// Connecting to broker(s) /////////////////
    const kafka = new Kafka({
      clientId: "myapp",
      brokers: ["localhost:9092"],
    });

    ///////////////// Creating consumer /////////////////
    const consumer = kafka.consumer({ groupId: "logging" });
    console.log("Connecting... 🔃");
    await consumer.connect();
    console.log("Connected! ✅");

    ///////////////// Consuming /////////////////
    consumer.subscribe({
      topic: "logging-events",
      fromBeginning: true,
    });
    await consumer.run({
      eachMessage: async (result) => {
        console.log(
          `[${Date.now()}] ---> Event happened! ❗"${result.message.value}"❗`
        );
      },
    });

    //
  } catch (ex) {
    console.log(`Something bad happened ❌"${ex}"❌`);
  }
}
///////////////// Running the consumer /////////////////
run();
