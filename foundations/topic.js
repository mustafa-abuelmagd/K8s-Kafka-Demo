const { Kafka } = require('kafkajs');

run();

async function run() {
    try {

        const kafka = new Kafka({
            clientId: 'my-app',
            brokers: ['mustafa:9092']
        });

        const admin = kafka.admin();
        console.log('Connecting...');
        await admin.connect();
        console.log('Connected!');

        // creating kafka topic
        // await admin.createTopics({
        //     topics: [
        //         {
        //             topic: 'Users1',
        //         },
        //     ]
        // });
        console.log('Created Successfully!');
        await admin.disconnect();


    } catch (e) {
        console.error(`[example/topic] ${e.message}`, e)
    }
    finally {
        process.exit(0);
    }
}