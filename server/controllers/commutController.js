const Communication = require("../models/communicationSchema");
const Nurse = require("../models/nurseSchema");
const Patient = require("../models/patientSchema");

exports.createCommunication = async (req, res) => {
    const patient = req.body.patient;
    const nurse = req.body.nurse;
    const tempCom = await Communication.findOne({ nurse })
    const tempCom1 = await Communication.findOne({ patient })
    if (tempCom || tempCom1) {
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
        });
    } else {
        const comm = await Communication.create({ patient, nurse })
        res.status(200).json(comm);
    }
}


exports.getCommunicationNurse = async (req, res) => {
    const { id } = req.params;

    try {
        // Step 1: Find one communication for the nurse
        const communication = await Communication.findOne({ nurse: id });

        // Step 2: Check if communication exists
        if (!communication) {
            return res.status(404).json({ message: 'No communication found for this nurse.' });
        }

        // Step 3: Fetch patient details including coordinates using the patient ID from the communication
        const patient = await Patient.findById(communication.patient);

        // Step 4: Construct the response
        const response = {
            patientCoordinates: patient ? patient.location.coordinates : null, // Assuming location is a GeoJSON Point
            // Add other patient details if needed
        };

        // Step 5: Send the response back to the client
        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching communication data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getCommunicationPatient = async (req, res) => {
    const { id } = req.params;

    try {
        // Step 1: Find one communication for the patient
        const communication = await Communication.findOne({ patient: id });

        // Step 2: Check if communication exists
        if (!communication) {
            return res.status(404).json({ message: 'No communication found for this patient.' });
        }

        // Step 3: Fetch nurse details including coordinates using the nurse ID from the communication
        const nurse = await Nurse.findOne({ user: communication.nurse }); // Assuming nurse ID is stored in the communication
        console.log(nurse);
        // Step 4: Construct the response
        const response = {
            nurseCoordinates: nurse ? nurse.location.coordinates : null, // Assuming location is a GeoJSON Point
            // Add other nurse details if needed
        };

        // Step 5: Send the response back to the client
        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching communication data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};



exports.getCommunication = async (req, res) => {
    const { id } = req.params;

    try {
        // Step 1: Find one communication for the patient
        const communication = await Communication.findOne({ patient: id });

        // Step 2: Check if communication exists
        if (!communication) {
            return res.status(404).json({ message: 'No communication found for this patient.' });
        }

        // Step 3: Fetch nurse details including coordinates using the nurse ID from the communication
        const nurse = await Nurse.findOne({ user: communication.nurse }); // Assuming nurse ID is stored in the communication
        console.log(nurse);
        // Step 4: Construct the response
        const response = {
            nurseCoordinates: nurse ? nurse.location.coordinates : null, // Assuming location is a GeoJSON Point
            // Add other nurse details if needed
        };

        // Step 5: Send the response back to the client
        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching communication data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


