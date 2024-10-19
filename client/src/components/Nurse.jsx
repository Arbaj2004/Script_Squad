import axios from 'axios';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FiMenu } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import uploadFile from '../helper/UploadFiles';

const NursePage = () => {
  const [alerts, setAlerts] = useState([
    { id: 1, patientName: 'John Doe', distance: '3 km', status: 'Pending', isServed: false },
    { id: 2, patientName: 'Jane Smith', distance: '2 km', status: 'Pending', isServed: false },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    gender: '',
    vehicle: '',
    location: { coordinates: [null, null] },
    shift: { startTime: '', endTime: '' },
    proofOfQualification: '',
    qualification: { degree: '', institution: '', yearOfPassing: '' },
  });

  const [activeAlertId, setActiveAlertId] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const nurseProfileCompleted = localStorage.getItem('nurseProfileCompleted');
    if (!nurseProfileCompleted) {
      setIsModalOpen(true);
    }

    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prevData) => ({
            ...prevData,
            location: { coordinates: [longitude, latitude] },
          }));
        },
        (error) => {
          toast.error("Unable to retrieve your location.");
          console.error("Geolocation error:", error);
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleAccept = (id) => {
    setAlerts(alerts.map(alert =>
      alert.id === id ? { ...alert, status: 'Accepted', isServed: true } : alert
    ));
    setActiveAlertId(id);
  };

  const handleReject = (id) => {
    setAlerts(alerts.map(alert =>
      alert.id === id ? { ...alert, status: 'Rejected', isServed: false } : alert
    ));
  };

  const handleServeComplete = () => {
    setAlerts(alerts.map(alert =>
      alert.id === activeAlertId ? { ...alert, status: 'Completed', isServed: false } : alert
    ));
    setActiveAlertId(null);
  };

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    const [key, subkey] = name.split('.');

    if (subkey) {
      setFormData((prevData) => ({
        ...prevData,
        [key]: { ...prevData[key], [subkey]: value },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files ? files[0].name : value,
      }));
    }
  };

  const handleUploadProfilePhoto = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    try {
      const uploadPhoto = await uploadFile(file);
      setFormData(prevData => ({
        ...prevData,
        proofOfQualification: uploadPhoto.secure_url,
      }));
    } catch (error) {
      toast.error("Failed to upload the file.");
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  const user = JSON.parse(localStorage.getItem('user'));
  const handleSubmit = async (e) => {
    e.preventDefault();
    const URL = `${process.env.REACT_APP_BACKEND_URL}/users/updateNurse/${user._id}`;
    try {
      const response = await axios.patch(URL, formData, { withCredentials: true });

      if (response.data.success) {
        localStorage.setItem('nurseProfileCompleted', 'true');
        setIsModalOpen(false);
        navigate('/');
      } else {
        toast.error("Profile update failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please check your input and try again.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen relative text-lg">
      <div className="absolute top-4 right-4">
        <button onClick={handleModalToggle} className="text-gray-700 hover:text-gray-900 p-0 transition-all duration-300">
          <FiMenu size={28} />
        </button>
      </div>

      <section className="container mx-auto px-6 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-blue-600 mb-8">Nurse Dashboard</h2>
          <p className="text-xl text-gray-600 mb-12">Monitor patient alerts and manage your emergency response efficiently.</p>
        </div>

        {/* Profile Modal */}
        {isModalOpen && (
          <div className="fixed overflow-y-auto inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-lg">
              <h3 className="text-2xl font-bold text-blue-600 mb-6">Nurse Profile</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-lg text-gray-700">Gender:</label>
                  <select
                    name="gender" 
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-3 text-lg rounded"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-lg text-gray-700">Vehicle:</label>
                  <select
                    name="vehicle"
                    value={formData.vehicle}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-3 text-lg rounded"
                  >
                    <option value="">Select Vehicle</option>
                    <option value="Car">Car</option>
                    <option value="Bike">Bike</option>
                    <option value="Cycle">Cycle</option>
                    <option value="On Foot">On Foot</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-lg text-gray-700">Shift Time:</label>
                  <div className='flex justify-between'>
                    <span>From</span>
                    <input
                      type="time"
                      name="shift.startTime"
                      onChange={handleInputChange}
                      className="w-2/4 border border-gray-300 p-3 mb-2 rounded"
                    />
                    <span>To</span>
                    <input
                      type="time"
                      name="shift.endTime"
                      onChange={handleInputChange}
                      className="w-2/4 border border-gray-300 p-3 mb-2 rounded"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-lg text-gray-700">Proof of Qualification (Upload):</label>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    name='proofOfQualification'
                    className={`bg-slate-100 px-2 py-1 focus:outline-primary rounded my-3`}
                    disabled={loading}
                    onChange={handleUploadProfilePhoto}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-lg text-gray-700">Qualification:</label>
                  <input
                    type="text"
                    name="qualification.degree"
                    placeholder="Degree"
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-3 mb-2 rounded"
                  />
                </div>

                <div className="flex justify-between items-center mt-6">
                  <button
                    type="button"
                    onClick={handleModalToggle}
                    className="w-1/2 mr-2 p-3 bg-gray-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 ml-2 p-3 bg-blue-600 text-white rounded-lg"
                  >
                    {loading ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        <section id="alerts" className="bg-white shadow-lg rounded-3xl p-8 mb-20 max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-blue-600 mb-6">Emergency Alerts</h3>
          <p className="text-gray-600 mb-8 text-lg">Please respond to the current emergency alerts as per the situation.</p>

          <div>
            {alerts.map(alert => (
              <div 
                key={alert.id} 
                className="mb-8 p-8 bg-gray-100 rounded-xl shadow-lg flex flex-col justify-between items-start h-64 w-96 mx-auto"
              >
                <div>
                  <h4 className="text-2xl font-semibold text-gray-800">Patient: {alert.patientName}</h4>
                  <p className="text-gray-600 text-lg">Distance: {alert.distance}</p>
                  <p className={`font-bold text-xl ${alert.status === 'Accepted' ? 'text-green-600' : alert.status === 'Rejected' ? 'text-red-600' : alert.status === 'Completed' ? 'text-blue-600' : 'text-yellow-600'}`}>
                    Status: {alert.status}
                  </p>
                </div>
                <div className="flex space-x-4 mt-4">
                  {alert.status === 'Pending' && activeAlertId === null && (
                    <>
                      <button
                        onClick={() => handleAccept(alert.id)}
                        className="bg-green-600 text-white py-3 px-6 rounded-full text-lg hover:bg-green-700"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(alert.id)}
                        className="bg-red-600 text-white py-3 px-6 rounded-full text-lg hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {activeAlertId && (
            <div className="mt-8 text-center">
              <button
                onClick={handleServeComplete}
                className="bg-blue-600 text-white py-3 px-8 rounded-full text-xl hover:bg-blue-700"
              >
                Mark as Served
              </button>
            </div>
          )}
        </section>
      </section>
    </div>
  );
};

const AlertCard = ({ alert, onAccept, onReject, onComplete }) => {
  return (
    <div className={`border p-4 rounded-lg mb-4 ${alert.isServed ? 'bg-green-200' : 'bg-yellow-200'}`}>
      <h4 className="font-semibold text-lg">{alert.patientName}</h4>
      <p className="text-gray-700">Distance: {alert.distance}</p>
      <p className="text-gray-700">Status: {alert.status}</p>
      {!alert.isServed && (
        <div className="mt-4 flex space-x-2">
          <button onClick={() => onAccept(alert.id)} className="bg-blue-500 text-white px-3 py-1 rounded">Accept</button>
          <button onClick={() => onReject(alert.id)} className="bg-red-500 text-white px-3 py-1 rounded">Reject</button>
        </div>
      )}
      {alert.isServed && (
        <button onClick={onComplete} className="bg-green-500 text-white px-3 py-1 rounded mt-2">Mark as Completed</button>
      )}
    </div>
  );
};

export default NursePage;
