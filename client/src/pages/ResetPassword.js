import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import config from '../config';
import NotificationModal from "../modals/NotificationModal";

const ResetPassword = () => {
  const { token } = useParams(); // Extract the token from the URL
  const navigate = useNavigate(); 
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setSuccess('');
      setShowNotificationModal(false); 
      return;
    }

    try {
      const response = await fetch(`${config.apiServer}/api/user/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const json = await response.json();
      if (response.ok) {
        setSuccess(json.message);
        setError('');
        setShowNotificationModal(true);
        setPassword('');
        setConfirmPassword('');

        // Redirect to home page
        setTimeout(() => navigate('/'), 2000); 
      } else {
        setError(json.error || 'An error occurred');
        setSuccess('');
        setShowNotificationModal(false); 
      }
    } catch (err) {
      setError('An error occurred');
      setSuccess('');
      setShowNotificationModal(false); 
    }
  };

  return (
    <div>
      <form className="reset-password" onSubmit={handleSubmit}>
        <h3>Reset Password</h3>
        <label>New Password</label>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <label>Confirm Password</label>
        <input
          type="password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
        />
        <button type="submit">Reset Password</button>
      </form>

      {error && <div className="error">{error}</div>}
      <NotificationModal
        isOpen={showNotificationModal}
        onRequestClose={() => setShowNotificationModal(false)}
        message={success}
      />
    </div>
  );
};

export default ResetPassword;
