import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaMoon, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { toggleDarkMode } from '../redux/darkModeSlice';
import { logout } from '../redux/userSlice'; // Action to logout the user from Redux
import Avatar from './Avatar';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.darkMode.darkMode);
  const user = useSelector((state) => state.user.user); // Get the user from Redux state
  const [options, setOptions] = useState(false);


  const handleLogout = async () => {
    const URL = `${process.env.REACT_APP_BACKEND_URL}/users/logout`;
    try {
      const response = await axios.get(URL, {
        withCredentials: true,
      });
      if (response.data.status === "success") {
        toast.success("Successfully logged out");

        // Clear Redux and local storage
        dispatch(logout()); // Dispatch an action to clear Redux user state
        localStorage.removeItem('user'); // Remove user from local storage
        navigate('/'); // Redirect after logout

      } else {
        toast.error("Internal Error");
      }
    } catch (error) {
      toast.error("Internal Error");
      console.log(">>", error);
    }
    setOptions(false);
  };

  return (
    <header className="bg-indigo-100 shadow-md py-7">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-5xl mx-8 font-bold text-blue-600">SeniorCare</h1>
            <ul className="flex space-x-12 text-2xl ">
              <li><NavLink to="/" className="text-gray-600  hover:text-blue-600">Home</NavLink></li>
              <li><NavLink to="/contact" className="text-gray-600  hover:text-blue-600">Contact</NavLink></li>
              {user ? (
            <div className='flex items-center gap-3 cursor-pointer' onClick={() => { setOptions(!options); }}>
              <p className='hover:text-blue-500'>Hello, {user.name.split(' ')[0]}</p>
              <Avatar width={50} height={50} name={user?.name} />
            </div>
          ) : (
            <li><NavLink to="/signin" className="text-gray-600  hover:text-blue-600">Login</NavLink></li>
          )}
              {/* <li><NavLink to="/signin" className="text-gray-600  hover:text-blue-600">Login</NavLink></li> */}
            </ul>
        </div>
      </header>
  )
}
