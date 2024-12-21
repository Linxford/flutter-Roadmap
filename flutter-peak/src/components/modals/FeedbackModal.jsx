import React, { useState } from 'react';
import { useModal } from '../../context/ModalContext';
import { Modal } from './Modal';
import '../../styles/components/modals/Modal.css';
import '../../styles/components/modals/FeedbackModal.css';
import { db, logAnalyticsEvent } from '../../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function FeedbackModal() {
  const { activeModal, hideModal } = useModal();
  const [feedback, setFeedback] = useState({
    type: 'suggestion',
    message: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (activeModal !== 'feedback') return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Add feedback to Firebase
      await addDoc(collection(db, 'feedback'), {
        type: feedback.type,
        message: feedback.message,
        email: feedback.email,
        timestamp: serverTimestamp(),
        status: 'new'
      });

      logAnalyticsEvent('feedback_submitted', {
        feedback_type: feedback.type,
        has_email: !!feedback.email
      });

      toast.success('Thank you for your feedback!');
      hideModal();
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal onClose={hideModal}>
      <div className="modal-content feedback-content">
        <h2>
          <img
            src="https://img.icons8.com/fluency/48/comments.png"
            width="24"
            alt="feedback"
          />
          Share Your Feedback
        </h2>
        <p className="feedback-intro">
          Help us improve FlutterPeak! Your feedback is valuable to us.
        </p>

        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="feedback-type">
            <label>Feedback Type:</label>
            <div className="feedback-options">
              {['suggestion', 'bug', 'content', 'other'].map(type => (
                <button
                  key={type}
                  type="button"
                  className={`type-btn ${feedback.type === type ? 'active' : ''}`}
                  onClick={() => setFeedback(prev => ({ ...prev, type }))}
                >
                  <img
                    src={`https://img.icons8.com/fluency/48/${
                      type === 'suggestion' ? 'light-on' :
                      type === 'bug' ? 'bug' :
                      type === 'content' ? 'document' :
                      'question-mark'
                    }.png`}
                    width="20"
                    alt={type}
                  />
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="message">Your Feedback:</label>
            <textarea
              id="message"
              value={feedback.message}
              onChange={(e) => setFeedback(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Share your thoughts, ideas, or report issues..."
              required
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email (optional):
              <span className="email-note">
                - to receive updates on your feedback
              </span>
            </label>
            <input
              type="email"
              id="email"
              value={feedback.email}
              onChange={(e) => setFeedback(prev => ({ ...prev, email: e.target.value }))}
              placeholder="your.email@example.com"
            />
          </div>

          <div className="button-group">
            <button
              type="submit"
              className="modal-btn"
              disabled={isSubmitting || !feedback.message.trim()}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
            <button
              type="button"
              className="modal-btn cancel"
              onClick={hideModal}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
