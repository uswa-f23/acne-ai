import React, { useState } from 'react';
import { Calendar, TrendingUp, TrendingDown, Camera, Filter } from 'lucide-react';

const ProgressPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30days');

  // Mock data - replace with actual user data
  const progressData = [
    {
      id: 1,
      date: '2026-02-10',
      severity: 'Moderate',
      imageUrl: 'https://via.placeholder.com/300x300?text=Day+45',
      improvement: -5
    },
    {
      id: 2,
      date: '2026-02-03',
      severity: 'Moderate',
      imageUrl: 'https://via.placeholder.com/300x300?text=Day+38',
      improvement: -3
    },
    {
      id: 3,
      date: '2026-01-27',
      severity: 'Moderate-Severe',
      imageUrl: 'https://via.placeholder.com/300x300?text=Day+31',
      improvement: -8
    },
    {
      id: 4,
      date: '2026-01-20',
      severity: 'Severe',
      imageUrl: 'https://via.placeholder.com/300x300?text=Day+24',
      improvement: -12
    }
  ];

  const stats = {
    totalImprovement: 23,
    consistencyRate: 88,
    daysTracked: 45,
    trend: 'improving'
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="section-container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4 animate-fadeIn">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-neutral-800">
            Your Progress <span className="gradient-text">Journey</span>
          </h1>
          <p className="text-lg text-neutral-600">
            Track your skin transformation over time
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="card hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Overall Improvement</p>
                <p className="text-3xl font-display font-bold text-primary-600">
                  {stats.totalImprovement}%
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex items-center space-x-2 text-green-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              <span>Improving trend</span>
            </div>
          </div>

          <div className="card hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Consistency Rate</p>
                <p className="text-3xl font-display font-bold text-secondary-600">
                  {stats.consistencyRate}%
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary-400 to-accent-400 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-secondary-400 to-accent-400 h-2 rounded-full"
                style={{ width: `${stats.consistencyRate}%` }}
              ></div>
            </div>
          </div>

          <div className="card hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Days Tracked</p>
                <p className="text-3xl font-display font-bold text-accent-600">
                  {stats.daysTracked}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-400 to-primary-400 flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-neutral-600">
              Since {new Date(Date.now() - stats.daysTracked * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </p>
          </div>

          <div className="card hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Current Status</p>
                <p className="text-3xl font-display font-bold text-primary-600">
                  Good
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
            </div>
            <p className="text-sm text-neutral-600">Keep up the great work!</p>
          </div>
        </div>

        {/* Filter Options */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-neutral-600" />
            <span className="font-semibold text-neutral-800">Time Period:</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {['7days', '30days', '90days', 'all'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedPeriod === period
                    ? 'bg-gradient-to-r from-primary-400 to-secondary-400 text-white shadow-soft'
                    : 'bg-white text-neutral-700 hover:bg-primary-50 border border-primary-200'
                }`}
              >
                {period === '7days' && 'Last 7 Days'}
                {period === '30days' && 'Last 30 Days'}
                {period === '90days' && 'Last 90 Days'}
                {period === 'all' && 'All Time'}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Timeline */}
        <div className="card mb-8">
          <h3 className="text-xl font-display font-bold text-neutral-800 mb-6">
            Visual Progress Timeline
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {progressData.map((entry, index) => (
              <div
                key={entry.id}
                className="space-y-4 animate-scaleIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Image */}
                <div className="relative rounded-2xl overflow-hidden shadow-soft group">
                  <img
                    src={entry.imageUrl}
                    alt={`Progress ${entry.date}`}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-white font-semibold">Click to view details</p>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-600">
                      {new Date(entry.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    {entry.improvement && (
                      <div className={`flex items-center space-x-1 text-xs font-semibold ${
                        entry.improvement > 0 ? 'text-green-600' : 'text-primary-600'
                      }`}>
                        {entry.improvement > 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        <span>{Math.abs(entry.improvement)}%</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-primary-50 rounded-xl px-3 py-2">
                    <p className="text-xs text-neutral-600 mb-1">Severity</p>
                    <p className="font-semibold text-primary-600">{entry.severity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Progress Chart */}
          <div className="card">
            <h3 className="text-xl font-display font-bold text-neutral-800 mb-6">
              Improvement Over Time
            </h3>
            <div className="space-y-6">
              {/* Mock chart visualization */}
              <div className="h-64 bg-primary-50 rounded-2xl p-6 flex items-end justify-between space-x-2">
                {[40, 35, 38, 30, 25, 28, 20].map((height, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center space-y-2">
                    <div
                      className="w-full bg-gradient-to-t from-primary-400 to-secondary-400 rounded-t-lg transition-all duration-500 hover:opacity-80"
                      style={{ height: `${height * 2}px` }}
                    ></div>
                    <span className="text-xs text-neutral-600">W{index + 1}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-primary-400"></div>
                  <span className="text-neutral-600">Severity Level</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Insights */}
          <div className="card bg-gradient-to-br from-primary-500 via-secondary-400 to-primary-600 text-white border-none">
            <h3 className="text-xl font-display font-bold mb-6">
              Key Insights
            </h3>
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <TrendingUp className="w-5 h-5" />
                  <h4 className="font-semibold">Great Progress!</h4>
                </div>
                <p className="text-primary-50 text-sm">
                  Your skin has improved by 23% over the past 45 days. Keep following your treatment plan!
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Calendar className="w-5 h-5" />
                  <h4 className="font-semibold">Consistency Matters</h4>
                </div>
                <p className="text-primary-50 text-sm">
                  You've been 88% consistent with tracking. Try to maintain daily check-ins for best results.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-xl">💡</span>
                  <h4 className="font-semibold">Recommendation</h4>
                </div>
                <p className="text-primary-50 text-sm">
                  Your progress is accelerating! Continue your current routine for the next 2 weeks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;