import React, { useState } from 'react';
import { Upload, Image as ImageIcon, AlertTriangle } from 'lucide-react';

interface Region {
  id: number;
  location: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  area: number;
  density: number;
  suspicion_level: 'high' | 'medium' | 'low';
}

interface AnalysisResult {
  result: string;
  class: string;
  confidence: number;
  risk_level: string;
  regions: Region[];
  recommendations: string[];
}

const Detection = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setResult(null);
      setError('');
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      console.log('Sending request to server...');
      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      if (data.error) {
        throw new Error(data.error);
      }
      
      setResult(data);
    } catch (error) {
      console.error('Error analyzing image:', error);
      setError(error instanceof Error ? error.message : 'Error analyzing image. Please try again.');
      setResult(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskLevelColor = (risk_level: string) => {
    switch (risk_level?.toLowerCase()) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-green-600 bg-green-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Breast Cancer Detection
          </h1>
          <p className="text-gray-600">
            Upload a mammogram image for AI-powered analysis
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start justify-center gap-8">
          <div className="w-full lg:w-1/2 bg-white p-8 rounded-xl shadow-sm">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center cursor-pointer"
              >
                {preview ? (
                  <div className="w-full flex justify-center">
                    <img
                      src={preview}
                      alt="Selected"
                      className="max-w-full h-64 object-contain mb-4"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="h-12 w-12 text-gray-400 mb-4" />
                    <ImageIcon className="h-24 w-24 text-gray-300 mb-4" />
                    <p className="text-gray-600 text-center">
                      Drag and drop your image here, or click to select
                    </p>
                  </div>
                )}
              </label>
            </div>

            {selectedFile && (
              <div className="mt-6 text-center">
                <button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full max-w-xs mx-auto px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:bg-pink-300"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
                </button>
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-start">
                <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
          </div>

          {result && (
            <div className="w-full lg:w-1/2 space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Primary Analysis</h3>
                <div className={`text-lg mb-4 p-3 rounded-lg font-medium ${
                  result.class === 'Benign' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                }`}>
                  Classification: {result.class}
                </div>
                <div className="text-gray-700 mb-4">
                  Confidence: {result.confidence.toFixed(1)}%
                </div>
                <div className={`p-3 rounded-lg font-medium ${getRiskLevelColor(result.risk_level)}`}>
                  Risk Level: {result.risk_level}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Regions of Interest</h3>
                <div className="space-y-3">
                  {result.regions.map((region) => (
                    <div 
                      key={region.id}
                      className={`p-3 rounded-lg ${
                        region.suspicion_level === 'high' ? 'bg-red-50' :
                        region.suspicion_level === 'medium' ? 'bg-yellow-50' : 'bg-green-50'
                      }`}
                    >
                      <div className="font-medium mb-1">Region {region.id}</div>
                      <div className="text-sm text-gray-600">
                        Suspicion Level: {region.suspicion_level}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="text-gray-700">{rec}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> This is an AI-assisted analysis and should not be used as a definitive diagnosis. 
                  Please consult with a healthcare professional for proper medical evaluation.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Detection;