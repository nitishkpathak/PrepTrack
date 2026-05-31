# 🚀 PrepTrack

PrepTrack is a full-stack (MERN) web application designed for students and developers to track their Data Structures & Algorithms (DSA) preparation. It enables users to record questions, write study notes, manage problem-solving states, track streaks, and visualize their preparation progress.

## 🌐 Live Demo

*   **Frontend**: [https://preptrack.vercel.app](https://preptrack.vercel.app)
*   **Backend**: [https://preptrack-kpjk.onrender.com](https://preptrack-kpjk.onrender.com)

---

## ✨ Features

*   **User Authentication (Register/Login)**: Fast, instant registration without OTP constraints.
*   **Dashboard Overview**: View daily problem-solving stats and streaks at a glance.
*   **Questions CRUD**: Easily add, view, update, and delete DSA problems.
*   **Status Tracking**: Group questions into *Solved*, *Pending*, and *Revision* states.
*   **Favorites System**: Bookmark important questions for quick revision.
*   **Daily Streak Tracking**: Build and maintain consistency with automated daily streak counts.
*   **Progress Statistics**: Visualize difficulty distribution and solve progress with interactive charts.
*   **Dark/Light Theme Toggle**: Native theme switching available across the platform (including landing page).
*   **Optimized Performance**: Custom window event-driven state updates to avoid CPU overhead (replaced heavy 1s setInterval polling).
*   **Contact Form Integration**: Fully functional landing page contact form using EmailJS.

---

## 🛠️ Tech Stack

The project is structured as a monorepo consisting of two main parts:

### 💻 Frontend (`client/`)
*   **Framework**: React 19 initialized with Vite
*   **Routing**: React Router DOM v7
*   **Styling**: Tailwind CSS v4.0 with PostCSS
*   **State & HTTP**: Axios for API calls, LocalStorage for session/auth token storage
*   **Data Visualization**: Recharts for analytics pie & bar charts
*   **Icons & UI Elements**: Lucide React & React Hot Toast

### ⚙️ Backend (`server/`)
*   **Runtime & Server**: Node.js & Express.js
*   **Database**: MongoDB using Mongoose ORM
*   **Security & Authentication**: bcryptjs for password hashing, JSON Web Tokens (JWT) for stateless authentication

### ☁️ Deployment
*   **Frontend**: Vercel
*   **Backend**: Render

---

## 📂 Project Structure

```text
PrepTrack/
├── client/
│   ├── src/
│   │   ├── assets/           # Static assets/images
│   │   ├── components/       # Reusable React components
│   │   │   ├── DifficultyChart.jsx  # Recharts pie chart for question difficulty
│   │   │   ├── FilterBar.jsx        # Searching and filtering controls
│   │   │   ├── ProgressChart.jsx    # Progress tracking visualization
│   │   │   ├── ProtectedRoute.jsx   # Auth guard for client-side pages
│   │   │   ├── Sidebar.jsx          # Collapsible navigation drawer (Optimized event-driven updates)
│   │   │   ├── StatsCards.jsx       # Overview statistics cards
│   │   │   ├── StreakCard.jsx       # Daily solve streak card
│   │   │   └── ThemeToggle.jsx      # Theme switcher (Light/Dark mode)
│   │   ├── context/          # Context providers
│   │   ├── pages/            # Application views (Home, Login, Register, Dashboard, Stats, Settings)
│   │   ├── routes/           # Router-related utilities
│   │   ├── services/         # API clients (authService, questionService, userService)
│   │   ├── App.jsx           # Main routing configuration and auto-login logic
│   │   ├── index.css         # Global stylesheet & Tailwind directives
│   │   └── main.jsx          # Frontend application entry point
│   ├── package.json          # Node dependencies for frontend
│   └── vite.config.js        # Vite configuration
│
└── server/
    ├── config/
    │   └── db.js             # Mongoose connection logic
    ├── controllers/
    │   ├── authController.js     # Signup, Login, and Auth flow controller
    │   ├── questionController.js # Question CRUD & Streak updating logic
    │   └── userController.js     # User profile retrieval and modification
    ├── middleware/
    │   └── authMiddleware.js # Express route guard using JWT validation
    ├── models/
    │   ├── Question.js       # Question Schema definitions
    │   └── User.js           # User Schema definitions
    ├── routes/
    │   ├── authRoutes.js     # Endpoints for authentication
    │   ├── questionRoutes.js # Endpoints for question CRUD
    │   └── userRoutes.js     # Endpoints for profile updates
    ├── server.js             # Server entry point
    └── package.json          # Node dependencies for backend
```

---

## 📸 Screenshots

### Home Page
<img width="1351" height="598" alt="image" src="https://github.com/user-attachments/assets/2573cd21-f1eb-41e0-a282-ab547acb209b" />

### Dashboard
<img width="1350" height="596" alt="image" src="https://github.com/user-attachments/assets/05eef2d0-17a3-4a1d-bc1d-c5d53b569cf3" />
<img width="1350" height="594" alt="image" src="https://github.com/user-attachments/assets/08288be9-cc18-4e2c-b294-070f3a076782" />
<img width="1353" height="595" alt="image" src="https://github.com/user-attachments/assets/7b8fe559-fd8b-48a2-922f-aa8612723657" />

### Stats Page
<img width="1349" height="601" alt="image" src="https://github.com/user-attachments/assets/0cab9c83-6624-46ec-a65d-32ff2576dee9" />

---

## ⚙️ Installation

### 1. Clone Repository
```bash
git clone https://github.com/nitishkpathak/PrepTrack.git
cd PrepTrack
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```

### 3. Backend Setup
```bash
cd ../server
npm install
npm run dev
```

---

## 🔮 Future Improvements

*   **Heatmap Calendar**: GitHub-style activity contribution graph to track consistency.
*   **Notes Feature**: In-app code editor or markdown pad for question notes.
*   **Weekly Progress Graphs**: Visual representation of weekly solve history.
*   **Profile Image Upload**: Native support or Cloudinary integration for custom profile images.
*   **AI-Based DSA Roadmap**: AI assistant to recommend next problems to solve.

---

## 👨‍💻 Author

**Nitish Kumar Pathak**
*   **GitHub**: [https://github.com/nitishkpathak](https://github.com/nitishkpathak)
*   **LinkedIn**: [https://www.linkedin.com/in/nitishkpathak](https://www.linkedin.com/in/nitishkpathak) *(Replace with your actual handle link if different)*

⭐ **If you like this project, consider giving it a star!**
