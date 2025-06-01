
import React, { useState, useEffect } from 'react';

const MockPdfViewer = ({ caseName, pdfUrl, onClose }) => {
  const [isValidPdf, setIsValidPdf] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (pdfUrl) {
      // Check if the URL is a valid PDF
      const checkPdfUrl = async () => {
        try {
          const response = await fetch(pdfUrl, { method: 'HEAD' });
          const contentType = response.headers.get('content-type');
          setIsValidPdf(contentType && contentType.includes('application/pdf'));
        } catch (error) {
          console.log('PDF URL check failed, using mock viewer');
          setIsValidPdf(false);
        } finally {
          setIsLoading(false);
        }
      };

      // If it looks like a real PDF URL, check it
      if (pdfUrl.startsWith('http') && pdfUrl.endsWith('.pdf')) {
        checkPdfUrl();
      } else {
        setIsLoading(false);
        setIsValidPdf(false);
      }
    } else {
      setIsLoading(false);
      setIsValidPdf(false);
    }
  }, [pdfUrl]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white',
        width: '90%',
        height: '90%',
        position: 'relative',
        borderRadius: '8px',
        overflow: 'hidden',
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 1001,
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            fontSize: '1.5em',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          &times;
        </button>

        {isLoading ? (
          <div style={{ 
            padding: '20px', 
            textAlign: 'center', 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <div>Loading PDF...</div>
          </div>
        ) : isValidPdf && pdfUrl ? (
          <>
            {/* Header with document name */}
            <div style={{ 
              padding: '10px 20px', 
              borderBottom: '1px solid #eee', 
              backgroundColor: '#f8f9fa',
              fontWeight: 'bold',
              color: '#333'
            }}>
              {caseName}
            </div>
            
            {/* Actual PDF viewer */}
            <iframe
              src={pdfUrl}
              width="100%"
              height="calc(100% - 60px)"
              style={{ border: 'none' }}
              title="PDF Viewer"
            >
              <p>
                This browser does not support PDFs. Please download the PDF to view it: 
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer">Download PDF</a>
              </p>
            </iframe>
          </>
        ) : (
          <>
            {/* Header for mock viewer */}
            <div style={{ 
              padding: '10px 20px', 
              borderBottom: '1px solid #eee', 
              backgroundColor: '#f8f9fa',
              fontWeight: 'bold',
              color: '#333'
            }}>
              Document Preview: {caseName}
            </div>
            
            {/* Mock PDF content */}
            <div style={{ 
              padding: '40px', 
              height: 'calc(100% - 60px)', 
              overflow: 'auto',
              backgroundColor: '#fff'
            }}>
              <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                backgroundColor: 'white',
                padding: '40px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                fontFamily: 'Arial, sans-serif',
                lineHeight: '1.6'
              }}>
                <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #333', paddingBottom: '20px' }}>
                  <h2 style={{ margin: '0 0 10px 0', fontSize: '20px', fontWeight: 'bold' }}>SUPREME COURT OF INDIA</h2>
                  <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>Civil Appeal No. 12345/2023</p>
                </div>
                
                <div style={{ marginBottom: '30px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', textAlign: 'center' }}>
                    {caseName || 'Sample Legal Document'}
                  </h3>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <p><strong>Court:</strong> Supreme Court of India</p>
                    <p><strong>Date:</strong> March 15, 2024</p>
                    <p><strong>Judges:</strong> Hon'ble Mr. Justice A. Kumar, Hon'ble Mr. Justice B. Sharma</p>
                    <p><strong>Petitioner:</strong> ABC Corporation Ltd.</p>
                    <p><strong>Respondent:</strong> XYZ Industries Pvt. Ltd.</p>
                  </div>
                  
                  <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', borderRadius: '4px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>ORDER</h4>
                    <p style={{ marginBottom: '15px' }}>
                      This matter has come up for hearing before this Court in the form of a Civil Appeal against the judgment 
                      and order dated [Date] passed by the High Court of [State] in [Case Details].
                    </p>
                    <p style={{ marginBottom: '15px' }}>
                      Having heard the learned counsel for both parties and having perused the records, this Court is of the 
                      opinion that the matter requires detailed consideration of the legal issues involved.
                    </p>
                    <p style={{ marginBottom: '15px' }}>
                      <strong>Facts of the case:</strong> The dispute arises from a commercial transaction between the parties 
                      involving [specific details of the case]. The petitioner contends that [petitioner's argument], while 
                      the respondent maintains that [respondent's argument].
                    </p>
                    <p style={{ marginBottom: '15px' }}>
                      <strong>Legal Issues:</strong> The primary legal questions that arise for consideration in this appeal are:
                      <br />1. Whether the High Court was correct in its interpretation of [relevant law/section]
                      <br />2. Whether the findings of fact recorded by the lower court are sustainable in law
                      <br />3. Whether the relief granted is adequate and appropriate in the circumstances
                    </p>
                    <p>
                      After careful consideration of the submissions made by both sides and the legal precedents cited, 
                      this Court is pleased to pass the following order: [Details of the order/judgment would follow]
                    </p>
                  </div>
                  
                  <div style={{ marginTop: '40px', textAlign: 'center', fontSize: '12px', color: '#888', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
                    <p>This is a mock PDF preview for demonstration purposes.</p>
                    <p>In production, this component will display actual PDF content when provided with a valid PDF URL.</p>
                    <p style={{ fontStyle: 'italic' }}>File: {caseName}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MockPdfViewer;
