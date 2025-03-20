// // src/component/MicrosoftAuth/MicrosoftAuth.js
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// function MicrosoftAuth() {
//   const [authStatus, setAuthStatus] = useState('checking');
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Check if we need to authenticate
//     axios.get('https://roombooking-okvk.onrender.com/auth-status')
//       .then(response => {
//         if (response.data.authenticated) {
//           setAuthStatus('authenticated');
//           navigate('/auth-success');
//         } else {
//           // Redirect to Microsoft login
//           window.location.href = 'https://roombooking-okvk.onrender.com/ms-login';
//         }
//       })
//       .catch(error => {
//         console.error('Error checking auth status:', error);
//         setAuthStatus('error');
//       });
//   }, [navigate]);

//   return (
//     <div style={{ textAlign: 'center', padding: '50px' }}>
//       {authStatus === 'checking' && <h2>Checking authentication status...</h2>}
//       {authStatus === 'error' && <h2>Error connecting to authentication service</h2>}
//     </div>
//   );
// }

// export default MicrosoftAuth;




// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// function MicrosoftAuth() {
//   const [authStatus, setAuthStatus] = useState('checking');
//   const [errorMessage, setErrorMessage] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const response = await axios.get('https://roombooking-okvk.onrender.com/auth-status', {
//           timeout: 5000, // 5 seconds timeout
//         });
//         if (response.data.authenticated) {
//           setAuthStatus('authenticated');
//           navigate('/auth-success');
//         } else {
//           localStorage.setItem('returnTo', window.location.pathname);
//           window.location.href = 'https://roombooking-okvk.onrender.com/ms-login';
//         }
//       } catch (error) {
//         console.error('Error checking auth status:', error);
//         setAuthStatus('error');
//         setErrorMessage(error.message || 'An unexpected error occurred.');
//       }
//     };

//     checkAuth();
//   }, [navigate]);

//   return (
//     <div style={{ textAlign: 'center', padding: '50px' }}>
//       {authStatus === 'checking' && <h2>Checking authentication status...</h2>}
//       {authStatus === 'error' && (
//         <div>
//           <h2>Error connecting to authentication service</h2>
//           <p>{errorMessage}</p>
//           <button onClick={() => window.location.reload()}>Retry</button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default MicrosoftAuth;



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function MicrosoftAuth() {
    const [authStatus, setAuthStatus] = useState('checking');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('https://roombooking-okvk.onrender.com/auth-status', {
                    timeout: 5000,
                });
                if (response.data.authenticated) {
                    setAuthStatus('authenticated');
                    navigate('/auth-success');
                } else {
                    console.log("Redirecting to /ms-login (backend)"); // Debug log
                    localStorage.setItem('returnTo', window.location.pathname);
                    window.location.href = 'https://roombooking-okvk.onrender.com/ms-login';
                }
            } catch (error) {
                console.error('Error checking auth status:', error);
                setAuthStatus('error');
                setErrorMessage(error.message || 'An unexpected error occurred.');
            }
        };

        checkAuth();
    }, [navigate]);

    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            {authStatus === 'checking' && <h2>Checking authentication status...</h2>}
            {authStatus === 'error' && (
                <div>
                    <h2>Error connecting to authentication service</h2>
                    <p>{errorMessage}</p>
                    <button onClick={() => window.location.reload()}>Retry</button>
                </div>
            )}
        </div>
    );
}

export default MicrosoftAuth;