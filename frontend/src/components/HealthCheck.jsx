// Health Check Component
import React, { useEffect } from 'react';
import { useHealthCheck } from '../hooks/useApi';
import './HealthCheck.css';

const HealthCheck = ({ showAlways = false }) => {
  const { isHealthy, isChecking, checkHealth } = useHealthCheck(true);

  useEffect(() => {
    // Check health every 30 seconds
    const interval = setInterval(() => {
      checkHealth();
    }, 30000);

    return () => clearInterval(interval);
  }, [checkHealth]);

  // Don't show if healthy and showAlways is false
  if (isHealthy && !showAlways) {
    return null;
  }

  return (
    <div className={`health-check ${isHealthy ? 'healthy' : 'unhealthy'}`}>
      <div className="health-indicator">
        {isChecking ? (
          <span className="checking">⟳</span>
        ) : isHealthy ? (
          <span className="status-dot healthy-dot">●</span>
        ) : (
          <span className="status-dot unhealthy-dot">●</span>
        )}
        <span className="health-text">
          {isChecking 
            ? 'Checking server...' 
            : isHealthy 
            ? 'Server Connected' 
            : 'Server Disconnected'}
        </span>
        {!isHealthy && (
          <button onClick={checkHealth} className="retry-btn">
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default HealthCheck;
