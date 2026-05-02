import React, { useState } from 'react';
import { Upload, AlertCircle, CheckCircle, XCircle, Loader, ShieldCheck } from 'lucide-react';
import productScannerService from '../../services/productScannerService';

const ProductScanner = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
      setResult(null);
      setError('');
    }
  };

  const handleScan = async () => {
    if (!selectedImage) return;
    setIsScanning(true);
    setError('');

    try {
      const response = await productScannerService.scanProduct(selectedImage);
      if (response.success) {
        setResult(response.data);
      } else {
        setError('Failed to analyze product. Please try again.');
      }
    } catch (err) {
      const msg = err.response?.data?.detail?.message
        || err.response?.data?.message
        || 'Failed to scan product. Make sure ingredients list is clearly visible.';
      setError(msg);
    } finally {
      setIsScanning(false);
    }
  };

  const getRatingColor = (rating) => {
    if (rating === 'Safe') return 'text-green-600 bg-green-50 border-green-200';
    if (rating === 'Use with Caution') return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getRatingIcon = (rating) => {
    if (rating === 'Safe') return <CheckCircle className="w-6 h-6 text-green-500" />;
    if (rating === 'Use with Caution') return <AlertCircle className="w-6 h-6 text-yellow-500" />;
    return <XCircle className="w-6 h-6 text-red-500" />;
  };

  const getScoreColor = (score) => {
    if (score >= 7) return 'from-green-400 to-green-500';
    if (score >= 4) return 'from-yellow-400 to-yellow-500';
    return 'from-red-400 to-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="section-container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4 animate-fadeIn">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-neutral-800">
            Product <span className="gradient-text">Scanner</span>
          </h1>
          <p className="text-lg text-neutral-600">
            Upload a photo of your product's ingredients list and we'll tell you if it's safe for your acne type
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
                  <li>• Take photo in good lighting</li>
                  <li>• Make sure the full ingredients list is visible</li>
                  <li>• Keep camera steady to avoid blur</li>
                  <li>• Include the entire ingredients section</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="max-w-4xl mx-auto mb-6 bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-xl font-display font-semibold text-neutral-800 mb-6">
                  Upload Ingredients Photo
                </h3>

                {!previewUrl ? (
                  <label className="block cursor-pointer">
                    <div className="border-3 border-dashed border-primary-300 rounded-3xl p-12 text-center hover:border-primary-500 hover:bg-primary-50 transition-all duration-300">
                      <Upload className="w-16 h-16 mx-auto text-primary-400 mb-4" />
                      <h4 className="font-semibold text-neutral-800 mb-2">
                        Click to upload ingredients photo
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
                      <img src={previewUrl} alt="Product" className="w-full h-auto" />
                      {isScanning && (
                        <div className="absolute inset-0 bg-primary-500/90 flex flex-col items-center justify-center space-y-4">
                          <Loader className="w-12 h-12 text-white animate-spin" />
                          <p className="text-white font-semibold">Reading ingredients...</p>
                          <p className="text-white/70 text-sm">Analyzing with AI...</p>
                        </div>
                      )}
                    </div>

                    {!result && !isScanning && (
                      <div className="flex space-x-3">
                        <button onClick={handleScan} className="btn-primary flex-1">
                          <ShieldCheck className="w-5 h-5 mr-2" />
                          Scan Ingredients
                        </button>
                        <button
                          onClick={() => { setSelectedImage(null); setPreviewUrl(null); setResult(null); }}
                          className="btn-secondary"
                        >
                          Change
                        </button>
                      </div>
                    )}

                    {result && !isScanning && (
                      <button
                        onClick={() => { setSelectedImage(null); setPreviewUrl(null); setResult(null); }}
                        className="btn-outline w-full"
                      >
                        Scan Another Product
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Acne Profile Card */}
              {result?.acne_profile && (
                <div className="card bg-primary-50 border-primary-200">
                  <h4 className="font-semibold text-neutral-800 mb-3">
                    Personalized For Your Skin
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Acne Types:</span>
                      <span className="font-medium text-primary-600 capitalize">
                        {result.acne_profile.acne_types?.join(', ') || 'Not scanned yet'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Severity:</span>
                      <span className="font-medium text-primary-600 capitalize">
                        {result.acne_profile.severity?.replace('_', ' ') || 'Not scanned yet'}
                      </span>
                    </div>
                  </div>
                  {!result.acne_profile.severity && (
                    <p className="text-xs text-yellow-600 mt-2">
                      ⚠️ Do an acne scan first for personalized results
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Results Section */}
            <div>
              {result?.analysis ? (
                <div className="space-y-6 animate-fadeIn">
                  {/* Overall Rating */}
                  <div className={`card border-2 ${getRatingColor(result.analysis.overall_rating)}`}>
                    <div className="flex items-center space-x-3 mb-4">
                      {getRatingIcon(result.analysis.overall_rating)}
                      <div>
                        <h3 className="text-xl font-display font-bold">
                          {result.analysis.overall_rating}
                        </h3>
                        <p className="text-sm text-neutral-600 capitalize">
                          {result.analysis.product_name}
                        </p>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-neutral-600">Suitability Score</span>
                        <span className="font-bold">{result.analysis.suitability_score}/10</span>
                      </div>
                      <div className="w-full bg-white rounded-full h-3">
                        <div
                          className={`bg-gradient-to-r ${getScoreColor(result.analysis.suitability_score)} h-3 rounded-full transition-all duration-1000`}
                          style={{ width: `${result.analysis.suitability_score * 10}%` }}
                        ></div>
                      </div>
                    </div>

                    <p className="text-sm text-neutral-700">{result.analysis.recommendation}</p>
                  </div>

                  {/* Harmful Ingredients */}
                  {result.analysis.harmful_ingredients?.length > 0 && (
                    <div className="card border border-red-200">
                      <h4 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
                        <XCircle className="w-5 h-5" /> Harmful Ingredients Found
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.analysis.harmful_ingredients.map((ing, i) => (
                          <span key={i} className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium border border-red-200">
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Comedogenic Ingredients */}
                  {result.analysis.comedogenic_ingredients?.length > 0 && (
                    <div className="card border border-yellow-200">
                      <h4 className="font-semibold text-yellow-600 mb-3 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" /> Pore-Clogging Ingredients
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.analysis.comedogenic_ingredients.map((ing, i) => (
                          <span key={i} className="px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full text-xs font-medium border border-yellow-200">
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Beneficial Ingredients */}
                  {result.analysis.beneficial_ingredients?.length > 0 && (
                    <div className="card border border-green-200">
                      <h4 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" /> Beneficial Ingredients
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.analysis.beneficial_ingredients.map((ing, i) => (
                          <span key={i} className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium border border-green-200">
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Alternative Suggestions */}
                  {result.analysis.alternative_suggestions?.length > 0 && (
                    <div className="card bg-white from-primary-500 via-secondary-400 to-primary-600 text-black border-none">
                      <h4 className="font-semibold text-lg mb-4">Better Alternatives</h4>
                      <ul className="space-y-2">
                        {result.analysis.alternative_suggestions.map((alt, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <span className="text-black/80 mt-1">•</span>
                            <span className="text-primary-50 text-black">{alt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Disclaimer */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <p className="text-xs text-yellow-800">{result.analysis.disclaimer}</p>
                  </div>
                </div>
              ) : (
                <div className="card h-full flex flex-col items-center justify-center text-center p-12">
                  <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mb-6">
                    <ShieldCheck className="w-10 h-10 text-primary-500" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-neutral-800 mb-3">
                    No Scan Yet
                  </h3>
                  <p className="text-neutral-600">
                    Upload a photo of your product's ingredients list to check if it's safe for your acne type
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

export default ProductScanner;