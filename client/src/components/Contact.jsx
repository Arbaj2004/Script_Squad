import { useState } from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact Form Data:', formData);
    alert('Message sent successfully!');
    setFormData({ name: '', email: '', message: '' }); // Clear form
  };

  return (
    <div className="bg-gradient-to-r from-blue-200 to-purple-300 min-h-screen flex items-center justify-center">
      <div className="flex bg-white bg-opacity-80 shadow-lg rounded-lg w-full max-w-xl"> {/* Increased max-width */}
        {/* Social Media Icons Section */}
        <div className="flex flex-col items-center gap-5 justify-center p-8 bg-blue-100 rounded-l-lg"> {/* Increased padding */}
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="mb-3">
            <FaFacebookF size={40} className="text-blue-600 hover:text-blue-700" /> {/* Increased icon size */}
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="mb-3">
            <FaTwitter size={40} className="text-blue-400 hover:text-blue-500" /> {/* Increased icon size */}
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="mb-3">
            <FaInstagram size={40} className="text-pink-500 hover:text-pink-600" /> {/* Increased icon size */}
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <FaLinkedinIn size={40} className="text-blue-700 hover:text-blue-800" /> {/* Increased icon size */}
          </a>
        </div>

        {/* Contact Form Section */}
        <div className="p-8 w-full max-w-md"> {/* Adjusted padding */}
          <h2 className="text-4xl font-bold text-blue-600 mb-6">Contact Us</h2> {/* Increased font size */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-lg text-gray-700">Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg" 
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg text-gray-700">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg" 
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg text-gray-700">Message:</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg" 
                rows="4" 
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-all duration-300 text-lg"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
