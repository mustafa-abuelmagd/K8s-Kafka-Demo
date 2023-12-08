# Demo

* demo idea: e-commerce demo application where the user creates an order and makes the payment and follow the order and payment statuses along the journey


## Stages of the cycle
1- order created
2- payment created
3- payment made 
4- order is readytoship
5- order is shipping 
6- order is shipped
7- order is delivered

## Kafka topics
* #### Orders
	* _orders-created_
	* _orders-ready-to-ship_
	* _orders-shipping_
	* _orders-shipped_
	* _orders-delivered_
* #### Payments
	* _payments-created_
	* _payments-made_
* #### Notification
	* _notification-events_
* #### Delivery
	* _delivery-shipping_
	* _delivery-shipped_
	* _delivery-delivered_
* #### Logging
	* _logging-events_

## System services
- ordering system
- payment system
- delivery system
- notification system
- logging system
- mobile application
- email

## Cycle flow 
* order is "created" via a RESTful endpoint to the ordering system
* ordering system calls the payment gateway to get the paymentUrl and returns back to the user
* order system sends to notification topic that order is "create" with paymentUrl "https://created"
* order system sends to logging topic that order is "create" with orderId
* notification system sends to user phone number and email that order is created and paymenturl is "https://created"
* user makes the payment to the payment system
* payment system pushes to the notification topic that "payment has been made successfully for orderId x"  (**producer to "notification" topic**)
* payment system pushes to the logging topic the paymentId   (**producer to "logging" topic**)
* notification system sends to the user phone and email that the payment is made successfully
* order system receives the notification from the notification topic that the payment is made successfully (**consumer to "payment" topic**)
* order system updates the order by id to be "readyToShip"
* order system sends to notification topic that order status is now "readyToShip" (**producer to "notification" topic**)
* order system sends to logging topic that order is "readyToShip" with orderId  (**producer to "logging" topic**)
* notification system sends to user email and phone number that the order status is now  "readyToShip"
* Delivery system pulls from notification topic that there's an order with status "readyToShip" and ACKs to the topic that it has received the order  (**consumer to "order" topic**)
* order system updates the order status to "shipping"
* order system sends to logging topic that order is "shipping" with orderId
* order system sends to notification topic that the order with id x status is "shipping"
* notification system sends to user phone number and email that their order is "shipping"
* delivery system updates the order status to "shipped" via RESTful API endpoint
* order system updates the order status to "shipped"
* order system sends to logging topic that order is "shipped" with orderId
* order system sends to notification topic that order status is "shipped"
* notification system sends to user email and phone number that their order is "shipped"
* delivery system updates the order status to "delivered" via RESTful API endpoint
* order system updates the order status to "delivered"
* order system sends to logging topic that order is "delivered" with orderId
* order system sends to notification topic that order status is "delivered"
* notification system sends to user email and phone number that their order is "delivered"

## System service identities
* Ordering system: producer and consumer: multiple instances in the same consumer group so that no two orders are created
* Payment system: producer: multiple instances in the same consumer group so that the payment is not made twice
* Delivery system: producer and consumer
* notification system: producer
* mobile application: consumer 
* email: consumer 
* mobile and email cannot be on the same consumer group as they'll need to consume messages individually

* ## Kafka topics interested parties
	* #### _orders-created_
		* ##### Producers:
			* Order system
		* #### Consumers
			* Notification system
	* #### _orders-ready-to-ship_
		* ##### Producers:
			* Order system
		* #### Consumers
			* Notification system
	* #### _orders-shipping_
		* ##### Producers:
			* Order system
		* #### Consumers
			* Notification system
	* #### _orders-shipped_
		* ##### Producers:
			* Order system
		* #### Consumers
			* Notification system
	* #### _orders-delivered
		* ##### Producers:
			* Order system
		* #### Consumers
			* Notification system

* ### Payments
	* ~~Payments should not be its own topic as interactions with payment gateways do neither tolerate latency, nor loose error handling.~~
	* But since the Notification topic is cancelled, we'll now use the payment topic to notify the user
	* #### _payments-created_
		* ##### Producers:
			* Payment system
		* ##### Consumers
			* Notification system
	* #### _payments-made_		
		* ##### Producers:
			* Payment system
		* ##### Consumers
			* Notification system
	

* ### Notification
	* For our specific use case, a notification topic would be an overkill, since other events will do very similar logic, i.e sending notifications for the email and mobile number of the user
	* #### ~~_notification-events~~
		* ##### ~~Producers~~:
			* ~~Order system~~
			* ~~Payment system~~
			* ~~Delivery system~~
		* #### ~~Consumers~~
			* ~~Notification system~~


* ### Delivery
	* #### _delivery-shipping_
		* ##### Producers:
			* Delivery system: to update the order status, message queues to achieve loose coupling 
		* #### Consumers
			* Order system
			* Notification system
	* #### _delivery-shipped_
		* ##### Producers:
			* Delivery system
		* #### Consumers
			* Order system
			* Notification system
	* #### _delivery-delivered
		* ##### Producers:
			* Delivery system
		* #### Consumers
			* Order system
			* Notification system


* ### Logging
	* #### _logging-events
		* ##### Producers:
			* Ordering system
			* Payment system
			* Delivery system
			
		* #### Consumers_
			* Logging system



## Interested parties by stage
1- payment service receives a payment request with the orderId, mobile and email are interested in that event
(this is not correct as payments are created from the order service via an api request, but only for demo purposes, let's assume that's the case: payment object is created in the ordering service ) 	 
2- mobile and email are interested in that event
3- order service receives the payment status with paymentId, mobile and email are interested in that event
4- delivery, mobile, email
5- order service: to update order status, mobile, email
6- order service: to update order status, mobile, email
7- order service: to update order status, mobile, email


## Infra and resources
* 7 micorservices
* 11 topics
* 2 consumer groups: Order system, and Payment system
	* calls for K8s replicaset of 2
* Default replication factor of 3, calls for 3 Kafka brokers 
* 


I'll need a K8s deployment resource with:
* Two replicaSets for the Order system and the payment gateway system
	* one microservice for order system
	* one microservice for payment gateway system
* 3 kafka brokers
* One ZooKeeper instance
* manually create 11 topics
* 5 other microservices
* expose the Zookeeper port 
* expose the kafka broker port 
* 1 API endpoint to create the order
* 1 API endpoint to make the payment
* 

steps 
* create zookeeper deployment and service yaml from confluent 
* create kafka deployment and service
* manually creating kafka topics
* Deploying microservices
	* create deployment and service yaml files
	* deploy microservices using kubectl apply -f
* Expose ports
	* expose zookeeper port 2181
	* expose kafka port 9092








