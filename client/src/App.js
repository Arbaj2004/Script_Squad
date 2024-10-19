// src/App.js
import { Outlet } from 'react-router-dom';
import './App.css';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header'
import Footer from './components/Footer'
import axios from 'axios';

export default function App() {
  const darkMode = useSelector((state) => state.darkMode.darkMode);

  // Add or remove the dark class on the root element based on Redux state
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const [count, setCount] = useState(0);
  // useEffect(() => {
  //   const fetchVisitorCount = async (URL) => {
  //     try {
  //       const response = await axios.get(URL, {
  //         withCredentials: true
  //       });
  //       console.log(response);
  //       localStorage.setItem('visitor', '0'); // You might want to change this logic based on your requirements
  //       setCount(response.data.data.count); // Ensure you access the correct path
  //     } catch (error) {
  //       console.error("Error fetching visitor count:", error);
  //       setCount(0);
  //     }
  //   }
  //   const cnt = localStorage.getItem('visitor')
  //   if (!cnt) {
  //     const URL = `${process.env.REACT_APP_BACKEND_URL}/users/visitorCntinc`;
  //     fetchVisitorCount(URL);
  //   } else {
  //     const URL = `${process.env.REACT_APP_BACKEND_URL}/users/getvisitorCnt`;
  //     fetchVisitorCount(URL);
  //   }
  // }, []);  

  return (
    <>
      <main className="min-h-screen bg-blue-200 ">
        {/* This renders your nested routes */}
        <Toaster position="top-right" reverseOrder={false} />
        <Header />
        <Outlet />
        <Footer />
      </main>
    </>
  );
}
