
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import AppointmentCard from '../components/AppointmentCard';
import { Appointment, AppointmentStatus } from '../types';

const DashboardPage: React.FC = () => {
  const { state } = useAppContext();
  const [filter, setFilter] = useState<AppointmentStatus | 'All'>('All');

  const sortedAppointments = useMemo(() => {
    return [...state.appointments].sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  }, [state.appointments]);

  const filteredAppointments = useMemo(() => {
    if (filter === 'All') return sortedAppointments;
    return sortedAppointments.filter(appt => appt.status === filter);
  }, [sortedAppointments, filter]);

  const upcomingAppointments = filteredAppointments.filter(appt => new Date(appt.startTime) >= new Date() && appt.status === 'Booked');
  const pastAppointments = filteredAppointments.filter(appt => new Date(appt.startTime) < new Date() || appt.status !== 'Booked');

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary">My Appointments</h1>
        <p className="mt-2 text-lg text-gray-600">View and manage your consultation schedule.</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md flex justify-center space-x-2">
        {(['All', 'Booked', 'Completed', 'Cancelled'] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              filter === status ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {state.appointments.length === 0 ? (
        <div className="text-center py-16">
            <h3 className="text-2xl font-semibold text-gray-700">No Appointments Yet</h3>
            <p className="text-gray-500 mt-2">Find a doctor and book your first consultation.</p>
        </div>
      ) : (
        <>
          {upcomingAppointments.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Upcoming</h2>
              <div className="space-y-4">
                {upcomingAppointments.map(appt => <AppointmentCard key={appt.id} appointment={appt} />)}
              </div>
            </div>
          )}
          {pastAppointments.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Past & Cancelled</h2>
              <div className="space-y-4">
                {pastAppointments.map(appt => <AppointmentCard key={appt.id} appointment={appt} />)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardPage;
