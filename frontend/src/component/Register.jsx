import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Video, ArrowLeft, CheckCircle } from "lucide-react";
import axios from "axios";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import Alert from "../components/ui/Alert";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    if (errorMessage) setErrorMessage(""); // Clear error when user starts typing
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setErrorMessage("Name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setErrorMessage("Email is required");
      return false;
    }
    if (!formData.password.trim()) {
      setErrorMessage("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/register`,
        formData
      );
      
      if (response.status === 200) {
        setSuccessMessage("Account created successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data;
        
        if (status === 422) {
          setErrorMessage("Email already in use. Please try a different email.");
        } else if (typeof message === 'string') {
          setErrorMessage(message);
        } else {
          setErrorMessage("Registration failed. Please try again.");
        }
      } else {
        setErrorMessage("Network error. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = () => {
    const password = formData.password;
    if (password.length === 0) return { strength: 0, text: "" };
    if (password.length < 6) return { strength: 1, text: "Weak", color: "text-error-600" };
    if (password.length < 10) return { strength: 2, text: "Good", color: "text-warning-600" };
    return { strength: 3, text: "Strong", color: "text-success-600" };
  };

  const strength = passwordStrength();

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
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">Create Account</h1>
          <p className="text-secondary-600">Start your screen recording journey today</p>
        </div>

        <Card>
          <Card.Content className="p-6">
            {errorMessage && (
              <Alert type="error" className="mb-6">
                {errorMessage}
              </Alert>
            )}

            {successMessage && (
              <Alert type="success" className="mb-6">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  {successMessage}
                </div>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Full Name"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />

              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />

              <div className="space-y-2">
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
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
                
                {formData.password && (
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-secondary-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          strength.strength === 1 ? 'bg-error-500 w-1/3' :
                          strength.strength === 2 ? 'bg-warning-500 w-2/3' :
                          strength.strength === 3 ? 'bg-success-500 w-full' : 'w-0'
                        }`}
                      />
                    </div>
                    <span className={`text-xs font-medium ${strength.color}`}>
                      {strength.text}
                    </span>
                  </div>
                )}
              </div>

              <div className="text-xs text-secondary-600 space-y-1">
                <p>Password requirements:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li className={formData.password.length >= 6 ? 'text-success-600' : ''}>
                    At least 6 characters
                  </li>
                  <li className={/[A-Z]/.test(formData.password) ? 'text-success-600' : ''}>
                    One uppercase letter (recommended)
                  </li>
                  <li className={/[0-9]/.test(formData.password) ? 'text-success-600' : ''}>
                    One number (recommended)
                  </li>
                </ul>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-secondary-600">
                Already have an account?{" "}
                <Link 
                  to="/login" 
                  className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </Card.Content>
        </Card>

        {/* Features Preview */}
        <Card className="mt-6 bg-secondary-50 border-secondary-200">
          <Card.Content className="p-4">
            <h3 className="font-semibold text-secondary-800 mb-2">What you'll get:</h3>
            <ul className="text-sm text-secondary-600 space-y-1">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-success-500 mr-2" />
                HD screen recording
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-success-500 mr-2" />
                Webcam overlay
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-success-500 mr-2" />
                Secure cloud storage
              </li>
            </ul>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}