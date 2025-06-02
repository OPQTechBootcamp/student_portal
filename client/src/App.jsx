import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import StudentPrivateRoute from "./components/StudentPrivateRoute"
import AdminPrivateRoute from "./components/AdminPrivateRoute"
// Lazy-loaded pages
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminStudentDetails = lazy(() => import("./pages/AdminStudentDetails"));
const HomePage = lazy(() => import("./pages/HomePage"));

function App() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Student Routes */}
          <Route path="/dashboard" element={<StudentPrivateRoute><Dashboard /></StudentPrivateRoute>} />
          <Route path="/edit-profile/:id" element={<StudentPrivateRoute><EditProfile /></StudentPrivateRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminPrivateRoute><AdminDashboard /></AdminPrivateRoute>} />
          <Route path="/admin/student/:id" element={<AdminPrivateRoute><AdminStudentDetails /></AdminPrivateRoute>} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
}

export default App;
