// Feedback Modal Component
import React, { useState } from 'react';
import { useSubmitFeedback } from '../hooks/useApi';
import './FeedbackModal.css';

const FeedbackModal = ({ isOpen, onClose, resultId = null }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { submitFeedback, isSubmitting, submitted, error } = useSubmitFeedback();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const feedbackData = {
      rating,
      comment,
      resultId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };

    const result = await submitFeedback(feedbackData);
    
    if (result.success) {
      setTimeout(() => {
        setRating(0);
        setComment('');
        onClose();
      }, 1500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="feedback-modal-overlay" onClick={onClose}>
      <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h2>Share Your Feedback</h2>
        <p>Help us improve your career discovery experience</p>

        {submitted ? (
          <div className="feedback-success">
            <span className="success-icon">✓</span>
            <h3>Thank you for your feedback!</h3>
            <p>We appreciate your input.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>How would you rate your experience?</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star ${star <= rating ? 'active' : ''}`}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Additional Comments (Optional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us what you think..."
                rows="4"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="modal-actions">
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={isSubmitting || rating === 0}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;
