import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Camera, TrendingUp, Heart, MessageCircle, Calendar, 
  User, ChevronRight, Award, Target, Activity 
} from 'lucide-react';

const DashboardPage = () => {
  // Mock data - replace with actual user data
  const userData = {
    name: 'Sarah',
    analysisCount: 12,
    improvementRate: 23,
    daysTracked: 45,
    currentLevel: 'Moderate',
    nextAnalysisDate: '2026-02-15'
  };

  const recentActivities = [
    { id: 1, type: 'analysis', date: '2026-02-10', result: 'Moderate' },
    { id: 2, type: 'progress', date: '2026-02-08', improvement: '+5%' },
    { id: 3, type: 'treatment', date: '2026-02-05', action: 'Updated routine' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 xl:px-24 py-12 lg:py-20">
        {/* Header */}
        <div className="mb-12 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-800">
                Welcome back, <span className="gradient-text">{userData.name}</span>! 👋
              </h1>
              <p className="text-neutral-600 mt-2">
                Track your progress and continue your journey to clear skin
              </p>
            </div>
            <div className="flex items-center space-x-3 bg-white rounded-2xl shadow-soft px-6 py-4 border border-primary-100">
              <User className="w-6 h-6 text-primary-500" />
              <div>
                <p className="text-sm text-neutral-600">Current Status</p>
                <p className="font-semibold text-neutral-800">{userData.currentLevel}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="card hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Total Analyses</p>
                <p className="text-3xl font-display font-bold text-primary-600">
                  {userData.analysisCount}
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center">
                <Camera className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="card hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Improvement</p>
                <p className="text-3xl font-display font-bold text-secondary-600">
                  {userData.improvementRate}%
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary-400 to-accent-400 flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="card hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Days Tracked</p>
                <p className="text-3xl font-display font-bold text-accent-600">
                  {userData.daysTracked}
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-400 to-primary-400 flex items-center justify-center">
                <Calendar className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="card hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Achievement</p>
                <p className="text-3xl font-display font-bold text-primary-600">
                  Gold
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center">
                <Award className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Actions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upload New Analysis */}
            <div className="card bg-gradient-to-br from-primary-500 via-secondary-400 to-primary-600 text-white border-none shadow-soft-lg">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
                <div className="flex-1">
                  <h3 className="text-2xl font-display font-bold mb-3">
                    Ready for Your Next Analysis?
                  </h3>
                  <p className="text-primary-50 mb-6">
                    Upload a new photo to track your progress and get updated recommendations
                  </p>
                  <Link
                    to="/detection"
                    className="inline-flex items-center space-x-2 bg-white text-primary-600 px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform duration-300 shadow-lg"
                  >
                    <Camera className="w-5 h-5" />
                    <span>Upload Image</span>
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
                <div className="hidden md:block">
                  <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Camera className="w-16 h-16 text-white/80" />
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Tracker */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-display font-bold text-neutral-800">
                    Progress Overview
                  </h3>
                  <p className="text-neutral-600 text-sm mt-1">
                    Your skin journey over time
                  </p>
                </div>
                <Link
                  to="/progress"
                  className="text-primary-600 hover:text-primary-500 font-medium text-sm flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-primary-50 rounded-2xl p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Target className="w-6 h-6 text-primary-600" />
                    <span className="font-semibold text-neutral-800">Goal Progress</span>
                  </div>
                  <div className="w-full bg-white rounded-full h-3 mb-2">
                    <div className="bg-gradient-to-r from-primary-400 to-secondary-400 h-3 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <p className="text-sm text-neutral-600">65% to clear skin goal</p>
                </div>

                <div className="bg-secondary-50 rounded-2xl p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Activity className="w-6 h-6 text-secondary-600" />
                    <span className="font-semibold text-neutral-800">Consistency</span>
                  </div>
                  <div className="w-full bg-white rounded-full h-3 mb-2">
                    <div className="bg-gradient-to-r from-secondary-400 to-accent-400 h-3 rounded-full" style={{ width: '88%' }}></div>
                  </div>
                  <p className="text-sm text-neutral-600">88% routine adherence</p>
                </div>
              </div>

              <Link to="/progress" className="btn-outline w-full">
                View Detailed Progress
              </Link>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h3 className="text-xl font-display font-bold text-neutral-800 mb-6">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center space-x-4 p-4 bg-primary-50 rounded-2xl hover:bg-primary-100 transition-colors duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center flex-shrink-0">
                      {activity.type === 'analysis' && <Camera className="w-6 h-6 text-white" />}
                      {activity.type === 'progress' && <TrendingUp className="w-6 h-6 text-white" />}
                      {activity.type === 'treatment' && <Heart className="w-6 h-6 text-white" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-neutral-800">
                        {activity.type === 'analysis' && `Analysis Result: ${activity.result}`}
                        {activity.type === 'progress' && `Progress Update: ${activity.improvement}`}
                        {activity.type === 'treatment' && activity.action}
                      </p>
                      <p className="text-sm text-neutral-600">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            {/* Treatment Plan */}
            <div className="card">
              <div className="flex items-center space-x-3 mb-4">
                <Heart className="w-6 h-6 text-primary-500" />
                <h3 className="text-lg font-display font-bold text-neutral-800">
                  Your Treatment Plan
                </h3>
              </div>
              <p className="text-neutral-600 text-sm mb-4">
                Personalized recommendations based on your latest analysis
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary-600 text-xs font-bold">✓</span>
                  </div>
                  <span className="text-sm text-neutral-700">Gentle cleanser (morning/night)</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary-600 text-xs font-bold">✓</span>
                  </div>
                  <span className="text-sm text-neutral-700">Salicylic acid treatment</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary-600 text-xs font-bold">✓</span>
                  </div>
                  <span className="text-sm text-neutral-700">Oil-free moisturizer</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary-600 text-xs font-bold">✓</span>
                  </div>
                  <span className="text-sm text-neutral-700">SPF 30+ daily sunscreen</span>
                </li>
              </ul>
              <button className="btn-secondary w-full text-sm">
                Update Treatment Plan
              </button>
            </div>

            {/* AI Assistant */}
            <div className="card bg-gradient-to-br from-secondary-100 to-primary-100 border-secondary-200">
              <div className="flex items-center space-x-3 mb-4">
                <MessageCircle className="w-6 h-6 text-secondary-600" />
                <h3 className="text-lg font-display font-bold text-neutral-800">
                  Ask Our AI Assistant
                </h3>
              </div>
              <p className="text-neutral-700 text-sm mb-6">
                Get instant answers to your skincare questions 24/7
              </p>
              <button className="btn-primary w-full text-sm">
                Start Chat
              </button>
            </div>

            {/* Next Steps */}
            <div className="card">
              <h3 className="text-lg font-display font-bold text-neutral-800 mb-4">
                Recommended Actions
              </h3>
              <div className="space-y-3">
                <Link
                  to="/detection"
                  className="flex items-center justify-between p-3 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors duration-300"
                >
                  <span className="text-sm font-medium text-neutral-800">Upload new photo</span>
                  <ChevronRight className="w-5 h-5 text-primary-500" />
                </Link>
                <Link
                  to="/progress"
                  className="flex items-center justify-between p-3 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors duration-300"
                >
                  <span className="text-sm font-medium text-neutral-800">View progress</span>
                  <ChevronRight className="w-5 h-5 text-primary-500" />
                </Link>
                <button className="flex items-center justify-between p-3 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors duration-300 w-full">
                  <span className="text-sm font-medium text-neutral-800">Check product safety</span>
                  <ChevronRight className="w-5 h-5 text-primary-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;