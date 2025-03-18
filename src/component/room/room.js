import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "./room.css";
import { jwtDecode } from 'jwt-decode';

function BookingForm() {
  const [fullName, setFullName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [location, setLocation] = useState("Hyderabad");
  const [branch, setBranch] = useState("");
  const [room, setRoom] = useState("");
  const [date, setDate] = useState("");
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");
  const [bookingType, setBookingType] = useState("self");
  const [bookedFor, setBookedFor] = useState("");
  const [message, setMessage] = useState("");
  const [showWeekendConfirm, setShowWeekendConfirm] = useState(false);
  const [emails, setEmails] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const [emailQueued, setEmailQueued] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        navigate('/login');
        return;
    }

    try {
        const decodedToken = jwtDecode(token); // Correct usage
        console.log("Decoded Token:", decodedToken);
        console.log("Full Name from Token:", decodedToken.full_name);
        setFullName(decodedToken.full_name || '');
        setEmployeeId(decodedToken.employee_id || '');
    } catch (error) {
        console.error("Error decoding token:", error);
        navigate('/login');
        return;
    }

    fetchEmails();
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [navigate]);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  const getMinDate = () => new Date().toISOString().split("T")[0];
  const isWeekend = (date) => new Date(date).getDay() % 6 === 0;

  const fetchEmails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await axios.get("http://127.0.0.1:5000/get_employee_emails", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setEmails(response.data.emails || []);
    } catch (error) {
      console.error("Failed to fetch emails:", error);
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setBookedFor(value);
    if (value.length >= 2) {
      const filtered = emails.filter(email => email.toLowerCase().includes(value.toLowerCase()));
      setFilteredEmails(filtered);
      setShowDropdown(true);
      fetchFilteredEmails(value);
    } else {
      setShowDropdown(false);
      setFilteredEmails([]);
    }
  };

  const fetchFilteredEmails = async (searchTerm) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await axios.get(`http://127.0.0.1:5000/get_employee_emails?search=${searchTerm}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setFilteredEmails(response.data.emails || []);
    } catch (error) {
      console.error("Failed to fetch filtered emails:", error);
    }
  };

  const selectEmail = (email) => {
    setBookedFor(email);
    setShowDropdown(false);
  };

  const locations = {
    Hyderabad: {
      "Ramky Towers (Gachibowli)": ["Prithvi(Conference Room)", "Akasha", "Agni", "Vayu", "Apas"],
      "Amarjyothi (Jubilee Hills)": ["Cabin-1", "Cabin-2", "Cabin-3", "Cabin-4", "Conference Room"]
    }
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 9; hour <= 23; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            const displayTime = convertTo12HourFormat(time);
            options.push({ value: time, display: displayTime });
        }
    }
    return options;
};

const convertTo12HourFormat = (time) => {
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours);
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${period}`;
};

const convertTo24HourFormat = (time12) => {
    let [time, period] = time12.split(' ');
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours);

    if (period === 'PM' && hours !== 12) {
        hours += 12;
    } else if (period === 'AM' && hours === 12) {
        hours = 0;
    }

    return `${hours.toString().padStart(2, '0')}:${minutes}`;
};

const timeOptions = generateTimeOptions();

const handleTimeFromChange = (e) => {
    setTimeFrom(convertTo24HourFormat(e.target.value));
};

const handleTimeToChange = (e) => {
    setTimeTo(convertTo24HourFormat(e.target.value));
};

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
    setBranch("");
  };

  const handleBranchChange = (e) => {
    setBranch(e.target.value);
    setRoom("");
  };

  const continueWithWeekendBooking = () => {
    setShowWeekendConfirm(false);
    processBooking();
  };

  const cancelWeekendBooking = () => {
    setShowWeekendConfirm(false);
  };

  const displayMessage = (msg, isError, conflicts = []) => {
    let fullMessage = msg;
    if (isError && conflicts.length > 0) {
        fullMessage += "\nConflicting slots:\n";
        conflicts.forEach(slot => {
            fullMessage += `- ${slot.start} - ${slot.end}\n`;
        });
    }
    setMessage(fullMessage);
    setTimeout(() => setMessage(''), 5000); // Clear message after 5 seconds
};

