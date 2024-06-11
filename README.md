# Pet-Keeping-Service

## Description

This project implements a web application with a backend written in Go and a frontend developed using Angular.  
The application utilizes Postgres as the database for storing data. The backend handles the business logic  
and provides RESTful APIs for communication with the frontend. The frontend is responsible for presenting  
the user interface and interacting with the backend APIs.

## About

The main functionality of the application is to act as a pet keeper service. The system allows owners to find  
and connect with keepers who can take care of their pets when they are unable to do so.

## Installation

### Backend

The backend is written in Go so you will need to have Go installed on your system.
I use docker to init the database. (more info inside /api/README.md)
Navigate to the backend directory and run the following command to install the dependencies and start the server:

```bash
docker-compose up -d
go run main.go
```

### Frontend

The frontend is written in Angular so you will need to have Node.js and npm installed on your system. (more info inside /front/README.md) 
Navigate to the frontend directory and run the following command to install the dependencies and start the server:

```bash
npm install
ng serve
```

### Features

- Admin is already created with the following credentials:
    - Username: admin
    - Password: admin
- Admin can
    - See all users
    - Delete users
    - See graphs and statistics about the users/pets/bookings

- User registration and login

- Owner can:
    - Add a pet
    - Book a keeper for a pet
    - See all bookings
    - Rate a keeper
    - Message a keeper if the booking is accepted

- Keeper can:
    - See all bookings
    - Accept or decline a booking
    - Message the owner if the booking is accepted
    - Check his rating and reviews


### User Usage

1. Open [http://localhost:4200/register](http://localhost:4200/register) to register a new user
2. Open [http://localhost:4200/login](http://localhost:4200/login) to login
3. You can use the following credentials to login as a owner/keeper:
    - Username: owner1/keeper1
    - Password: 123456
4. Browse the website and use the features

### Admin Usage

1. Open [http://localhost:4200/admin-login](http://localhost:4200/admin-login) to login as an admin
2. You can use the following credentials to login as an admin:
    - Username: admin
    - Password: admin
3. Browse the website and use the features


### Extra Features

- Order Keepers by distance or by duration with car (using Google Maps API)
- Message system between owners and keepers
- Rating system for keepers
- Its owner can have multiple pets

