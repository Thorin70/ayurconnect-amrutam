
import React, { createContext, useReducer, useEffect, ReactNode, Dispatch, useContext } from 'react';
import { AppState, AppAction, Appointment, AvailabilitySlot, User } from '../types';
import { doctors as mockDoctors, generateSlots as mockGenerateSlots } from '../services/mockData';

const LOCAL_STORAGE_KEY = 'ayurConnectState';

const initialState: AppState = {
  doctors: [],
  slots: [],
  appointments: [],
  isLoading: true,
  currentUser: { id: 'user123', name: 'Patient User', role: 'patient' },
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'INITIALIZE_DATA':
      return { ...action.payload, isLoading: false };
    case 'LOCK_SLOT': {
      return {
        ...state,
        slots: state.slots.map(slot =>
          slot.id === action.payload.slotId
            ? { ...slot, status: 'locked', lockExpiresAt: action.payload.lockExpiresAt }
            : slot
        ),
      };
    }
    case 'RELEASE_SLOT': {
      return {
        ...state,
        slots: state.slots.map(slot =>
          slot.id === action.payload.slotId ? { ...slot, status: 'available', lockExpiresAt: undefined } : slot
        ),
      };
    }
    case 'BOOK_APPOINTMENT': {
        const newAppointment = action.payload;
      return {
        ...state,
        appointments: [...state.appointments, newAppointment],
        slots: state.slots.map(slot =>
          slot.id === newAppointment.slotId ? { ...slot, status: 'booked', lockExpiresAt: undefined } : slot
        ),
      };
    }
    case 'CANCEL_APPOINTMENT': {
        const { appointmentId, slotId } = action.payload;
        return {
            ...state,
            appointments: state.appointments.map(appt => appt.id === appointmentId ? {...appt, status: 'Cancelled'} : appt),
            slots: state.slots.map(slot => slot.id === slotId ? {...slot, status: 'available'} : slot)
        }
    }
    case 'RESCHEDULE_APPOINTMENT': {
        const { appointmentId, oldSlotId, newSlot } = action.payload;
        return {
            ...state,
            appointments: state.appointments.map(appt => appt.id === appointmentId ? {...appt, startTime: newSlot.startTime, endTime: newSlot.endTime, slotId: newSlot.id} : appt),
            slots: state.slots.map(slot => {
                if (slot.id === oldSlotId) return {...slot, status: 'available'};
                if (slot.id === newSlot.id) return {...slot, status: 'booked'};
                return slot;
            })
        };
    }
    case 'SET_USER':
        return { ...state, currentUser: action.payload };
    case 'ADD_SLOT':
        return { ...state, slots: [...state.slots, action.payload] };
    case 'REMOVE_SLOT':
        return { ...state, slots: state.slots.filter(slot => slot.id !== action.payload.slotId) };
    default:
      return state;
  }
};

export const AppContext = createContext<{ state: AppState; dispatch: Dispatch<AppAction> }>({
  state: initialState,
  dispatch: () => null,
});

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    try {
      const storedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedState) {
        const parsedState = JSON.parse(storedState);
        // Clean up expired locks on load
        const now = new Date();
        const cleanedSlots = parsedState.slots.map((slot: AvailabilitySlot) => {
            if (slot.status === 'locked' && slot.lockExpiresAt && new Date(slot.lockExpiresAt) < now) {
                return {...slot, status: 'available', lockExpiresAt: undefined};
            }
            return slot;
        });
        const payload = {
            ...parsedState,
            slots: cleanedSlots,
            currentUser: parsedState.currentUser || initialState.currentUser
        };
        dispatch({ type: 'INITIALIZE_DATA', payload });
      } else {
        const initialSlots = mockGenerateSlots();
        const initialData = { ...initialState, doctors: mockDoctors, slots: initialSlots, isLoading: false };
        dispatch({ type: 'INITIALIZE_DATA', payload: initialData });
      }
    } catch (error) {
      console.error("Failed to load state from localStorage", error);
      const initialSlots = mockGenerateSlots();
      const initialData = { ...initialState, doctors: mockDoctors, slots: initialSlots, isLoading: false };
      dispatch({ type: 'INITIALIZE_DATA', payload: initialData });
    }
  }, []);

  useEffect(() => {
    if (!state.isLoading) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error("Failed to save state to localStorage", error);
      }
    }
  }, [state]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};
