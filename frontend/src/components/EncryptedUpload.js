"use client";
import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export default function EncryptedDocumentUpload({ onUpload }) {
  const wallet = useWallet();
  const [file, setFile] = useState(null);
  const [encrypting, setEncrypting] = useState(false);

  const handleEncryptAndUpload = async () => {
    if (!file) return;

    setEncrypting(true);
    try {
      // Read file
      const fileBuffer = await file.arrayBuffer();
      const fileData = new Uint8Array(fileBuffer);

      // Simulate encryption (in production, use Arcium)
      const encrypted = fileData;
      
      // Generate hash
      const hashBuffer = await crypto.subtle.digest('SHA-256', fileData);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // Call upload callback
      onUpload({
        encryptedData: Array.from(encrypted),
        hash,
        metadata: {
          filename: file.name,
          size: file.size
        }
      });

    } catch (error) {
      console.error('Encryption failed:', error);
      alert('Failed to encrypt document');
    } finally {
      setEncrypting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-purple-300 rounded-xl p-6 bg-purple-50">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="hidden"
          id="encrypted-upload"
          accept=".pdf,.jpg,.png"
        />
        <label htmlFor="encrypted-upload" className="cursor-pointer">
          {file ? (
            <div className="text-center">
              <span className="text-2xl">🔒</span>
              <p className="font-medium text-purple-700 mt-2">{file.name}</p>
              <p className="text-xs text-purple-500">Ready to encrypt</p>
            </div>
          ) : (
            <div className="text-center">
              <span className="text-4xl">🔐</span>
              <p className="mt-2 text-gray-600">Click to upload encrypted document</p>
              <p className="text-xs text-purple-600 mt-1">PDF, JPG, or PNG</p>
            </div>
          )}
        </label>
      </div>

      {file && (
        <button
          onClick={handleEncryptAndUpload}
          disabled={encrypting}
          className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all duration-300 disabled:bg-gray-400 flex items-center justify-center gap-2"
        >
          {encrypting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Encrypting...
            </>
          ) : (
            <>
              <span>🔐</span> Encrypt & Upload
            </>
          )}
        </button>
      )}
    </div>
  );
}