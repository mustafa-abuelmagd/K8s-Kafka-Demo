// payment system is a microservice that is responsible for handling payments
// it works as a 
/*
producer for the kafka topics: 
    * payments-created
    * payments-made
    * logging-events

*/


const { Kafka } = require("kafkajs");
const kafka = new Kafka({
    clientId: "myapp",
    brokers: ["localhost:9092"],
});
const http = require('http');
const axios = require('axios');
const PORT = 3031;



let kafka_admin;
let topics;


// defining the producer for the order system
let payment_producer;

async function send(topic, message) {
    try {
        let result = await payment_producer.send({
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


const server = http.createServer(async (req, res) => {
    let METHOD = req.method;
    let URL = req.url;
    if (METHOD === 'POST' && URL === '/createpayment') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // convert Buffer to string
        });
        req.on('end', async () => {
            body = JSON.parse(body);
            let paymentId = body.orderId;

            res.writeHead(200, { 'Content-Type': 'text/plain' });
            let result = await send("payments-created", `Created a new payment with id ${paymentId}`);
            result = await send("payments-made", `Created a new payment with id ${paymentId}`);
            let sentLogging = await send("logging-events", `Created payment WITH ID${paymentId}`);

            res.end('Payment created successfully!');
        });
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


        // connecting producer to the kafka server
        payment_producer = kafka.producer();
        console.log('Connecting Producer...');
        await payment_producer.connect();
        console.log('Producer Connected!');


        // if all goes well, start the server
        server.listen(PORT, () => {
            console.log(`Payment Server is running at http://localhost:${PORT}`);
        });

        //
    } catch (ex) {
        console.log(`Something bad happened ${ex}`);
    }
}

run();
