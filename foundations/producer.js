const { Kafka } = require("kafkajs");
const msg = process.argv[2];
const partition = msg[0] < "N" ? 0 : 1;

async function run() {
    try {
        ///////////////// Connecting to broker(s) /////////////////
        const kafka = new Kafka({
            clientId: "myapp",
            brokers: ["localhost:9092"],
        });

        ///////////////// Creating producer /////////////////
        const producer = kafka.producer();
        console.log("Connecting... 🔃");
        await producer.connect();
        console.log("Connected! ✅");

        ///////////////// Producing /////////////////
        const result = await producer.send({
            topic: "Users",
            messages: [
                {
                    value: msg,
                    partition: partition,
                },
            ],
        });
        console.log(`Sent successfully! 🎉 ${JSON.stringify(result)}`);
        await producer.disconnect();

        //
    } catch (ex) {
        console.log(`Something bad happened ${ex}`);

        //
    } finally {
        process.exit(0);
    }
}

run();
