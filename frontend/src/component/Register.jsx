import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Video, ArrowLeft, CheckCircle, Sparkles, User, Mail, Lock } from "lucide-react";
import { authUtils } from "../utils/auth";
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
      const result = await authUtils.register(
        formData.username,
        formData.email,
        formData.password
      );
      
      if (result.success) {
        setSuccessMessage("Account created successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
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

  const passwordStrength = () => {
    const password = formData.password;
    if (password.length === 0) return { strength: 0, text: "" };
    if (password.length < 6) return { strength: 1, text: "Weak", color: "text-error-600" };
    if (password.length < 10) return { strength: 2, text: "Good", color: "text-warning-600" };
    return { strength: 3, text: "Strong", color: "text-success-600" };
  };

  const strength = passwordStrength();

  const features = [
    "HD screen recording up to 4K",
    "Webcam overlay with customization",
    "Secure cloud storage",
    "Real-time collaboration tools",
    "Advanced editing features"
  ];

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
          
          <h1 className="text-4xl font-bold text-secondary-900 mb-3">Create Your Account</h1>
          <p className="text-lg text-secondary-600">Start your professional recording journey today</p>
        </div>

        <Card className="shadow-2xl border-0">
          <Card.Content className="p-8">
            {errorMessage && (
              <Alert type="error" className="mb-8">
                {errorMessage}
              </Alert>
            )}

            {successMessage && (
              <Alert type="success" className="mb-8">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  {successMessage}
                </div>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="relative">
                <User className="absolute left-3 top-12 h-5 w-5 text-secondary-400" />
                <Input
                  label="Full Name"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="pl-12"
                  required
                />
              </div>

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

              <div className="space-y-3">
                <div className="relative">
                  <Lock className="absolute left-3 top-12 h-5 w-5 text-secondary-400" />
                  <Input
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
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
                
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 bg-secondary-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            strength.strength === 1 ? 'bg-error-500 w-1/3' :
                            strength.strength === 2 ? 'bg-warning-500 w-2/3' :
                            strength.strength === 3 ? 'bg-success-500 w-full' : 'w-0'
                          }`}
                        />
                      </div>
                      <span className={`text-sm font-semibold ${strength.color}`}>
                        {strength.text}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-secondary-50 rounded-xl p-4">
                <p className="text-sm font-semibold text-secondary-700 mb-3">Password requirements:</p>
                <ul className="space-y-2">
                  <li className={`flex items-center text-sm ${formData.password.length >= 6 ? 'text-success-600' : 'text-secondary-500'}`}>
                    <CheckCircle className={`h-4 w-4 mr-2 ${formData.password.length >= 6 ? 'text-success-500' : 'text-secondary-300'}`} />
                    At least 6 characters
                  </li>
                  <li className={`flex items-center text-sm ${/[A-Z]/.test(formData.password) ? 'text-success-600' : 'text-secondary-500'}`}>
                    <CheckCircle className={`h-4 w-4 mr-2 ${/[A-Z]/.test(formData.password) ? 'text-success-500' : 'text-secondary-300'}`} />
                    One uppercase letter (recommended)
                  </li>
                  <li className={`flex items-center text-sm ${/[0-9]/.test(formData.password) ? 'text-success-600' : 'text-secondary-500'}`}>
                    <CheckCircle className={`h-4 w-4 mr-2 ${/[0-9]/.test(formData.password) ? 'text-success-500' : 'text-secondary-300'}`} />
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
                {isLoading ? "Creating Account..." : "Create Your Account"}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-secondary-600">
                Already have an account?{" "}
                <Link 
                  to="/login" 
                  className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </Card.Content>
        </Card>

        {/* Features Preview */}
        <Card className="mt-8 bg-gradient-to-r from-secondary-50 to-primary-50 border-secondary-200 shadow-lg">
          <Card.Content className="p-6">
            <h3 className="font-bold text-secondary-800 mb-4 text-center">What you'll get with RecordPro:</h3>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-secondary-700">
                  <CheckCircle className="h-4 w-4 text-success-500 mr-3 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}