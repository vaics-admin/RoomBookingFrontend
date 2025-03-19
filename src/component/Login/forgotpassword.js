
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './forgot-password.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const handleSendOtp = async () => {
    setIsLoading(true);
    try {
      await axios.post('https://roombooking-okvk.onrender.com/forgot-password', { email });
      
      // Check if we need to authenticate first
      const authStatus = await axios.get('https://roombooking-okvk.onrender.com/auth-status');
      
      
      setStep(2);
      setMessage('OTP sent to your email address');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error sending OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setIsLoading(true);
    try {
      await axios.post('https://roombooking-okvk.onrender.com/reset-password', { email, otp, newPassword });
      setMessage('Password reset successful! Please login.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error resetting password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">

      {step === 1 ? (
        <>
          <h2>Forgot Password</h2>
          <input
            type="email"
            placeholder="Enter Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button onClick={handleSendOtp} disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send OTP'}
          </button>
        </>
      ) : (
        <>
          <h2>Reset Password</h2>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button onClick={handleResetPassword} disabled={isLoading}>
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </>
      )}
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default ForgotPassword;