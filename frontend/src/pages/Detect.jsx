import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Detect() {
  const webcamRef = useRef(null);
  const [detectionType, setDetectionType] = useState("words"); // "alphabet" or "words"
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const capture = useCallback(async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setError("Failed to capture image");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Remove data URL prefix if present
      const base64Image = imageSrc.includes(",") 
        ? imageSrc.split(",")[1] 
        : imageSrc;

      const response = await fetch(`${API_URL}/api/detect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64Image,
          type: detectionType,
        }),
      });

      if (!response.ok) {
        throw new Error(`Detection failed: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);

      // Save to history
      if (data.label && !data.fallback) {
        try {
          await fetch(`${API_URL}/api/history`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              label: data.label,
              confidence: data.confidence,
            }),
          });
        } catch (err) {
          console.error("Failed to save to history:", err);
        }
      }
    } catch (err) {
      setError(err.message || "Failed to detect sign");
      console.error("Detection error:", err);
    } finally {
      setLoading(false);
    }
  }, [detectionType]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-blue-400">
          Sign Language Detection
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Show a sign language gesture to your camera and click "Detect"
        </p>

        {/* Detection Type Selector */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => {
              setDetectionType("words");
              setResult(null);
            }}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              detectionType === "words"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Words
          </button>
          <button
            onClick={() => {
              setDetectionType("alphabet");
              setResult(null);
            }}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              detectionType === "alphabet"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Alphabet
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Webcam Section */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-2xl">
            <div className="flex justify-center items-center mb-4">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={640}
                height={480}
                className="rounded-lg shadow-xl"
                videoConstraints={{
                  width: 640,
                  height: 480,
                  facingMode: "user",
                }}
              />
            </div>
            <button
              onClick={capture}
              disabled={loading}
              className={`w-full py-3 px-6 rounded-lg font-bold text-lg transition-all ${
                loading
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
              }`}
            >
              {loading ? "Detecting..." : "🔍 Detect Sign"}
            </button>
          </div>

          {/* Results Section */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Detection Result</h2>
            
            {error && (
              <div className="bg-red-900/50 border border-red-600 rounded-lg p-4 mb-4">
                <p className="text-red-200 font-semibold">Error</p>
                <p className="text-red-300">{error}</p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6">
                  <div className="text-center">
                    <p className="text-sm text-blue-200 mb-2">Predicted {detectionType === "words" ? "Word" : "Letter"}</p>
                    <p className="text-5xl font-bold mb-4">{result.label || "Unknown"}</p>
                    {result.confidence !== undefined && (
                      <div>
                        <p className="text-sm text-blue-200 mb-1">Confidence</p>
                        <div className="w-full bg-gray-900/50 rounded-full h-4 mb-2">
                          <div
                            className="bg-white h-4 rounded-full transition-all"
                            style={{
                              width: `${(result.confidence * 100).toFixed(1)}%`,
                            }}
                          ></div>
                        </div>
                        <p className="text-2xl font-semibold">
                          {(result.confidence * 100).toFixed(1)}%
                        </p>
                      </div>
                    )}
                    {result.fallback && (
                      <p className="text-xs text-yellow-300 mt-2">
                        ⚠️ Using fallback mode (Python service unavailable)
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {!result && !error && !loading && (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No detection yet</p>
                <p className="text-sm mt-2">Click "Detect Sign" to analyze your gesture</p>
              </div>
            )}

            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-4 text-gray-400">Analyzing gesture...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
