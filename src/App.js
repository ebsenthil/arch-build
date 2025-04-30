import React, { useState, useEffect } from 'react';
import { Amplify, Auth } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import './App.css';

// AWS Amplify Configuration
const amplifyConfig = {
  Auth: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_XXXXXXXXX', // Replace with your Cognito User Pool ID
    userPoolWebClientId: 'XXXXXXXXXXXXXXXXXXXXXXXXXX', // Replace with your App Client ID
    mandatorySignIn: true
  },
  API: {
    endpoints: [
      {
        name: 'ArchitectureDocAPI',
        endpoint: 'https://xxxxxxxx.execute-api.us-east-1.amazonaws.com/prod', // Replace with your API Gateway URL
        region: 'us-east-1'
      }
    ]
  }
};

Amplify.configure(amplifyConfig);

// Component for the header
const Header = ({ user, onLogout }) => {
  return (
    <header className="app-header">
      <div className="logo">
        <h1>Architecture Document Generator</h1>
      </div>
      <div className="user-info">
        <span>Welcome, {user.attributes.email}</span>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </div>
    </header>
  );
};

// Component for the document sections form
const DocumentSectionsForm = ({ formData, setFormData, handleChange }) => {
  return (
    <div className="form-section">
      <h2>Document Sections</h2>
      <p className="section-hint">All sections will be included in the document. Focus on providing detailed information for each section.</p>

      {/* Introduction */}
      <div className="form-group">
        <label htmlFor="introduction">1. Introduction</label>
        <textarea
          id="introduction"
          name="introduction"
          value={formData.introduction}
          onChange={handleChange}
          placeholder="Provide a brief introduction to the architecture project"
          rows={3}
        />
      </div>

      {/* Scope */}
      <div className="form-group">
        <label htmlFor="scope">2.i. Scope</label>
        <textarea
          id="scope"
          name="scope"
          value={formData.scope}
          onChange={handleChange}
          placeholder="Define what is in scope for this architecture"
          rows={3}
        />
      </div>

      <div className="form-group">
        <label htmlFor="outOfScope">2.ii. Out of Scope</label>
        <textarea
          id="outOfScope"
          name="outOfScope"
          value={formData.outOfScope}
          onChange={handleChange}
          placeholder="Define what is out of scope for this architecture"
          rows={3}
        />
      </div>

      {/* Requirements */}
      <div className="form-group">
        <label htmlFor="functionalRequirements">3.i. Functional Requirements</label>
        <textarea
          id="functionalRequirements"
          name="functionalRequirements"
          value={formData.functionalRequirements}
          onChange={handleChange}
          placeholder="List the functional requirements (one per line)"
          rows={5}
        />
      </div>

      <div className="form-group">
        <label htmlFor="nonFunctionalRequirements">3.ii. Non-Functional Requirements</label>
        <textarea
          id="nonFunctionalRequirements"
          name="nonFunctionalRequirements"
          value={formData.nonFunctionalRequirements}
          onChange={handleChange}
          placeholder="List the non-functional requirements (one per line)"
          rows={5}
        />
      </div>

      {/* System Context */}
      <div className="form-group">
        <label htmlFor="systemContextDescription">4. System Context</label>
        <textarea
          id="systemContextDescription"
          name="systemContextDescription"
          value={formData.systemContextDescription}
          onChange={handleChange}
          placeholder="Describe the system context including actors and external systems"
          rows={5}
        />
      </div>

      {/* Component Model */}
      <div className="form-group">
        <label htmlFor="componentModelDescription">5. Component Model</label>
        <textarea
          id="componentModelDescription"
          name="componentModelDescription"
          value={formData.componentModelDescription}
          onChange={handleChange}
          placeholder="Describe the main components of the system and their relationships"
          rows={5}
        />
      </div>

      {/* Physical Operational Model */}
      <div className="form-group">
        <label htmlFor="physicalModelDescription">6. Physical Operational Model</label>
        <textarea
          id="physicalModelDescription"
          name="physicalModelDescription"
          value={formData.physicalModelDescription}
          onChange={handleChange}
          placeholder="Describe the physical deployment and operational aspects"
          rows={5}
        />
      </div>

      {/* Architectural Decisions */}
      <div className="form-group">
        <label htmlFor="architecturalDecisions">7. Architectural Decisions</label>
        <textarea
          id="architecturalDecisions"
          name="architecturalDecisions"
          value={formData.architecturalDecisions}
          onChange={handleChange}
          placeholder="List key architectural decisions (Format: Decision | Options | Outcome | Justification)"
          rows={8}
        />
      </div>

      {/* Viability Assessment */}
      <div className="form-group">
        <label htmlFor="viabilityAssessment">8. Viability Assessment (RAID)</label>
        <textarea
          id="viabilityAssessment"
          name="viabilityAssessment"
          value={formData.viabilityAssessment}
          onChange={handleChange}
          placeholder="List risks, assumptions, issues, and dependencies"
          rows={5}
        />
      </div>

      {/* Appendix */}
      <div className="form-group">
        <label htmlFor="appendix">9. Appendix</label>
        <textarea
          id="appendix"
          name="appendix"
          value={formData.appendix}
          onChange={handleChange}
          placeholder="Additional information, references, etc."
          rows={3}
        />
      </div>
    </div>
  );
};

