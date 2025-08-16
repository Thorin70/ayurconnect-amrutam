# Amrutam Ayurvedic Consultation Platform

## Assignment Submission
 The project is a modular MVP for an Ayurvedic doctor consultation platform, built to demonstrate scalable architecture and real-world product thinking.

---

## How the Project Works

### Features
- **Doctor Discovery:**
  - Search and filter Ayurvedic doctors by specialization and consultation mode (online/in-person).
  - Sort by soonest available slot.
- **Slot Booking:**
  - Users can book available slots with doctors.
  - Slot is locked for 5 minutes during booking; confirmation required via mock OTP.
  - If not confirmed, slot is released automatically.
- **Rescheduling & Cancellation:**
  - Appointments can be rescheduled or cancelled if more than 24 hours remain before the scheduled time.
  - Cancelled/rescheduled slots become available to others.
- **Appointment Dashboard:**
  - Users can view upcoming and past appointments.
  - Filter appointments by status: Booked, Completed, Cancelled.
- **Doctor/Admin Features (Optional):**
  - Doctor login and calendar view.
  - Manage availability and slots.

### Tech Stack
- **Frontend:** React (Vite)
- **Backend:** Node.js + Express (not included in this repo)
- **Database:** (To be implemented) PostgreSQL or MongoDB
- **Auth:** JWT (to be implemented)

---

## Running the Project

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd amrutam-ayurvedic-consultation-platform
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Project Live Here
https://ayurconnect.netlify.app/#/discover:

## Project Structure
- `components/` — UI components (navbar, cards, calendar, etc.)
- `pages/` — Main app pages (Discover, Dashboard, Booking, etc.)
- `contexts/` — Global state management
- `services/` — Mock data and utility functions
- `types.ts` — TypeScript types

---


## Author
Yasar