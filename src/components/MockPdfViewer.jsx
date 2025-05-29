import React from 'react';

const MockPdfViewer = ({ caseName, pdfUrl, onClose }) => { // Add pdfUrl prop
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
        width: '80%',
        height: '80%',
        position: 'relative',
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 1001, // Ensure close button is above iframe
            background: 'none',
            border: 'none',
            fontSize: '1.5em',
            cursor: 'pointer',
            color: 'black', // Make close button visible
          }}
        >
          &times;
        </button>
        {/* Display case name (optional, you might remove this later) */}
        <div style={{ padding: '10px', textAlign: 'center', color: 'black' }}>
          Viewing: {caseName}
        </div>
        {/* Iframe to embed the PDF */}
        {pdfUrl && (
          <iframe
            src={pdfUrl}
            width="100%"
            height="calc(100% - 50px)" // Adjust height to make space for case name/close button
            style={{ border: 'none' }}
            title="PDF Viewer"
          >
            This browser does not support PDFs. Please download the PDF to view it: <a href={pdfUrl}>Download PDF</a>.
          </iframe>
        )}
      </div>
    </div>
  );
};

export default MockPdfViewer;