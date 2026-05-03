import React, { useState, useRef, useCallback } from 'react';
import { Upload, Camera, AlertCircle, Loader, CheckCircle, TrendingUp, X, ZoomIn } from 'lucide-react';
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

  // ── Camera state ─────────────────────────────────
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // ── Existing: file input handler ─────────────────
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

  // ── NEW: Camera helpers ───────────────────────────

  const openCamera = useCallback(async () => {
    setIsCameraOpen(true);
    setIsCameraLoading(true);
    setIsCameraReady(false);
    setError('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;

      // Wait for modal to mount, then attach stream
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            setIsCameraLoading(false);
            setIsCameraReady(true);
          };
        }
      }, 100);
    } catch (err) {
      setIsCameraLoading(false);
      setIsCameraOpen(false);
      if (err.name === 'NotAllowedError') {
        setError('Camera access was denied. Please allow camera permissions in your browser and try again.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device.');
      } else {
        setError('Could not access camera. Please try uploading an image instead.');
      }
    }
  }, []);

  const closeCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
    setIsCameraReady(false);
    setIsCameraLoading(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !isCameraReady) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');

    // Mirror the capture to match what user sees
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setError('Failed to capture photo. Please try again.');
          return;
        }

        // Convert blob → File so it feeds into the exact same upload pipeline
        const file = new File([blob], `camera-capture-${Date.now()}.jpg`, {
          type: 'image/jpeg',
        });

        if (file.size > 10 * 1024 * 1024) {
          setError('Captured image is too large. Please try again.');
          closeCamera();
          return;
        }

        setSelectedImage(file);
        const reader = new FileReader();
        reader.onloadend = () => setPreviewUrl(reader.result);
        reader.readAsDataURL(file);
        setAnalysisResult(null);
        setTreatmentData(null);
        setError('');

        closeCamera();
      },
      'image/jpeg',
      0.92
    );
  }, [isCameraReady, closeCamera]);

  // ── Existing: analyze handler ─────────────────────
  const handleAnalyze = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    setProgress(10);
    setError('');

    try {
      const uploadResponse = await analysisService.uploadImage(selectedImage);
      console.log('Upload response:', uploadResponse);

      if (!uploadResponse.success || !uploadResponse.data?.job_id) {
        throw new Error('Job ID not found in upload response.');
      }

      const { job_id } = uploadResponse.data;
      setProgress(30);

      const resultId = await analysisService.pollUntilComplete(
        job_id,
        (p) => setProgress(30 + Math.floor(p * 0.6))
      );
      setProgress(90);

      const resultResponse = await resultsService.getResult(resultId);
      if (!resultResponse.success) throw new Error('Failed to fetch result.');
      const result = resultResponse.data;

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

  // Severity color helpers (unchanged)
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

              {/* ── Camera Option (UPDATED) ─────────────────── */}
              <div className="card">
                <h3 className="text-xl font-display font-semibold text-neutral-800 mb-6">
                  Take a Photo
                </h3>

                <button
                  onClick={openCamera}
                  className="w-full cursor-pointer focus:outline-none bg-transparent border-none shadow-none p-0"
                  type="button"
                >
                  <div className="border-3 border-dashed border-primary-300 rounded-3xl p-12 text-center hover:border-primary-500 hover:bg-primary-50 transition-all duration-300">
                    <Camera className="w-16 h-16 mx-auto text-primary-400 mb-4" />
                    <h4 className="font-semibold text-neutral-800 mb-2">
                      Click to open camera
                    </h4>
                    <p className="text-sm text-neutral-600">
                      Use your device camera for instant capture
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Results Section (unchanged) */}
            <div>
              {analysisResult ? (
                <div className="space-y-6 animate-fadeIn">
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

                  {analysisResult.disclaimer && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <p className="text-xs text-yellow-800">{analysisResult.disclaimer}</p>
                    </div>
                  )}

                  {treatmentData && analysisResult.has_acne && (
                    <>
                      {treatmentData.recommendations?.medicated?.length > 0 && (
                        <div className="card">
                          <h4 className="font-display font-semibold text-lg text-neutral-800 mb-4">
                            Medicated Treatments
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

                      {treatmentData.recommendations?.herbal?.length > 0 && (
                        <div className="card">
                          <h4 className="font-display font-semibold text-lg text-neutral-800 mb-4">
                            Herbal Remedies
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

                      {treatmentData.see_dermatologist && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                          <p className="text-red-700 font-semibold text-sm">
                            ⚠️ Based on your severity level, we strongly recommend consulting a licensed dermatologist.
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  <div className="space-y-3">
                    <button onClick={resetAnalysis} className="btn-outline w-full">
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

      {/* ── Camera Modal ──────────────────────────────────── */}
      {isCameraOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
        >
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl w-full max-w-lg">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <h3 className="text-lg font-display font-semibold text-neutral-800">
                Take a Photo
              </h3>
              <button
                onClick={closeCamera}
                className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors"
                type="button"
              >
                <X className="w-5 h-5 text-neutral-600" />
              </button>
            </div>

            {/* Video Feed */}
            <div className="relative bg-black" style={{ aspectRatio: '4/3' }}>
              {isCameraLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 z-10">
                  <Loader className="w-10 h-10 text-white animate-spin" />
                  <p className="text-white text-sm">Starting camera...</p>
                </div>
              )}

              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{
                  transform: 'scaleX(-1)', // mirror so it feels natural
                  opacity: isCameraReady ? 1 : 0,
                  transition: 'opacity 0.3s ease',
                }}
              />

              {/* Face guide overlay */}
              {isCameraReady && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div
                    className="rounded-full border-2 border-dashed border-white/50"
                    style={{ width: '55%', aspectRatio: '3/4' }}
                  />
                </div>
              )}
            </div>

            {/* Tip + Capture Button */}
            <div className="px-6 py-5 space-y-4">
              {isCameraReady && (
                <p className="text-xs text-neutral-500 text-center">
                  Center your face inside the guide and ensure good lighting
                </p>
              )}

              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={closeCamera}
                  className="btn-secondary px-6"
                  type="button"
                >
                  Cancel
                </button>

                <button
                  onClick={capturePhoto}
                  disabled={!isCameraReady}
                  className="btn-primary flex iems-center px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                  type="button"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Capture
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetectionPage;