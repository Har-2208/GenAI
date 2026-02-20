import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Results.css';

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const results = location.state?.results;

  if (!results) {
    navigate('/');
    return null;
  }

  const { career_identity_summary, top_careers } = results;

  const getMatchColor = (percentage) => {
    if (percentage >= 80) return '#10b981';
    if (percentage >= 70) return '#3b82f6';
    return '#8b5cf6';
  };

  return (
    <div className="results-page">
      <div className="container">
        <div className="results-header">
          <h1>🎯 Your Career Identity Profile</h1>
          <p>Based on your responses, here are your personalized career recommendations</p>
        </div>

        {/* Career Identity Summary */}
        <div className="identity-summary">
          <h2>Your Profile</h2>
          <p>{career_identity_summary}</p>
        </div>

        {/* Top Careers */}
        <div className="careers-section">
          <h2>Top Career Matches</h2>
          <div className="careers-grid">
            {top_careers.map((career, index) => (
              <div key={index} className="career-card" style={{animationDelay: `${index * 0.2}s`}}>
                <div className="career-header">
                  <div className="career-rank">#{index + 1}</div>
                  <div className="career-match" style={{color: getMatchColor(career.match_percentage)}}>
                    {career.match_percentage}% Match
                  </div>
                </div>

                <h3 className="career-name">{career.career_name}</h3>

                <div className="match-bar-container">
                  <div 
                    className="match-bar" 
                    style={{
                      width: `${career.match_percentage}%`,
                      background: `linear-gradient(90deg, ${getMatchColor(career.match_percentage)}, ${getMatchColor(career.match_percentage)}aa)`
                    }}
                  ></div>
                </div>

                <div className="career-section">
                  <h4>Why It Fits</h4>
                  <p>{career.fit_reason}</p>
                </div>

                <div className="career-section">
                  <h4>Required Skills</h4>
                  <div className="skills-tags">
                    {career.required_skills.map((skill, idx) => (
                      <span key={idx} className="skill-tag required">{skill}</span>
                    ))}
                  </div>
                </div>

                <div className="career-section">
                  <h4>Skills to Develop</h4>
                  <div className="skills-tags">
                    {career.skill_gap.map((skill, idx) => (
                      <span key={idx} className="skill-tag gap">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="results-actions">
          <button className="secondary-btn" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
          <button className="primary-btn" onClick={() => navigate('/questionnaire')}>
            Take Assessment Again
          </button>
          <button className="secondary-btn" onClick={() => window.print()}>
            Print Results 🖨️
          </button>
        </div>

        {/* Next Steps */}
        <div className="next-steps">
          <h3>📚 Next Steps</h3>
          <div className="steps-grid">
            <div className="step-card">
              <span className="step-number">1</span>
              <h4>Research Careers</h4>
              <p>Explore job descriptions, salary ranges, and growth prospects for your matched careers</p>
            </div>
            <div className="step-card">
              <span className="step-number">2</span>
              <h4>Develop Skills</h4>
              <p>Focus on closing the skill gaps identified in your results through courses or projects</p>
            </div>
            <div className="step-card">
              <span className="step-number">3</span>
              <h4>Network & Connect</h4>
              <p>Reach out to professionals in these fields to learn about their experiences</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
