import { useState } from "react";
// import config from '../config';
import NotificationModal from "../modals/NotificationModal";


const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Submitting form with email:', email);
    setLoading(true);
    setShowNotificationModal(false);

    try {
      const response = await fetch('/api/user/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      console.log('Response Status:', response.status);
      console.log('Response Headers:', response.headers);

      const json = await response.json();
      console.log('Response JSON:', json);

      if (response.ok) {
        setMessage('A password reset link has been sent to your email.');
        setShowNotificationModal(true);
      } else {
        setError(json.error || 'An error occurred');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError('An error occurred while sending the reset link.');
    } finally {
      setLoading(false);
      setEmail('');

      setTimeout(() => {
        setError('');
        setMessage('');
      }, 3000);
    }
  };
  
  return (
    <div>
      <form className="forgot-password" onSubmit={handleSubmit}>
        <h3>Forgot Password</h3>
        <label>Email</label>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <button type="submit">Send Reset Link</button>
      </form>
      {error && <div className="error">{error}</div>}
      {loading && <div className="spinner"></div>}

      <NotificationModal
        isOpen={showNotificationModal}
        onRequestClose={() => setShowNotificationModal(false)}
        message={message}
      />
    </div>
  );
}

export default ForgotPassword;
