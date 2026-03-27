import React, { useState } from 'react';
import { Upload, Camera, AlertCircle, Loader, CheckCircle, TrendingUp } from 'lucide-react';

const DetectionPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setAnalysisResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    
    // Simulate AI analysis - Replace with actual API call
    setTimeout(() => {
      setAnalysisResult({
        acneType: 'Papulopustular',
        severity: 'Moderate',
        confidence: 87,
        recommendations: [
          'Use a gentle, non-comedogenic cleanser twice daily',
          'Apply topical treatment with salicylic acid or benzoyl peroxide',
          'Maintain a consistent sleep schedule (7-8 hours)',
          'Stay hydrated (8 glasses of water daily)',
          'Avoid touching your face throughout the day'
        ],
        causes: [
          'Hormonal fluctuations',
          'Bacterial inflammation',
          'Excess sebum production'
        ]
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
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
                      <p className="text-sm text-neutral-600">
                        PNG, JPG or JPEG (max. 5MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="space-y-4">
                    <div className="relative rounded-2xl overflow-hidden">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-auto"
                      />
                      {isAnalyzing && (
                        <div className="absolute inset-0 bg-primary-500/90 flex flex-col items-center justify-center space-y-4">
                          <Loader className="w-12 h-12 text-white animate-spin" />
                          <p className="text-white font-semibold">Analyzing your image...</p>
                        </div>
                      )}
                    </div>

                    {!analysisResult && !isAnalyzing && (
                      <div className="flex space-x-3">
                        <button
                          onClick={handleAnalyze}
                          className="btn-primary flex-1"
                        >
                          <Camera className="w-5 h-5 mr-2" />
                          Analyze Image
                        </button>
                        <button
                          onClick={resetAnalysis}
                          className="btn-secondary"
                        >
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

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-primary-50 rounded-2xl p-4">
                        <p className="text-sm text-neutral-600 mb-1">Acne Type</p>
                        <p className="text-xl font-display font-bold text-primary-600">
                          {analysisResult.acneType}
                        </p>
                      </div>
                      <div className="bg-secondary-50 rounded-2xl p-4">
                        <p className="text-sm text-neutral-600 mb-1">Severity</p>
                        <p className="text-xl font-display font-bold text-secondary-600">
                          {analysisResult.severity}
                        </p>
                      </div>
                    </div>

                    <div className="bg-accent-50 rounded-2xl p-4">
                      <p className="text-sm text-neutral-600 mb-2">Confidence Score</p>
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-white rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-primary-400 to-secondary-400 h-3 rounded-full"
                            style={{ width: `${analysisResult.confidence}%` }}
                          ></div>
                        </div>
                        <span className="text-lg font-bold text-accent-600">
                          {analysisResult.confidence}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Possible Causes */}
                  <div className="card">
                    <h4 className="font-display font-semibold text-lg text-neutral-800 mb-4">
                      Possible Causes
                    </h4>
                    <ul className="space-y-2">
                      {analysisResult.causes.map((cause, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <span className="text-primary-500 mt-1">•</span>
                          <span className="text-neutral-700">{cause}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendations */}
                  <div className="card bg-gradient-to-br from-primary-500 via-secondary-400 to-primary-600 text-white border-none">
                    <h4 className="font-display font-semibold text-lg mb-4 flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5" />
                      <span>Recommended Actions</span>
                    </h4>
                    <ul className="space-y-3">
                      {analysisResult.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-xs font-bold">✓</span>
                          </div>
                          <span className="text-primary-50">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button className="btn-primary w-full">
                      Save to Dashboard
                    </button>
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