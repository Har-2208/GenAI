import React from 'react';
import { useNavigate } from 'react-router-dom';
import APP_CONSTANTS from '../constants/appConstants';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();
  const { LANDING } = APP_CONSTANTS;

  return (
    <div className="landing-page">
      <div className="container">
        <div className="landing-content">
          <div className="logo-section">
            <div className="logo-icon">{LANDING.LOGO_ICON}</div>
            <h1 className="title">{LANDING.TITLE}</h1>
          </div>
          
          <p className="description">
            {LANDING.DESCRIPTION}
          </p>

          <div className="features">
            {LANDING.FEATURES.map((feature, index) => (
              <div key={index} className="feature">
                <span className="feature-icon">{feature.icon}</span>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>

          <button 
            className="start-btn"
            onClick={() => navigate('/questionnaire')}
          >
            {LANDING.START_BUTTON}
          </button>

          <p className="time-estimate">{LANDING.TIME_ESTIMATE}</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
