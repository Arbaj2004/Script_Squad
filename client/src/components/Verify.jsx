import { useState } from 'react';
import backgroundImage from '../assets/background.jpg';
import { Navigate, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { loginSuccess } from '../redux/userSlice';
import { useDispatch } from 'react-redux';

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const token = localStorage.getItem('token');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e, index) => {
    const value = e.target.value;

    if (/^\d*$/.test(value) && (value === '' || value.length <= 1)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value !== '' && index < 5) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }

    if (e.key === 'Enter') {
      // Submit on Enter key press
      handleSubmit(e);
    }
  };

  const handlePaste = (e, index) => {
    e.preventDefault(); // Prevent the default paste action
    const pastedData = e.clipboardData.getData('Text').trim(); // Get pasted data from clipboard

    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      // Move focus to the last input field after pasting
      document.getElementById(`otp-input-5`).focus();
    } else {
      toast.error("Please paste a valid 6-digit OTP.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${process.env.REACT_APP_BACKEND_URL}/users/verifySignupEmailOTP`;
    try {
      const response = await axios.post(
        URL,
        { Emailotp: otp.join('') },
        { headers: { authorization: `Bearer ${token}` } },
        { withCredentials: true }
      );

      if (response.data.status === "success") {
        const userData = response.data.data.userr;
        dispatch(loginSuccess(userData)); // Dispatch the user state to Redux
        setTimeout(() => {
          toast.success("Verification successful");
          if (userData.role === 'Nurse') {
            navigate('/nurse'); // Redirect to the home page
          } else if (userData.role === 'Patient') {
            navigate('/patient');
          } else if (userData.role === 'Admin') {
            navigate('Admin');
          }
        }, 1000);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred during registration.");
      console.log(">>", error);
      navigate('/signup');
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          opacity: 0.4,
        }}
      ></div>

      <div className="relative z-10 bg-white bg-opacity-75 p-10 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">Verify OTP</h2>
        <form onSubmit={handleSubmit} className="flex justify-between mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              value={digit}
              onChange={(e) => handleInputChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={(e) => handlePaste(e, index)}
              className="w-12 h-12 border border-gray-300 text-center text-2xl rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              maxLength="1"
            />
          ))}
        </form>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-600 text-white text-lg py-2 px-4 rounded w-full transition duration-150 ease-in-out"
        >
          Verify OTP
        </button>

        <div className="flex items-center justify-between mt-4">
          <NavLink to="/signin" className="text-sm text-blue-600 hover:underline">
            Sign In
          </NavLink>
          <NavLink to="/signup" className="text-sm text-blue-600 hover:underline">
            Sign Up
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
