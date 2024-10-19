import healthcareImage from "../assets/healthcare.jpg"; // Adjust the path as necessary
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(loggedInStatus === "true");
  }, []);

  const handleButtonClick = () => {
    if (isLoggedIn) {
      navigate("/patient");
    } else {
      navigate("/signin");
    }
  };

  return (
    <div className="bg-gray-50 min-h-[50vh] flex flex-col justify-between">
      {/* Hero Section */}
      <section
        id="home"
        className="relative flex flex-col items-center justify-center py-24 bg-cover bg-center text-white min-h-screen"
        style={{ backgroundImage: `url(${healthcareImage})` }}
      >
        {/* Overlay for opacity */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        {/* Content */}
        <div className="relative z-10 text-center animate-fade-in-up max-w-4xl mx-auto">
          <h2 className="text-5xl lg:text-6xl font-extrabold mb-8 tracking-wide animate-pulse">
            Help is Just a Click Away
          </h2>
          <p className="text-xl lg:text-2xl mb-10 max-w-2xl mx-auto leading-relaxed">
            We connect senior citizens with the nearest nurses for emergency
            assistance.
          </p>

          {/* Call to Action Button */}
          <button
            onClick={handleButtonClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 px-12 rounded-full shadow-lg transition-transform duration-300 transform hover:scale-105 focus:outline-none animate-bounce text-2xl"
          >
            Get Help Now
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section
  id="services"
  className="container mx-auto px-4 py-20 text-center bg-indigo-100"
>
  <h3 className="text-6xl font-bold mb-10 text-gray-700">Our Services</h3>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
    <div className="bg-white shadow-md rounded-lg p-10 mx-4 hover:shadow-xl transition"> {/* Added mx-4 for left and right margins */}
      <h4 className="text-4xl font-semibold text-blue-600 mb-6">
        Emergency Alerts
      </h4>
      <p className="text-xl text-gray-600">
        Quickly connect with the nearest nurse for emergencies, ensuring fast response times.
      </p>
    </div>
    <div className="bg-white shadow-md rounded-lg p-10 mx-4 hover:shadow-xl transition"> {/* Added mx-4 for left and right margins */}
      <h4 className="text-4xl font-semibold text-blue-600 mb-6">
        Live Tracking
      </h4>
      <p className="text-xl text-gray-600">
        Track the live location of the nurse and get real-time updates until they arrive.
      </p>
    </div>
    <div className="bg-white shadow-md rounded-lg p-10 mx-4 hover:shadow-xl transition"> {/* Added mx-4 for left and right margins */}
      <h4 className="text-4xl font-semibold text-blue-600 mb-6">
        24/7 Availability
      </h4>
      <p className="text-xl text-gray-600">
        Our network of nurses ensures you are covered round the clock, 7 days a week.
      </p>
    </div>
  </div>
</section>

    </div>
  );
};

export default LandingPage;
