# Patient Dashboard

## Overview
The **Patient Dashboard** is a web-based application designed to assist patients in managing their medical needs by providing real-time access to nearby nurses. The application allows patients to send emergency alerts, view nurse availability, and manage their medical profiles, ensuring timely assistance and enhanced healthcare experiences.

## Features
- **User Authentication**: Secure login and registration for patients.
- **Emergency Alerts**: Send notifications to the nearest nurses for immediate assistance.
- **Nurse Availability Indicator**: Display the status of each nurse (available, busy, on leave) and suggest the best available nurse based on proximity.
- **Proximity-Based Nurse Notification**: Automatically notify the three nearest nurses when a patient requests help, minimizing response time.
- **Multi-Language Support**: Support for multiple languages, making the app accessible to patients who may not be fluent in the default language.
- **Patient Profile Management**: Patients can manage their personal and medical information, including age, address, family contact number, and medical history.
- **Admin Dashboard**: 
  - View the total number of nurses and patients registered in the system.
  - Verify nurses by storing their medical certificates in Cloudinary, ensuring all credentials are validated and accessible.
  - Manage nurse and patient information effectively.

## Technologies Used
- **Frontend**: 
  - React.js
  - React Router
  - Tailwind CSS for styling
  - React Icons for icons
- **Backend**: 
  - Node.js
  - Express.js
  - MongoDB for database management
  - Axios for API calls
  - Cloudinary for storing medical certificates
<div>
<img src="https://nodejs.org/static/images/logo.svg" alt="Node.js Logo" width="50" height="50" /> 
<img src="https://devlevate.com/wp-content/uploads/2022/06/express-logo.png" alt="Express Logo" width="50" height="50" /> 
<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNhoXisDruJMDAq3Ltd-wuaMW2lGxck9wAKw&s" width="50" height="50" /> 
<img src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png" alt="JavaScript Logo" width="50" height="50" /> 
<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMj2GFYbSnPo9nTCLe3MQ_wtTQvUhsSnB1IA&s" alt="Cloudinary Logo" width="50" height="50" /> 
<img src="https://www.vectorlogo.zone/logos/mongodb/mongodb-icon.svg" alt="MongoDB Logo" width="50" height="50" />
</div>

## Getting Started
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/patient-dashboard.git
   cd patient-dashboard
