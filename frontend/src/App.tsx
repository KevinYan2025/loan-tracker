import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './contexts/PrivateRoute';
import './App.css';
import Login from './pages/Auth';
import Home from './pages/Home';
import { AuthProvider } from './contexts/AuthProvider';

function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Login />} />
        {/* <Route path="/register" element={Register} /> */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;