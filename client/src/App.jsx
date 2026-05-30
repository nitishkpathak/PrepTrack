import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import {useEffect, } from "react";
import { jwtDecode } from "jwt-decode";

import Home from "./pages/Home";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Questions from "./pages/Questions";
import Stats from "./pages/Stats";
import Settings from "./pages/Settings";


import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  const token =
    localStorage.getItem(
      "token"
    );

  useEffect(() => {

    if (token) {

      try {

        // Decode Token
        const decoded =
          jwtDecode(token);

        // Current Time
        const currentTime =
          Date.now() / 1000;

        // Check Token Expiry
        if (

          decoded.exp <
          currentTime

        ) {

          // Remove Expired Data
          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "user"
          );

          // Redirect Login
          window.location.href =
            "/login";

        } else {

          // Current Path
          const path =
            window.location.pathname;

          // Auto Login
          if (

            path === "/" ||

            path === "/login" ||

            path === "/register"

          ) {

            window.location.href =
              "/dashboard";
          }
        }

      } catch (error) {

        console.log(error);

        // Invalid Token
        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );

        window.location.href =
          "/login";
      }
    }

  }, [token]);

  return (

    <BrowserRouter>

      <main>
      
      <Routes>

        {/* Default Route */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Public */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Protected */}
        <Route

          path="/dashboard"

          element={

            <ProtectedRoute>

              <Dashboard />

            </ProtectedRoute>

          }

        />

        <Route

          path="/questions"

          element={

            <ProtectedRoute>

              <Questions />

            </ProtectedRoute>

          }

        />

        <Route

          path="/stats"

          element={

            <ProtectedRoute>

              <Stats />

            </ProtectedRoute>

          }

        />

        <Route

          path="/settings"

          element={

            <ProtectedRoute>

              <Settings />

            </ProtectedRoute>

          }

        />

        <Route
  path="*"
  element={
    <h1
      className="
        text-center
        text-3xl
        mt-20
      "
    >
      404 Page Not Found
    </h1>
  }
/>
      

      </Routes>

      </main>

    </BrowserRouter>

  );
}

export default App;