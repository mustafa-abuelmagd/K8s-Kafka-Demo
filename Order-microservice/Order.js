// order system is a microservice that is responsible for handling orders
// it works as a 
/*
producer for the kafka topics: 
    * orders-created
    * orders-ready-to-ship
    * orders-shipping
    * orders-shipped
    * orders-delivered
    * logging-events

consumer for the kafka topics:
    * delivery-shipping
    * delivery-shipped
    * delivery-delivered

*/


const { Kafka } = require("kafkajs");
const kafka = new Kafka({
    clientId: "myapp",
    brokers: ["localhost:9092"],
});
const http = require('http');


let kafka_admin;
let topics;
// defining the consumer for the order system
let order_consumer;

// defining the producer for the order system
let order_producer;

async function send(topic, message) {
    try {
        let result = await order_producer.send({
            topic: topic,
            messages: [
                { value: `${message}` },
            ],
        });
        console.log(`Sent Successfully! ${JSON.stringify(result)}`);
    }
    catch (ex) {
        console.log(`Something bad happened ${ex}`);
    }
}

async function subscribe(topic) {
    try {
        order_consumer.subscribe({
            topic: topic,
            fromBeginning: true,
        });
    }
    catch (ex) {
        console.log(`Something bad happened ${ex}`);
    }
}

// consuming the messages from the kafka topics
async function consume() {
    try {
        await order_consumer.run({
            eachMessage: async (result) => {
                console.log(`Received message:: ${result.message.value} on topic::  ${result.topic}, partition::${result.partition} \n\n\n`);
            },
        });
    }
    catch (ex) {
        console.log(`Something bad happened ${ex}`);
    }
}


const server = http.createServer(async (req, res) => {
    console.log("req.url::::  ", req.url);
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        let result = await send("orders-created", "Hello, World!");
        res.end('Hello, World!');
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});


async function run() {
    try {

        kafka_admin = kafka.admin();
        console.log("Connecting Admin...🔃");
        await kafka_admin.connect();
        console.log("Admin Connected...✅");


        // connecting consumer to the kafka server
        order_consumer = kafka.consumer({ groupId: "test" });
        console.log("Connecting Consumer... 🔃");
        await order_consumer.connect();
        console.log("Consumer Connected! ✅");


        // connecting producer to the kafka server
        order_producer = kafka.producer();
        console.log('Connecting Producer...');
        await order_producer.connect();
        console.log('Producer Connected!');


        // // get avainlable topics
        // topics = await kafka_admin.listTopics();
        // subscribe to the topics
        ['orders-created',
            'orders-ready-to-ship',
            'orders-shipping',
            'orders-shipped',
            'orders-delivered',
            'logging-events'].forEach(async (topic) => {
                console.log('Subscribing to topic: ', topic, '...\n\n\n');
                await subscribe(topic)
            });

        consume();

        // if all goes well, start the server
        server.listen(3030, () => {
            console.log(`Server is running at http://localhost:${3030}`);
        });

        //
    } catch (ex) {
        console.log(`Something bad happened ${ex}`);
    }
}

run();
