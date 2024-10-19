import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <h5 className="text-lg font-semibold mb-4">Stay Connected</h5>
        <p>&copy; 2024 SeniorCare. All rights reserved.</p>
        <ul className="flex justify-center space-x-6 mt-4">
          <li>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-blue-400">
              <FontAwesomeIcon icon={faFacebook} className="h-5 w-5 mr-2" />
              Facebook
            </a>
          </li>
          <li>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-blue-400">
              <FontAwesomeIcon icon={faTwitter} className="h-5 w-5 mr-2" />
              Twitter
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-blue-400">
              <FontAwesomeIcon icon={faInstagram} className="h-5 w-5 mr-2" />
              Instagram
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