// Component for project metadata form
const ProjectMetadataForm = ({ formData, setFormData, handleChange }) => {
  return (
    <div className="form-section metadata-form">
      <h2>Project Metadata</h2>
      <p className="section-hint">This information will be used to customize the document and diagrams.</p>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="projectName">Project Name</label>
          <input
            type="text"
            id="projectName"
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
            placeholder="Project Name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="projectId">Project ID</label>
          <input
            type="text"
            id="projectId"
            name="projectId"
            value={formData.projectId}
            onChange={handleChange}
            placeholder="Project ID"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="preparedBy">Prepared By</label>
          <input
            type="text"
            id="preparedBy"
            name="preparedBy"
            value={formData.preparedBy}
            onChange={handleChange}
            placeholder="Your Name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="preparedDate">Date</label>
          <input
            type="date"
            id="preparedDate"
            name="preparedDate"
            value={formData.preparedDate}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="clientName">Client/Department</label>
          <input
            type="text"
            id="clientName"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            placeholder="Client or Department Name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="version">Version</label>
          <input
            type="text"
            id="version"
            name="version"
            value={formData.version}
            onChange={handleChange}
            placeholder="1.0"
          />
        </div>
      </div>

      <div className="form-group cloud-platform-selector">
        <label>Cloud Platform</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="cloudPlatform"
              value="aws"
              checked={formData.cloudPlatform === "aws"}
              onChange={handleChange}
            />
            AWS
          </label>
          <label>
            <input
              type="radio"
              name="cloudPlatform"
              value="azure"
              checked={formData.cloudPlatform === "azure"}
              onChange={handleChange}
            />
            Azure
          </label>
          <label>
            <input
              type="radio"
              name="cloudPlatform"
              value="gcp"
              checked={formData.cloudPlatform === "gcp"}
              onChange={handleChange}
            />
            Google Cloud
          </label>
          <label>
            <input
              type="radio"
              name="cloudPlatform"
              value="hybrid"
              checked={formData.cloudPlatform === "hybrid"}
              onChange={handleChange}
            />
            Hybrid/Multi-Cloud
          </label>
        </div>
      </div>
    </div>
  );
};

