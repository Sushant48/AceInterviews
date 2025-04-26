import React, { useState } from 'react';
import { ChevronDown, Sparkles, BarChart, FileText } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const HomePage = () => {
  const [isHovered, setIsHovered] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStart = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/dashboard");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 text-white overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse -top-48 -left-48" />
        <div className="absolute w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse -bottom-48 -right-48 animation-delay-2000" />
      </div>

      <section className="relative text-center py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight animate-fade-in-up">
            Ace Your Next Interview<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
              with Confidence
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 text-gray-300 animate-fade-in-up animation-delay-200 max-w-3xl mx-auto">
            AI-powered mock interviews and resume analysis tailored just for you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up animation-delay-400">
            <button 
                onClick={handleStart}
                className="group bg-white text-purple-900 px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl hover:shadow-purple-500/20 transform hover:scale-105 transition-all duration-300">
              Get Started
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>
       
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-purple-300/70" />
        </div>
      </section>

      
      <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: "AI Mock Interviews",
                description: "Get real-time interview questions and feedback based on your resume."
              },
              {
                icon: <FileText className="w-8 h-8" />,
                title: "Resume Analysis",
                description: "Let our ATS-powered system analyze and optimize your resume."
              },
              {
                icon: <BarChart className="w-8 h-8" />,
                title: "Performance Metrics",
                description: "Track your progress and improve with detailed insights."
              }
            ].map((feature, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br from-white to-gray-100 text-purple-900 p-8 rounded-3xl shadow-xl transform transition-all duration-300 ${
                  isHovered === index ? 'scale-105 shadow-2xl' : 'hover:scale-105'
                } animate-fade-in-up`}
                style={{ animationDelay: `${200 + index * 100}ms` }}
                onMouseEnter={() => setIsHovered(index)}
                onMouseLeave={() => setIsHovered(null)}
              >
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 transform transition-transform duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-16 bg-gradient-to-t from-indigo-950/50 to-transparent" />

      <style jsx global>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-300 {
          animation-delay: 300ms;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }

        .animation-delay-500 {
          animation-delay: 500ms;
        }

        .animation-delay-2000 {
          animation-delay: 2000ms;
        }
      `}</style>
    </div>
  );
};

export default HomePage;