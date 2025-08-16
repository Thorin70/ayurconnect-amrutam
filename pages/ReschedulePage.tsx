
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { Appointment, AvailabilitySlot } from '../types';
import AvailabilityCalendar from '../components/AvailabilityCalendar';

const ReschedulePage: React.FC = () => {
    const { appointmentId } = useParams<{ appointmentId: string }>();
    const { state, dispatch } = useAppContext();
    const navigate = useNavigate();
    const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);

    const appointment = useMemo(() => state.appointments.find(a => a.id === appointmentId), [state.appointments, appointmentId]);
    const doctor = useMemo(() => state.doctors.find(d => d.id === appointment?.doctorId), [state.doctors, appointment]);
    const doctorSlots = useMemo(() => {
        if (!doctor) return [];
        return state.slots.filter(s => s.doctorId === doctor.id && new Date(s.startTime) > new Date());
    }, [state.slots, doctor]);

    if (!appointment || !doctor) {
        return (
            <div className="text-center p-10">
                <h2 className="text-2xl font-bold">Appointment not found</h2>
                <Link to="/dashboard" className="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-lg">Back to Dashboard</Link>
            </div>
        );
    }
    
    const isReschedulable = new Date(appointment.startTime).getTime() > new Date().getTime() + 24 * 60 * 60 * 1000;
    
    if (!isReschedulable) {
        return (
            <div className="text-center p-10 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-red-600">Cannot Reschedule</h2>
                <p className="text-gray-600 mt-2">Appointments can only be rescheduled more than 24 hours in advance.</p>
                <Link to="/dashboard" className="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-lg">Back to Dashboard</Link>
            </div>
        );
    }

    const handleReschedule = () => {
        if (!selectedSlot) {
            alert("Please select a new slot.");
            return;
        }
        if (window.confirm("Are you sure you want to reschedule to this new time?")) {
            dispatch({
                type: 'RESCHEDULE_APPOINTMENT',
                payload: {
                    appointmentId: appointment.id,
                    oldSlotId: appointment.slotId,
                    newSlot: selectedSlot,
                }
            });
            alert("Appointment rescheduled successfully!");
            navigate('/dashboard');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-center text-primary">Reschedule Appointment</h1>
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-2">Current Appointment</h2>
                <p><strong>Doctor:</strong> {doctor.name}</p>
                <p><strong>Time:</strong> {new Date(appointment.startTime).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Select a New Slot for {doctor.name}</h2>
                <AvailabilityCalendar slots={doctorSlots} onSlotSelect={setSelectedSlot} selectedSlotId={selectedSlot?.id} />
            </div>

            {selectedSlot && (
                <div className="text-center p-4 bg-primary-light rounded-lg">
                    <p className="font-semibold text-primary-dark">
                        New time selected: {new Date(selectedSlot.startTime).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
                    </p>
                    <button
                        onClick={handleReschedule}
                        className="mt-4 bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-dark transition-colors"
                    >
                        Confirm Reschedule
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReschedulePage;
