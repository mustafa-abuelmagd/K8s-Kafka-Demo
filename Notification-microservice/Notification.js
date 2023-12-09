/****************************************************** 
Notification Microservice:
  - Responsible for sending notification for all possible events
  - Consumer to the following topics:
    - orders-created
    - orders-ready-to-ship
    - orders-shipping
    - orders-shipped
    - orders-delivered
    - payments-created
    - payments-made
    - delivery-shipping
    - delivery-shipped
    - delivery-delivered
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
    const consumer = kafka.consumer({ groupId: "notification" });
    console.log("Connecting... 🔃");
    await consumer.connect();
    console.log("Connected! ✅");

    ///////////////// Consuming /////////////////
    const topics = [
      "orders-created",
      "orders-ready-to-ship",
      "orders-shipping",
      "orders-shipped",
      "orders-delivered",
      "payments-created",
      "payments-made",
      "delivery-shipping",
      "delivery-shipped",
      "delivery-delivered",
    ];

    consumer.subscribe({
      topics: topics,
      fromBeginning: true,
    });

    await consumer.run({
      eachMessage: async (result) => {
          console.log(`New Notification❗ ${result.message.value}`);
      },
    });

  } catch (ex) {
    console.log(`Something bad happened! ❌"${ex}"❌`);
  }
}
///////////////// Running the consumer /////////////////
run();
