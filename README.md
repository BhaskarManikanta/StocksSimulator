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

# Installation & Setup

## Prerequisites

Make sure the following are installed on your system:

- Docker Compose Plugin
- Git

Verify installation:

```bash
docker --version
docker compose version
git --version
```

---

# Clone Repositorie

```bash
git clone https://github.com/BhaskarManikanta/StocksSimulator.git
```

# Project Structure

After cloning:

```bash
project/
│
├── StocksSimulator/

```

# Environment Variables

Inside the repository:

```bash
cd StocksSimulator
```

Create `.env` file:

```env
PORT=3000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

EMAIL_USER=your_email

EMAIL_PASS=your_email_password

KAFKA_BROKER=kafka:9092
```

# Running the Application

## Start All Services

```bash
docker compose up -d
```

---

## Build & Start Services

```bash
docker compose up --build -d
```

---

## View Running Containers

```bash
docker ps
```

---

## View Logs

```bash
docker compose logs -f
```

---

## Stop Services

```bash
docker compose down
```

---

# Accessing Services

| Service | URL |
|---|---|
| Frontend | http://YOUR_EC2_PUBLIC_IP |
| Backend API | http://YOUR_EC2_PUBLIC_IP:3000 |
| Kafka UI | http://YOUR_EC2_PUBLIC_IP:8080 |

---

# Kafka UI

Kafka UI can be used to:
- Monitor Kafka topics
- Inspect producer/consumer activity
- View Kafka messages
- Debug event streams

---

# Important Notes

- Replace `YOUR_EC2_PUBLIC_IP` with your AWS EC2 public IP address.
- Ensure ports `80`, `3000`, `8080`, `9092`, and `29092` are allowed in AWS Security Groups.
- The frontend communicates with the backend through Docker networking.
