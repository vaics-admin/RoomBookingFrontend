// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './forgot-password.css';

// function ForgotPassword() {
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [otp, setOtp] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [step, setStep] = useState(1);
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSendOtp = async () => {
//     setIsLoading(true);
//     try {
//       await axios.post(' http://127.0.0.1:5000/forgot-password', { phoneNumber });
//       setStep(2);
//       setMessage('OTP sent to your mobile number');
//     } catch (error) {
//       setMessage(error.response?.data?.error || 'Error sending OTP');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResetPassword = async () => {
//     setIsLoading(true);
//     try {
//       await axios.post(' http://127.0.0.1:5000/reset-password', { phoneNumber, otp, newPassword });
//       setMessage('Password reset successful! Please login.');
//       setTimeout(() => navigate('/'), 2000);
//     } catch (error) {
//       setMessage(error.response?.data?.error || 'Error resetting password');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="forgot-password-container">
//       {step === 1 ? (
//         <>
//           <h2>Forgot Password</h2>
//           <input
//             type="text"
//             placeholder="Enter Phone Number"
//             value={phoneNumber}
//             onChange={(e) => setPhoneNumber(e.target.value)}
//             required
//           />
//           <button onClick={handleSendOtp} disabled={isLoading}>
//             {isLoading ? 'Sending...' : 'Send OTP'}
//           </button>
//         </>
//       ) : (
//         <>
//           <h2>Reset Password</h2>
//           <input
//             type="text"
//             placeholder="Enter OTP"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//             required
//           />
//           <input
//             type="password"
//             placeholder="Enter New Password"
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//             required
//           />
//           <button onClick={handleResetPassword} disabled={isLoading}>
//             {isLoading ? 'Resetting...' : 'Reset Password'}
//           </button>
//         </>
//       )}
//       {message && <p className="message">{message}</p>}
//     </div>
//   );
// }

// export default ForgotPassword;






// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './forgot-password.css';

// function ForgotPassword() {
//   const [email, setEmail] = useState(''); // Changed from phoneNumber
//   const [otp, setOtp] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [step, setStep] = useState(1);
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSendOtp = async () => {
//     setIsLoading(true);
//     try {
//       await axios.post('http://127.0.0.1:5000/forgot-password', { email }); // Changed from phoneNumber
//       setStep(2);
//       setMessage('OTP sent to your email address'); // Updated message
//     } catch (error) {
//       setMessage(error.response?.data?.error || 'Error sending OTP');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResetPassword = async () => {
//     setIsLoading(true);
//     try {
//       await axios.post('http://127.0.0.1:5000/reset-password', { email, otp, newPassword }); // Changed from phoneNumber
//       setMessage('Password reset successful! Please login.');
//       setTimeout(() => navigate('/'), 2000);
//     } catch (error) {
//       setMessage(error.response?.data?.error || 'Error resetting password');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="forgot-password-container">
//       {step === 1 ? (
//         <>
//           <h2>Forgot Password</h2>
//           <input
//             type="email" // Changed type to email
//             placeholder="Enter Email Address" // Updated placeholder
//             value={email} // Changed from phoneNumber
//             onChange={(e) => setEmail(e.target.value)} // Changed from setPhoneNumber
//             required
//           />
//           <button onClick={handleSendOtp} disabled={isLoading}>
//             {isLoading ? 'Sending...' : 'Send OTP'}
//           </button>
//         </>
//       ) : (
//         <>
//           <h2>Reset Password</h2>
//           <input
//             type="text"
//             placeholder="Enter OTP"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//             required
//           />
//           <input
//             type="password"
//             placeholder="Enter New Password"
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//             required
//           />
//           <button onClick={handleResetPassword} disabled={isLoading}>
//             {isLoading ? 'Resetting...' : 'Reset Password'}
//           </button>
//         </>
//       )}
//       {message && <p className="message">{message}</p>}
//     </div>
//   );
// }

// export default ForgotPassword;






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
  const [needsAuth, setNeedsAuth] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if we need microsoft authentication
    axios.get('http://127.0.0.1:5000/auth-status')
      .then(response => {
        setNeedsAuth(!response.data.authenticated);
      })
      .catch(error => {
        console.error('Error checking auth status:', error);
      });
  }, []);

  const handleSendOtp = async () => {
    setIsLoading(true);
    try {
      await axios.post('http://127.0.0.1:5000/forgot-password', { email });
      
      // Check if we need to authenticate first
      const authStatus = await axios.get('http://127.0.0.1:5000/auth-status');
      
      if (!authStatus.data.authenticated) {
        // Store the return location
        localStorage.setItem('returnTo', '/forgot-password');
        setIsLoading(false);
        // Redirect to auth
        navigate('/microsoft-auth');
        return;
      }
      
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
      await axios.post('http://127.0.0.1:5000/reset-password', { email, otp, newPassword });
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
      {needsAuth && (
        <div className="auth-notice">
          <p>Email functionality requires Microsoft authentication</p>
          <button onClick={() => navigate('/microsoft-auth')}>Authenticate</button>
        </div>
      )}

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