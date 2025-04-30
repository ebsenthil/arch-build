import React, { useState } from 'react';
import './App.css'; // Import CSS file
import axios from 'axios'; // Assuming you installed axios

function App() {
  const [projectInput, setProjectInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState(null);

  // Replace with your API Gateway Endpoint URL
  const API_ENDPOINT = 'YOUR_API_GATEWAY_ENDPOINT_URL';

  const handleInputChange = (event) => {
    setProjectInput(event.target.value);
  };

  const handleGenerateDocument = async () => {
    setIsLoading(true);
    setPreviewUrl(null);
    setDownloadUrl(null);
    setError(null);

    try {
      const response = await axios.post(`${API_ENDPOINT}/generate-document`, {
        projectDetails: projectInput,
        // Add other input fields from your form here
      });

      // Assuming your backend returns URLs like this:
      // { previewUrl: '...', downloadUrl: '...' }
      const { previewUrl, downloadUrl } = response.data;

      setPreviewUrl(previewUrl);
      setDownloadUrl(downloadUrl);

    } catch (err) {
      console.error('Error generating document:', err);
      setError('Failed to generate document. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Architecture Document Generator</h1>
      </header>
      <main>
        <div className="input-section">
          <h2>Project Details Input</h2>
          <textarea
            rows="10"
            cols="80"
            value={projectInput}
            onChange={handleInputChange}
            placeholder="Enter project details, scope, requirements, services, decisions, etc. here..."
          />
          {/* Add more specific input fields here for better structure */}
          <br />
          <button onClick={handleGenerateDocument} disabled={isLoading || !projectInput.trim()}>
            {isLoading ? 'Generating...' : 'Generate Document'}
          </button>
          {error && <p className="error-message">{error}</p>}
        </div>

        {previewUrl && (
          <div className="preview-section">
            <h2>Document Preview</h2>
            {/* Using iframe to embed PDF. Adjust styling as needed. */}
            {/* Ensure your backend returns a pre-signed URL for the PDF */}
            <iframe src={previewUrl} width="100%" height="600px" title="Document Preview"></iframe>
          </div>
        )}

        {downloadUrl && (
          <div className="download-section">
            <h2>Download</h2>
            {/* Ensure your backend returns a pre-signed URL for the DOCX */}
            <a href={downloadUrl} download="architecture-document.docx">
              Download Word Document (.docx)
            </a>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
