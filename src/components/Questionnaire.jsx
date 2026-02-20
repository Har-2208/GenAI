import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Questionnaire.css';

const Questionnaire = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    interests: [],
    strengths: [],
    workStyle: '',
    riskTolerance: '',
    subjectsLiked: []
  });

  const interestOptions = [
    'Technology', 'Healthcare', 'Business', 'Arts & Design', 
    'Science', 'Education', 'Finance', 'Marketing', 
    'Engineering', 'Social Work', 'Law', 'Media'
  ];

  const strengthOptions = [
    'Analytical Thinking', 'Creativity', 'Leadership', 'Communication',
    'Problem Solving', 'Teamwork', 'Technical Skills', 'Attention to Detail',
    'Adaptability', 'Time Management', 'Critical Thinking', 'Empathy'
  ];

  const workStyleOptions = [
    'Independent work', 'Team collaboration', 'Mix of both', 
    'Remote work', 'Office environment', 'Field work'
  ];

  const riskToleranceOptions = [
    'Very Low - I prefer stability and security',
    'Low - I prefer predictability with minimal risk',
    'Moderate - I can handle some uncertainty',
    'High - I embrace challenges and change',
    'Very High - I thrive in unpredictable environments'
  ];

  const subjectOptions = [
    'Mathematics', 'Science', 'Literature', 'History',
    'Computer Science', 'Psychology', 'Economics', 'Art',
    'Biology', 'Physics', 'Chemistry', 'Philosophy'
  ];

  const handleMultiSelect = (field, value) => {
    setFormData(prev => {
      const currentValues = prev[field];
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [field]: currentValues.filter(item => item !== value)
        };
      } else {
        return {
          ...prev,
          [field]: [...currentValues, value]
        };
      }
    });
  };

  const handleSingleSelect = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.interests.length === 0 || formData.strengths.length === 0 || 
        !formData.workStyle || !formData.riskTolerance || formData.subjectsLiked.length === 0) {
      alert('Please complete all fields before submitting');
      return;
    }

    try {
      // Navigate to loading screen
      navigate('/loading', { state: { formData } });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="questionnaire-page">
      <div className="container">
        <div className="questionnaire-header">
          <h1>🎯 Career Identity Assessment</h1>
          <p>Answer these questions to discover your ideal career path</p>
        </div>

        <form onSubmit={handleSubmit} className="questionnaire-form">
          {/* Interests */}
          <div className="form-section">
            <label className="section-label">
              What are your main interests? <span className="required">*</span>
              <span className="helper-text">Select at least 2-3</span>
            </label>
            <div className="options-grid">
              {interestOptions.map(interest => (
                <button
                  key={interest}
                  type="button"
                  className={`option-btn ${formData.interests.includes(interest) ? 'selected' : ''}`}
                  onClick={() => handleMultiSelect('interests', interest)}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Strengths */}
          <div className="form-section">
            <label className="section-label">
              What are your key strengths? <span className="required">*</span>
              <span className="helper-text">Select at least 2-3</span>
            </label>
            <div className="options-grid">
              {strengthOptions.map(strength => (
                <button
                  key={strength}
                  type="button"
                  className={`option-btn ${formData.strengths.includes(strength) ? 'selected' : ''}`}
                  onClick={() => handleMultiSelect('strengths', strength)}
                >
                  {strength}
                </button>
              ))}
            </div>
          </div>

          {/* Work Style */}
          <div className="form-section">
            <label className="section-label">
              Preferred work style? <span className="required">*</span>
            </label>
            <select 
              className="select-input"
              value={formData.workStyle}
              onChange={(e) => handleSingleSelect('workStyle', e.target.value)}
            >
              <option value="">Select your preference</option>
              {workStyleOptions.map(style => (
                <option key={style} value={style}>{style}</option>
              ))}
            </select>
          </div>

          {/* Risk Tolerance */}
          <div className="form-section">
            <label className="section-label">
              Risk tolerance level? <span className="required">*</span>
            </label>
            <select 
              className="select-input"
              value={formData.riskTolerance}
              onChange={(e) => handleSingleSelect('riskTolerance', e.target.value)}
            >
              <option value="">Select your risk tolerance</option>
              {riskToleranceOptions.map(risk => (
                <option key={risk} value={risk}>{risk}</option>
              ))}
            </select>
          </div>

          {/* Subjects Liked */}
          <div className="form-section">
            <label className="section-label">
              Which subjects do you enjoy? <span className="required">*</span>
              <span className="helper-text">Select at least 2-3</span>
            </label>
            <div className="options-grid">
              {subjectOptions.map(subject => (
                <button
                  key={subject}
                  type="button"
                  className={`option-btn ${formData.subjectsLiked.includes(subject) ? 'selected' : ''}`}
                  onClick={() => handleMultiSelect('subjectsLiked', subject)}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="back-btn"
              onClick={() => navigate('/')}
            >
              ← Back
            </button>
            <button type="submit" className="submit-btn">
              Analyze My Career Identity →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Questionnaire;
