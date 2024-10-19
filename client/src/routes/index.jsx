import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import LandingPage from '../components/Landing';
import SignUpPage from '../components/Signup';
import SignInPage from '../components/Signin';
import VerifyOtpPage from '../components/Verify';
import ContactPage from '../components/Contact';
import PatientsPage from '../components/Patient';
import NursePage from '../components/Nurse';
import AdminDashboard from '../components/Admin';
import TicketPage from '../components/TicketPage';
import NurseDashboard from '../components/NurseAlert';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/',
                element: <LandingPage/>
            },
            {
                path: '/signin',
                element: <SignInPage />
            },
            {
                path: '/signup',
                element: <SignUpPage />
            },
            {
                path: '/verify',
                element: <VerifyOtpPage />
            },
            {
                path: '/contact',
                element: <ContactPage />
            },
            {
                path: '/patient',
                element: <PatientsPage />
            },
            {
                path: '/nurse',
                element: <NursePage />
            },
            // {
            //     path: '/nurseAlert',
            //     element: <NurseDashboard />
            // },
            {
                path: '/ticket',
                element: <TicketPage />
            },
            {
                path: '/admin',
                element: <AdminDashboard />
            }
        ]
    }
])

export default router