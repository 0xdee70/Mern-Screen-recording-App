import React from "react";
import { Link } from "react-router-dom";
import { Video, Shield, Users, ArrowRight, Play, Star } from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

export default function Home() {
  const features = [
    {
      icon: Video,
      title: "HD Screen Recording",
      description: "Record your screen in high definition with crystal clear quality and smooth frame rates."
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your recordings are encrypted and stored securely. Only you have access to your content."
    },
    {
      icon: Users,
      title: "Easy Sharing",
      description: "Share your recordings instantly with team members or save them for later use."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Manager",
      content: "This tool has revolutionized how we create product demos. The quality is outstanding!",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Developer",
      content: "Perfect for creating tutorials and bug reports. Simple to use and very reliable.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Video className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-secondary-800">RecordPro</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-secondary-900 mb-6 leading-tight">
            Professional Screen Recording
            <span className="text-primary-600"> Made Simple</span>
          </h1>
          <p className="text-xl text-secondary-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Create stunning screen recordings with webcam overlay. Perfect for tutorials, 
            presentations, and product demos. Start recording in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Start Recording Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">
            Everything You Need to Create Amazing Recordings
          </h2>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Powerful features designed to make screen recording effortless and professional.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center p-8 hover:shadow-xl transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-xl mb-6">
                <feature.icon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-secondary-600 leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-secondary-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Loved by Professionals Worldwide
            </h2>
            <p className="text-lg text-secondary-600">
              See what our users have to say about their experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-warning-500 fill-current" />
                  ))}
                </div>
                <p className="text-secondary-700 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-secondary-900">{testimonial.name}</p>
                  <p className="text-sm text-secondary-600">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-secondary-900 mb-6">
            Ready to Start Recording?
          </h2>
          <p className="text-xl text-secondary-600 mb-8">
            Join thousands of professionals who trust RecordPro for their screen recording needs.
          </p>
          <Link to="/register">
            <Button size="lg">
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 text-secondary-300 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Video className="h-6 w-6 text-primary-400" />
              <span className="text-lg font-semibold text-white">RecordPro</span>
            </div>
            <div className="text-sm">
              © 2025 RecordPro. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}