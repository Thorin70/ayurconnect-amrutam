
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Appointment, Doctor } from '../types';
import { useAppContext } from '../hooks/useAppContext';
import { CalendarIcon } from './icons/CalendarIcon';
import { ClockIcon } from './icons/ClockIcon';

interface AppointmentCardProps {
  appointment: Appointment;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
  const { state: { doctors }, dispatch } = useAppContext();
  const navigate = useNavigate();
  const doctor = doctors.find(d => d.id === appointment.doctorId);

  if (!doctor) return null;

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      dispatch({ type: 'CANCEL_APPOINTMENT', payload: { appointmentId: appointment.id, slotId: appointment.slotId } });
    }
  };
  
  const handleReschedule = () => {
    navigate(`/reschedule/${appointment.id}`);
  };

  const isCancellable = new Date(appointment.startTime).getTime() > new Date().getTime() + 24 * 60 * 60 * 1000;
  
  const statusColors = {
    Booked: 'bg-blue-100 text-blue-800',
    Completed: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-5">
      <img src={doctor.imageUrl} alt={doctor.name} className="w-20 h-20 rounded-full object-cover" />
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-lg font-bold text-primary">{doctor.name}</h4>
            <p className="text-gray-600">{doctor.specialization}</p>
          </div>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[appointment.status]}`}>
            {appointment.status}
          </span>
        </div>
        <div className="mt-3 pt-3 border-t flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-gray-700">
          <div className="flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2 text-primary" />
            <span>{new Date(appointment.startTime).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center">
            <ClockIcon className="w-5 h-5 mr-2 text-primary" />
            <span>{new Date(appointment.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(appointment.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>
      {appointment.status === 'Booked' && isCancellable && (
        <div className="flex flex-col space-y-2 w-full md:w-auto md:ml-auto">
          <button 
            onClick={handleReschedule}
            className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-opacity-90 transition-colors w-full"
          >
            Reschedule
          </button>
          <button 
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors w-full"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;
