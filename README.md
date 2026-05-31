# 🚀 PrepTrack

PrepTrack is a full-stack DSA Progress Tracking Platform designed to help students and developers organize coding questions, track progress, maintain streaks, and analyze their preparation journey.

## 🌐 Live Demo

Frontend: https://preptrack.vercel.app

Backend: https://preptrack-kpjk.onrender.com

## ✨ Features

* User Authentication (Register/Login)
* Dashboard Overview
* Questions CRUD (Create, Read, Update, Delete)
* Track Solved, Pending, and Revision Questions
* Favorites System
* Daily Streak Tracking
* Progress Statistics
* Dark/Light Theme Toggle
* Responsive Design
* Contact Form Integration
* Mobile-Friendly Navigation

## 🛠️ Tech Stack

🛠️ Technology Stack
The project is structured as a monorepo consisting of two main parts: client and server.

Frontend (client/)
Framework: React 19 initialized with Vite
Routing: React Router DOM v7
Styling: Tailwind CSS v4.0 with PostCSS
State & HTTP: Axios for API calls, local storage for authentication tokens
Data Visualization: Recharts for analytics charts
Icons & Notifications: Lucide React and React Hot Toast
Utilities: jwt-decode for parsing JWT tokens, date-fns for date formatting

Backend (server/)
Runtime & Server: Node.js & Express v5.2
Database: MongoDB using Mongoose ORM
Security & Authentication: bcryptjs for password hashing, jsonwebtoken for stateless auth
Mail Dispatch: nodemailer for email verification and password recovery
Development Utilities: nodemon for hot-reloadin

### Deployment

* Vercel (Frontend)
* Render (Backend)

## 📸 Screenshots

### Home Page

<img width="1351" height="598" alt="image" src="https://github.com/user-attachments/assets/2573cd21-f1eb-41e0-a282-ab547acb209b" />


### Dashboard

<img width="1350" height="596" alt="image" src="https://github.com/user-attachments/assets/05eef2d0-17a3-4a1d-bc1d-c5d53b569cf3" />
<img width="1350" height="594" alt="image" src="https://github.com/user-attachments/assets/08288be9-cc18-4e2c-b294-070f3a076782" />
<img width="1353" height="595" alt="image" src="https://github.com/user-attachments/assets/7b8fe559-fd8b-48a2-922f-aa8612723657" />



### Stats Page

<img width="1349" height="601" alt="image" src="https://github.com/user-attachments/assets/0cab9c83-6624-46ec-a65d-32ff2576dee9" />


## 📂 Project Structure

PrepTrack/
├── client/
│ ├── src/
│ └── public/
├── server/
│ ├── controllers/
│ ├── routes/
│ ├── models/
│ └── middleware/
└── README.md

## ⚙️ Installation

### Clone Repository

git clone https://github.com/nitishkpathak/PrepTrack.git

### Frontend Setup

cd client
npm install
npm run dev

### Backend Setup

cd server
npm install
npm run dev

## 🔮 Future Improvements

* Search & Filter Questions
* Notes Feature
* Weekly Progress Charts
* Heatmap Calendar
* Profile Image Upload
* AI-Based DSA Roadmap

## 👨‍💻 Author

Nitish Kumar Pathak

GitHub: https://github.com/nitishkpathak

LinkedIn: Add your LinkedIn profile link here

⭐ If you like this project, consider giving it a star!
