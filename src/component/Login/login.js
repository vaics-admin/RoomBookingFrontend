import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';

function Login() {
  const [fullName, setFullName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [needsAuth, setNeedsAuth] = useState(false);

  useEffect(() => {
    // Check authentication status on component mount
    checkAuthStatus();
  },);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/auth-status');
      setNeedsAuth(!response.data.authenticated);
    } catch (error) {
      console.error('Error checking auth status:', error);
    }
  };

  const handleMicrosoftAuth = () => {
    // Store the return location
    localStorage.setItem('returnTo', '/login');
    // Redirect to Microsoft Auth
    navigate('/microsoft-auth');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    const endpoint = isRegister ? '/register' : '/login';

    try {
       //const response = await axios.post(` http://127.0.0.1:5000${endpoint}`, {
        const response = await axios.post(` https://roombooking-okvk.onrender.com${endpoint}`, {
        fullName: isRegister ? fullName : undefined,
        employeeId,
        email: isRegister ? email : undefined,
        phoneNumber: isRegister ? phoneNumber : undefined,
        department: isRegister ? department : undefined,
        designation: isRegister ? designation : undefined,
        password,
      });

      if (isRegister) {
        setMessage('Registration successful!');
        setIsRegister(false);
      } else {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('fullName', response.data.fullName);
        localStorage.setItem('employeeId', response.data.employeeId);
        navigate('/book-room');
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred');
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="login-container">
      {needsAuth && (
        <div className="auth-notice">
          <p>Email functionality requires Microsoft authentication</p>
          <button onClick={handleMicrosoftAuth}>Authenticate</button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="login-form">
        <h2>{isRegister ? 'Register' : 'Login'}</h2>

        {isRegister && (
          <div className="form-group">
            <label>FullName:</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label>Employee ID:</label>
          <input
            type="text"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            required
          />
        </div>

        {isRegister && (
          <>
            <div className="form-group">
              <label style={{ width: '180px' }}>Phone Number:</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Department:</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Designation:</label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                required
              />
            </div>
          </>
        )}

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? (isRegister ? 'Registering...' : 'Logging in...') : (isRegister ? 'Register' : 'Login')}
        </button>

        <p className="toggle-form">
          {isRegister ? 'Already have an account? ' : "Don't have an account? "}
          <span onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Login' : 'Register'}
          </span>
        </p>

        {!isRegister && (
          <p className="forgot-password" style={{ textAlign: 'center', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}>
            <span onClick={() => navigate('/forgot-password')}>Forgot Password?</span>
          </p>
        )}

        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}

export default Login;























