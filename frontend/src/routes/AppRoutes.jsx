import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import GlobalLayout from "../layouts/GlobalLayout";
import HomePage from "../pages/HomePage";
import Dashboard from "../pages/DashBoard";
import Resumes from "../pages/Resumes";
import Interviews from "../pages/Interviews";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import PrivateRoute from "./PrivateRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
