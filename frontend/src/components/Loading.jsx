import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import apiService from '../services/api';
import APP_CONSTANTS from '../constants/appConstants';
import './Loading.css';

const Loading = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state?.formData;
  const { LOADING } = APP_CONSTANTS;
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!formData) {
      navigate('/');
      return;
    }

    const submitToBackend = async () => {
      const startTime = Date.now();

      try {
        // Track questionnaire submission event
        apiService.trackEvent({
          event: 'questionnaire_submitted',
          timestamp: new Date().toISOString()
        });

        // Analyze career identity
        const result = await apiService.analyzeCareer(formData);
        
        if (result.success) {
          // Ensure minimum loading time for better UX
          const elapsed = Date.now() - startTime;
          const remainingTime = Math.max(0, LOADING.MIN_LOADING_TIME - elapsed);
          
          setTimeout(() => {
            // Track successful analysis
            apiService.trackEvent({
              event: 'analysis_completed',
              timestamp: new Date().toISOString()
            });
            
            navigate('/results', { state: { results: result.data } });
          }, remainingTime);
        } else {
          // Handle API error
          setError(result.error);
          
          // Track error event
          apiService.trackEvent({
            event: 'analysis_error',
            error: result.error,
            statusCode: result.statusCode,
            timestamp: new Date().toISOString()
          });
          
          setTimeout(() => {
            alert(`Error: ${result.error}\n\nPlease ensure the backend server is running and try again.`);
            navigate('/questionnaire');
          }, 1000);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        setError('An unexpected error occurred');
        
        setTimeout(() => {
          alert('An unexpected error occurred. Please try again.');
          navigate('/questionnaire');
        }, 1000);
      }
    };

    submitToBackend();
  }, [formData, navigate]);

  return (
    <div className="loading-page">
      <div className="loading-content">
        <div className="spinner-container">
          <div className="spinner"></div>
          <div className="spinner-inner"></div>
        </div>
        
        <h2 className="loading-title">{LOADING.TITLE}</h2>
        
        <div className="loading-steps">
          {LOADING.STEPS.map((step, index) => (
            <div key={index} className="step">
              <span className="step-icon">{step.icon}</span>
              <span>{step.text}</span>
            </div>
          ))}
        </div>
        
        <p className="loading-subtitle">{LOADING.SUBTITLE}</p>
      </div>
    </div>
  );
};

export default Loading;
