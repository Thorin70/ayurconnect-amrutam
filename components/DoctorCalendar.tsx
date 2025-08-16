import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { XIcon } from './icons/XIcon';
import { AvailabilitySlot } from '../types';

interface DoctorCalendarProps {
    doctorId: string;
}

const DoctorCalendar: React.FC<DoctorCalendarProps> = ({ doctorId }) => {
    const { state, dispatch } = useAppContext();
    const [currentDate, setCurrentDate] = useState(new Date());

    const { slots, appointments } = state;

    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const nextWeek = () => setCurrentDate(d => { const newDate = new Date(d); newDate.setDate(d.getDate() + 7); return newDate; });
    const prevWeek = () => setCurrentDate(d => { const newDate = new Date(d); newDate.setDate(d.getDate() - 7); return newDate; });
    
    const days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        return date;
    });

    const timeSlots = [];
    for(let hour = 9; hour < 17; hour++) {
        timeSlots.push({ hour });
    }

    const handleAddSlot = (date: Date) => {
        if(new Date() > date) {
            alert("Cannot add slots in the past.");
            return;
        }
        const endTime = new Date(date);
        endTime.setMinutes(date.getMinutes() + 45);

        const newSlot: AvailabilitySlot = {
            id: `slot-${doctorId}-${date.getTime()}`,
            doctorId,
            startTime: date.toISOString(),
            endTime: endTime.toISOString(),
            status: 'available',
        };
        dispatch({ type: 'ADD_SLOT', payload: newSlot });
    };

    const handleRemoveSlot = (slotId: string) => {
        const slotToRemove = slots.find(s => s.id === slotId);
        if (slotToRemove?.status === 'booked' || slotToRemove?.status === 'locked') {
            alert("Cannot remove a booked or locked slot.");
            return;
        }

        const confirmMessage = slotToRemove?.status === 'unavailable' 
            ? "Are you sure you want to make this hour available again?"
            : "Are you sure you want to remove this available slot?";

        if (window.confirm(confirmMessage)) {
            dispatch({ type: 'REMOVE_SLOT', payload: { slotId } });
        }
    };
    
    const handleCancelAppointment = (slotId: string) => {
        const appointment = appointments.find(a => a.slotId === slotId && a.status === 'Booked');
        if (!appointment) {
            alert("Could not find the appointment to cancel.");
            return;
        }
        if (window.confirm(`Are you sure you want to cancel the appointment with ${appointment.userName}?`)) {
            dispatch({ type: 'CANCEL_APPOINTMENT', payload: { appointmentId: appointment.id, slotId } });
        }
    };

    const handleBlockHour = (date: Date) => {
         if(new Date() > date) {
            alert("Cannot block slots in the past.");
            return;
        }
        const endTime = new Date(date);
        endTime.setHours(date.getHours() + 1);

        const newSlot: AvailabilitySlot = {
            id: `slot-${doctorId}-${date.getTime()}-unavailable`,
            doctorId,
            startTime: date.toISOString(),
            endTime: endTime.toISOString(),
            status: 'unavailable',
        };
        dispatch({ type: 'ADD_SLOT', payload: newSlot });
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
            <div className="flex justify-between items-center mb-4 min-w-[900px]">
                <button onClick={prevWeek} className="p-2 rounded-full hover:bg-gray-100"><ChevronLeftIcon className="w-6 h-6" /></button>
                <h3 className="text-lg font-semibold">{startOfWeek.toLocaleString('default', { month: 'long', year: 'numeric' })} - Week View</h3>
                <button onClick={nextWeek} className="p-2 rounded-full hover:bg-gray-100"><ChevronRightIcon className="w-6 h-6" /></button>
            </div>
            <div className="grid grid-cols-8 text-center text-sm font-semibold min-w-[900px]">
                <div className="p-2 border-b border-r">Time</div>
                {days.map(day => <div key={day.toISOString()} className="p-2 border-b border-r">{day.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}</div>)}

                {timeSlots.map(({ hour }) => (
                    <React.Fragment key={`${hour}`}>
                        <div className="p-2 border-r h-24 flex items-center justify-center">{new Date(0, 0, 0, hour, 0).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
                        {days.map(day => {
                            const allSlotsForDay = slots.filter(s => {
                                const sTime = new Date(s.startTime);
                                return s.doctorId === doctorId && sTime.getFullYear() === day.getFullYear() && sTime.getMonth() === day.getMonth() && sTime.getDate() === day.getDate();
                            });
                            
                            const cellStartTime = new Date(day);
                            cellStartTime.setHours(hour, 0, 0, 0);
                            
                            const cellEndTime = new Date(day);
                            cellEndTime.setHours(hour + 1, 0, 0, 0);

                            const existingSlotsInHour = allSlotsForDay.filter(s => {
                                const sTime = new Date(s.startTime);
                                return sTime >= cellStartTime && sTime < cellEndTime;
                            }).sort((a,b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
                            
                            const potentialStarts = [0, 15, 30, 45];
                            const availableSubSlots: Date[] = [];

                            if (new Date() < cellEndTime) {
                                for (const minute of potentialStarts) {
                                    const potentialStartTime = new Date(day);
                                    potentialStartTime.setHours(hour, minute, 0, 0);

                                    if (potentialStartTime < cellStartTime || potentialStartTime >= cellEndTime) continue;

                                    const potentialEndTime = new Date(potentialStartTime);
                                    potentialEndTime.setMinutes(potentialStartTime.getMinutes() + 45);

                                    const conflict = allSlotsForDay.some(existingSlot => {
                                        const existingStart = new Date(existingSlot.startTime);
                                        const existingEnd = new Date(existingSlot.endTime);
                                        return (potentialStartTime < existingEnd && potentialEndTime > existingStart);
                                    });

                                    if (!conflict) {
                                        availableSubSlots.push(potentialStartTime);
                                    }
                                }
                            }

                            return (
                                <div key={day.toISOString()} className="p-1 border-b border-r h-24 group relative flex flex-col space-y-1 justify-start overflow-y-auto">
                                    {existingSlotsInHour.length === 1 && existingSlotsInHour[0].status === 'unavailable' ? (
                                        <div className="flex-grow w-full h-full">
                                            <div key={existingSlotsInHour[0].id} className="w-full h-full p-1 bg-gray-200 text-gray-600 rounded-md relative group/slot flex items-center justify-center">
                                                <p className="font-semibold text-xs">Unavailable</p>
                                                <button 
                                                    onClick={() => handleRemoveSlot(existingSlotsInHour[0].id)} 
                                                    className="absolute top-0 right-0 p-0.5 bg-gray-500 text-white rounded-bl-md opacity-0 group-hover/slot:opacity-100 transition-opacity"
                                                    aria-label="Make hour available"
                                                >
                                                    <XIcon className="w-3 h-3"/>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {existingSlotsInHour.map(slot => {
                                                if (slot.status === 'booked') {
                                                    const appointment = appointments.find(a => a.slotId === slot.id && a.status === 'Booked');
                                                    return (
                                                        <div key={slot.id} className="p-1 bg-red-100 text-red-800 rounded-md text-xs text-center w-full relative group/slot">
                                                            <p className="font-semibold">{new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                            <p>w/ {appointment?.userName || '...'}</p>
                                                            <button 
                                                                onClick={() => handleCancelAppointment(slot.id)} 
                                                                className="absolute top-0 right-0 p-0.5 bg-red-500 text-white rounded-bl-md opacity-0 group-hover/slot:opacity-100 transition-opacity"
                                                                aria-label="Cancel appointment"
                                                            >
                                                                <XIcon className="w-3 h-3"/>
                                                            </button>
                                                        </div>
                                                    );
                                                }
                                                return (
                                                    <div key={slot.id} className="p-1 bg-green-100 text-green-800 rounded-md relative group/slot text-xs text-center w-full">
                                                        <p className="font-semibold">{new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                        <p>Available</p>
                                                        <button 
                                                            onClick={() => handleRemoveSlot(slot.id)} 
                                                            className="absolute top-0 right-0 p-0.5 bg-red-500 text-white rounded-bl-md opacity-0 group-hover/slot:opacity-100 transition-opacity"
                                                            aria-label="Remove slot"
                                                        >
                                                            <XIcon className="w-3 h-3"/>
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                            <div className="flex-grow flex flex-col items-center space-y-1 opacity-0 group-hover:opacity-100 transition-opacity pt-1">
                                                {existingSlotsInHour.length === 0 && new Date() < cellEndTime && (
                                                    <button
                                                        onClick={() => handleBlockHour(cellStartTime)}
                                                        className="w-full text-xs py-0.5 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-sm mb-1"
                                                        aria-label={`Block hour starting at ${cellStartTime.toLocaleString()}`}
                                                    >
                                                        Block Hour
                                                    </button>
                                                )}
                                                {availableSubSlots.map(subSlotTime => (
                                                    <button 
                                                        key={subSlotTime.getTime()} 
                                                        onClick={() => handleAddSlot(subSlotTime)} 
                                                        className="w-full text-xs py-0.5 bg-primary-light text-primary-dark hover:bg-primary hover:text-white rounded-sm"
                                                        aria-label={`Add slot for ${subSlotTime.toLocaleString()}`}
                                                    >
                                                        + {subSlotTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default DoctorCalendar;