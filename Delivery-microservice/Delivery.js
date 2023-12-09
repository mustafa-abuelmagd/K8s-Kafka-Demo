/****************************************************** 
Delivery Microservice:
  - Responsible for handling deliveries
  - Producer to the following topics:
    - delivery-shipping
    - delivery-shipped
    - delivery-delivered
    - logging-events
*******************************************************/
const { Kafka } = require("kafkajs");

async function run() {
  try {
    ///////////////// Connecting to broker(s) /////////////////
    const kafka = new Kafka({
      clientId: "myapp",
      brokers: ['localhost:9092']
    })

    ///////////////// Creating producer /////////////////
    const producer = kafka.producer();
    console.log("Connecting...🔃");
    await producer.connect();
    console.log("Connected! ✅");
    
    ///////////////// Batch Producing/////////////////
    const topicMessages = [
      {
        topic: "delivery-shipping",
        messages: [{value: "Shipping Delivery! 🚚"}]
      },
      {
        topic: "delivery-shipped",
        messages: [{value: "Delivery Shipped! ✌"}]
      },
      {
        topic: "delivery-delivered",
        messages: [{value: "Delivery Delivered! 👀"}]
      },
      {
        topic: "logging-events",
        messages: [
          {value: "Shipping Delivery! 🚚"},
          {value: "Delivery Shipped! ✌"},
          {value: "Delivery Delivered! 👀"}
        ]
      }
    ];
    await producer.sendBatch({ topicMessages });
    console.log("Sent Successfully! 🎉");
    

  } catch(ex) {
    console.log(`Something bad happened! ❌"${ex}"❌`);
  } finally {
    process.exit(0);
  }
}
///////////////// Running the producer /////////////////
run();


