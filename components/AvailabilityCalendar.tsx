
import React, { useState } from 'react';
import { AvailabilitySlot } from '../types';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface AvailabilityCalendarProps {
  slots: AvailabilitySlot[];
  onSlotSelect: (slot: AvailabilitySlot) => void;
  selectedSlotId?: string;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ slots, onSlotSelect, selectedSlotId }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

  const nextWeek = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)));
  };

  const prevWeek = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)));
  };

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });

  const getSlotsForDay = (date: Date) => {
    return slots
      .filter(slot => {
        const slotDate = new Date(slot.startTime);
        return (
          slotDate.getDate() === date.getDate() &&
          slotDate.getMonth() === date.getMonth() &&
          slotDate.getFullYear() === date.getFullYear()
        );
      })
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevWeek} className="p-2 rounded-full hover:bg-gray-100">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <h3 className="text-lg font-semibold">
          {startOfWeek.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>
        <button onClick={nextWeek} className="p-2 rounded-full hover:bg-gray-100">
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
        {days.map(day => (
          <div key={day.toISOString()} className="border rounded-md p-2">
            <p className="text-center font-bold text-sm">
              {day.toLocaleString('default', { weekday: 'short' })}
            </p>
            <p className="text-center text-gray-500 text-xs mb-2">
              {day.toLocaleString('default', { day: 'numeric' })}
            </p>
            <div className="flex flex-col space-y-2 max-h-60 overflow-y-auto">
              {getSlotsForDay(day).map(slot => (
                <button
                  key={slot.id}
                  onClick={() => onSlotSelect(slot)}
                  disabled={slot.status !== 'available'}
                  className={`px-2 py-1 text-sm rounded-md w-full transition-colors duration-200
                    ${slot.id === selectedSlotId ? 'bg-primary text-white' : ''}
                    ${slot.status === 'available' ? 'bg-primary-light text-primary-dark hover:bg-primary hover:text-white' : ''}
                    ${slot.status === 'booked' ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}
                    ${slot.status === 'locked' ? 'bg-yellow-300 text-yellow-800 cursor-not-allowed' : ''}
                  `}
                >
                  {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                </button>
              ))}
              {getSlotsForDay(day).length === 0 && <p className="text-center text-xs text-gray-400 mt-2">No Slots</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
