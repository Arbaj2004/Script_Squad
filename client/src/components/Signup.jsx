// "name": "COCK Johnson",
// "phone": "9960689854", 
// "password": "Password123",
// "passwordConfirm": "Password123",
// "role": "Nurse"

import { useEffect, useState } from 'react';
import backgroundImage from '../assets/background.jpg'; // Adjust the path to your image file
import { NavLink, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  useEffect(() => {
    
    console.log(process.env.REACT_APP_BACKEND_URL)
  
  }, [])
  
  const handleSubmit = async(e) => {
    e.preventDefault();
    e.stopPropagation();
    const URL = `${process.env.REACT_APP_BACKEND_URL}/users/register`;
    try {
      const response = await axios.post(URL, {
        passwordConfirm: formData.confirmPassword, 
        name: formData.name,
        phone: formData.phoneNumber,
        password: formData.password,
        role: formData.role,
      },{
        withCredentials: true
      });
      
      if (response.data.status === "success") {
        toast.success("Registration successful");
        localStorage.setItem('token',response.data.token)

        setTimeout(() => {
          setFormData({
            name: "",
            phone: "",
            password: "",
            passwordConfirm: "",
            role: "",
          });
          navigate('/verify'); // Redirect to the login page
        }, 1000);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred during registration.");
      console.log(">>", error);
    }
    console.log('Sign Up Data:', formData);
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

      <div className="relative z-10 bg-white bg-opacity-70 p-10 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-4xl font-bold text-blue-600 mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-lg text-gray-700">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 text-sm rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg text-gray-700">Phone Number:</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 text-sm rounded"
            />
          </div>
          <div className="mb-4">
            <div className='flex justify-between'>
              <label className="block text-lg text-gray-700">Password:</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs  flex items-center"
                title={showPassword ? 'Hide password' : 'Show password'}
                >
                {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
                <p className='ml-1'> {showPassword ? 'Hide' : 'Show'}</p>
              </button>
              </div>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 text-sm rounded"
            />
          </div>
          <div className="mb-4">
          <div className='flex justify-between'>
              <label className="block text-lg text-gray-700">Password:</label>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-xs  flex items-center"
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                {showConfirmPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
                <p className='ml-1'> {showConfirmPassword ? 'Hide' : 'Show'}</p>
              </button>
              </div>
            {/* <label className="block text-lg text-gray-700">Confirm Password:</label> */}
            <input
              type={showConfirmPassword? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 text-sm rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg text-gray-700">Role:</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 text-sm rounded"
            >
              <option value="">Select Role</option>
              <option value="Nurse">Nurse</option>
              <option value="Patient">Patient</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white text-lg py-2 px-4 rounded w-full mt-4"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-4 text-center">
          <NavLink to="/signin" className="text-lg text-blue-600 hover:underline">
            Already have an account? Sign In
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
