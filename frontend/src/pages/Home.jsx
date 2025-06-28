import React from "react";
import { Link } from "react-router-dom";
import { Video, Shield, Users, ArrowRight, Play, Star, Sparkles, Zap, Globe } from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

export default function Home() {
  const features = [
    {
      icon: Video,
      title: "HD Screen Recording",
      description: "Record your screen in stunning 4K quality with smooth 60fps frame rates and crystal-clear audio capture.",
      gradient: "from-primary-500 to-primary-600"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption and secure cloud storage ensure your recordings are protected with zero-knowledge architecture.",
      gradient: "from-success-500 to-success-600"
    },
    {
      icon: Users,
      title: "Seamless Collaboration",
      description: "Share recordings instantly with team members, add comments, and collaborate in real-time with advanced permissions.",
      gradient: "from-warning-500 to-warning-600"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Manager at TechCorp",
      content: "RecordPro has completely transformed how we create product demos. The quality is absolutely outstanding and the interface is incredibly intuitive.",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Mike Chen",
      role: "Senior Developer",
      content: "Perfect for creating tutorials and bug reports. The reliability is unmatched and it integrates seamlessly into our workflow.",
      rating: 5,
      avatar: "MC"
    },
    {
      name: "Emily Rodriguez",
      role: "UX Designer",
      content: "The best screen recording tool I've ever used. Clean interface, powerful features, and excellent customer support.",
      rating: 5,
      avatar: "ER"
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Users" },
    { number: "1M+", label: "Recordings Created" },
    { number: "99.9%", label: "Uptime" },
    { number: "4.9/5", label: "User Rating" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Video className="h-8 w-8 text-primary-600" />
              <Sparkles className="h-4 w-4 text-warning-500 absolute -top-1 -right-1" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              RecordPro
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" className="font-semibold">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button className="shadow-lg">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-24 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 bg-primary-100 rounded-full text-primary-700 font-medium mb-8 animate-fade-in">
            <Zap className="h-4 w-4 mr-2" />
            New: AI-powered auto-editing now available
          </div>
          
          <h1 className="text-6xl lg:text-7xl font-extrabold text-secondary-900 mb-8 leading-tight">
            Professional Screen Recording
            <span className="block bg-gradient-to-r from-primary-600 via-primary-500 to-primary-700 bg-clip-text text-transparent">
              Made Effortless
            </span>
          </h1>
          
          <p className="text-xl text-secondary-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Create stunning screen recordings with webcam overlay, crystal-clear audio, and professional editing tools. 
            Perfect for tutorials, presentations, and product demos that captivate your audience.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto text-lg px-10 py-4 shadow-2xl">
                Start Recording Free
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-10 py-4">
              <Play className="mr-3 h-6 w-6" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">{stat.number}</div>
                <div className="text-secondary-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-secondary-100 rounded-full text-secondary-700 font-medium mb-6">
            <Globe className="h-4 w-4 mr-2" />
            Trusted by professionals worldwide
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-secondary-900 mb-6">
            Everything You Need for
            <span className="block text-primary-600">Professional Recording</span>
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto leading-relaxed">
            Powerful features designed to make screen recording effortless, professional, and engaging.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} hover className="text-center p-10 group">
              <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${feature.gradient} rounded-2xl mb-8 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-secondary-600 leading-relaxed text-lg">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gradient-to-r from-secondary-50 to-primary-50 py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-secondary-900 mb-6">
              Loved by Professionals
              <span className="block text-primary-600">Around the Globe</span>
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              See what industry leaders have to say about their RecordPro experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-8 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-warning-500 fill-current" />
                  ))}
                </div>
                <p className="text-secondary-700 mb-8 italic text-lg leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-secondary-900 text-lg">{testimonial.name}</p>
                    <p className="text-secondary-600">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl lg:text-6xl font-bold text-secondary-900 mb-8">
            Ready to Create
            <span className="block bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
              Amazing Recordings?
            </span>
          </h2>
          <p className="text-xl text-secondary-600 mb-12 leading-relaxed">
            Join thousands of professionals who trust RecordPro for their screen recording needs. 
            Start your free trial today and experience the difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto text-lg px-12 py-5 shadow-2xl">
                Get Started Today
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
            <p className="text-secondary-500 text-sm">
              No credit card required • 14-day free trial
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 text-secondary-300 py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="relative">
                <Video className="h-8 w-8 text-primary-400" />
                <Sparkles className="h-4 w-4 text-warning-400 absolute -top-1 -right-1" />
              </div>
              <span className="text-2xl font-bold text-white">RecordPro</span>
            </div>
            <div className="text-center md:text-right">
              <div className="text-sm mb-2">
                © 2025 RecordPro. All rights reserved.
              </div>
              <div className="text-xs text-secondary-400">
                Made with ❤️ for creators worldwide
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}