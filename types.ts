export type ConsultationMode = 'Online' | 'In-Person';
export type AppointmentStatus = 'Booked' | 'Completed' | 'Cancelled';
export type SlotStatus = 'available' | 'locked' | 'booked' | 'unavailable';

export interface User {
  id: string; // For patient, 'user123'. For doctor, will be doctor's ID.
  name: string;
  role: 'patient' | 'doctor';
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  location: string;
  mode: ConsultationMode[];
  bio: string;
  imageUrl: string;
  rating: number;
}

export interface AvailabilitySlot {
  id: string;
  doctorId: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  status: SlotStatus;
  lockExpiresAt?: string; // ISO string
}

export interface Appointment {
  id: string;
  userId: string;
  userName: string;
  doctorId: string;
  slotId: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  status: AppointmentStatus;
  createdAt: string; // ISO string
}

export interface AppState {
  doctors: Doctor[];
  slots: AvailabilitySlot[];
  appointments: Appointment[];
  isLoading: boolean;
  currentUser: User;
}

export type AppAction =
  | { type: 'INITIALIZE_DATA'; payload: AppState }
  | { type: 'LOCK_SLOT'; payload: { slotId: string; lockExpiresAt: string } }
  | { type: 'RELEASE_SLOT'; payload: { slotId: string } }
  | { type: 'BOOK_APPOINTMENT'; payload: Appointment }
  | { type: 'CANCEL_APPOINTMENT'; payload: { appointmentId: string; slotId: string } }
  | { type: 'RESCHEDULE_APPOINTMENT'; payload: { appointmentId: string; oldSlotId: string; newSlot: AvailabilitySlot } }
  | { type: 'SET_USER'; payload: User }
  | { type: 'ADD_SLOT'; payload: AvailabilitySlot }
  | { type: 'REMOVE_SLOT'; payload: { slotId: string } };