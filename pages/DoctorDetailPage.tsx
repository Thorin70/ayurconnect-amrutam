
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import { Doctor, AvailabilitySlot } from '../types';
import { StarIcon } from '../components/icons/StarIcon';
import { VideoIcon } from '../components/icons/VideoIcon';
import { LocationIcon } from '../components/icons/LocationIcon';

const DoctorDetailPage: React.FC = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const { state } = useAppContext();
  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);

  const doctor = useMemo(() => state.doctors.find(d => d.id === doctorId), [state.doctors, doctorId]);
  const doctorSlots = useMemo(() => {
    return state.slots.filter(s => s.doctorId === doctorId && new Date(s.startTime) > new Date());
  }, [state.slots, doctorId]);

  if (state.isLoading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  if (!doctor) {
    return (
        <div className="text-center p-10">
            <h2 className="text-2xl font-bold">Doctor not found</h2>
            <Link to="/discover" className="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-lg">Back to Discovery</Link>
        </div>
    );
  }

  const handleSlotSelect = (slot: AvailabilitySlot) => {
    setSelectedSlot(slot);
  };
  
  const handleBooking = () => {
    if (selectedSlot) {
      navigate(`/book/${selectedSlot.id}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="p-8 md:flex md:space-x-8">
                <div className="md:w-1/3 text-center md:text-left">
                    <img className="w-48 h-48 rounded-full object-cover mx-auto md:mx-0" src={doctor.imageUrl} alt={doctor.name} />
                     <div className="mt-4 flex items-center justify-center md:justify-start bg-yellow-100 text-yellow-800 text-lg font-semibold px-4 py-1 rounded-full w-fit mx-auto md:mx-0">
                        <StarIcon className="w-6 h-6 mr-2 text-yellow-500" />
                        <span>{doctor.rating}</span>
                    </div>
                     <div className="mt-4 flex flex-col space-y-2 items-center md:items-start">
                        {doctor.mode.includes('Online') && <div className="flex items-center text-gray-600"><VideoIcon className="w-5 h-5 mr-2 text-primary"/> Online Consultations</div>}
                        {doctor.mode.includes('In-Person') && <div className="flex items-center text-gray-600"><LocationIcon className="w-5 h-5 mr-2 text-primary"/> In-Person at {doctor.location}</div>}
                    </div>
                </div>
                <div className="md:w-2/3 mt-6 md:mt-0">
                    <h1 className="text-4xl font-bold text-primary">{doctor.name}</h1>
                    <p className="text-xl text-gray-600 mt-1">{doctor.specialization}</p>
                    <p className="text-md text-gray-700 mt-4">{doctor.bio}</p>
                </div>
            </div>
            <div className="px-8 py-6 bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Select an Appointment Slot</h2>
                <AvailabilityCalendar slots={doctorSlots} onSlotSelect={handleSlotSelect} selectedSlotId={selectedSlot?.id} />
                {selectedSlot && (
                    <div className="mt-6 p-4 bg-primary-light rounded-lg text-center">
                        <p className="font-semibold text-primary-dark">
                            You've selected: {new Date(selectedSlot.startTime).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
                        </p>
                        <button 
                            onClick={handleBooking}
                            className="mt-4 bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-dark transition-colors duration-300 shadow-lg transform hover:scale-105"
                        >
                            Confirm & Proceed to Book
                        </button>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default DoctorDetailPage;
