"use client";

import { useState } from "react";

export default function TestUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setError(null);
    setImageUrl(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'upload");
      }
      
      setImageUrl(data.url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          🚀 Test Upload R2
        </h1>
        
        <div className="space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full p-3 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
              !file || uploading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {uploading ? "⏳ Envoi en cours..." : "⬆️ Uploader l'image"}
          </button>
          
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm border border-red-200">
              ❌ {error}
            </div>
          )}
          
          {imageUrl && (
            <div className="mt-6 space-y-3">
              <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm border border-green-200">
                ✅ Upload réussi avec succès dans le bucket Cloudflare !
              </div>
              <div className="p-2 bg-gray-100 text-xs text-gray-600 rounded break-all border border-gray-200 font-mono">
                {imageUrl}
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden group relative shadow-inner flex justify-center bg-gray-100">
                <img 
                  src={imageUrl} 
                  alt="Aperçu Cloudflare R2" 
                  className="w-full h-auto max-h-64 object-contain"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
