import { Navigate } from "react-router-dom";

const StudentPrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

export default StudentPrivateRoute;
