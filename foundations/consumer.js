const { Kafka } = require("kafkajs");

async function run() {
    try {
        ///////////////// Connecting to broker(s) /////////////////
        const kafka = new Kafka({
            clientId: "myapp",
            brokers: ["localhost:9092"],
        });

        ///////////////// Creating consumer /////////////////
        const consumer = kafka.consumer({ groupId: "test" });
        console.log("Connecting... 🔃");
        await consumer.connect();
        console.log("Connected! ✅");

        ///////////////// Consuming /////////////////
        consumer.subscribe({
            topic: "Users",
            fromBeginning: true,
        });
        await consumer.run({
            eachMessage: async (result) => {
                console.log(
                    `Received ${result.message.value} on partition ${result.partition}`
                );
            },
        });

        //
    } catch (ex) {
        console.log(`Something bad happened ${ex}`);
    }
}

run();