// Preview component
const DocumentPreview = ({ documentData, isLoading }) => {
  if (isLoading) {
    return (
      <div className="preview-loading">
        <div className="loader"></div>
        <p>Generating document preview...</p>
        <p className="loading-detail">This may take up to a minute as we process your document.</p>
      </div>
    );
  }

  if (!documentData) return <div className="empty-preview">Document preview will appear here</div>;

  return (
    <div className="document-preview">
      <div className="preview-header">
        <h1>{documentData.projectName} - Architecture Document</h1>
        <div className="preview-meta">
          <p><strong>Prepared by:</strong> {documentData.preparedBy}</p>
          <p><strong>Date:</strong> {documentData.preparedDate}</p>
          <p><strong>Version:</strong> {documentData.version}</p>
        </div>
      </div>

      <div className="preview-section">
        <h2>1. Introduction</h2>
        <div dangerouslySetInnerHTML={{ __html: documentData.introduction }} />
      </div>

      <div className="preview-section">
        <h2>2. Scope</h2>
        <h3>2.1. In Scope</h3>
        <div dangerouslySetInnerHTML={{ __html: documentData.scope }} />
        
        <h3>2.2. Out of Scope</h3>
        <div dangerouslySetInnerHTML={{ __html: documentData.outOfScope }} />
      </div>

      <div className="preview-section">
        <h2>3. Requirements</h2>
        <h3>3.1. Functional Requirements</h3>
        <div dangerouslySetInnerHTML={{ __html: documentData.functionalRequirements }} />
        
        <h3>3.2. Non-Functional Requirements</h3>
        <div dangerouslySetInnerHTML={{ __html: documentData.nonFunctionalRequirements }} />
      </div>

      <div className="preview-section">
        <h2>4. System Context Diagram</h2>
        {documentData.systemContextDiagram && (
          <div className="diagram-container">
            <img src={`data:image/svg+xml;base64,${btoa(documentData.systemContextDiagram)}`} alt="System Context Diagram" />
          </div>
        )}
        <h3>4.1. System Context Description</h3>
        <div dangerouslySetInnerHTML={{ __html: documentData.systemContextDescription }} />
        
        <h3>4.2. Actors and External Systems</h3>
        <div dangerouslySetInnerHTML={{ __html: documentData.actorsTable }} />
      </div>

      <div className="preview-section">
        <h2>5. Component Model</h2>
        {documentData.componentModelDiagram && (
          <div className="diagram-container">
            <img src={`data:image/svg+xml;base64,${btoa(documentData.componentModelDiagram)}`} alt="Component Model Diagram" />
          </div>
        )}
        <h3>5.1. Component Description</h3>
        <div dangerouslySetInnerHTML={{ __html: documentData.componentModelDescription }} />
      </div>

      <div className="preview-section">
        <h2>6. Physical Operational Model</h2>
        {documentData.physicalModelDiagram && (
          <div className="diagram-container">
            <img src={`data:image/svg+xml;base64,${btoa(documentData.physicalModelDiagram)}`} alt="Physical Model Diagram" />
          </div>
        )}
        <h3>6.1. Physical Model Description</h3>
        <div dangerouslySetInnerHTML={{ __html: documentData.physicalModelDescription }} />
      </div>

      <div className="preview-section">
        <h2>7. Architectural Decisions</h2>
        <div dangerouslySetInnerHTML={{ __html: documentData.architecturalDecisionsTable }} />
      </div>

      <div className="preview-section">
        <h2>8. Viability Assessment</h2>
        <div dangerouslySetInnerHTML={{ __html: documentData.viabilityAssessmentTable }} />
      </div>

      <div className="preview-section">
        <h2>9. Appendix</h2>
        <div dangerouslySetInnerHTML={{ __html: documentData.appendix }} />
      </div>
    </div>
  );
};

