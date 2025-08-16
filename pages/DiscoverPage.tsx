
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import DoctorCard from '../components/DoctorCard';
import { Doctor, ConsultationMode } from '../types';

const DiscoverPage: React.FC = () => {
  const { state } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [specialization, setSpecialization] = useState('All');
  const [mode, setMode] = useState<ConsultationMode | 'All'>('All');
  const [sortBy, setSortBy] = useState('rating');

  const specializations = useMemo(() => {
    return ['All', ...Array.from(new Set(state.doctors.map(d => d.specialization)))];
  }, [state.doctors]);

  const filteredAndSortedDoctors = useMemo(() => {
    const now = new Date();
    let doctorsWithSlots = state.doctors.map(doctor => {
        const soonestSlot = state.slots
            .filter(slot => slot.doctorId === doctor.id && slot.status === 'available' && new Date(slot.startTime) > now)
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0];
        return {...doctor, soonestSlotTime: soonestSlot ? soonestSlot.startTime : null};
    });

    let filtered = doctorsWithSlots.filter(doctor => {
      const nameMatch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase());
      const specMatch = specialization === 'All' || doctor.specialization === specialization;
      const modeMatch = mode === 'All' || doctor.mode.includes(mode);
      return nameMatch && specMatch && modeMatch;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'availability') {
          if (!a.soonestSlotTime) return 1;
          if (!b.soonestSlotTime) return -1;
          return new Date(a.soonestSlotTime).getTime() - new Date(b.soonestSlotTime).getTime();
      }
      // Default to rating
      return b.rating - a.rating;
    });
  }, [state.doctors, state.slots, searchTerm, specialization, mode, sortBy]);

  if (state.isLoading) {
    return <div className="text-center p-10">Loading doctors...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary">Find Your Ayurvedic Doctor</h1>
        <p className="mt-2 text-lg text-gray-600">Discover top-rated specialists tailored to your needs.</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md sticky top-0 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search by doctor's name..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            value={specialization}
            onChange={e => setSpecialization(e.target.value)}
          >
            {specializations.map(spec => <option key={spec} value={spec}>{spec}</option>)}
          </select>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            value={mode}
            onChange={e => setMode(e.target.value as ConsultationMode | 'All')}
          >
            <option value="All">All Modes</option>
            <option value="Online">Online</option>
            <option value="In-Person">In-Person</option>
          </select>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="rating">Sort by Rating</option>
            <option value="availability">Sort by Availability</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredAndSortedDoctors.map(doctor => (
          <DoctorCard key={doctor.id} doctor={doctor} soonestSlot={doctor.soonestSlotTime || undefined} />
        ))}
      </div>
       {filteredAndSortedDoctors.length === 0 && (
        <div className="text-center col-span-full py-16">
          <h3 className="text-2xl font-semibold text-gray-700">No Doctors Found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search filters.</p>
        </div>
      )}
    </div>
  );
};

export default DiscoverPage;
