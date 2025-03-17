// import './App.css';
// import BookingForm from './component/room/room';
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Login from './component/Login/login';
// import ForgotPassword from './component/Login/forgotpassword';


// function App() {
//   return (
//     <Router>
//     <Routes>
//       <Route path="/login" element={<Login />} />
//       <Route path="/book-room" element={<BookingForm />} />
//       <Route path="/" element={<Navigate to="/login" />} />
//       <Route path="/forgot-password" element={<ForgotPassword />} />
//       {/* <Route path="/reset-password" element={<ForgotPassword />} /> */}
//     </Routes>
//   </Router>
// );
// }

// export default App;


import './App.css';
import BookingForm from './component/room/room';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './component/Login/login';
import ForgotPassword from './component/Login/forgotpassword';
import MicrosoftAuth from './component/MicrosoftAuth/MicrosoftAuth';
import AuthSuccess from './component/MicrosoftAuth/AuthSuccess';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/book-room" element={<BookingForm />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/microsoft-auth" element={<MicrosoftAuth />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;

