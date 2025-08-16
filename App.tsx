
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Header from './components/Header';
import DiscoverPage from './pages/DiscoverPage';
import DoctorDetailPage from './pages/DoctorDetailPage';
import BookingPage from './pages/BookingPage';
import DashboardPage from './pages/DashboardPage';
import ReschedulePage from './pages/ReschedulePage';
import DoctorDashboardPage from './pages/DoctorDashboardPage';

function App() {
  return (
    <AppProvider>
      <HashRouter>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
            <Routes>
              <Route path="/" element={<Navigate to="/discover" replace />} />
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/doctors/:doctorId" element={<DoctorDetailPage />} />
              <Route path="/book/:slotId" element={<BookingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/doctor-dashboard" element={<DoctorDashboardPage />} />
              <Route path="/reschedule/:appointmentId" element={<ReschedulePage />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </AppProvider>
  );
}

export default App;
