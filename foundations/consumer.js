const { Kafka } = require('kafkajs');

run();

async function run() {
    try {

        const kafka = new Kafka({
            clientId: 'my-app',
            brokers: ['mustafa:9092']
        });

        const consumer = kafka.consumer({
            groupId: `test2-${Date.now()}`

        });
        console.log('Connecting...');
        await consumer.connect();
        console.log('Connected!');


        await consumer.subscribe({
            topic: 'Users1',
            fromBeginning: true
        });

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log({
                    value: message.value.toString(),
                });
            },
        });



    } catch (e) {
        console.error(`[example/topic] ${e.message}`, e)
    }
    // finally {
    //     process.exit(0);
    // }
}