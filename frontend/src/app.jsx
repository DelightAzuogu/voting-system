import React, { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import AdminLayout from "./layouts/Admin.js";
import InstructorLayout from "./layouts/Instructor.jsx";
import Auth from "./layouts/Auth";
import StudentLayout from "./layouts/Student.jsx";

const App = () => {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  // Logout handler
  const logoutHandler = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuth(false);
  };

  function setAuthAndRole(auth, role) {
    setRole(role);
    setIsAuth(auth);
  }

  if (isAuth && role) {
    // For the admin
    if (role === "admin") {
      return (
        <Routes>
          <Route
            path="/admin/*"
            element={<AdminLayout logout={logoutHandler} />}
          />
          <Route
            path="*"
            element={<Navigate to="/admin/create-poll/" replace />}
          />
        </Routes>
      );
    }
    // For the student
    else if (role === "student") {
      return (
        <Routes>
          <Route
            path="/student/*"
            element={<StudentLayout logout={logoutHandler} />}
          />
          <Route
            path="*"
            element={<Navigate to="/student/create-poll" replace />}
          />
        </Routes>
      );
    }
    // For the instructor
    else if (role === "instructor") {
      return (
        <Routes>
          <Route
            path="/instructor/*"
            element={<InstructorLayout logout={logoutHandler} />}
          />
          <Route
            path="*"
            element={<Navigate to="/instructor/create-poll" replace />}
          />
        </Routes>
      );
    }
  } else {
    return (
      <Routes>
        <Route path="/login" element={<Auth setIsAuth={setAuthAndRole} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }
};

export default App;
