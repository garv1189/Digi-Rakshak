'use client';

import { useState, useEffect } from "react";

const NewsScoringApp: React.FC = () => {
  const [url, setUrl] = useState<string>("");
  const [data, setData] = useState<Record<string, any> | null>(null);
  const [verificationData, setVerificationData] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>("");

  useEffect(() => {
    if (loading) {
      const messages = [
        "Searching the web...",
        "Analyzing sources...",
        "Consulting knowledge base...",
        "Verifying claims..."
      ];
      let index = 0;
      const interval = setInterval(() => {
        setLoadingMessage(messages[index % messages.length]);
        index++;
      }, 1500);
      return () => clearInterval(interval);
    } else {
      setLoadingMessage("");
    }
  }, [loading]);

  const fetchScore = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8080/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });
      if (!response.ok) throw new Error("Failed to fetch score");
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fetchVerification = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8081/verify?url=${encodeURIComponent(url)}`);
      if (!response.ok) throw new Error("Failed to verify claims");
      const result = await response.json();
      setVerificationData(result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <div className="w-full max-w-2xl bg-gray-800 p-6 rounded-xl shadow-lg">
        <div className="flex flex-col gap-4">
          <input
            className="bg-gray-700 text-white border border-gray-600 px-4 py-2 rounded-md w-full"
            placeholder="Enter news URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <div className="flex gap-2">
            <button 
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md" 
              onClick={fetchScore} 
              disabled={loading}
            >
              {loading ? loadingMessage : "Get Score"}
            </button>
            <button 
              className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md" 
              onClick={fetchVerification} 
              disabled={loading}
            >
              {loading ? loadingMessage : "Verify Claims"}
            </button>
          </div>
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>
      {data && (
        <div className="w-full max-w-4xl bg-gray-800 mt-6 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4">Analysis Results</h2>
          <table className="w-full border border-gray-700 text-left">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="p-2">Metric</th>
                <th className="p-2">Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(data).map(([key, value]) => (
                <tr key={key} className="border-b border-gray-700">
                  <td className="p-2 font-semibold">{key.replace(/_/g, " ")}</td>
                  <td className="p-2">{typeof value === "number" ? value.toFixed(2) : value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {verificationData && (
        <div className="w-full max-w-4xl bg-gray-800 mt-6 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4">Verification Results</h2>
          <p className="mb-2"><strong>Article URL:</strong> {verificationData.article_url}</p>
          <h3 className="text-lg font-semibold">Extracted Claims:</h3>
          <ul className="list-disc pl-5">
            {(verificationData.extracted_claims as string[]).map((claim, index) => (
              <li key={index}>{claim}</li>
            ))}
          </ul>
          <h3 className="text-lg font-semibold mt-4">Verification Scores:</h3>
          <ul className="list-disc pl-5">
            {Object.entries(verificationData.verification_results as Record<string, string>).map(([claim, score], index) => (
              <li key={index}><strong>{claim}:</strong> {score}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NewsScoringApp;
