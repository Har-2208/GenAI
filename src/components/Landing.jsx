import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="container">
        <div className="landing-content">
          <div className="logo-section">
            <div className="logo-icon">🎯</div>
            <h1 className="title">AI Career Identity Finder</h1>
          </div>
          
          <p className="description">
            Discover your perfect career path through AI-powered analysis of your 
            personality traits, interests, and strengths. Get personalized career 
            recommendations with detailed skill gap analysis.
          </p>

          <div className="features">
            <div className="feature">
              <span className="feature-icon">📊</span>
              <span>Comprehensive Personality Assessment</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🤖</span>
              <span>AI-Powered Career Matching</span>
            </div>
            <div className="feature">
              <span className="feature-icon">📈</span>
              <span>Skill Gap Analysis</span>
            </div>
          </div>

          <button 
            className="start-btn"
            onClick={() => navigate('/questionnaire')}
          >
            Start Assessment
          </button>

          <p className="time-estimate">⏱️ Takes 5-7 minutes</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
