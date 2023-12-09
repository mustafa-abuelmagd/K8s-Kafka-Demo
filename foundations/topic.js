const { Kafka } = require("kafkajs");

async function run() {
  try {
    ///////////////// Connecting to broker(s) /////////////////
    const kafka = new Kafka({
      clientId: "myapp",
      brokers: ["localhost:9092"],
    });

    ///////////////// Creating admin for creating topics /////////////////
    const admin = kafka.admin();
    console.log("Connecting...🔃");
    await admin.connect();
    console.log("Connected...✅");

    ///////////////// Creating topics /////////////////
    await admin.createTopics({
      topics: [
        {
          topic: "orders-created",
          numPartitions: 2,
        },
        {
          topic: "orders-ready-to-ship",
          numPartitions: 2,
        },
        {
          topic: "orders-shipping",
          numPartitions: 2,
        },
        {
          topic: "orders-shipped",
          numPartitions: 2,
        },
        {
          topic: "orders-delivered",
          numPartitions: 2,
        },
        {
          topic: "payments-created",
          numPartitions: 2,
        },
        {
          topic: "payments-made",
          numPartitions: 2,
        },
        {
          topic: "delivery-shipping",
          numPartitions: 2,
        },
        {
          topic: "delivery-delivered",
          numPartitions: 2,
        },
        {
          topic: "logging-events",
          numPartitions: 2,
        },
      ],
    });
    console.log("Topic(s) created successfully! 🎉");
    await admin.disconnect();

    //
  } catch (ex) {
    console.log(`Something bad happened ❌ ${ex} ❌`);

    //
  } finally {
    process.exit(0);
  }
}

run();
