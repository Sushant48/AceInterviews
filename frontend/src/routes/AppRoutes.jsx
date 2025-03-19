import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import GlobalLayout from "../layouts/GlobalLayout";
import PrivateRoute from "./PrivateRoute";

import HomePage from "../pages/HomePage";
import Dashboard from "../pages/DashBoard";
import Resumes from "../pages/Resumes";
import Interviews from "../pages/Interviews";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import PerformanceMetrics from "../pages/PerformanceMetrics";
import RealTimeInterview from "../pages/RealtimeInterview";
import Profile from "@/pages/ProfilePage";
import ProfilePicture from "@/pages/ProfilePicture";
import ChangePassword from "@/pages/ChangePassword";
import InterviewDetails from "@/pages/InterviewDetails";
import MockInterview from "@/pages/MockInterview";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<GlobalLayout />}>
        
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<PrivateRoute />}>
          <Route index element={<HomePage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="mock-interview" element={<MockInterview />} />
          <Route path="interview/:id" element={<InterviewDetails />} />
          <Route path="profile-picture" element={<ProfilePicture />} />
          <Route path="home" element={<HomePage />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="resumes" element={<Resumes />} />
          <Route path="interviews" element={<Interviews />} />
          <Route path="performanceMetrics" element={<PerformanceMetrics />} />
          <Route path="realTimeInterview" element={<RealTimeInterview />} />
          </Route>
          
        </Route>
        

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
