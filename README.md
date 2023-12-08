# Demo

- Demo idea: e-commerce demo application where the user creates an order and makes the payment and follow the order and payment statuses along the journey.

## Stages of the cycle

1. Order created
2. Payment created
3. Payment made
4. Order is readytoship
5. Order is shipping
6. Order is shipped
7. Order is delivered

## Kafka topics

**- Orders:**

- _orders-created_
- _orders-ready-to-ship_
- _orders-shipping_
- _orders-shipped_
- _orders-delivered_
  **- Payments:**
- _payments-created_
- _payments-made_
  **- Notification:**
- _notification-events_
  **- Delivery:**
- _delivery-shipping_
- _delivery-shipped_
- _delivery-delivered_
  **- Logging:**
- _logging-events_

## System services

- Ordering system
- Payment system
- Delivery system
- Notification system
- Logging system
- Mobile application
- Email

## Cycle flow

- Order is "created" via a RESTful endpoint to the ordering system
- Ordering system calls the payment gateway to get the paymentUrl and returns back to the user
- Order system sends to notification topic that order is "created" with paymentUrl "https://created"
- Order system sends to logging topic that order is "create" with orderId
- Notification system sends to user phone number and email that order is created and paymenturl is "https://created"
- User makes the payment to the payment system
- Payment system pushes to the notification topic that "payment has been made successfully for orderId x" (**producer to "notification" topic**)
- Payment system pushes to the logging topic the paymentId (**producer to "logging" topic**)
- Notification system sends to the user phone and email that the payment is made successfully
- Order system receives the notification from the notification topic that the payment is made successfully (**consumer to "payment" topic**)
- Order system updates the order by id to be "readyToShip"
- Order system sends to notification topic that order status is now "readyToShip" (**producer to "notification" topic**)
- Order system sends to logging topic that order is "readyToShip" with orderId (**producer to "logging" topic**)
- Notification system sends to user email and phone number that the order status is now "readyToShip"
- Delivery system pulls from notification topic that there's an order with status "readyToShip" and ACKs to the topic that it has received the order (**consumer to "order" topic**)
- Order system updates the order status to "shipping"
- Order system sends to logging topic that order is "shipping" with orderId
- Order system sends to notification topic that the order with id x status is "shipping"
- Notification system sends to user phone number and email that their order is "shipping"
- Delivery system updates the order status to "shipped" via RESTful API endpoint
- Order system updates the order status to "shipped"
- Order system sends to logging topic that order is "shipped" with orderId
- Order system sends to notification topic that order status is "shipped"
- Notification system sends to user email and phone number that their order is "shipped"
- Delivery system updates the order status to "delivered" via RESTful API endpoint
- Order system updates the order status to "delivered"
- Order system sends to logging topic that order is "delivered" with orderId
- Order system sends to notification topic that order status is "delivered"
- Notification system sends to user email and phone number that their order is "delivered"

## System service identities

- Ordering system: producer and consumer: multiple instances in the same consumer group so that no two orders are created
- Payment system: producer: multiple instances in the same consumer group so that the payment is not made twice
- Delivery system: producer and consumer
- Notification system: producer
- Mobile application: consumer
- Email: consumer
- Mobile and email cannot be on the same consumer group as they'll need to consume messages individually

## Kafka topics interested parties

**- Orders:** - _orders-created_ - Producers: - Order system - Consumers - Notification system

- _orders-ready-to-ship_
  - Producers:
    - Order system
  - Consumers
    - Notification system
- _orders-shipping_
  - Producers:
    - Order system
  - Consumers
    - Notification system
- _orders-shipped_
  - Producers:
    - Order system
  - Consumers
    - Notification system
- _orders-delivered_
  - Producers:
    - Order system
  - Consumers
    - Notification system

**- Payments:**

- ~~Payments should not be its own topic as interactions with payment gateways do neither tolerate latency, nor loose error handling.~~
- But since the Notification topic is cancelled, we'll now use the payment topic to notify the user
- _payments-created_
  - Producers:
    - Payment system
  - Consumers
    - Notification system
- _payments-made_
  - Producers:
    - Payment system
  - Consumers
    - Notification system

**- Notifications:**

- For our specific use case, a notification topic would be an overkill, since other events will do very similar logic, i.e sending notifications for the email and mobile number of the user
  ~~- _notification-events_
  - Producers:
    - Order system
    - Payment system
    - Delivery system
  - Consumers:
    - Notification system~~

**- Delivery:**

- _delivery-shipping_
  - Producers:
    - Delivery system: to update the order status, message queues to achieve loose coupling
  - Consumers
    - Order system
    - Notification system
- _delivery-shipped_
  - Producers:
    - Delivery system
  - Consumers
    - Order system
    - Notification system
- _delivery-delivered_
  - Producers:
    - Delivery system
  - Consumers
    - Order system
    - Notification system

**- Logging:**

- _logging-events_
  - Producers:
    - Ordering system
    - Payment system
    - Delivery system
  - Consumers:
    - Logging system

## Interested parties by stage

1. Payment service receives a payment request with the orderId, mobile and email are interested in that event
   (this is not correct as payments are created from the order service via an api request, but only for demo purposes, let's assume that's the case: payment object is created in the ordering service )
2. Mobile and email are interested in that event
3. Order service receives the payment status with paymentId, mobile and email are interested in that event
4. Delivery, mobile, email
5. Order service: to update order status, mobile, email
6. Order service: to update order status, mobile, email
7. Order service: to update order status, mobile, email

## Infra and resources

- 7 Microservices
- 11 Topics
- 2 consumer groups: Order system, and Payment system
  - Calls for K8s ReplicaSet of 2
- Default replication factor of 3, calls for 3 Kafka brokers

### I'll need a K8s deployment resource with:

- Two replicaSets for the Order system and the payment gateway system
  - 1 Microservice for order system
  - 1 Microservice for payment gateway system
- 3 Kafka brokers
- 1 ZooKeeper instance
- Manually create 11 topics
- 5 Other microservices
- Expose the Zookeeper port
- Expose the kafka broker port
- 1 API endpoint to create the order
- 1 API endpoint to make the payment

### Steps

- Create zookeeper deployment and service yaml from confluent
- Create kafka deployment and service
- Manually creating kafka topics
- Deploying microservices
  - Create deployment and service yaml files
  - Deploy microservices using kubectl apply -f
- Expose ports
  - Expose zookeeper port 2181
  - Expose kafka port 9092
