import { useState } from "react";
import config from '../config';
import NotificationModal from "../modals/NotificationModal";


const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Submitting form with email:', email);
    setLoading(true); // Show spinner
    setShowNotificationModal(false); // Hide modal while loading

    try {
      const response = await fetch(`${config.apiServer}/api/user/forgot-password`, {
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
      } else {
        setMessage(json.error || 'An error occurred');
      }
    } catch (error) {
        console.error('Fetch error:', error);
        setMessage('An error occurred while sending the reset link.');
      } finally {
        setLoading(false); // Hide spinner
        setShowNotificationModal(true); // Show modal
      }
    }
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
