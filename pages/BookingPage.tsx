
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import Modal from '../components/Modal';

const SLOT_LOCK_DURATION_MS = 5 * 60 * 1000;

const BookingPage: React.FC = () => {
  const { slotId } = useParams<{ slotId: string }>();
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();

  const [isOtpModalOpen, setOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(SLOT_LOCK_DURATION_MS);

  const slot = useMemo(() => state.slots.find(s => s.id === slotId), [state.slots, slotId]);
  const doctor = useMemo(() => state.doctors.find(d => d.id === slot?.doctorId), [state.doctors, slot]);

  useEffect(() => {
    if (!slot || slot.status !== 'available') {
      alert("This slot is no longer available.");
      navigate(`/doctors/${doctor?.id || ''}`);
      return;
    }

    const lockExpiresAt = new Date(Date.now() + SLOT_LOCK_DURATION_MS).toISOString();
    dispatch({ type: 'LOCK_SLOT', payload: { slotId: slot.id, lockExpiresAt } });

    return () => {
      // Check if the component is unmounting without a booking
      const currentSlot = state.slots.find(s => s.id === slotId);
      if (currentSlot && currentSlot.status === 'locked') {
        dispatch({ type: 'RELEASE_SLOT', payload: { slotId: slot.id } });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slotId, navigate, dispatch]);
  
  useEffect(() => {
    if (slot && slot.status === 'locked' && slot.lockExpiresAt) {
      const interval = setInterval(() => {
        const remaining = new Date(slot.lockExpiresAt!).getTime() - Date.now();
        if (remaining <= 0) {
          clearInterval(interval);
          setTimeLeft(0);
          alert("Your session has expired. The slot has been released.");
          dispatch({ type: 'RELEASE_SLOT', payload: { slotId: slot.id } });
          navigate(`/doctors/${doctor?.id || ''}`);
        } else {
          setTimeLeft(remaining);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [slot, dispatch, navigate, doctor]);

  if (!slot || !doctor) {
    return <div className="text-center p-10">Loading booking details...</div>;
  }

  const handleConfirmBooking = () => {
    // Mock OTP logic
    if (otp === '123456') {
      const newAppointment = {
        id: `appt-${Date.now()}`,
        userId: state.currentUser.id,
        userName: state.currentUser.name,
        doctorId: doctor.id,
        slotId: slot.id,
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: 'Booked' as const,
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: 'BOOK_APPOINTMENT', payload: newAppointment });
      setOtpModalOpen(false);
      alert('Appointment booked successfully!');
      navigate('/dashboard');
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Confirm Your Booking</h1>
        <p className="text-lg text-red-600 font-semibold mb-6">
          This slot is reserved for you for: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </p>

        <div className="border-t border-b py-6 space-y-4">
            <div className="flex items-center space-x-4">
                <img src={doctor.imageUrl} alt={doctor.name} className="w-20 h-20 rounded-full" />
                <div>
                    <h2 className="text-2xl font-bold">{doctor.name}</h2>
                    <p className="text-gray-600">{doctor.specialization}</p>
                </div>
            </div>
            <div>
                <p className="text-lg"><span className="font-semibold">Date:</span> {new Date(slot.startTime).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="text-lg"><span className="font-semibold">Time:</span> {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
        </div>
        
        <div className="mt-8 text-center">
            <button
                onClick={() => setOtpModalOpen(true)}
                className="w-full md:w-auto bg-primary text-white font-bold py-3 px-12 rounded-lg hover:bg-primary-dark transition-colors duration-300 text-lg"
            >
                Proceed to Confirmation
            </button>
        </div>
      </div>

      <Modal isOpen={isOtpModalOpen} onClose={() => setOtpModalOpen(false)} title="Confirm with OTP">
          <p className="text-gray-600 mb-4">An OTP has been sent to your registered mobile number. Please enter it below to confirm.</p>
          <p className="text-center font-mono text-lg my-2">(Hint: The OTP is <span className="font-bold text-primary">123456</span>)</p>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            className="w-full p-3 border border-gray-300 rounded-lg text-center text-2xl tracking-widest"
            placeholder="______"
          />
          <button
            onClick={handleConfirmBooking}
            className="mt-6 w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Confirm Booking
          </button>
      </Modal>
    </div>
  );
};

export default BookingPage;
