import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Video, ArrowLeft, Sparkles, Lock, Mail } from "lucide-react";
import { authUtils } from "../utils/auth";
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
      const result = await authUtils.login(formData.email, formData.password);
      
      if (result.success) {
        navigate("/screen");
      } else {
        setErrorMessage(result.error);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center text-secondary-600 hover:text-secondary-800 mb-8 transition-colors group">
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="relative">
              <Video className="h-10 w-10 text-primary-600" />
              <Sparkles className="h-5 w-5 text-warning-500 absolute -top-1 -right-1" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              RecordPro
            </span>
          </div>
          
          <h1 className="text-4xl font-bold text-secondary-900 mb-3">Welcome Back</h1>
          <p className="text-lg text-secondary-600">Sign in to continue your recording journey</p>
        </div>

        <Card className="shadow-2xl border-0">
          <Card.Content className="p-8">
            {errorMessage && (
              <Alert type="error" className="mb-8">
                {errorMessage}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="relative">
                <Mail className="absolute left-3 top-12 h-5 w-5 text-secondary-400" />
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="pl-12"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-12 h-5 w-5 text-secondary-400" />
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="pl-12 pr-12"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-12 text-secondary-400 hover:text-secondary-600 transition-colors"
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
                {isLoading ? "Signing In..." : "Sign In to RecordPro"}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-secondary-600">
                Don't have an account?{" "}
                <Link 
                  to="/register" 
                  className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                >
                  Create one here
                </Link>
              </p>
            </div>
          </Card.Content>
        </Card>

        {/* Demo Account Info */}
        <Card className="mt-8 bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200 shadow-lg">
          <Card.Content className="p-6">
            <div className="text-center">
              <h3 className="font-semibold text-primary-800 mb-2">Try Demo Account</h3>
              <p className="text-sm text-primary-700">
                <strong>Email:</strong> test@example.com<br />
                <strong>Password:</strong> password123
              </p>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}