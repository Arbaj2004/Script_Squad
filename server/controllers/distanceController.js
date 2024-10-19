// controllers/nurseController.js
const math = require('mathjs'); // or use native Math if preferred
const Patient = require('../models/patientSchema');
const Nurse = require('../models/nurseSchema');
const Message = require('../models/messageSchema');

// Haversine formula for calculating distance
const haversine = (coord1, coord2) => {
    const R = 6371; // Radius of Earth in km
    const [lat1, lon1] = coord1;
    const [lat2, lon2] = coord2;

    // Convert degrees to radians
    const dlat = (lat2 - lat1) * Math.PI / 180;
    const dlon = (lon2 - lon1) * Math.PI / 180;

    // Haversine formula
    const a = Math.sin(dlat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dlon / 2) ** 2;

    const c = 2 * Math.asin(Math.sqrt(a));

    // console.log(coord1, coord2, R * c);
    return R * c; // Distance in km
};


exports.findNearestNurses = async (req, res) => {
    try {
        const patientId = req.params.id;


        const patient = await Patient.findOne({ user: patientId })

        // Find the patient
        // console.log(patient);
        // const patient = await Patient.findById(patient1._id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        // console.log(patient);

        const patientCoordinates = [patient.location.coordinates[1], patient.location.coordinates[0]];
        // console.log(patientCoordinates);

        // Find all nurses
        const nurses = await Nurse.find();

        // Calculate distances and sort
        // console.log(nurses[0].location.coordinates);
        const distances = nurses.map(nurse => ({
            nurse,
            distance: haversine(patientCoordinates, [nurse.location.coordinates[1], nurse.location.coordinates[0]]),
        }));
        // console.log(distances);

        // Sort by distance
        distances.sort((a, b) => a.distance - b.distance);

        // Get the top 3 nearest nurses
        const nearestNurses = distances.slice(0, 3).map(item => item.nurse);

        // Prepare and send messages
        const cordinates = nearestNurses.map(nurse => {
            // Assuming nurse.coordinates is an object with lat and lng properties
            return {
                coordinates: nurse.location,
            };
        });
        const messages = nearestNurses.map(nurse => {
            return {
                sender: patientId, // The patient sending the message
                recipient: nurse._id, // The nurse receiving the message
                content: `Hello ${nurse.name}, you are one of the nearest nurses to me. Please assist me as needed.`, // Custom message content
            };
        });





        //sms to familyno
        //sms to nurse







        // Save all messages to the database
        await Message.insertMany(messages);

        // Respond with the nearest nurses
        res.status(200).json(cordinates);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
