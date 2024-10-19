import { useState, useEffect } from 'react';
import { FiMenu } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import uploadFile from '../helper/UploadFiles';
import axios from 'axios';

const PatientsPage = () => {
  const [alertSent, setAlertSent] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const [formData, setFormData] = useState({
    age: '',
    address: '',
    language: '',
    familyNo: '',
    location: { coordinates: [null, null] },
    profilePic: '',
    medical_history: {
      allergies: '',
      conditions: '',
      current_medications: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const [uploadPhoto, setUploadPhoto] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const isFirstVisit = localStorage.getItem('modalShown');
    if (!isFirstVisit) {
      setIsModalOpen(true);
      localStorage.setItem('modalShown', 'true');
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
          toast.error('Unable to retrieve your location.');
          console.error('Geolocation error:', error);
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser.');
    }
  }, []);

  const handleEmergencyAlert =async () => {
    const URL = `${process.env.REACT_APP_BACKEND_URL}/users/patients/${user._id}/nearest-nurses`;
    try {
      const response = await axios.get(URL, { withCredentials: true });
      console.log(response)
      setAlertSent(true);
  
      toast.success('Emergency alert sent!');
    } catch (error) {
      
    }
  };

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const [key, subkey] = name.split('.'); // For nested fields
    if (subkey) {
      setFormData((prevData) => ({
        ...prevData,
        [key]: { ...prevData[key], [subkey]: value },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleUploadProfilePhoto = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    try {
      const uploadedPhoto = await uploadFile(file);
      setFormData((prevData) => ({
        ...prevData,
        profilePic: uploadedPhoto.secure_url,
      }));
      setUploadPhoto(file.name);
    } catch (error) {
      toast.error('Failed to upload the file.');
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Assuming backend API endpoint and user logic
      const response = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/users/updatePatient/${user._id}`,
        formData,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success('Profile submitted successfully!');
        setIsModalOpen(false);
        navigate('/');
      } else {
        toast.error('Failed to submit profile.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error('Submit error:', error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen relative text-lg">
      <div className="absolute top-4 right-4">
        <button onClick={handleModalToggle} className="text-gray-700 hover:text-gray-900 p-0">
          <FiMenu size={28} />
        </button>
      </div>

      <section className="container mx-auto px-6 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-blue-600 mb-8">Patient Dashboard</h2>
          <button onClick={handleEmergencyAlert} className="bg-red-500 text-white px-4 py-2 rounded">
            Send Emergency Alert
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-lg">
              <h3 className="text-2xl font-bold text-blue-600 mb-6">Patient Profile</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-lg">Age:</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-3 rounded"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-lg">Address:</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-3 rounded"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-lg">Family Contact No:</label>
                  <input
                    type="text"
                    name="familyNo"
                    value={formData.familyNo}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-3 rounded"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-lg">Language:</label>
                  <input
                    type="text"
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-3 rounded"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-lg">Medical History:</label>
                  <input
                    type="text"
                    name="medical_history.allergies"
                    placeholder="Allergies"
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-3 mb-2 rounded"
                  />
                  <input
                    type="text"
                    name="medical_history.conditions"
                    placeholder="Conditions"
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-3 mb-2 rounded"
                  />
                  <input
                    type="text"
                    name="medical_history.current_medications"
                    placeholder="Current Medications"
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-3 mb-2 rounded"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-lg">Profile Picture:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadProfilePhoto}
                    className="w-full p-3 rounded border"
                    disabled={loading}
                  />
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={handleModalToggle}
                    className="w-1/2 mr-2 p-3 bg-gray-300 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 ml-2 p-3 bg-blue-600 text-white rounded"
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default PatientsPage;
