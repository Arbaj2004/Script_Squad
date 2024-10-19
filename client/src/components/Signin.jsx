import { useState } from 'react';
import backgroundImage from '../assets/background.jpg'; // Adjust the path to your image file
import { NavLink } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/userSlice';

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: '',
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const URL = `${process.env.REACT_APP_BACKEND_URL}/users/login`;
    try {
      const response = await axios.post(URL, {
        phone: formData.phoneNumber,
        password: formData.phoneNumber,
      }, {
        withCredentials: true
      });
      const userData = response.data.data.userr;
      dispatch(loginSuccess(userData)); // Dispatch the user state to Redux

      if (response.data.status === "success") {
        toast.success("Successful login");
        
        setTimeout(() => {
          setFormData({
            password: "",
            phoneNumber: ""
          });
          console.log(userData)
          if(userData.role==='Nurse'){
            navigate('/nurse'); // Redirect to the home page
          }else if(userData.role==='Patient'){
            navigate('/patient')
          }else if(userData.role==='Admin'){
            navigate('Admin')
          }
        }, 1000);
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      toast.error("Please check your email and password");
      console.log(">>", error);
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

      <div className="relative z-10 bg-white bg-opacity-70 p-10 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-4xl font-bold text-blue-600 mb-4 text-center">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-m text-gray-700">Phone Number:</label>
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
          

          <div className="mb-4 text-right">
            <NavLink to="/verify" className="text-sm text-blue-600 hover:underline">
              Forgot Password?
            </NavLink>
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-4 rounded w-full mt-4"
          >
            Sign In
          </button>
        </form>

        <div className="mt-4 text-center">
          <NavLink to="/signup" className="text-sm text-blue-600 hover:underline">
            Don't have an account? Sign Up
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
