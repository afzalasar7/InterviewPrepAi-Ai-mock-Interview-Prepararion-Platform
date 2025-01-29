"use client";

import { useState } from "react";

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null); // State to store the selected file
  const [result, setResult] = useState(null); // State to store the analysis result
  const [jsonResponse, setJsonResponse] = useState(null); // State to store raw JSON response
  const [error, setError] = useState(null); // State to store errors
  const [isLoading, setIsLoading] = useState(false); // State to handle loading state

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null); // Reset error on file selection
    setResult(null); // Reset result on new file selection
    setJsonResponse(null); // Reset JSON response on new file selection
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setError(null);
      setIsLoading(true);

      const res = await fetch("/api/parse-pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || "An error occurred");
        return;
      }

      const data = await res.json();
      setResult(data.cleanedText); // Assuming the server returns `cleanedText` as the key
      setJsonResponse(data); // Store the entire JSON response
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Resume Analyzer</h1>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        className={`${
          isLoading ? "bg-gray-400" : "bg-blue-500"
        } text-white px-4 py-2 rounded`}
        disabled={isLoading}
      >
        {isLoading ? "Uploading..." : "Upload and Analyze"}
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {result && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Formatted Result:</h2>
          <pre className="bg-gray-100 p-4 rounded max-h-96 overflow-auto">
            {result}
          </pre>
        </div>
      )}
      
    </div>
  );
}
