import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NurseDashboard = () => {
    const [messages, setMessages] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/getMessages/${user._id}`);
            setMessages(response.data || []); // Ensure to set to an empty array if no data
            console.log(response.data.messages);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        fetchMessages();

        const interval = setInterval(() => {
            fetchMessages();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const handleClick = async (senderId) => {
        const URL = `${process.env.REACT_APP_BACKEND_URL}/users/createCommunication`;
        try {
            const response = await axios.post(URL, { patient: senderId, nurse: user._id }, { withCredentials: true });
            console.log('Communication request sent:', response.data); // Handle success response
        } catch (error) {
            console.error('Error sending communication request:', error); // Handle error response
        }
    };

    return (
        <div>
            <h1>Nurse Dashboard</h1>
            <h2>Messages:</h2>
            <ul>
                {messages.length > 0 ? (
                    messages.map((msg) => (
                        <div key={msg._id}> {/* Ensure a unique key for the parent div */}
                            <li>
                                <strong>From:</strong> {msg.sender._id} Access sender ID or another property as needed
                                <strong>Address:</strong> {msg.sender.address} {/* Access sender ID or another property as needed */}
                                <strong>Age:</strong> {msg.sender.age} {/* Access sender ID or another property as needed */}
                                <br />
                                <strong>Content:</strong> {msg.content}
                                <br />
                                <strong>Timestamp:</strong> {new Date(msg.timestamp).toLocaleString()} {/* Format the timestamp */}
                            </li>
                            <button onClick={() => handleClick(msg.sender._id)} className='bg-black text-white'>
                                Communicate
                            </button>
                        </div>
                    ))
                ) : (
                    <li>No messages found.</li>
                )}
            </ul>
        </div>
    );
};

export default NurseDashboard;
