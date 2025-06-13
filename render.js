
import React, { useState } from "react";
import ResultBlock from "./ResultBlock";
import { matchResearch } from "./logic";

export default function RenderApp() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await matchResearch(inputText);
      setResult(res);
    } catch (error) {
      console.error("Error analyzing input:", error);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto font-sarabun">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">ผู้ช่วยนักวิจัยอัจฉริยะ</h1>

      <textarea
        id="userInput"
        className="w-full p-4 border border-gray-300 rounded-2xl mb-4 text-gray-800"
        rows={4}
        placeholder="พิมพ์โจทย์วิจัยหรือไอเดียของคุณ..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />

      <button
        id="analyzeBtn"
        onClick={handleAnalyze}
        className="bg-blue-600 text-white py-2 px-6 rounded-xl hover:bg-blue-700 transition"
      >
        วิเคราะห์
      </button>

      {loading && <p className="mt-4 text-gray-600">กำลังวิเคราะห์...</p>}

      {result && (
        <div className="mt-6">
          <ResultBlock
            theories={result.theories}
            methods={result.methods}
            stats={result.stats}
            sdgs={result.sdgs}
          />
        </div>
      )}
    </div>
  );
}
