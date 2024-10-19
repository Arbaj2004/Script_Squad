
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
// import Loading from '../components/Loading';

const formatDate = (dateString) => {
    const date = new Date(dateString);
  
    const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const optionsTime = { hour: '2-digit', minute: '2-digit' };
  
    const formattedDate = date.toLocaleDateString('en-GB', optionsDate); // 'dd/mm/yyyy'
    const formattedTime = date.toLocaleTimeString('en-GB', optionsTime); // 'hh:mm'
  
    return `${formattedDate} ${formattedTime}`;
};

const TicketPage = () => {
    const token=localStorage.getItem('token')
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [allTickets, setAllTickets] = useState([]);
    const fetchAllTickets = async () => {
        const URL = `${process.env.REACT_APP_BACKEND_URL}/admin/getAllUnverfiedNurses`;
        try {
          setLoading(true)
        const response = await axios.get(URL, { headers: { 'authorization': `Bearer ${token}` } },{
          withCredentials: true
      })
        setAllTickets(response.data.data.rows);
        setLoading(false)
        // console.log("Tickets fetched successfully>>>>", response.data.data);
        } catch (error) {
        console.error("Error fetching Tickets:", error);
        }
    };

    useEffect(() => {
        fetchAllTickets();
      }, []);

      const handleClick = (ticketId) => {
        navigate(`/admin/ticket/${ticketId}`);
      };

return (
    <div>
        <div>
        <h2 className="text-3xl font-bold text-center my-8">All Tickets</h2>
        {
          loading && (
            // <Loading/>
            <p>

                loading....
            </p>
          )
        }
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {allTickets.map((ticket) => (
            <div
              className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden"
              key={ticket.id}
            >
                {
                    ticket.Answer  && (
                    <div className="p-4 flex flex-col justify-between h-full dark:bg-green-900 bg-green-400">
              <h4 className="text-lg font-semibold mb-2  "  key={ticket.id} >{ticket.Question}</h4>
              <p className="text-black-500 text-sm font-bold">{ticket.Answer} &bull; </p>
              <p className="text-black-500 text-sm">{formatDate(ticket.createdAt)} &bull;{ticket.EmailID} </p>
            </div>)
            }{
                (ticket.Answer==null || !ticket.Answer) && (
                <div className="p-4 flex flex-col justify-between h-full dark:bg-red-900 bg-red-400">
              <h4 className="text-lg font-semibold mb-2 hover:text-blue-600 cursor-pointer"  key={ticket.id} onClick={() => handleClick(ticket.id)}>{ticket.Question}</h4>
              <p className="text-black-500 text-sm">{formatDate(ticket.createdAt)} &bull; {ticket.EmailID}</p>
            </div>)
            }
          </div>
        ))}
      </div>
    </div>
    </div>
  )
}

export default TicketPage