const processBooking = async () => {
    setIsLoading(true); // Start loading
    const token = localStorage.getItem('token');
    if (!token) {
        navigate('/login');
        return;
    }
    const startTime = new Date(`${date}T${timeFrom}`);
    const endTime = new Date(`${date}T${timeTo}`);
    if (endTime <= startTime) {
        displayMessage("❌ End time must be later than start time on the same day.", true);
        setIsLoading(false); // Stop loading
        return;
    }

    const bookingData = {
        fullName,
        employeeId,
        location,
        branch,
        room,
        date,
        timeFrom: timeFrom,
        timeTo: timeTo,
        bookingType,
        bookedFor: bookingType === "self" ? "Self" : bookedFor,
    };

    try {
        const response = await axios.post("http://127.0.0.1:5000/book_room", bookingData, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        displayMessage(`✅ ${response.data.message}`, false);
        setRoom(""); setLocation("Hyderabad"); setBranch(""); setDate(""); setTimeFrom(""); setTimeTo(""); setBookingType("self"); setBookedFor("");
        if (response.data.emailQueued) {
          setEmailQueued(true);
      }
    } catch(error) {
        displayMessage(
            error.response?.data?.error || "❌ Failed to book the room",
            true,
            error.response?.data?.conflicts || []
        );
    } finally {
        setIsLoading(false); // Stop loading
    }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !employeeId || !location || !branch || !room || !date || !timeFrom || !timeTo || !bookingType) {
      displayMessage("❌ Please fill all fields", true);
      return;
    }
    if (isWeekend(date)) {
      setShowWeekendConfirm(true);
    } else {
      processBooking();
    }
  };

  const WeekendConfirmationModal = () => {
    if (!showWeekendConfirm) return null;
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>Weekend Booking Confirmation</h3>
          <p>⚠️ You are booking a room on a weekend. Do you want to continue?</p>
          <div className="modal-buttons">
            <button className="modal-button confirm-button" onClick={continueWithWeekendBooking}>Continue</button>
            <button className="modal-button cancel-button" onClick={cancelWeekendBooking}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

    return (
        <div className="form-container">
            <WeekendConfirmationModal />
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="column" style={{ width: '320px', marginLeft: '105px' }}>
                        <label>Enter Your Name:</label>
                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                    </div>
                    <div className="column" style={{ width: '320px', marginLeft: '105px' }}>
                        <label>Employee ID:</label>
                        <input type="text" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} required />
                    </div>
                </div>

                <label>Select Location:</label>
                <select value={location} onChange={handleLocationChange} required>
                    <option value="Hyderabad">Hyderabad</option>
                </select>

                <label>Select Branch:</label>
                <select value={branch} onChange={handleBranchChange} required>
                    <option value="">Select Branch</option>
                    {Object.keys(locations[location]).map((br) => (
                        <option key={br} value={br}>{br}</option>
                    ))}
                </select>

                {branch && (
                    <>
                        <label>Choose a Room:</label>
                        <select value={room} onChange={(e) => setRoom(e.target.value)} required>
                            <option value="">Select Room</option>
                            {locations[location][branch].map((rm) => (
                                <option key={rm} value={rm}>{rm}</option>
                            ))}
                        </select>
                    </>
                )}

                <label>Select Date:</label>
                <input type="date" style={{ width: '290px', marginLeft: '105px' }} value={date} onChange={(e) => setDate(e.target.value)} min={getMinDate()} required />
                <label>From Time:</label>
                   <select style={{ width: '320px', marginLeft: '105px' }} value={convertTo12HourFormat(timeFrom)} onChange={handleTimeFromChange} required>
                {timeOptions.map((option) => (
                    <option key={option.value} value={option.display}>{option.display}</option>
                ))}
                </select>

                <label>To Time:</label>
                <select style={{ width: '320px', marginLeft: '105px' }} value={convertTo12HourFormat(timeTo)} onChange={handleTimeToChange} required>
                    {timeOptions.map((option) => (
                        <option key={option.value} value={option.display}>{option.display}</option>
                    ))}
                </select>

               
                <label>Booking Type:</label>
                <select style={{ width: '320px', marginLeft: '105px' }} value={bookingType} onChange={(e) => setBookingType(e.target.value)} required>
                    {/* <option value="self">Self</option>
                    <option value="team">Our Team</option>
                    <option value="Client-Team">Client-Team</option>
                    <option value="others">Some Other Person(s)</option> */}
                    <option value="self">Self</option>
                    <option value="onBehalf">On Behalf</option>
                </select>

                {bookingType === "onBehalf" && (
                    <>
                        <label>Booked For (Enter Name or Team or Client):</label>
                        <div className="email-input-container" ref={dropdownRef}>
                            <input type="text" style={{ width: '300px', marginLeft: '105px' }} value={bookedFor} onChange={handleEmailChange} required={bookingType !== "self"} placeholder="Start typing email..." />
                            {showDropdown && filteredEmails.length > 0 && (
                                <div className="email-dropdown">
                                    {filteredEmails.map((email, index) => (
                                        <div key={index} className="email-option" onClick={() => selectEmail(email)}>{email}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}

                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Booking...' : 'Book Room'}
                </button>

                {message && (
                    <p className={`message ${message.includes("✅") ? "success" : "error"}`}>
                        {message}
                    </p>
                )}

              {emailQueued && (
            <div>
              <p>Email sending is pending. Please authenticate.</p>
              <button onClick={() => (window.location.href = "/ms-login")}>
                Authenticate with Microsoft
              </button>
            </div>
          )}
            </form>
        </div>
    );
}

export default BookingForm;