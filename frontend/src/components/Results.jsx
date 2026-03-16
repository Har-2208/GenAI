import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import APP_CONSTANTS from '../constants/appConstants';
import FeedbackModal from './FeedbackModal';
import { useSaveResults, useAnalytics } from '../hooks/useApi';
import './Results.css';

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const results = location.state?.results;
  const { RESULTS } = APP_CONSTANTS;
  const [showFeedback, setShowFeedback] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const { saveResults, isSaving, savedId } = useSaveResults();
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    if (results) {
      // Track results view
      trackEvent('results_viewed');
    }
  }, [results, trackEvent]);

  if (!results) {
    navigate('/');
    return null;
  }

  const { career_identity_summary, top_careers } = results;

  const getMatchColor = (percentage) => {
    const thresholds = RESULTS.MATCH_COLOR_THRESHOLDS;
    if (percentage >= thresholds.HIGH.threshold) return thresholds.HIGH.color;
    if (percentage >= thresholds.MEDIUM.threshold) return thresholds.MEDIUM.color;
    return thresholds.LOW.color;
  };

  const handleSaveResults = async () => {
    trackEvent('save_results_clicked');
    const result = await saveResults(results);
    if (result.success) {
      alert(`Results saved! Your ID: ${result.data.id}`);
    } else {
      alert(`Failed to save results: ${result.error}`);
    }
  };

  const handleShareResults = () => {
    setShowShareMenu(!showShareMenu);
    trackEvent('share_menu_opened');
  };

  const handleCopyLink = () => {
    if (savedId) {
      const link = `${window.location.origin}/results/${savedId}`;
      navigator.clipboard.writeText(link);
      alert('Link copied to clipboard!');
      trackEvent('share_link_copied');
    } else {
      alert('Please save your results first to get a shareable link.');
    }
  };

  const handleDownloadPDF = () => {
    trackEvent('download_pdf_clicked');
    window.print();
  };

  const handleFeedback = () => {
    setShowFeedback(true);
    trackEvent('feedback_opened');
  };

  return (
    <div className="results-page">
      <div className="container">
        <div className="results-header">
          <h1>{RESULTS.TITLE}</h1>
          <p>{RESULTS.SUBTITLE}</p>
        </div>

        {/* Career Identity Summary */}
        <div className="identity-summary">
          <h2>{RESULTS.PROFILE_HEADING}</h2>
          <p>{career_identity_summary}</p>
        </div>

        {/* Top Careers */}
        <div className="careers-section">
          <h2>{RESULTS.TOP_CAREERS_HEADING}</h2>
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
                  <h4>{RESULTS.CAREER_CARD.WHY_IT_FITS}</h4>
                  <p>{career.fit_reason}</p>
                </div>

                <div className="career-section">
                  <h4>{RESULTS.CAREER_CARD.REQUIRED_SKILLS}</h4>
                  <div className="skills-tags">
                    {career.required_skills.map((skill, idx) => (
                      <span key={idx} className="skill-tag required">{skill}</span>
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
            {RESULTS.BUTTONS.BACK_HOME}
          </button>
          <button className="primary-btn" onClick={() => navigate('/questionnaire')}>
            {RESULTS.BUTTONS.RETAKE}
          </button>
          <button className="secondary-btn" onClick={handleDownloadPDF}>
            {RESULTS.BUTTONS.PRINT}
          </button>
          <button 
            className="secondary-btn" 
            onClick={handleSaveResults}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : savedId ? '✓ Saved' : '💾 Save Results'}
          </button>
          <div className="share-container">
            <button className="secondary-btn" onClick={handleShareResults}>
              🔗 Share
            </button>
            {showShareMenu && (
              <div className="share-menu">
                <button onClick={handleCopyLink}>
                  📋 Copy Link
                </button>
                <button onClick={() => {
                  trackEvent('share_social', { platform: 'twitter' });
                  window.open(`https://twitter.com/intent/tweet?text=I just discovered my career identity!&url=${window.location.href}`, '_blank');
                }}>
                  🐦 Share on Twitter
                </button>
                <button onClick={() => {
                  trackEvent('share_social', { platform: 'linkedin' });
                  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`, '_blank');
                }}>
                  💼 Share on LinkedIn
                </button>
              </div>
            )}
          </div>
          <button className="primary-btn feedback-btn" onClick={handleFeedback}>
            📝 Give Feedback
          </button>
        </div>

        {/* Next Steps */}
        <div className="next-steps">
          <h3>{RESULTS.NEXT_STEPS.TITLE}</h3>
          <div className="steps-grid">
            {RESULTS.NEXT_STEPS.STEPS.map((step, index) => (
              <div key={index} className="step-card">
                <span className="step-number">{step.number}</span>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal 
        isOpen={showFeedback} 
        onClose={() => setShowFeedback(false)}
        resultId={savedId}
      />
    </div>
  );
};

export default Results;
