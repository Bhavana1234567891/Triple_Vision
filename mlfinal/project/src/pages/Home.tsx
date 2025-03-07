import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scan, MessageCircle, ShieldCheck, Clock, Users, Brain } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Early Detection Saves Lives
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Our advanced AI-powered platform helps detect breast cancer early through
          image analysis and provides personalized support through our intelligent
          chatbot assistant.
        </p>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <FeatureCard
          icon={<Scan className="h-8 w-8 text-pink-500" />}
          title="AI Detection"
          description="Upload mammogram images for instant AI-powered analysis and early detection"
        />
        <FeatureCard
          icon={<MessageCircle className="h-8 w-8 text-pink-500" />}
          title="24/7 Chat Support"
          description="Get immediate answers to your questions from our intelligent chatbot"
        />
        <FeatureCard
          icon={<ShieldCheck className="h-8 w-8 text-pink-500" />}
          title="Privacy First"
          description="Your data is encrypted and protected with the highest security standards"
        />
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-6">
        <button
          onClick={() => navigate('/detection')}
          className="px-8 py-4 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
        >
          Start Detection
        </button>
        <button
          onClick={() => navigate('/chatbot')}
          className="px-8 py-4 bg-white text-pink-500 border-2 border-pink-500 rounded-lg hover:bg-pink-50 transition-colors"
        >
          Chat with Assistant
        </button>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default Home;