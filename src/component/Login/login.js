import React, { useState } from 'react';
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
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    const endpoint = isRegister ? '/register' : '/login';

    try {
      const response = await axios.post(` http://127.0.0.1:5000${endpoint}`, {
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



























// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './login.css';

// function Login() {
//   const [employeeId, setEmployeeId] = useState('');
//   const [password, setPassword] = useState('');
//   const [username, setUsername] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [role, setRole] = useState('Manager 1');
//   const [isRegister, setIsRegister] = useState(false);
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false); // Add loading state

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true); // Start loading
//     const endpoint = isRegister ? '/register' : '/login';

//     try {
//       const response = await axios.post(` http://127.0.0.1:5000${endpoint}`, {
//         username: isRegister ? username : undefined,
//         employeeId,
//         password,
//         phoneNumber: isRegister ? phoneNumber : undefined,
//         role: isRegister ? role : undefined,
//       });

//       if (isRegister) {
//         setMessage('Registration successful! Waiting for approval.');
//         setIsRegister(false);
//       } else {
//         localStorage.setItem('token', response.data.token);
//         localStorage.setItem('username', response.data.username);
//         localStorage.setItem('employeeId', response.data.employeeId);
//         navigate('/book-room');
//       }
//     } catch (error) {
//       setMessage(error.response?.data?.error || 'An error occurred');
//     } finally {
//       setIsLoading(false); // Stop loading
//     }
//   };

//   return (
//     <div className="login-container">
//       <form onSubmit={handleSubmit} className="login-form">
//         <h2>{isRegister ? 'Register' : 'Login'}</h2>

//         {isRegister && (
//           <div className="form-group">
//             <label>Username:</label>
//             <input
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               required
//             />
//           </div>
//         )}

//         <div className="form-group">
//           <label>Employee ID:</label>
//           <input
//             type="text"
//             value={employeeId}
//             onChange={(e) => setEmployeeId(e.target.value)}
//             required
//           />
//         </div>

//         {isRegister && (
//           <>
//             <div className="form-group">
//               <label style={{ width: '180px' }}>Phone Number:</label>
//               <input
//                 type="text"
//                 value={phoneNumber}
//                 onChange={(e) => setPhoneNumber(e.target.value)}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label style={{ width: '180px' }}>Select Approver:</label>
//               <select value={role} onChange={(e) => setRole(e.target.value)} required>
//                 <option value="Manager 1">Manager 1</option>
//                 <option value="Manager 2">Manager 2</option>
//                 <option value="HR">HR</option>
//               </select>
//             </div>
//           </>
//         )}

//         <div className="form-group">
//           <label>Password:</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>

//         <button type="submit" disabled={isLoading}>
//           {isLoading ? (isRegister ? 'Registering...' : 'Logging in...') : (isRegister ? 'Register' : 'Login')}
//         </button>

//         <p className="toggle-form">
//           {isRegister ? 'Already have an account? ' : "Don't have an account? "}
//           <span onClick={() => setIsRegister(!isRegister)}>
//             {isRegister ? 'Login' : 'Register'}
//           </span>
//         </p>

//         {!isRegister && (
//           <p className="forgot-password" style={{ textAlign: 'center', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}>
//             <span onClick={() => navigate('/forgot-password')}>Forgot Password?</span>
//           </p>
//         )}

//         {message && <p className="message">{message}</p>}
//       </form>
//     </div>
//   );
// }

// export default Login;