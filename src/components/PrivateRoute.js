// components/PrivateRoute.js
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('access'); // or any token logic

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
