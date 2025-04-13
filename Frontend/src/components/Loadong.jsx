import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoadingSpinner = () => {
  const containerStyle = {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#f0fff4',
  };

  const spinnerWrapperStyle = {
    position: 'relative',
    width: '4rem',
    height: '4rem',
    animation: 'spin 2s linear infinite',
  };

  const dotBaseStyle = {
    position: 'absolute',
    width: '1rem',
    height: '1rem',
    backgroundColor: '#4caf50',
    borderRadius: '50%',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };

  const textStyle = {
    marginTop: '1rem',
    color: '#2e7d32',
    fontSize: '1.1rem',
    fontWeight: '500',
    letterSpacing: '0.5px',
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0%   { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      <div style={containerStyle}>
        <div style={spinnerWrapperStyle}>
          {/* 6 dots evenly placed at 60-degree intervals */}
          <div style={{ ...dotBaseStyle, transform: 'rotate(0deg) translateX(1.5rem)' }}></div>
          <div style={{ ...dotBaseStyle, transform: 'rotate(60deg) translateX(1.5rem)' }}></div>
          <div style={{ ...dotBaseStyle, transform: 'rotate(120deg) translateX(1.5rem)' }}></div>
          <div style={{ ...dotBaseStyle, transform: 'rotate(180deg) translateX(1.5rem)' }}></div>
          <div style={{ ...dotBaseStyle, transform: 'rotate(240deg) translateX(1.5rem)' }}></div>
          <div style={{ ...dotBaseStyle, transform: 'rotate(300deg) translateX(1.5rem)' }}></div>
        </div>
        <div style={textStyle}>Loading farm-fresh data...</div>
      </div>
    </>
  );
};

export default LoadingSpinner;
