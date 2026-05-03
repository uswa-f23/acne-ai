import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, TrendingDown, Camera, Filter, Loader, Sparkles, Heart } from 'lucide-react';
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

  useEffect(() => { loadProgress(); }, [selectedPeriod]);

  const loadProgress = async () => {
    setLoading(true);
    setError('');
    try {
      const days = periodDays[selectedPeriod];
      const response = await progressService.getSummary(days);
      if (response.success) setProgressData(response.data);
    } catch (err) {
      setError('Failed to load progress data.');
    } finally {
      setLoading(false);
    }
  };

  const getTrendColor  = (t) => t === 'improving' ? 'text-green-600' : t === 'worsening' ? 'text-red-500' : 'text-mauve-500';
  const getTrendBg     = (t) => t === 'improving' ? 'bg-green-50'   : t === 'worsening' ? 'bg-red-50'   : 'bg-mauve-50';
  const getTrendIcon   = (t) => t === 'improving' ? <TrendingDown className="w-5 h-5" /> : t === 'worsening' ? <TrendingUp className="w-5 h-5" /> : <span>➡️</span>;
  const getTrendLabel  = (t) => t === 'improving' ? 'Improving'    : t === 'worsening' ? 'Worsening'   : 'Stable';
  const getSeverityColor = (s) => ({ mild: 'text-green-600', moderate: 'text-yellow-600', severe: 'text-orange-600', very_severe: 'text-red-600' }[s] || 'text-primary-600');
  const getSeverityBg    = (s) => ({ mild: 'bg-green-50',   moderate: 'bg-yellow-50',   severe: 'bg-orange-50',   very_severe: 'bg-red-50'    }[s] || 'bg-primary-50');

  const getInsightMessage = (data) => {
    if (!data || data.total_scans === 0) return { title: "Get Started!", message: "Upload your first photo to begin tracking your skin journey." };
    if (data.trend === 'improving') return { title: "Great Progress!", message: `Your skin has improved by ${Math.abs(Math.round(data.severity_change * 100))}% over the past ${data.period_days} days. Keep following your treatment plan!` };
    if (data.trend === 'worsening') return { title: "Don't Give Up!", message: "Your skin needs a bit more attention. Consider consulting a dermatologist and staying consistent with your routine." };
    return { title: "Staying Stable", message: "Your skin condition is stable. Keep up your routine and try to do regular scans for better tracking." };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader className="w-12 h-12 text-primary-500 animate-spin mx-auto" />
          <p className="text-neutral-500 font-medium">Loading your progress...</p>
        </div>
      </div>
    );
  }

  const totalScans    = progressData?.total_scans || 0;
  const trend         = progressData?.trend || 'stable';
  const severityChange = progressData?.severity_change || 0;
  const dataPoints    = progressData?.data_points || [];
  const insight       = getInsightMessage(progressData);

  const chartData = dataPoints.slice(-7).map((p) => ({
    label:    new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    height:   Math.round(p.severity_score * 100),
    severity: p.severity_label,
  }));

  const statCards = [
    {
      label: 'Overall Trend',
      value: getTrendLabel(trend),
      valueClass: getTrendColor(trend),
      bg: getTrendBg(trend),
      icon: getTrendIcon(trend),
      iconBg: 'from-primary-400 to-mauve-400',
      sub: getTrendLabel(trend) + ' trend',
    },
    {
      label: 'Severity Change',
      value: `${severityChange <= 0 ? '▼' : '▲'} ${Math.abs(Math.round(severityChange * 100))}%`,
      valueClass: severityChange <= 0 ? 'text-green-600' : 'text-red-500',
      bg: severityChange <= 0 ? 'bg-green-50' : 'bg-red-50',
      icon: <Calendar className="w-5 h-5 text-white" />,
      iconBg: 'from-mauve-400 to-primary-500',
      bar: true,
    },
    {
      label: 'Total Scans',
      value: totalScans,
      valueClass: 'text-primary-600',
      bg: 'bg-primary-50',
      icon: <Camera className="w-5 h-5 text-white" />,
      iconBg: 'from-primary-500 to-mauve-500',
      sub: `Over ${progressData?.period_days || 30} days`,
    },
    {
      label: 'Current Status',
      value: dataPoints.length > 0
        ? dataPoints[dataPoints.length - 1]?.severity_label?.replace('_', ' ')
        : 'No data',
      valueClass: getSeverityColor(dataPoints[dataPoints.length - 1]?.severity_label),
      bg: getSeverityBg(dataPoints[dataPoints.length - 1]?.severity_label),
      icon: <img src="/logo1.png" alt="AcneAI Logo" className="w-5 h-5 text-white" />,
      iconBg: 'from-mauve-400 to-primary-400',
      sub: trend === 'improving' ? 'Keep up the great work!' : 'Stay consistent!',
    },
  ];

  return (
    <div className="min-h-screen bg-primary-50">

      {/* ── Hero Banner ───────────────────────────────────── */}
      <section className="w-full bg-gradient-to-br from-primary-100 to-mauve-100 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-4 animate-fadeIn">
          <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-600 px-4 py-2 rounded-full border border-primary-200">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-semibold">Skin Journey Tracker</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-neutral-800">
            Your Progress <span className="gradient-text">Journey</span>
          </h1>
          <p className="text-lg text-neutral-500 max-w-xl mx-auto">
            Track your skin transformation and celebrate every step of improvement
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 space-y-10">

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        {/* ── Stat Cards ─────────────────────────────────── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 shadow-soft border border-primary-100
              hover:shadow-soft-lg hover:scale-[1.02] transition-all duration-300 animate-scaleIn"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {/* Icon + label */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-neutral-500 font-medium">{s.label}</p>
                <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${s.iconBg} flex items-center justify-center shadow-soft`}>
                  {s.icon}
                </div>
              </div>
              {/* Value */}
              <p className={`text-2xl font-display font-bold capitalize mb-2 ${s.valueClass}`}>
                {s.value}
              </p>
              {/* Bar or sub-text */}
              {s.bar ? (
                <div className="w-full bg-neutral-100 rounded-full h-2 mt-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-700 ${severityChange <= 0 ? 'bg-green-400' : 'bg-red-400'}`}
                    style={{ width: `${Math.min(Math.abs(severityChange) * 100, 100)}%` }}
                  />
                </div>
              ) : (
                <p className="text-xs text-neutral-400">{s.sub}</p>
              )}
            </div>
          ))}
        </div>

        {/* ── Period Filter ──────────────────────────────── */}
        <div className="bg-white rounded-3xl p-6 shadow-soft border border-primary-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-mauve-500" />
              <span className="font-semibold text-neutral-700">Time Period</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { key: '7days',  label: 'Last 7 Days'  },
                { key: '30days', label: 'Last 30 Days' },
                { key: '90days', label: 'Last 90 Days' },
                { key: 'all',    label: 'All Time'     },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setSelectedPeriod(key)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border-none shadow-none
                  ${selectedPeriod === key
                    ? 'bg-gradient-to-r from-primary-400 to-mauve-400 text-white shadow-soft'
                    : 'bg-primary-50 text-neutral-600 hover:bg-primary-100'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Progress Timeline ──────────────────────────── */}
        <div className="bg-white rounded-3xl p-8 shadow-soft border border-primary-100">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-400 to-mauve-400 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-xl font-display font-bold text-neutral-800">Progress Timeline</h3>
          </div>

          {dataPoints.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {dataPoints.slice(-4).reverse().map((entry, index) => (
                <div
                  key={index}
                  className="bg-primary-50 rounded-2xl p-5 space-y-4 border border-primary-100
                  hover:shadow-soft hover:scale-[1.02] transition-all duration-300 animate-scaleIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <p className="text-xs font-semibold text-neutral-500">
                    {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>

                  {/* Severity bar */}
                  <div>
                    <div className="flex justify-between text-xs text-neutral-400 mb-1.5">
                      <span>Severity</span>
                      <span className="font-semibold">{Math.round(entry.severity_score * 100)}%</span>
                    </div>
                    <div className="w-full bg-white rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-primary-400 to-mauve-400 h-2.5 rounded-full transition-all duration-700"
                        style={{ width: `${Math.round(entry.severity_score * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Level badge */}
                  <div className={`${getSeverityBg(entry.severity_label)} rounded-xl px-3 py-2`}>
                    <p className="text-xs text-neutral-400 mb-0.5">Level</p>
                    <p className={`text-sm font-bold capitalize ${getSeverityColor(entry.severity_label)}`}>
                      {entry.severity_label?.replace('_', ' ') || 'N/A'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 space-y-4">
              <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mx-auto">
                <Camera className="w-10 h-10 text-primary-400" />
              </div>
              <h4 className="text-lg font-display font-semibold text-neutral-700">No Progress Data Yet</h4>
              <p className="text-neutral-400 text-sm max-w-xs mx-auto">
                Upload your first photo to start tracking your skin journey
              </p>
              <a href="/detection" className="btn-primary inline-flex items-center space-x-2">
                <Camera className="w-4 h-4" />
                <span>Start Your First Analysis</span>
              </a>
            </div>
          )}
        </div>

        {/* ── Chart + Insights ───────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* Chart */}
          <div className="bg-white rounded-3xl p-8 shadow-soft border border-primary-100">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-mauve-400 to-primary-500 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold text-neutral-800">Severity Over Time</h3>
            </div>

            {chartData.length > 0 ? (
              <div className="space-y-6">
                <div className="h-56 bg-primary-50 rounded-2xl px-6 pt-4 pb-2 flex items-end justify-between gap-2">
                  {chartData.map((point, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full bg-gradient-to-t from-primary-400 to-mauve-300 rounded-t-xl
                        transition-all duration-500 hover:opacity-80 min-h-3 shadow-soft"
                        style={{ height: `${point.height * 1.6}px` }}
                        title={`${point.severity} — ${point.height}%`}
                      />
                      <span className="text-xs text-neutral-400 text-center leading-tight">{point.label}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-neutral-400">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary-400 to-mauve-300" />
                  <span>Severity Score (%)</span>
                </div>
              </div>
            ) : (
              <div className="h-56 bg-primary-50 rounded-2xl flex items-center justify-center">
                <p className="text-neutral-400 text-sm">No data to display yet</p>
              </div>
            )}
          </div>

          {/* Key Insights */}
          <div className="bg-gradient-to-br from-primary-200 via-primary-400 to-primary-600 rounded-3xl p-8 shadow-dusty-lg text-white space-y-5">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <img src="/logo1.png" alt="AcneAI Logo" className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold">Key Insights</h3>
            </div>

            {[
              {
                icon: <TrendingUp className="w-4 h-4" />,
                title: insight.title,
                body: insight.message,
              },
              {
                icon: <Calendar className="w-4 h-4" />,
                title: 'Tracking Period',
                body: `You have ${totalScans} scan${totalScans !== 1 ? 's' : ''} over the past ${progressData?.period_days || 30} days.${totalScans < 3 ? ' Upload more photos for better insights!' : ''}`,
              },
              {
                icon: <Heart className="w-4 h-4" />,
                title: 'Recommendation',
                body: trend === 'improving'
                  ? 'Your progress is great! Continue your current routine.'
                  : trend === 'worsening'
                  ? 'Consider consulting a dermatologist for personalized advice.'
                  : 'Upload photos regularly for more accurate tracking.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 space-y-1.5 border border-white/10">
                <div className="flex items-center space-x-2 text-primary-100">
                  {item.icon}
                  <h4 className="font-semibold text-sm">{item.title}</h4>
                </div>
                <p className="text-primary-200 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProgressPage;