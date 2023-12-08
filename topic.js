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
          topic: "Fruits",
          numPartitions: 2,
        },
      ],
    });
    console.log("Topic created successfully! 🎉");
    await admin.disconnect();

    //
  } catch (ex) {
    console.log(`Something bad happened ${ex}`);

    //
  } finally {
    process.exit(0);
  }
}

run();
