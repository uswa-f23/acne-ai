import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera, TrendingUp, Heart, MessageCircle, Calendar,
  User, ChevronRight, Award, Target, Activity, Loader
} from 'lucide-react';
import authService from '../../services/authService';
import progressService from '../../services/progressService';
import resultsService from '../../services/resultsService';
import treatmentService from '../../services/treatmentService';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState(null);
  const [recentResults, setRecentResults] = useState([]);
  const [latestTreatment, setLatestTreatment] = useState(null);
  const [user, setUser] = useState({ name: 'User' });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Get user info
      const savedUser = authService.getUser();
      //Debigging
      console.log('USER OBJECT:', savedUser);
      if (savedUser) setUser(savedUser);

      // Load progress summary
      const progressRes = await progressService.getSummary(30);
      if (progressRes.success) setProgressData(progressRes.data);

      // Load results history
      const historyRes = await resultsService.getHistory(1, 5);
      if (historyRes.success) {
        setRecentResults(historyRes.data.items || []);

        // Load treatment for latest result
        if (historyRes.data.items?.length > 0) {
          const latestResultId = historyRes.data.items[0].result_id;
          const treatRes = await treatmentService.getTreatment(latestResultId);
          if (treatRes.success) setLatestTreatment(treatRes.data);
        }
      }
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper: severity color
  const getSeverityColor = (severity) => {
    const colors = {
      mild: 'text-green-600',
      moderate: 'text-yellow-600',
      severe: 'text-orange-600',
      very_severe: 'text-red-600',
    };
    return colors[severity] || 'text-primary-600';
  };

  // Helper: trend label
  const getTrendLabel = (trend) => {
    if (trend === 'improving') return '📈 Improving';
    if (trend === 'worsening') return '📉 Worsening';
    return 'Stable';
  };

  // Helper: achievement badge
  const getAchievement = (count) => {
    if (count >= 20) return 'Gold';
    if (count >= 10) return 'Silver';
    if (count >= 5) return 'Bronze';
    return 'Starter';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader className="w-12 h-12 text-primary-500 animate-spin mx-auto" />
          <p className="text-neutral-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const totalScans = progressData?.total_scans || 0;
  const trend = progressData?.trend || 'stable';
  const severityChange = progressData?.severity_change || 0;
  const improvementRate = severityChange < 0
    ? Math.round(Math.abs(severityChange) * 100)
    : 0;
  const latestSeverity = recentResults[0]?.severity || 'N/A';

  return (
    <div className="bg-gradient-to-b from-primary-100 to-primary-300 w-full min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 xl:px-24 py-12 lg:py-20">

        {/* Header */}
        <div className="mb-12 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-800">
                Welcome back, <span className="gradient-text">
                  {user?.full_name?.split(' ')[0] || 'User'}
                </span>! 
              </h1>
              <p className="text-neutral-600 mt-2">
                Track your progress and continue your journey to clear skin
              </p>
            </div>
            <div className="flex items-center space-x-3 bg-white rounded-2xl shadow-soft px-6 py-4 border border-primary-100">
              <User className="w-6 h-6 text-primary-500" />
              <div>
                <p className="text-sm text-neutral-600">Current Status</p>
                <p className={`font-semibold capitalize ${getSeverityColor(latestSeverity)}`}>
                  {latestSeverity?.replace('_', ' ') || 'No data yet'}
                </p>
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
                  {totalScans}
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
                <p className="text-sm text-neutral-600 mb-1">Trend</p>
                <p className="text-3xl font-display font-bold text-primary-600">
                  {getTrendLabel(trend)}
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
                <p className="text-3xl font-display font-bold text-primary-600">
                  {progressData?.period_days || 30}
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
                  {getAchievement(totalScans)}
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

          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">

            {/* Upload New Analysis */}
            <div className="card rounded-3xl p-8 bg-gradient-to-br from-secondary-500 via-primary-400 to-secondary-600 text-white border-none shadow-soft-lg">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
                <div className="flex-1">
                  <h3 className="text-2xl font-display font-bold mb-3">
                    Ready for Your Next Analysis?
                  </h3>
                  <p className="text-primary-50 mb-6">
                    Upload a new photo to track your progress and get updated recommendations
                  </p>
                  
                </div>
                <div className="hidden md:block">
                  <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Camera className="w-16 h-16 text-white/80" />
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Overview */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-display font-bold text-neutral-800">
                    Progress Overview
                  </h3>
                  <p className="text-neutral-600 text-sm mt-1">Your skin journey over time</p>
                </div>
                <Link
                  to="/progress"
                  className="text-primary-600 hover:text-primary-500 font-medium text-sm flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {progressData?.data_points?.length > 0 ? (
                <div className="space-y-4 mb-6">
                  {progressData.data_points.slice(-3).map((point, i) => (
                    <div key={i} className="flex items-center space-x-4 bg-primary-50 rounded-xl p-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center flex-shrink-0">
                        <Activity className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-neutral-800 capitalize">
                          {point.severity_label?.replace('_', ' ') || 'Analysis'}
                        </p>
                        <p className="text-xs text-neutral-500">{point.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-primary-600">
                          {Math.round(point.severity_score * 100)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="bg-primary-50 rounded-2xl p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Target className="w-6 h-6 text-primary-600" />
                      <span className="font-semibold text-neutral-800">Goal Progress</span>
                    </div>
                    <div className="w-full bg-white rounded-full h-3 mb-2">
                      <div className="bg-gradient-to-r from-primary-400 to-secondary-400 h-3 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <p className="text-sm text-neutral-600">Upload your first scan to start!</p>
                  </div>
                  <div className="bg-secondary-50 rounded-2xl p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Activity className="w-6 h-6 text-secondary-600" />
                      <span className="font-semibold text-neutral-800">Consistency</span>
                    </div>
                    <div className="w-full bg-white rounded-full h-3 mb-2">
                      <div className="bg-gradient-to-r from-secondary-400 to-accent-400 h-3 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <p className="text-sm text-neutral-600">No data yet</p>
                  </div>
                </div>
              )}

              <Link to="/progress" className="btn-outline w-full">
                View Detailed Progress
              </Link>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h3 className="text-xl font-display font-bold text-neutral-800 mb-6">
                Recent Activity
              </h3>
              {recentResults.length > 0 ? (
                <div className="space-y-4">
                  {recentResults.map((result) => (
                    <div
                      key={result.result_id}
                      className="flex items-center space-x-4 p-4 bg-primary-50 rounded-2xl hover:bg-primary-100 transition-colors duration-300"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center flex-shrink-0">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-neutral-800">
                          Analysis: <span className={`capitalize ${getSeverityColor(result.severity)}`}>
                            {result.severity?.replace('_', ' ') || 'Complete'}
                          </span>
                        </p>
                        <p className="text-sm text-neutral-600">
                          {result.analyzed_at
                            ? new Date(result.analyzed_at).toLocaleDateString()
                            : 'Recent'}
                        </p>
                      </div>
                      <Link
                        to={`/detection`}
                        className="text-primary-500 hover:text-primary-600"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Camera className="w-12 h-12 text-primary-300 mx-auto mb-3" />
                  <p className="text-neutral-500">No analyses yet. Upload your first photo!</p>
                  <Link to="/detection" className="btn-primary mt-4 inline-block">
                    Start Analysis
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
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

              {latestTreatment?.recommendations?.medicated?.length > 0 ? (
                <ul className="space-y-3 mb-6">
                  {latestTreatment.recommendations.medicated.slice(0, 3).map((t, i) => (
                    <li key={i} className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-primary-600 text-xs font-bold">✓</span>
                      </div>
                      <span className="text-sm text-neutral-700">{t.name}</span>
                    </li>
                  ))}
                  {latestTreatment.recommendations.herbal?.slice(0, 1).map((t, i) => (
                    <li key={i} className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-green-600 text-xs font-bold">✓</span>
                      </div>
                      <span className="text-sm text-neutral-700">{t.name}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4 mb-4">
                  <p className="text-sm text-neutral-500">
                    Complete an analysis to get your treatment plan
                  </p>
                </div>
              )}

              <Link to="/detection" className="btn-secondary w-full text-sm text-center block">
                {latestTreatment ? 'Update Treatment Plan' : 'Get Treatment Plan'}
              </Link>
            </div>

            {/* AI Assistant */}
            <div className="card bg-gradient-to-br from-secondary-100 to-primary-100 border-secondary-200 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <MessageCircle className="w-6 h-6 text-secondary-600" />
                <h3 className="text-lg font-display font-bold text-neutral-800">
                  Ask Our AI Assistant
                </h3>
              </div>
              <p className="text-neutral-700 text-sm mb-6">
                Get instant answers to your skincare questions 24/7
              </p>
              <button
                className="btn-primary w-full text-sm"
                onClick={() => window.dispatchEvent(new CustomEvent('openChatbot'))}
              >
                Start Chat
              </button>
            </div>

            {/* Recommended Actions */}
            <div className="card">
              <h3 className="text-lg font-display font-bold text-neutral-800 mb-4">
                Recommended Actions
              </h3>
              
              <Link
                to="/product-scanner"
                className="flex items-center justify-between p-3 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors duration-300"
              >
               <span className="text-sm font-medium text-neutral-800">Check product safety</span>
               <ChevronRight className="w-5 h-5 text-primary-500" />
              </Link>
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
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('openChatbot'))}
                  className="flex items-center justify-between p-3 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors duration-300 w-full"
                >
                  <span className="text-sm font-medium text-neutral-800">Ask DermaAI</span>
                  <ChevronRight className="w-5 h-5 text-primary-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Floating Upload Button */}
      <Link
        to="/detection"
        className="fixed bottom-8 left-8 z-50 flex items-center space-x-2
        bg-primary-500 text-white font-semibold px-6 py-4 rounded-full
        shadow-dusty-lg hover:bg-primary-600 hover:scale-105
        transition-all duration-300 animate-float group"
      >
        <span className="absolute -inset-1 rounded-full bg-primary-400 opacity-30 animate-ping" />
        <span className="relative flex items-center space-x-2">
          <Camera className="w-5 h-5" />
          <span>Upload Image</span>
          <ChevronRight className="w-5 h-8 group-hover:translate-x-1 transition-transform duration-300" />
        </span>
      </Link>
    </div>
  );
};

export default DashboardPage;