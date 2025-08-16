
import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Link, Navigate } from 'react-router-dom';
import DoctorCalendar from '../components/DoctorCalendar';

const DoctorDashboardPage: React.FC = () => {
    const { state } = useAppContext();
    const { currentUser, doctors, appointments } = state;

    if (currentUser.role !== 'doctor') {
        return <Navigate to="/discover" replace />;
    }
    
    const doctor = doctors.find(d => d.id === currentUser.id);

    if (!doctor) {
         return (
            <div className="text-center p-10 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-red-600">Error</h2>
                <p className="text-gray-600 mt-2">Could not find doctor data. Please try switching views again.</p>
                <Link to="/" className="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-lg">Go to Homepage</Link>
            </div>
        );
    }

    const upcomingAppointments = appointments
        .filter(appt => appt.doctorId === doctor.id && appt.status === 'Booked' && new Date(appt.startTime) >= new Date())
        .sort((a,b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());


    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-4xl font-bold text-primary">Welcome, {doctor.name}</h1>
                <p className="mt-2 text-lg text-gray-600">Here's your schedule and availability manager.</p>
            </div>

            <div>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Calendar</h2>
                <DoctorCalendar doctorId={doctor.id} />
            </div>

            <div>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Upcoming Appointments</h2>
                {upcomingAppointments.length > 0 ? (
                    <div className="bg-white rounded-lg shadow-md">
                        <ul className="divide-y divide-gray-200">
                           {upcomingAppointments.map(appt => (
                                <li key={appt.id} className="p-4 flex justify-between items-center flex-wrap">
                                    <div>
                                        <p className="font-semibold text-primary">{appt.userName}</p>
                                        <p className="text-sm text-gray-600">
                                            {new Date(appt.startTime).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                                        </p>
                                    </div>
                                    <span className="text-sm font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full mt-2 sm:mt-0">Booked</span>
                                </li>
                           ))}
                        </ul>
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <p className="text-gray-500">You have no upcoming appointments.</p>
                    </div>
                )}
            </div>
        </div>
    )
};

export default DoctorDashboardPage;
