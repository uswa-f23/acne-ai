import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, TrendingDown, Camera, Filter, Loader } from 'lucide-react';
import progressService from '../../services/progressService';

const ProgressPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState(null);
  const [error, setError] = useState('');

  const periodDays = {
    '7days': 7,
    '30days': 30,
    '90days': 90,
    'all': 365,
  };

  useEffect(() => {
    loadProgress();
  }, [selectedPeriod]);

  const loadProgress = async () => {
    setLoading(true);
    setError('');
    try {
      const days = periodDays[selectedPeriod];
      const response = await progressService.getSummary(days);
      if (response.success) {
        setProgressData(response.data);
      }
    } catch (err) {
      setError('Failed to load progress data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getTrendColor = (trend) => {
    if (trend === 'improving') return 'text-green-600';
    if (trend === 'worsening') return 'text-red-600';
    return 'text-yellow-600';
  };

  const getTrendIcon = (trend) => {
    if (trend === 'improving') return <TrendingDown className="w-4 h-4" />;
    if (trend === 'worsening') return <TrendingUp className="w-4 h-4" />;
    return <span>➡️</span>;
  };

  const getTrendLabel = (trend) => {
    if (trend === 'improving') return 'Improving trend';
    if (trend === 'worsening') return 'Worsening trend';
    return 'Stable trend';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      mild: 'text-green-600',
      moderate: 'text-yellow-600',
      severe: 'text-orange-600',
      very_severe: 'text-red-600',
    };
    return colors[severity] || 'text-primary-600';
  };

  const getInsightMessage = (data) => {
    if (!data || data.total_scans === 0) {
      return {
        title: "Get Started!",
        message: "Upload your first photo to begin tracking your skin journey."
      };
    }
    if (data.trend === 'improving') {
      return {
        title: "Great Progress! 🎉",
        message: `Your skin has improved by ${Math.abs(Math.round(data.severity_change * 100))}% over the past ${data.period_days} days. Keep following your treatment plan!`
      };
    }
    if (data.trend === 'worsening') {
      return {
        title: "Don't Give Up!",
        message: "Your skin needs a bit more attention. Consider consulting a dermatologist and staying consistent with your routine."
      };
    }
    return {
      title: "Staying Stable",
      message: "Your skin condition is stable. Keep up your routine and try to do regular scans for better tracking."
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader className="w-12 h-12 text-primary-500 animate-spin mx-auto" />
          <p className="text-neutral-600">Loading your progress...</p>
        </div>
      </div>
    );
  }

  const totalScans = progressData?.total_scans || 0;
  const trend = progressData?.trend || 'stable';
  const severityChange = progressData?.severity_change || 0;
  const dataPoints = progressData?.data_points || [];
  const insight = getInsightMessage(progressData);

  // Build chart bars from data points
  const chartData = dataPoints.slice(-7).map((p) => ({
    label: new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    height: Math.round(p.severity_score * 100),
    severity: p.severity_label,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="section-container">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4 animate-fadeIn">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-neutral-800">
            Your Progress <span className="gradient-text">Journey</span>
          </h1>
          <p className="text-lg text-neutral-600">Track your skin transformation over time</p>
        </div>

        {/* Error */}
        {error && (
          <div className="max-w-4xl mx-auto mb-6 bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="card hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Overall Trend</p>
                <p className={`text-2xl font-display font-bold capitalize ${getTrendColor(trend)}`}>
                  {trend}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className={`flex items-center space-x-2 text-sm font-medium ${getTrendColor(trend)}`}>
              {getTrendIcon(trend)}
              <span>{getTrendLabel(trend)}</span>
            </div>
          </div>

          <div className="card hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Severity Change</p>
                <p className={`text-3xl font-display font-bold ${severityChange <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {severityChange <= 0 ? '▼' : '▲'} {Math.abs(Math.round(severityChange * 100))}%
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary-400 to-accent-400 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${severityChange <= 0 ? 'bg-green-400' : 'bg-red-400'}`}
                style={{ width: `${Math.min(Math.abs(severityChange) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="card hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Total Scans</p>
                <p className="text-3xl font-display font-bold text-accent-600">
                  {totalScans}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-400 to-primary-400 flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-neutral-600">
              Over {progressData?.period_days || 30} days
            </p>
          </div>

          <div className="card hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Current Status</p>
                <p className={`text-2xl font-display font-bold capitalize ${getSeverityColor(dataPoints[dataPoints.length - 1]?.severity_label)}`}>
                  {dataPoints.length > 0
                    ? dataPoints[dataPoints.length - 1]?.severity_label?.replace('_', ' ')
                    : 'No data'}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
            </div>
            <p className="text-sm text-neutral-600">
              {trend === 'improving' ? 'Keep up the great work!' : 'Stay consistent!'}
            </p>
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
            Progress Timeline
          </h3>

          {dataPoints.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dataPoints.slice(-4).reverse().map((entry, index) => (
                <div
                  key={index}
                  className="space-y-4 animate-scaleIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="bg-primary-50 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-neutral-600">
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    {/* Severity Score Bar */}
                    <div>
                      <div className="flex justify-between text-xs text-neutral-500 mb-1">
                        <span>Severity</span>
                        <span>{Math.round(entry.severity_score * 100)}%</span>
                      </div>
                      <div className="w-full bg-white rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-primary-400 to-secondary-400 h-3 rounded-full transition-all duration-1000"
                          style={{ width: `${Math.round(entry.severity_score * 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl px-3 py-2">
                      <p className="text-xs text-neutral-600 mb-1">Severity Level</p>
                      <p className={`font-semibold capitalize ${getSeverityColor(entry.severity_label)}`}>
                        {entry.severity_label?.replace('_', ' ') || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Camera className="w-16 h-16 text-primary-300 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-neutral-700 mb-2">No Progress Data Yet</h4>
              <p className="text-neutral-500 mb-6">
                Upload your first photo to start tracking your skin journey
              </p>
              <a href="/detection" className="btn-primary inline-block">
                Start Your First Analysis
              </a>
            </div>
          )}
        </div>

        {/* Chart + Insights */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* Severity Chart */}
          <div className="card">
            <h3 className="text-xl font-display font-bold text-neutral-800 mb-6">
              Severity Over Time
            </h3>
            {chartData.length > 0 ? (
              <div className="space-y-6">
                <div className="h-64 bg-primary-50 rounded-2xl p-6 flex items-end justify-between space-x-2">
                  {chartData.map((point, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center space-y-2">
                      <div
                        className="w-full bg-gradient-to-t from-primary-400 to-secondary-400 rounded-t-lg transition-all duration-500 hover:opacity-80 min-h-4"
                        style={{ height: `${point.height * 1.8}px` }}
                        title={`${point.severity} - ${point.height}%`}
                      ></div>
                      <span className="text-xs text-neutral-600 text-center leading-tight">
                        {point.label}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-primary-400"></div>
                    <span className="text-neutral-600">Severity Score (%)</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-64 bg-primary-50 rounded-2xl flex items-center justify-center">
                <p className="text-neutral-500 text-sm">No data to display yet</p>
              </div>
            )}
          </div>

          {/* Key Insights */}
          <div className="card bg-gradient-to-br from-primary-500 via-secondary-400 to-primary-600 text-white border-none">
            <h3 className="text-xl font-display font-bold mb-6">Key Insights</h3>
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <TrendingUp className="w-5 h-5" />
                  <h4 className="font-semibold">{insight.title}</h4>
                </div>
                <p className="text-primary-50 text-sm">{insight.message}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Calendar className="w-5 h-5" />
                  <h4 className="font-semibold">Tracking Period</h4>
                </div>
                <p className="text-primary-50 text-sm">
                  You have {totalScans} scan{totalScans !== 1 ? 's' : ''} over the past{' '}
                  {progressData?.period_days || 30} days.
                  {totalScans < 3 && ' Upload more photos for better insights!'}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-xl">💡</span>
                  <h4 className="font-semibold">Recommendation</h4>
                </div>
                <p className="text-primary-50 text-sm">
                  {trend === 'improving'
                    ? 'Your progress is great! Continue your current routine.'
                    : trend === 'worsening'
                    ? 'Consider consulting a dermatologist for personalized advice.'
                    : 'Upload photos regularly for more accurate tracking.'}
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