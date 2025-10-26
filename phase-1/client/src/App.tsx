import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import NotFoundPage from "./pages/not-found/NotFoundPage";
import EquipmentList from "./pages/equipment-list/EquipmentList";
import Requests from "./pages/requests/Requests";
import Signup from "./pages/sign-up/SignUp";

const App: React.FC = () => {
  return (
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<Signup />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/equipment-list" element={<EquipmentList />} />
              <Route path="/requests" element={<Requests />} />
          </Route>

          {/* Redirect unknown routes */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
  );
};

export default App;
