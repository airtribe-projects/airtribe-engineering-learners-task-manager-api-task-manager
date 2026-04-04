Smart Parking Lot Backend

A Node.js + Express backend system for managing a multi-floor smart parking lot.

The system supports:

Vehicle check-in and check-out
Automatic parking spot allocation
Parking fee calculation
Real-time parking spot availability
PostgreSQL integration with Sequelize ORM


Features
Allocate parking spots based on vehicle type
Support for:
Motorcycle
Car
Bus
Generate parking tickets
Calculate parking charges based on duration
Release parking spots on exit
View currently available parking spots

Tech Stack
Node.js
Express.js
PostgreSQL
Sequelize ORM
dotenv
nodemon

Running the Project
npm run dev
Database connected
Server running on port 3000

API Endpoints
1. Check In Vehicle
 POST /api/parking/checkin
2. Check Out Vehicle
 POST /api/parking/checkout
3. Get Available Parking Spots
 GET /api/parking/availability

Parking Rules
Vehicle Type	Allowed Parking Spot
MOTORCYCLE	    MOTORCYCLE,COMPACT,LARGE
CAR	            COMPACT,LARGE
BUS	            LARGE

Fee Calculation
Formula: pricing.baseFee + hours * pricing.hourlyRate