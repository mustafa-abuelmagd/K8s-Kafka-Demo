const { Kafka } = require('kafkajs');
let mes = process.argv[2];


run();

async function run() {
    try {

        const kafka = new Kafka({
            clientId: 'my-app',
            brokers: ['mustafa:9092']
        });

        const producer = kafka.producer();
        console.log('Connecting...');
        await producer.connect();
        console.log('Connected!');


        // seding message
        let result = await producer.send({
            topic: 'Users1',
            messages: [
                { value: `${mes}` },
            ],
        });



        console.log(`Sent Successfully! ${JSON.stringify(result)}`);
        await producer.disconnect();


    } catch (e) {
        console.error(`[example/topic] ${e.message}`, e)
    }
    finally {
        process.exit(0);
    }
}