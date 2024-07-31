import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import config from '../config';
import NotificationModal from "../modals/NotificationModal";

const ResetPassword = () => {
  const { token } = useParams(); // Extract the token from the URL
  const navigate = useNavigate(); // Hook to programmatically navigate
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirmation password
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setSuccess('');
      setShowNotificationModal(true);
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
        // Clear the form fields
        setPassword('');
        setConfirmPassword('');
        // Redirect to home page
        setTimeout(() => navigate('/'), 2000); // Redirect after 2 seconds to show the notification
      } else {
        setError(json.error || 'An error occurred');
        setSuccess('');
        setShowNotificationModal(true);
      }
    } catch (err) {
      setError('An error occurred');
      setSuccess('');
      setShowNotificationModal(true);
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

      <NotificationModal
        isOpen={showNotificationModal}
        onRequestClose={() => setShowNotificationModal(false)}
        message={success || error}
      />
    </div>
  );
};

export default ResetPassword;
