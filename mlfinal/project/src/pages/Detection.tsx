import React, { useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

const Detection = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Breast Cancer Detection
        </h1>
        <p className="text-gray-600">
          Upload a mammogram image for AI-powered analysis
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm">
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
              <img
                src={preview}
                alt="Selected"
                className="max-w-full h-64 object-contain mb-4"
              />
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
            <button className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors">
              Analyze Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Detection;