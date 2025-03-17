// src/component/MicrosoftAuth/MicrosoftAuth.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function MicrosoftAuth() {
  const [authStatus, setAuthStatus] = useState('checking');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we need to authenticate
    axios.get('http://127.0.0.1:5000/auth-status')
      .then(response => {
        if (response.data.authenticated) {
          setAuthStatus('authenticated');
          navigate('/auth-success');
        } else {
          // Redirect to Microsoft login
          window.location.href = 'http://127.0.0.1:5000/ms-login';
        }
      })
      .catch(error => {
        console.error('Error checking auth status:', error);
        setAuthStatus('error');
      });
  }, [navigate]);

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      {authStatus === 'checking' && <h2>Checking authentication status...</h2>}
      {authStatus === 'error' && <h2>Error connecting to authentication service</h2>}
    </div>
  );
}

export default MicrosoftAuth;