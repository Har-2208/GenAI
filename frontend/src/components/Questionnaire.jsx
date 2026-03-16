import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import APP_CONSTANTS from '../constants/appConstants';
import './Questionnaire.css';

const Questionnaire = () => {
  const navigate = useNavigate();
  const { QUESTIONNAIRE } = APP_CONSTANTS;
  
  const [formData, setFormData] = useState({
    interests: [],
    strengths: [],
    workStyle: '',
    riskTolerance: '',
    subjectsLiked: []
  });

  const interestOptions = QUESTIONNAIRE.INTERESTS.OPTIONS;
  const strengthOptions = QUESTIONNAIRE.STRENGTHS.OPTIONS;
  const workStyleOptions = QUESTIONNAIRE.WORK_STYLE.OPTIONS;
  const riskToleranceOptions = QUESTIONNAIRE.RISK_TOLERANCE.OPTIONS;
  const subjectOptions = QUESTIONNAIRE.SUBJECTS.OPTIONS;

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
      alert(QUESTIONNAIRE.VALIDATION_MESSAGE);
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
          <h1>{QUESTIONNAIRE.TITLE}</h1>
          <p>{QUESTIONNAIRE.SUBTITLE}</p>
        </div>

        <form onSubmit={handleSubmit} className="questionnaire-form">
          {/* Interests */}
          <div className="form-section">
            <label className="section-label">
              {QUESTIONNAIRE.INTERESTS.LABEL} <span className="required">*</span>
              <span className="helper-text">{QUESTIONNAIRE.INTERESTS.HELPER_TEXT}</span>
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
              {QUESTIONNAIRE.STRENGTHS.LABEL} <span className="required">*</span>
              <span className="helper-text">{QUESTIONNAIRE.STRENGTHS.HELPER_TEXT}</span>
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
              {QUESTIONNAIRE.WORK_STYLE.LABEL} <span className="required">*</span>
            </label>
            <select 
              className="select-input"
              value={formData.workStyle}
              onChange={(e) => handleSingleSelect('workStyle', e.target.value)}
            >
              <option value="">{QUESTIONNAIRE.WORK_STYLE.PLACEHOLDER}</option>
              {workStyleOptions.map(style => (
                <option key={style} value={style}>{style}</option>
              ))}
            </select>
          </div>

          {/* Risk Tolerance */}
          <div className="form-section">
            <label className="section-label">
              {QUESTIONNAIRE.RISK_TOLERANCE.LABEL} <span className="required">*</span>
            </label>
            <select 
              className="select-input"
              value={formData.riskTolerance}
              onChange={(e) => handleSingleSelect('riskTolerance', e.target.value)}
            >
              <option value="">{QUESTIONNAIRE.RISK_TOLERANCE.PLACEHOLDER}</option>
              {riskToleranceOptions.map(risk => (
                <option key={risk} value={risk}>{risk}</option>
              ))}
            </select>
          </div>

          {/* Subjects Liked */}
          <div className="form-section">
            <label className="section-label">
              {QUESTIONNAIRE.SUBJECTS.LABEL} <span className="required">*</span>
              <span className="helper-text">{QUESTIONNAIRE.SUBJECTS.HELPER_TEXT}</span>
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
              {QUESTIONNAIRE.BUTTONS.BACK}
            </button>
            <button type="submit" className="submit-btn">
              {QUESTIONNAIRE.BUTTONS.SUBMIT}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Questionnaire;
