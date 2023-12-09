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
      topic: topics,
      fromBeginning: true,
    });


    await consumer.run({
      eachMessage: async ({topic, partition, message}) => {

        switch(topic) {
          case "orders-created":
            console.log(`New Notification! ${message.value} order is created ❗`);
            break;
            
          case "orders-ready-to-ship":
            console.log(`New Notification! ${message.value} order is created ❗`);
            break;

          case "orders-shipping":
            console.log(`New Notification! ${message.value} order is being shipped ❗`);
            break;

          case "orders-shipped":
            console.log(`New Notification! ${message.value} order is shipped ❗`);
            break;

          case "orders-delivered":
            console.log(`New Notification! ${message.value} order is delivered ❗`);
            break;

          case "payments-created":
            console.log(`New Notification! ${message.value} payment is created ❗`);
            break;

          case "payments-made":
            console.log(`New Notification! ${message.value} payment is made ❗`);
            break;

          case "delivery-shipping":
            console.log(`New Notification! ${message.value} delivery is being shipped ❗`);
            break;

          case "delivery-shipped":
            console.log(`New Notification! ${message.value} delivery is shipped ❗`);
            break;

          case "delivery-delivered":
            console.log(`New Notification! ${message.value} delivery is delivered ❗`);
            break;
        }
      },
    });
  } catch (ex) {
    console.log(`Something bad happened ${ex} 💀`);
  }
}


run();
