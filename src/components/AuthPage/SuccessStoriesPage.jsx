import React, { useState, useEffect } from 'react';
import { Heart, Send, Sparkles, User } from 'lucide-react';
import storiesService from '../../services/storiesService';

const SuccessStoriesPage = () => {
  const [stories, setStories]       = useState([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm]     = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [fetchError, setFetchError] = useState('');
  const [formError, setFormError]   = useState('');
  const [likedStories, setLikedStories] = useState(() => {
    const saved = localStorage.getItem('likedStories');
    return saved ? JSON.parse(saved) : [];
  });
  const [form, setForm] = useState({ username: '', story: '' });

  useEffect(() => { fetchStories(); }, []);

  const fetchStories = async () => {
    setIsLoading(true);
    setFetchError('');
    try {
      const data = await storiesService.getStories();
      setStories(data);
    } catch {
      setFetchError('Could not load stories. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.username.trim() || !form.story.trim()) {
      setFormError('Please fill in both your name and story.'); return;
    }
    if (form.story.trim().length < 20) {
      setFormError('Story must be at least 20 characters.'); return;
    }
    setIsSubmitting(true);
    setFormError('');
    try {
      await storiesService.submitStory(form);
      setSuccessMsg('Your story has been shared! 🎉');
      setForm({ username: '', story: '' });
      setShowForm(false);
      fetchStories();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch {
      setFormError('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (id) => {
    if (likedStories.includes(id)) return;
    try {
      await storiesService.likeStory(id);
      const updated = [...likedStories, id];
      setLikedStories(updated);
      localStorage.setItem('likedStories', JSON.stringify(updated));
      setStories(prev => prev.map(s => s.id === id ? { ...s, likes: s.likes + 1 } : s));
    } catch { console.error('Like failed'); }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="min-h-screen bg-primary-50">

      {/* ── Hero Banner ───────────────────────────────────────────── */}
      <section className="w-full bg-gradient-to-br from-primary-100 to-mauve-100 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-4">
          <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-600 px-4 py-2 rounded-full border border-primary-200">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Real People, Real Results</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-neutral-800">
            Success <span className="gradient-text">Stories</span>
          </h1>
          <p className="text-lg text-neutral-500 max-w-xl mx-auto">
            Read how others transformed their skin. Share your own journey and inspire someone today.
          </p>
          <button
            onClick={() => { setShowForm(!showForm); setFormError(''); }}
            className="btn-primary inline-flex items-center space-x-2 mt-2"
          >
            <Send className="w-4 h-4" />
            <span>{showForm ? 'Cancel' : 'Share Your Story'}</span>
          </button>
        </div>
      </section>

      {/* ── Submit Form ───────────────────────────────────────────── */}
      {showForm && (
        <section className="max-w-2xl mx-auto px-6 py-10">
          <div className="card space-y-4">
            <h2 className="text-xl font-display font-bold text-neutral-800">Your Story</h2>
            {formError && (
              <p className="text-sm text-mauve-600 bg-mauve-50 px-4 py-2 rounded-xl">{formError}</p>
            )}
            <input
              value={form.username}
              onChange={(e) => setForm(p => ({ ...p, username: e.target.value }))}
              placeholder="Your name or nickname"
              maxLength={30}
              className="rounded-xl p-2 input-field"
            />
            <br />
            <textarea
              value={form.story}
              onChange={(e) => setForm(p => ({ ...p, story: e.target.value }))}
              placeholder="Share your acne journey... What worked for you? How did AcneAI help?"
              rows={5}
              maxLength={500}
              className="rounded-xl p-2 input-field resize-none w-full story-textarea"
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-neutral-400">{form.story.length}/500</span>
              <button onClick={handleSubmit} disabled={isSubmitting} className="btn-primary flex items-center space-x-2">
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Sharing...' : 'Share Story'}</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Success toast */}
      {successMsg && (
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-mauve-100 text-mauve-700 text-center py-3 rounded-2xl font-semibold text-sm">
            {successMsg}
          </div>
        </div>
      )}

      {/* ── Stories Grid ──────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-12">

        {isLoading && (
          <div className="text-center py-20 text-neutral-400">
            <Sparkles className="w-10 h-10 mx-auto text-primary-300 animate-pulse mb-3" />
            <p>Loading stories...</p>
          </div>
        )}

        {!isLoading && fetchError && (
          <div className="text-center py-20 text-mauve-500">⚠️ {fetchError}</div>
        )}

        {!isLoading && stories.length === 0 && !fetchError && (
          <div className="text-center py-20 space-y-3">
            <Heart className="w-12 h-12 mx-auto text-primary-200" />
            <p className="text-lg font-display font-semibold text-neutral-700">No stories yet</p>
            <p className="text-neutral-400 text-sm">Be the first to share your journey!</p>
          </div>
        )}

        <div className="grid md:grid-cols-1 gap-6">
          {stories.map((story) => (
            <div key={story.id} className="p-4 bg-primary-200 rounded-xl card hover:scale-[1.02] transition-transform duration-300">
              {/* Card header */}
              <div className="flex items-center space-x-3 mb-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-200 to-mauve-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-700 font-bold text-sm">
                    {story.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-neutral-800 text-sm">{story.username}</p>
                  <p className="text-xs text-neutral-600">{formatDate(story.created_at)}</p>
                </div>
                {/* Like button */}
                <button
                  onClick={() => handleLike(story.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border transition-all duration-200 ${
                    likedStories.includes(story.id)
                      ? 'bg-primary-50 border-primary-300'
                      : 'bg-white border-neutral-200 hover:border-primary-200'
                  }`}
                >
                  <Heart
                    className="w-3.5 h-3.5"
                    fill={likedStories.includes(story.id) ? '#f5629d' : 'none'}
                    color={likedStories.includes(story.id) ? '#f5629d' : '#b0a89f'}
                  />
                  <span className={`text-xs font-semibold ${likedStories.includes(story.id) ? 'text-primary-500' : 'text-neutral-400'}`}>
                    {story.likes}
                  </span>
                </button>
              </div>

              {/* Story text */}
              <p className="text-neutral-600 text-sm leading-relaxed">{story.story}</p>
            </div>
          ))}
        </div>

        {/* Count */}
        {stories.length > 0 && (
          <p className="text-center text-neutral-400 text-sm mt-10">
            {stories.length} {stories.length === 1 ? 'story' : 'stories'} shared 
          </p>
        )}
      </section>
    </div>
  );
};

export default SuccessStoriesPage;