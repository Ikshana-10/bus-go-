# 🚌 BusGo – Smart Bus Ticket Booking System

BusGo is a modern and user-friendly **online bus ticket booking system** that allows users to search buses, compare routes, select seats, enter passenger details, make a simulated payment, and generate a digital bus ticket with a QR code.

The project is designed as a complete travel-booking application suitable for **college projects, internship demonstrations, and real-world application development**.

---

## 🚀 Features

### 👤 User Authentication

* User registration and login
* Google Sign-In
* Forgot password
* User profile management
* Secure Firebase Authentication

### 🔍 Bus Search

* Search buses using:

  * From location
  * Destination
  * Journey date
  * Number of passengers
* Swap source and destination
* Search available buses
* Filter and sort bus results

### 🚌 Bus Information

Each bus displays:

* Bus operator
* Bus number
* Bus type
* AC / Non-AC
* Sleeper / Seater
* Departure time
* Arrival time
* Journey duration
* Boarding point
* Dropping point
* Ticket price
* Available seats
* Rating

### 💺 Interactive Seat Selection

* Visual bus seat layout
* Available seats
* Selected seats
* Already booked seats
* Multiple-seat selection
* Automatic fare calculation
* Prevents selection of unavailable seats

### 👨‍👩‍👧 Passenger Management

Passenger details include:

* Full name
* Age
* Gender
* Phone number
* Email
* Seat number

### 💳 Payment

The project includes a **demo payment system** supporting:

* UPI
* Credit Card
* Debit Card
* Net Banking

> Real-money transactions are not required for the demonstration.

### 🎫 Digital Ticket

After successful booking, the system generates a digital ticket containing:

* Booking ID
* Passenger details
* Bus details
* Source and destination
* Journey date
* Seat number
* Boarding point
* Dropping point
* Ticket amount
* QR code
* Booking status

### 📱 My Tickets

Users can:

* View upcoming journeys
* View completed journeys
* View cancelled tickets
* View ticket details
* Download/print tickets
* Cancel bookings

### 📍 Bus Tracking

The application provides a bus tracking interface showing:

* Current location
* Destination
* Route progress
* Intermediate stops
* Estimated arrival

For demonstration purposes, tracking can use simulated data.

### 🤖 BusGo AI Assistant

An AI travel assistant helps users with queries such as:

* "Which is the cheapest bus?"
* "What buses are available from Chennai to Coimbatore?"
* "What are the boarding points?"
* "Which bus has the shortest journey?"

The AI should use available application data and should not invent bus availability or prices.

### 🛠️ Admin Dashboard

Administrators can:

* Add buses
* Edit buses
* Delete buses
* Manage routes
* Manage locations
* View users
* View bookings
* Manage seat availability
* View revenue
* View booking statistics

---

## 🏗️ System Workflow

```text
User Login
    ↓
Home Page
    ↓
Enter From / To / Date
    ↓
Search Available Buses
    ↓
Select Bus
    ↓
View Bus Details
    ↓
Select Seats
    ↓
Enter Passenger Details
    ↓
Payment
    ↓
Booking Confirmation
    ↓
Generate Digital Ticket
    ↓
QR Code
    ↓
My Tickets
```

---

## 🗺️ Route Management

BusGo uses a route-based search system.

Example:

```text
Chennai
   ↓
Tambaram
   ↓
Villupuram
   ↓
Salem
   ↓
Coimbatore
```

Users can select an origin and destination, and the system displays buses operating on the selected route.

Locations can contain:

```text
locationId
city
state
latitude
longitude
busStandName
```

---

## 🗄️ Database Structure

Firebase Firestore can contain the following collections:

```text
users
buses
routes
locations
bookings
passengers
payments
notifications
```

### Example Bus Document

```json
{
  "busId": "BUS001",
  "operatorName": "ABC Travels",
  "busNumber": "TN38AB1234",
  "busType": "AC Sleeper",
  "source": "Chennai",
  "destination": "Coimbatore",
  "departureTime": "22:00",
  "arrivalTime": "05:30",
  "price": 750,
  "totalSeats": 40,
  "availableSeats": 18
}
```

### Example Booking Document

