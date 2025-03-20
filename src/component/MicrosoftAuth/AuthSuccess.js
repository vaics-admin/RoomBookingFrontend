// src/component/MicrosoftAuth/AuthSuccess.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect after showing success message
    const timer = setTimeout(() => {
      // Redirect to previous page or home
      const returnTo = localStorage.getItem('returnTo') || '/';
      console.log(returnTo)
      localStorage.removeItem('returnTo');
      navigate(returnTo);
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h2>Authentication Successful!</h2>
      <p>You can now use the email functionality.</p>
      <p>Redirecting you back...</p>
    </div>
  );
}

export default AuthSuccess;