import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Video, ArrowLeft } from "lucide-react";
import axios from "axios";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import Alert from "../components/ui/Alert";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.email || !formData.password) {
      setErrorMessage("Please provide both email and password.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        formData
      );

      if (response.status === 200 && response.data.token) {
        localStorage.setItem("Token", response.data.token);
        navigate("/screen");
      } else {
        setErrorMessage("Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data;
        
        if (status === 401) {
          setErrorMessage("User not found. Please check your email.");
        } else if (status === 402) {
          setErrorMessage("Incorrect password. Please try again.");
        } else if (typeof message === 'string') {
          setErrorMessage(message);
        } else {
          setErrorMessage("Login failed. Please try again.");
        }
      } else {
        setErrorMessage("Network error. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-secondary-600 hover:text-secondary-800 mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Video className="h-8 w-8 text-primary-600" />
            <span className="text-2xl font-bold text-secondary-800">RecordPro</span>
          </div>
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">Welcome Back</h1>
          <p className="text-secondary-600">Sign in to your account to continue recording</p>
        </div>

        <Card>
          <Card.Content className="p-6">
            {errorMessage && (
              <Alert type="error" className="mb-6">
                {errorMessage}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-secondary-400 hover:text-secondary-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-secondary-600">
                Don't have an account?{" "}
                <Link 
                  to="/register" 
                  className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  Create one here
                </Link>
              </p>
            </div>
          </Card.Content>
        </Card>

        {/* Demo Account Info */}
        <Card className="mt-6 bg-primary-50 border-primary-200">
          <Card.Content className="p-4">
            <p className="text-sm text-primary-800 text-center">
              <strong>Demo Account:</strong> test@example.com / password123
            </p>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}