"use client";
import { useState } from 'react';
import { Upload, CheckCircle, Loader2, FileText, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EncryptedDocumentUpload({ onUpload }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(selectedFile.type)) {
        toast.error('Please upload PDF, JPG, or PNG files only');
        return;
      }
      
      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      
      setFile(selectedFile);
      setVerificationResult(null);
      toast.success('File selected! Click upload to verify.');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    setUploading(true);
    const toastId = toast.loading('🤖 AI verifying document...');

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('document', file);
      formData.append('description', 'Medical emergency document');
      formData.append('amount', '1000');

      // Call AI API
      const response = await fetch('http://localhost:3001/api/verify-document', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Verification failed');
      }

      const result = await response.json();
      
      setVerificationResult(result);
      
      if (result.verified) {
        toast.success(
          <div>
            <p className="font-bold">✅ Document Verified!</p>
            <p className="text-sm">Score: {result.overallScore}% - {result.recommendation}</p>
          </div>,
          { id: toastId, duration: 5000 }
        );
        
        // Pass result to parent
        onUpload({
          hash: result.documentHash,
          verified: true,
          score: result.overallScore,
          metadata: result.metadata
        });
      } else {
        toast.error(
          <div>
            <p className="font-bold">⚠️ Verification Failed</p>
            <p className="text-sm">{result.recommendation}</p>
          </div>,
          { id: toastId, duration: 5000 }
        );
      }

    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to verify document. Is the AI API running?', { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* File Upload Area */}
      <div className="border-2 border-dashed border-purple-300 rounded-2xl p-6 bg-gradient-to-br from-purple-50 to-indigo-50 hover:border-purple-400 transition-all cursor-pointer">
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          id="doc-upload"
          accept=".pdf,.jpg,.jpeg,.png"
          disabled={uploading}
        />
        <label htmlFor="doc-upload" className="cursor-pointer">
          {file ? (
            <div className="text-center">
              <FileText size={48} className="mx-auto mb-3 text-purple-600" />
              <p className="font-bold text-purple-700 mb-1">{file.name}</p>
              <p className="text-sm text-gray-600">{(file.size / 1024).toFixed(1)} KB</p>
              <p className="text-xs text-purple-500 mt-2 flex items-center justify-center gap-1">
                <Shield size={14} />
                Ready for AI verification
              </p>
            </div>
          ) : (
            <div className="text-center">
              <Upload size={48} className="mx-auto mb-3 text-gray-400" />
              <p className="text-gray-700 font-medium mb-1">Click to upload document</p>
              <p className="text-xs text-gray-500">PDF, JPG, PNG (Max 5MB)</p>
            </div>
          )}
        </label>
      </div>

      {/* Upload Button */}
      {file && !verificationResult && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          {uploading ? (
            <>
              <Loader2 size={24} className="animate-spin" />
              AI Verifying...
            </>
          ) : (
            <>
              <Shield size={24} />
              Verify with AI
            </>
          )}
        </button>
      )}

      {/* Verification Result */}
      {verificationResult && (
        <div className={`rounded-2xl p-6 border-2 ${
          verificationResult.verified 
            ? 'bg-green-50 border-green-300' 
            : 'bg-red-50 border-red-300'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            {verificationResult.verified ? (
              <CheckCircle size={32} className="text-green-600" />
            ) : (
              <Shield size={32} className="text-red-600" />
            )}
            <div>
              <p className="font-bold text-lg">
                {verificationResult.verified ? 'Verified ✅' : 'Not Verified ⚠️'}
              </p>
              <p className="text-sm text-gray-600">{verificationResult.recommendation}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white rounded-lg p-3">
              <p className="text-gray-600 mb-1">Overall Score</p>
              <p className="font-bold text-xl text-purple-600">{verificationResult.overallScore}%</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-gray-600 mb-1">Authenticity</p>
              <p className="font-bold text-xl text-green-600">
                {verificationResult.aiAnalysis.confidence.authenticity}%
              </p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-gray-600 mb-1">Risk Level</p>
              <p className="font-bold text-blue-600">
                {verificationResult.aiAnalysis.confidence.riskLevel}
              </p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-gray-600 mb-1">Processing</p>
              <p className="font-bold text-purple-600">{verificationResult.processingTime}</p>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-4 font-mono break-all">
            Hash: {verificationResult.documentHash.substring(0, 32)}...
          </p>
        </div>
      )}
    </div>
  );
}