import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthProvider";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const authContext = useAuth();
  const Navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    if (authContext.user) {
      Navigate("/");
    }
  },[authContext.user, Navigate]);

  const handleFormDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLogin) {
      await authContext.handleEmailLogin(formData.email, formData.password);
    } else {
      await authContext.handleEmailSignup(formData.email, formData.password);
    }
  };

  const handleGoogleLogin = async () => {
    await authContext.handleGoogleLogin();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleFormDataChange}
          placeholder="Email"
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleFormDataChange}
          placeholder="Password"
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </form>
      {authContext.error && (
        <div className="mt-4 text-red-500">
          {authContext.error}
        </div>
      )}
      <button
        className="mt-4 text-blue-500"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? "Switch to Sign Up" : "Switch to Login"}
      </button>
      <button className="mt-4 bg-red-500 text-white p-2 rounded" onClick={handleGoogleLogin}>Google</button>
    </div>
  );
};

export default Auth;