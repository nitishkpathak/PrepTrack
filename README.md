# 🚀 PrepTrack

PrepTrack is a full-stack (MERN) web application designed for students and developers to track their Data Structures & Algorithms (DSA) preparation. It enables users to record questions, write study notes, manage problem-solving states, track streaks, and visualize their preparation progress.

## 🌐 Live Demo

*   **Frontend**: [https://prep-track-blue.vercel.app/](https://prep-track-blue.vercel.app/)
*   **Backend**: [https://preptrack-kpjk.onrender.com](https://preptrack-kpjk.onrender.com)

---

## ✨ Features

*   **User Authentication (Register/Login)**: Fast, instant registration without OTP constraints.
*   **Modular Dashboard & Questions**: Refactored layouts using modular components (`QuestionForm` and `QuestionList`) for high readability.
*   **Enhanced DSA Form**: Support for manual DSA entries and automated scraper fetching to parse problem descriptions directly from LeetCode, GFG, Codeforces, etc.
*   **Study Target Preferences**: Customize your daily practice target (questions/day) and preferred platform from the Settings panel.
*   **Daily Goal Tracker**: Monitor today's practice progress vs. daily goal directly inside the Streak Card with visual percentage indicators.
*   **Quick Practice Shortcut**: One-click launcher button dynamically rendered in the Dashboard header pointing to your preferred practice platform.
*   **Dedicated Profile Page**: A sleek, full-page workspace linked from the sidebar to view details and modify avatars, names, roles, and bios.
*   **Security & Data Control**: Secure change password form and database wipe options under Settings.
*   **Optimized Performance**: Replaced sequential blocking API calls with concurrent `Promise.all` requests and smooth skeleton loading indicators for faster page loads.
*   **Dark/Light Theme Toggle**: Native theme switching integrated directly inside the sidebar footer.
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
│   │   ├── pages/            # Application views (Home, Login, Register, Dashboard, Stats, Profile, Settings)
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
<img width="1352" height="596" alt="image" src="https://github.com/user-attachments/assets/6615a074-c28d-4181-b9be-8ce481cf9467" />
<img width="1352" height="596" alt="image" src="https://github.com/user-attachments/assets/26664ab2-dbff-4c29-90c6-8dff82cbf7b4" />

### Stats Page
<img width="1348" height="600" alt="image" src="https://github.com/user-attachments/assets/ca891424-1b96-40eb-8856-303686932ec3" />
<img width="1349" height="598" alt="image" src="https://github.com/user-attachments/assets/4124f306-a81b-4d8d-97ef-b30751a0fdca" />


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
