import { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const AdminDashboard = () => {
  // Hardcoded data
  const data = {
    requestsToday: 120,
    patientsServed: 90,
    activeNurses: 15,
    feedback: [
      {
        id: 1,
        patientName: "John Doe",
        comment: "Great service!",
        date: "2024-10-15",
      },
      {
        id: 2,
        patientName: "Jane Smith",
        comment: "Very helpful staff.",
        date: "2024-10-14",
      },
      {
        id: 3,
        patientName: "Alice Johnson",
        comment: "Quick response time.",
        date: "2024-10-13",
      },
    ],
    activityLogs: [
      {
        id: 1,
        action: "Nurse assigned to John Doe",
        date: "2024-10-15 10:00 AM",
      },
      {
        id: 2,
        action: "Patient feedback received from Jane Smith",
        date: "2024-10-14 03:00 PM",
      },
      {
        id: 3,
        action: "Emergency alert sent for Alice Johnson",
        date: "2024-10-14 02:00 PM",
      },
    ],
    nursesToVerify: [
      { id: 1, name: "Nurse A" },
      { id: 2, name: "Nurse B" },
      { id: 3, name: "Nurse C" },
    ],
  };

  // State for circular progress
  const [requestProgress, setRequestProgress] = useState(0);
  const [patientsProgress, setPatientsProgress] = useState(0);
  const [nursesProgress, setNursesProgress] = useState(0);

  useEffect(() => {
    const duration = 2500; // Duration for the CountUp in milliseconds
    const incrementRequest = data.requestsToday / (duration / 100); // Increment for requests
    const incrementPatients = data.patientsServed / (duration / 100); // Increment for patients
    const incrementNurses = data.activeNurses / (duration / 100); // Increment for nurses

    // Requests Today Progress Interval
    const requestsInterval = setInterval(() => {
      setRequestProgress((prev) => {
        if (prev >= data.requestsToday) {
          clearInterval(requestsInterval);
          return prev; // Stop when the target is reached
        }
        return Math.min(prev + incrementRequest, data.requestsToday);
      });
    }, 100);

    // Patients Served Progress Interval
    const patientsInterval = setInterval(() => {
      setPatientsProgress((prev) => {
        if (prev >= data.patientsServed) {
          clearInterval(patientsInterval);
          return prev; // Stop when the target is reached
        }
        return Math.min(prev + incrementPatients, data.patientsServed);
      });
    }, 100);

    // Active Nurses Progress Interval
    const nursesInterval = setInterval(() => {
      setNursesProgress((prev) => {
        if (prev >= data.activeNurses) {
          clearInterval(nursesInterval);
          return prev; // Stop when the target is reached
        }
        return Math.min(prev + incrementNurses, data.activeNurses);
      });
    }, 100);

    return () => {
      clearInterval(requestsInterval);
      clearInterval(patientsInterval);
      clearInterval(nursesInterval);
    };
  }, [data]);

  // Set max values for partial completion
  const maxRequestValue = data.requestsToday * 0.8; // 80% of total requests
  const maxPatientsValue = data.patientsServed * 0.7; // 70% of total patients
  const maxNursesValue = data.activeNurses * 0.9; // 90% of total nurses

  const handleVerify = (id) => {
    // Logic for verifying the nurse
    console.log(`Verified nurse with ID: ${id}`);
  };

  const handleReject = (id) => {
    // Logic for rejecting the nurse
    console.log(`Rejected nurse with ID: ${id}`);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between gap-8">
        {/* Circular Progress Indicators */}
        <h1 className="flex items-center justify-center text-3xl font-bold text-center text-blue-600 mb-6 ">STATS :</h1>
        <div className="flex flex-col items-center justify-center space-y-8 md:flex-row md:space-y-0 md:space-x-8">
          {/* Requests Today Circular Progress */}
          <div className="flex flex-col items-center">
            <div className="relative" style={{ width: "200px", height: "200px" }}>
              <CircularProgressbar
                value={(requestProgress / maxRequestValue) * 100} // Limit progress to max value
                maxValue={100} // Set maximum to 100 for percentage
                styles={{
                  path: { stroke: `#4A90E2`, strokeWidth: 10 },
                  trail: { stroke: "#d6d6d6" },
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl font-bold text-blue-600">
                  {Math.floor(requestProgress)}
                </span>
              </div>
            </div>
            <h2 className="text-lg font-semibold mt-2">Requests Today</h2>
          </div>

          {/* Patients Served Circular Progress */}
          <div className="flex flex-col items-center">
            <div className="relative" style={{ width: "200px", height: "200px" }}>
              <CircularProgressbar
                value={(patientsProgress / maxPatientsValue) * 100} // Limit progress to max value
                maxValue={100} // Set maximum to 100 for percentage
                styles={{
                  path: { stroke: `#50E3C2`, strokeWidth: 10 },
                  trail: { stroke: "#d6d6d6" },
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl font-bold text-blue-600">
                  {Math.floor(patientsProgress)}
                </span>
              </div>
            </div>
            <h2 className="text-lg font-semibold mt-2">Patients Served</h2>
          </div>

          {/* Active Nurses Circular Progress */}
          <div className="flex flex-col items-center">
            <div className="relative" style={{ width: "200px", height: "200px" }}>
              <CircularProgressbar
                value={(nursesProgress / maxNursesValue) * 100} // Limit progress to max value
                maxValue={100} // Set maximum to 100 for percentage
                styles={{
                  path: { stroke: `#F5A623`, strokeWidth: 10 },
                  trail: { stroke: "#d6d6d6" },
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl font-bold text-blue-600">
                  {Math.floor(nursesProgress)}
                </span>
              </div>
            </div>
            <h2 className="text-lg font-semibold mt-2">Active Nurses</h2>
          </div>
        </div>

        {/* Verification Cards Section */}
        <div className="w-full md:w-1/3">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">Verify Nurses</h2>
          {data.nursesToVerify.map((nurse) => (
            <div key={nurse.id} className="bg-white p-4 rounded-lg shadow-md mb-4 w-3/4">
              <h3 className="font-bold">{nurse.name}</h3>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleVerify(nurse.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Verify
                </button>
                <button
                  onClick={() => handleReject(nurse.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feedback Section */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-semibold text-blue-600 mb-4">
          Patient Feedback
        </h2>
        <div className="bg-white rounded-lg p-6 shadow-lg">
          {data.feedback.map((item) => (
            <div key={item.id} className="border-b last:border-b-0 py-4">
              <p className="font-bold text-xl">{item.patientName}</p>
              <p className="text-gray-700">{item.comment}</p>
              <p className="text-xs text-gray-400">{item.date}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Activity Log Section */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-semibold text-blue-600 mb-4">
          Activity Logs
        </h2>
        <div className="bg-white rounded-lg p-6 shadow-lg">
          {data.activityLogs.map((log) => (
            <div key={log.id} className="border-b last:border-b-0 py-4">
              <p className="font-bold text-xl">{log.action}</p>
              <p className="text-xs text-gray-400">{log.date}</p>
            </div>
          ))}
        </div>
      </section>
      <div>
        get all nurse
        
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-4 mt-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 SeniorCare Admin Panel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;
