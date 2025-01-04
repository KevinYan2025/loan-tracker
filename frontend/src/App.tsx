import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './contexts/PrivateRoute';
import './App.css';
import Login from './pages/Auth';
import Home from './pages/Home';
import { AuthProvider } from './contexts/AuthProvider';
import LoanDetail from './component/LoanDetail';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/auth" element={<Login />} />

          {/* Private Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/loans/:id"
            element={
              <PrivateRoute>
                <LoanDetail />
              </PrivateRoute>
            }
          />

          {/* Fallback Route for 404 */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
