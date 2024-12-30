
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while checking authentication
  }

  if (!user || !user.emailVerified) {
    // Redirect to login page if not authenticated
    return <Navigate to="/auth" />;
  }


  return children;
};

export default PrivateRoute;