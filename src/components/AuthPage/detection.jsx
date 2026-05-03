import React, { useState } from 'react';
import { Upload, Camera, AlertCircle, Loader, CheckCircle, TrendingUp } from 'lucide-react';
import analysisService from '../../services/analysisService';
import resultsService from '../../services/resultsService';
import treatmentService from '../../services/treatmentService';

const DetectionPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [treatmentData, setTreatmentData] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Image must be under 10MB.');
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
      setAnalysisResult(null);
      setTreatmentData(null);
      setError('');
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    setProgress(10);
    setError('');

    try {
      // Step 1: Upload image
      const uploadResponse = await analysisService.uploadImage(selectedImage);
      console.log('Upload response:', uploadResponse);

      // ← FIX: job_id is inside uploadResponse.data
      if (!uploadResponse.success || !uploadResponse.data?.job_id) {
        throw new Error('Job ID not found in upload response.');
      }

      const { job_id } = uploadResponse.data;
      setProgress(30);

      // Step 2: Poll until complete
      const resultId = await analysisService.pollUntilComplete(
        job_id,
        (p) => setProgress(30 + Math.floor(p * 0.6))
      );
      setProgress(90);

      // Step 3: Fetch result
      const resultResponse = await resultsService.getResult(resultId);
      if (!resultResponse.success) throw new Error('Failed to fetch result.');
      const result = resultResponse.data;

      // Step 4: Fetch treatments
      const treatmentResponse = await treatmentService.getTreatment(resultId);
      if (treatmentResponse.success) setTreatmentData(treatmentResponse.data);

      setProgress(100);
      setAnalysisResult(result);

    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setTreatmentData(null);
    setProgress(0);
    setError('');
  };

  // Severity color helper
  const getSeverityColor = (severity) => {
    const colors = {
      mild: 'text-green-600',
      moderate: 'text-yellow-600',
      severe: 'text-orange-600',
      very_severe: 'text-red-600',
    };
    return colors[severity] || 'text-primary-600';
  };

  const getSeverityBg = (severity) => {
    const colors = {
      mild: 'bg-green-50',
      moderate: 'bg-yellow-50',
      severe: 'bg-orange-50',
      very_severe: 'bg-red-50',
    };
    return colors[severity] || 'bg-secondary-50';
  };

  return (
    <div className="p-12 min-h-screen bg-gradient-to-b from-primary-100 to-primary-300 w-full py-12 lg:py-20">
      <div className="section-container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4 animate-fadeIn">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-neutral-800">
            AI Acne <span className="gradient-text">Detection</span>
          </h1>
          <p className="text-lg text-neutral-600">
            Upload a clear, well-lit photo of your face for accurate analysis
          </p>
        </div>

        {/* Instructions */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-primary-100 border-l-4 border-primary-500 rounded-r-2xl p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-semibold text-neutral-800">For Best Results:</h3>
                <ul className="text-sm text-neutral-700 space-y-1">
                  <li>• Take photo in natural lighting</li>
                  <li>• Remove makeup and ensure face is clean</li>
                  <li>• Face camera directly with neutral expression</li>
                  <li>• Ensure entire face is visible and in focus</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm text-center">
              {error}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-xl font-display font-semibold text-neutral-800 mb-6">
                  Upload Your Image
                </h3>

                {!previewUrl ? (
                  <label className="block cursor-pointer">
                    <div className="border-3 border-dashed border-primary-300 rounded-3xl p-12 text-center hover:border-primary-500 hover:bg-primary-50 transition-all duration-300">
                      <Upload className="w-16 h-16 mx-auto text-primary-400 mb-4" />
                      <h4 className="font-semibold text-neutral-800 mb-2">
                        Click to upload or drag and drop
                      </h4>
                      <p className="text-sm text-neutral-600">PNG, JPG or JPEG (max. 10MB)</p>
                    </div>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="space-y-4">
                    <div className="relative rounded-2xl overflow-hidden">
                      <img src={previewUrl} alt="Preview" className="w-full h-auto" />
                      {isAnalyzing && (
                        <div className="absolute inset-0 bg-primary-500/90 flex flex-col items-center justify-center space-y-4">
                          <Loader className="w-12 h-12 text-white animate-spin" />
                          <p className="text-white font-semibold">Analyzing your image...</p>
                          <div className="w-48 bg-white/30 rounded-full h-2">
                            <div
                              className="bg-white h-2 rounded-full transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <p className="text-white/80 text-sm">{progress}%</p>
                        </div>
                      )}
                    </div>

                    {!analysisResult && !isAnalyzing && (
                      <div className="flex space-x-3">
                        <button onClick={handleAnalyze} className="btn-primary flex-1 flex items-center justify-center">
                          <Camera className="w-5 h-5 mr-2" />
                          Analyze Image
                        </button>
                        <button onClick={resetAnalysis} className="btn-secondary">
                          Change Photo
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Camera Option */}
              <div className="card">
                <h3 className="text-xl font-display font-semibold text-neutral-800 mb-6">
                  Take a Photo
                </h3>

                <label className="block cursor-pointer">
                  <div className="border-3 border-dashed border-primary-300 rounded-3xl p-12 text-center hover:border-primary-500 hover:bg-primary-50 transition-all duration-300">
                    <Camera className="w-16 h-16 mx-auto text-primary-400 mb-4" />
                    <h4 className="font-semibold text-neutral-800 mb-2">
                      Click to open camera
                    </h4>
                    <p className="text-sm text-neutral-600">
                      Use your device camera for instant capture
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    capture="user"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Results Section */}
            <div>
              {analysisResult ? (
                <div className="space-y-6 animate-fadeIn">
                  {/* Main Results */}
                  <div className="card">
                    <div className="flex items-center space-x-2 mb-6">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      <h3 className="text-xl font-display font-semibold text-neutral-800">
                        Analysis Complete
                      </h3>
                    </div>

                    {analysisResult.has_acne ? (
                      <>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="bg-primary-50 rounded-2xl p-4">
                            <p className="text-sm text-neutral-600 mb-1">Acne Types</p>
                            <p className="text-lg font-display font-bold text-primary-600 capitalize">
                              {analysisResult.acne_types?.join(', ') || 'N/A'}
                            </p>
                          </div>
                          <div className={`${getSeverityBg(analysisResult.severity)} rounded-2xl p-4`}>
                            <p className="text-sm text-neutral-600 mb-1">Severity</p>
                            <p className={`text-xl font-display font-bold capitalize ${getSeverityColor(analysisResult.severity)}`}>
                              {analysisResult.severity?.replace('_', ' ') || 'N/A'}
                            </p>
                          </div>
                        </div>

                        <div className="bg-accent-50 rounded-2xl p-4">
                          <p className="text-sm text-neutral-600 mb-2">Confidence Score</p>
                          <div className="flex items-center space-x-3">
                            <div className="flex-1 bg-white rounded-full h-3">
                              <div
                                className="bg-gradient-to-r from-primary-400 to-secondary-400 h-3 rounded-full transition-all duration-1000"
                                style={{ width: `${Math.round((analysisResult.confidence || 0) * 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-lg font-bold text-accent-600">
                              {Math.round((analysisResult.confidence || 0) * 100)}%
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-6">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h4 className="text-xl font-bold text-green-600 mb-2">No Acne Detected! 🎉</h4>
                        <p className="text-neutral-600">Your skin looks clear. Keep up your skincare routine!</p>
                      </div>
                    )}
                  </div>

                  {/* Disclaimer */}
                  {analysisResult.disclaimer && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <p className="text-xs text-yellow-800">{analysisResult.disclaimer}</p>
                    </div>
                  )}

                  {/* Treatments */}
                  {treatmentData && analysisResult.has_acne && (
                    <>
                      {/* Medicated */}
                      {treatmentData.recommendations?.medicated?.length > 0 && (
                        <div className="card">
                          <h4 className="font-display font-semibold text-lg text-neutral-800 mb-4">
                            💊 Medicated Treatments
                          </h4>
                          <ul className="space-y-3">
                            {treatmentData.recommendations.medicated.map((t, i) => (
                              <li key={i} className="bg-primary-50 rounded-xl p-3">
                                <p className="font-semibold text-primary-700">{t.name}</p>
                                <p className="text-sm text-neutral-600 mt-1">{t.description}</p>
                                <p className="text-xs text-neutral-500 mt-1">
                                  {t.frequency} · {t.application_method}
                                </p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Herbal */}
                      {treatmentData.recommendations?.herbal?.length > 0 && (
                        <div className="card">
                          <h4 className="font-display font-semibold text-lg text-neutral-800 mb-4">
                            🌿 Herbal Remedies
                          </h4>
                          <ul className="space-y-3">
                            {treatmentData.recommendations.herbal.map((t, i) => (
                              <li key={i} className="bg-green-50 rounded-xl p-3">
                                <p className="font-semibold text-green-700">{t.name}</p>
                                <p className="text-sm text-neutral-600 mt-1">{t.description}</p>
                                <p className="text-xs text-neutral-500 mt-1">
                                  {t.frequency} · {t.application_method}
                                </p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Lifestyle Tips */}
                      {treatmentData.lifestyle_tips?.length > 0 && (
                        <div className="card bg-gradient-to-br from-primary-500 via-secondary-400 to-primary-600 text-white border-none">
                          <h4 className="font-display font-semibold text-lg mb-4 flex items-center space-x-2">
                            <TrendingUp className="w-5 h-5" />
                            <span>Lifestyle Tips</span>
                          </h4>
                          <ul className="space-y-3">
                            {treatmentData.lifestyle_tips.map((tip, i) => (
                              <li key={i} className="flex items-start space-x-3">
                                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-white text-xs font-bold">✓</span>
                                </div>
                                <span className="text-primary-50">{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* See Dermatologist Warning */}
                      {treatmentData.see_dermatologist && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                          <p className="text-red-700 font-semibold text-sm">
                            ⚠️ Based on your severity level, we strongly recommend consulting a licensed dermatologist.
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={resetAnalysis}
                      className="btn-outline w-full"
                    >
                      Analyze Another Photo
                    </button>
                  </div>
                </div>
              ) : (
                <div className="card h-full flex flex-col items-center justify-center text-center p-12">
                  <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mb-6">
                    <Camera className="w-10 h-10 text-primary-500" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-neutral-800 mb-3">
                    No Analysis Yet
                  </h3>
                  <p className="text-neutral-600">
                    Upload a photo to get started with AI-powered acne detection and personalized recommendations
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectionPage;