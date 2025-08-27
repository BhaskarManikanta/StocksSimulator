# Stock Price Alert System (Backend)

**Backend Only** – Real-Time Stock Monitoring & Alerts using Kafka, Node.js, and MongoDB  

---

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
  - [General](#general)
  - [User Features](#user-features)
  - [Admin Features](#admin-features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Installation & Setup](#installation--setup)
- [API Endpoints](#api-endpoints)
- [Future Improvements](#future-improvements)

---

## Project Overview

This project is a **real-time stock monitoring backend system** that allows users to set price thresholds for stocks. When stock prices cross user-defined thresholds, email notifications are sent automatically. Admins can dynamically manage stock symbols and monitor thresholds. Apache Kafka is used to stream live stock prices, while MongoDB persists user and threshold data. The system supports **role-based authentication** with JWT and secure password hashing.

---

## Features

### General
- Real-time streaming of stock prices using **Kafka producers and consumers**.
- **Role-based authentication** (admin/user) with JWT tokens.
- Persistent storage of **users, thresholds, and stock symbols** in MongoDB.
- Email notifications when stock price exceeds a user-defined threshold.
- Secure password hashing using **bcrypt**.
- Dockerized setup for Kafka and Kafka UI integration.

### User Features
- Sign up and log in with email/password.
- Add price thresholds for specific stocks.
- View all thresholds created by the user.
- Update or delete thresholds.
- Receive email alerts when thresholds are exceeded.

### Admin Features
- Add new stock symbols dynamically.
- Update existing stock symbols.
- Delete stock symbols.
- View all thresholds for monitoring purposes.
- Full access to manage users and thresholds if needed.

---

## Tech Stack

- **Backend:** Node.js, Express  
- **Database:** MongoDB, Mongoose  
- **Message Broker:** Apache Kafka (multiple brokers supported)  
- **Email:** Nodemailer  
- **Authentication:** JWT, bcrypt  
- **Containerization & Monitoring:** Docker, Kafka UI  

---

## Architecture Overview

1. **Kafka Producer**  
   - Simulates or streams live stock prices for multiple stock symbols.  

2. **Kafka Consumer**  
   - Consumes stock prices and compares them with user-defined thresholds.
   - Sends email notifications if any threshold is crossed.  

3. **Express API**  
   - User routes: signup, login, add/update/delete thresholds.  
   - Admin routes: manage stock symbols and thresholds.  
   - Protected by **JWT-based authentication** and **role-based access control**.  

4. **MongoDB**  
   - Stores user credentials, stock thresholds, and stock symbols.  

5. **Email Service**  
   - Sends alerts to users when a stock crosses their threshold.

---

## Installation & Setup

# 1. Clone the repository
git clone https://github.com/yourusername/stock-price-alert-backend.git

# 2. Install dependencies
npm install

# 3. Set up MongoDB and Kafka using Docker
# Create a file named docker-compose.yml with the following content:
cat <<EOL > docker-compose.yml
version: '3.8'

services:
  kafka:
    image: bitnami/kafka:latest
    container_name: kafka
    ports:
      - "9092:9092"
    environment:
      - KAFKA_CFG_NODE_ID=1
      - KAFKA_CFG_PROCESS_ROLES=broker,controller
      - KAFKA_CFG_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093
      - KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092
      - ALLOW_PLAINTEXT_LISTENER=yes

  kafka-ui:
    image: provectuslabs/kafka-ui:latest
    container_name: kafka-ui
    ports:
      - "8080:8080"
    environment:
      - KAFKA_CLUSTERS_0_NAME=local-cluster
      - KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS=kafka:9092
      - KAFKA_CLUSTERS_0_READONLY=false
      - KAFKA_CLUSTERS_0_TOPIC_AUTO_CREATE=true
EOL

# Start Kafka and Kafka UI
docker-compose up -d

# 4. Configure environment variables
# Create a .env file in the project root with the following content:
cat <<EOL > .env
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
EMAIL_USER=<your-email>
EMAIL_PASS=<your-email-app-password>
EOL

# 5. Start the backend server
npm start

# 6. Start Kafka producer to simulate stock prices
node services/producer.js

# 7. Start Kafka consumer to handle alerts
node services/consumer.js
