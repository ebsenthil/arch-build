import React, { useState } from 'react';
import { API } from 'aws-amplify';
import { 
  Container, TextField, Button, Typography, Paper, 
  Grid, CircularProgress, Tabs, Tab, Box, Alert
} from '@mui/material';
import { saveAs } from 'file-saver';

function App() {
  const [projectDetails, setProjectDetails] = useState({
    projectName: '',
    projectDescription: '',
    requirements: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [documentPreview, setDocumentPreview] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [activeSection, setActiveSection] = useState('introduction');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectDetails({
      ...projectDetails,
      [name]: value
    });
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const generatePreview = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await API.post('architectureDocApi', '/generate-document', {
        body: {
          projectDetails,
          action: 'preview',
          // You would provide these from configuration or environment
          knowledgeBaseId: process.env.REACT_APP_KNOWLEDGE_BASE_ID,
          modelId: process.env.REACT_APP_BEDROCK_MODEL_ID
        }
      });
      
      setDocumentPreview(response.content);
      setCurrentTab(1); // Switch to preview tab
    } catch (err) {
      console.error('Error generating preview:', err);
      setError('Failed to generate document preview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateDocument = async () => {
    if (!documentPreview) {
      setError('Please generate a preview first');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await API.post('architectureDocApi', '/generate-document', {
        body: {
          projectDetails,
          action: 'generate',
          // You would provide these from configuration or environment
          knowledgeBaseId: process.env.REACT_APP_KNOWLEDGE_BASE_ID,
          modelId: process.env.REACT_APP_BEDROCK_MODEL_ID
        }
      });
      
      // Convert base64 to blob and download
      const byteCharacters = atob(response.document);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      
      saveAs(blob, response.filename);
    } catch (err) {
      console.error('Error generating document:', err);
      setError('Failed to generate document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!projectDetails.projectName.trim()) {
      setError('Project name is required');
      return false;
    }
    if (!projectDetails.projectDescription.trim()) {
      setError('Project description is required');
      return false;
    }
    if (!projectDetails.requirements.trim()) {
      setError('Requirements are required');
      return false;
    }
    return true;
  };

  // List of sections in the document
  const documentSections = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'scope', title: 'Scope' },
    { id: 'requirements', title: 'Requirements' },
    { id: 'system_context_diagram', title: 'System Context Diagram' },
    { id: 'component_model', title: 'Component Model' },
    { id: 'physical_operational_model', title: 'Physical Operational Model' },
    { id: 'architectural_decisions', title: 'Architectural Decisions' },
    { id: 'viability_assessment', title: 'Viability Assessment' },
    { id: 'appendix', title: 'Appendix' }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        AI-Assisted Architecture Document Generator
      </Typography>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Tabs value={currentTab} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab label="Project Details" />
          <Tab label="Document Preview" disabled={!documentPreview} />
        </Tabs>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        {currentTab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project Name"
                name="projectName"
                value={projectDetails.projectName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project Description"
                name="projectDescription"
                value={projectDetails.projectDescription}
                onChange={handleChange}
                multiline
                rows={4}
                required
                placeholder="Provide a detailed description of the project, including its purpose, goals, and context."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Requirements"
                name="requirements"
                value={projectDetails.requirements}
                onChange={handleChange}
                multiline
                rows={6}
                required
                placeholder="List both functional and non-functional requirements for the project."
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={generatePreview}
                disabled={loading}
                fullWidth
              >
                {loading ? <CircularProgress size={24} /> : 'Generate Document Preview'}
              </Button>
            </Grid>
          </Grid>
        )}
        
        {currentTab === 1 && documentPreview && (
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ width: '25%', borderRight: '1px solid #e0e0e0', pr: 2 }}>
              <Typography variant="h6" gutterBottom>
                Document Sections
              </Typography>
              {documentSections.map((section) => (
                <Button
                  key={section.id}
                  fullWidth
                  onClick={() => handleSectionChange(section.id)}
                  sx={{
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    backgroundColor: activeSection === section.id ? '#f0f7ff' : 'transparent',
                    mb: 1
                  }}
                >
                  {section.title}
                </Button>
              ))}
              <Box sx={{ mt: 4 }}>
                <Button 
                  variant="contained" 
                  color="success" 
                  onClick={generateDocument}
                  disabled={loading}
                  fullWidth
                >
                  {loading ? <CircularProgress size={24} /> : 'Download as Word'}
                </Button>
              </Box>
            </Box>
            
            <Box sx={{ width: '75%', p: 2 }}>
              <Typography variant="h5" gutterBottom>
                {documentPreview[activeSection]?.title || 'Section Not Available'}
              </Typography>
              
              <Paper elevation={0} sx={{ p: 2, backgroundColor: '#fafafa' }}>
                {documentPreview[activeSection]?.content ? (
                  <Typography component="div" sx={{ whiteSpace: 'pre-wrap' }}>
                    {documentPreview[activeSection].content}
                  </Typography>
                ) : (
                  <Typography color="text.secondary">
                    This section has no content.
                  </Typography>
                )}
              </Paper>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default App;