// Main app component
function App({ signOut, user }) {
  // Initialize form data
  const initialFormData = {
    projectName: '',
    projectId: '',
    preparedBy: '',
    preparedDate: new Date().toISOString().split('T')[0],
    clientName: '',
    version: '1.0',
    cloudPlatform: 'aws',
    introduction: '',
    scope: '',
    outOfScope: '',
    functionalRequirements: '',
    nonFunctionalRequirements: '',
    systemContextDescription: '',
    componentModelDescription: '',
    physicalModelDescription: '',
    architecturalDecisions: '',
    viabilityAssessment: '',
    appendix: ''
  };

  // State variables
  const [formData, setFormData] = useState(initialFormData);
  const [documentData, setDocumentData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('metadata'); // 'metadata', 'sections', 'preview'
  const [downloadUrl, setDownloadUrl] = useState(null);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle document generation
  const handleGenerateDocument = async () => {
    // Validate form
    if (!formData.projectName) {
      setError('Project Name is required');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    setDownloadUrl(null);

    try {
      // Get AWS credentials
      const credentials = await Auth.currentCredentials();
      const token = (await Auth.currentSession()).getIdToken().getJwtToken();

      // Call API Gateway
      const response = await fetch('https://xxxxxxxx.execute-api.us-east-1.amazonaws.com/prod/generate-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setDocumentData(data);
      setSuccessMessage('Document generated successfully');
      setActiveTab('preview');

      // Store download URL if available
      if (data.downloadUrl) {
        setDownloadUrl(data.downloadUrl);
      }
    } catch (err) {
      console.error('Error generating document:', err);
      setError(`Failed to generate document: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle document download
  const handleDownloadDocument = async () => {
    if (!documentData) {
      setError('No document to download. Please generate the document first.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Get AWS credentials
      const token = (await Auth.currentSession()).getIdToken().getJwtToken();

      // Request document download
      const response = await fetch('https://xxxxxxxx.execute-api.us-east-1.amazonaws.com/prod/download-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({
          projectName: formData.projectName,
          documentData: documentData
        })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      // Handle document download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${formData.projectName.replace(/\s+/g, '_')}_Architecture_Document.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccessMessage('Document downloaded successfully');
    } catch (err) {
      console.error('Error downloading document:', err);
      setError(`Failed to download document: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all form fields?')) {
      setFormData(initialFormData);
      setDocumentData(null);
      setError('');
      setSuccessMessage('');
      setDownloadUrl(null);
      setActiveTab('metadata');
    }
  };

  return (
    <div className="app-container">
      <Header user={user} onLogout={signOut} />

      <main className="main-content">
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'metadata' ? 'active' : ''}`}
            onClick={() => setActiveTab('metadata')}
          >
            Project Metadata
          </button>
          <button 
            className={`tab-button ${activeTab === 'sections' ? 'active' : ''}`}
            onClick={() => setActiveTab('sections')}
          >
            Document Sections
          </button>
          <button 
            className={`tab-button ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
            disabled={!documentData && !isLoading}
          >
            Document Preview
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'metadata' && (
            <ProjectMetadataForm 
              formData={formData} 
              setFormData={setFormData} 
              handleChange={handleChange} 
            />
          )}

          {activeTab === 'sections' && (
            <DocumentSectionsForm 
              formData={formData} 
              setFormData={setFormData} 
              handleChange={handleChange} 
            />
          )}

          {activeTab === 'preview' && (
            <DocumentPreview 
              documentData={documentData} 
              isLoading={isLoading} 
            />
          )}
        </div>

        <div className="action-buttons">
          {activeTab !== 'preview' && (
            <button 
              className="generate-button"
              onClick={handleGenerateDocument}
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : 'Generate Document'}
            </button>
          )}

          {activeTab === 'preview' && documentData && (
            <button 
              className="download-button"
              onClick={handleDownloadDocument}
              disabled={isLoading}
            >
              {isLoading ? 'Downloading...' : 'Download Document (.docx)'}
            </button>
          )}

          <button 
            className="reset-button"
            onClick={handleReset}
            disabled={isLoading}
          >
            Reset Form
          </button>
        </div>
      </main>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Architecture Document Generator. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default withAuthenticator(App);