```json
{
  "bookingId": "BUSGO-2026-8F42K",
  "userId": "USER001",
  "busId": "BUS001",
  "source": "Chennai",
  "destination": "Coimbatore",
  "journeyDate": "2026-09-20",
  "seats": ["A3", "A4"],
  "totalAmount": 1500,
  "paymentStatus": "SUCCESS",
  "bookingStatus": "CONFIRMED"
}
```

---

## 🛠️ Technologies Used

### Frontend

* React
* TypeScript
* Tailwind CSS
* HTML5
* CSS3
* JavaScript

### Backend / Database

* Firebase Authentication
* Firebase Firestore
* Firebase Storage

### AI

* Google Gemini API
* Google AI Studio

### Other Technologies

* QR Code generation
* Responsive UI
* Route/location management
* Simulated payment system

---

## 📂 Project Structure

```text
BusGo/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── Header
│   │   ├── BusCard
│   │   ├── SeatLayout
│   │   ├── Ticket
│   │   └── RouteMap
│   │
│   ├── pages/
│   │   ├── Home
│   │   ├── Login
│   │   ├── Signup
│   │   ├── SearchBuses
│   │   ├── BusDetails
│   │   ├── SeatSelection
│   │   ├── PassengerDetails
│   │   ├── Payment
│   │   ├── Ticket
│   │   ├── MyBookings
│   │   ├── TrackBus
│   │   └── AdminDashboard
│   │
│   ├── firebase/
│   │   ├── config
│   │   ├── auth
│   │   └── firestore
│   │
│   ├── services/
│   │   ├── bookingService
│   │   ├── busService
│   │   └── aiService
│   │
│   ├── data/
│   │   └── demoData
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── .env
├── package.json
├── README.md
└── .gitignore
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/busgo.git
```

### 2. Navigate to the Project

```bash
cd busgo
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Firebase

Create a Firebase project and enable:

* Authentication
* Google Authentication
* Firestore Database

Add your Firebase configuration to the project's environment variables.

Example:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 5. Run the Application

```bash
npm run dev
```

The application will start on the local development server.

---

## 🔐 Security

The application should implement:

* Firebase Authentication
* Protected user routes
* Protected admin routes
* Firestore security rules
* User-specific booking access
* Secure environment variables
* No API keys committed to GitHub

---

## 📊 Demo Data

The application can include demo routes such as:

| From       | To         |
| ---------- | ---------- |
| Chennai    | Coimbatore |
| Chennai    | Madurai    |
| Chennai    | Salem      |
| Chennai    | Trichy     |
| Coimbatore | Chennai    |
| Madurai    | Chennai    |
| Salem      | Bengaluru  |
| Trichy     | Chennai    |

Demo buses should contain different operators, prices, timings, bus types, and seat availability.

---

## 🎯 Project Objectives

* Provide a simple online bus booking experience
* Reduce manual ticket-booking processes
* Enable convenient seat selection
* Provide digital tickets with QR codes
* Maintain booking information digitally
* Provide route and bus tracking
* Provide an admin management system
* Demonstrate AI-assisted travel recommendations

---

## 🔮 Future Enhancements

* Real-time GPS bus tracking
* Real payment gateway integration
* Live traffic integration
* Automated SMS and email notifications
* Cancellation and refund automation
* Dynamic pricing
* Advanced AI travel recommendations
* Multi-language support
* Mobile application
* Driver/operator application
* Real-time seat synchronization

---

## 📸 Application Modules

```text
🏠 Home
🔐 Authentication
🔎 Bus Search
🚌 Bus Details
💺 Seat Selection
👤 Passenger Details
💳 Payment
🎫 Digital Ticket
📱 My Tickets
📍 Bus Tracking
🤖 AI Assistant
⚙️ Admin Dashboard
```

---

## 👨‍💻 Project Type

**BusGo – Smart Bus Ticket Booking System**

Developed as an internship/academic project to demonstrate:

* Web application development
* Database integration
* Authentication
* Booking management
* UI/UX design
* AI integration
* Cloud services
* Real-world software development concepts

---

## 📄 License

This project is developed for educational and demonstration purposes.

```

You can save the above directly as **`README.md`** in your GitHub BusGo repository.
```

