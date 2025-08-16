
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LeafIcon } from './icons/LeafIcon';

// Simple SVG icons for LinkedIn and GitHub
const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" {...props}>
    <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75c.97 0 1.75.79 1.75 1.75s-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.07-.93-2-2-2s-2 .93-2 2v4.5h-3v-9h3v1.22c.41-.63 1.36-1.22 2.25-1.22 1.93 0 3.5 1.57 3.5 3.5v5.5z"/>
  </svg>
);
const GitHubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" {...props}>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.263.82-.582 0-.288-.01-1.05-.015-2.06-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.76-1.605-2.665-.304-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.236-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.399 3-.404 1.02.005 2.04.137 3 .404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.803 5.624-5.475 5.922.43.372.813 1.102.813 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.218.699.825.58C20.565 21.796 24 17.297 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);
import { useAppContext } from '../hooks/useAppContext';


const Header: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { currentUser, doctors } = state;
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const activeLinkClass = "text-white bg-primary-dark";
  const defaultLinkClass = "text-gray-100 hover:bg-primary-dark hover:text-white";

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    setMenuOpen(false);
    if (newRole === 'patient') {
      dispatch({ type: 'SET_USER', payload: { id: 'user123', name: 'Patient User', role: 'patient' } });
      navigate('/discover');
    } else {
      if (doctors.length > 0) {
        const firstDoctor = doctors[0];
        dispatch({ type: 'SET_USER', payload: { id: firstDoctor.id, name: firstDoctor.name, role: 'doctor' } });
        navigate('/doctor-dashboard');
      }
    }
  };

  const handleDoctorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const doctorId = e.target.value;
    setMenuOpen(false);
    const selectedDoctor = doctors.find(d => d.id === doctorId);
    if (selectedDoctor) {
      dispatch({ type: 'SET_USER', payload: { id: selectedDoctor.id, name: selectedDoctor.name, role: 'doctor' } });
      navigate('/doctor-dashboard');
    }
  };

  // Responsive menu links
  const navLinks = currentUser.role === 'patient'
    ? [
        { to: '/discover', label: 'Discover Doctors' },
        { to: '/dashboard', label: 'My Appointments' },
      ]
    : [
        { to: '/doctor-dashboard', label: 'Doctor Dashboard' },
      ];

  return (
    <header className="bg-primary shadow-md sticky top-0 z-20">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 flex-wrap">
          <div className="flex items-center space-x-4">
            {/* Social icons */}
            <a href="https://www.linkedin.com/in/yasar-beg-5946ab367/" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors" aria-label="LinkedIn">
              <LinkedInIcon />
            </a>
            <a href="https://github.com/Thorin70" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors" aria-label="GitHub">
              <GitHubIcon />
            </a>
            <NavLink to="/" className="flex-shrink-0 flex items-center text-white">
              <LeafIcon className="h-8 w-8 text-secondary" />
              <span className="ml-2 text-2xl font-bold">AyurConnect</span>
            </NavLink>
          </div>
          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => `px-4 py-2 rounded-lg text-base font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-secondary ${isActive ? 'bg-primary-dark text-white shadow' : 'text-white hover:bg-primary-dark hover:text-white'}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
            <div className="flex items-center space-x-2 bg-primary-dark p-2 rounded-lg ml-6">
              <select onChange={handleRoleChange} value={currentUser.role} className="bg-primary-dark border border-primary-light text-white rounded-lg px-3 py-2 text-base font-semibold focus:ring-secondary focus:border-secondary focus:outline-none transition-all">
                <option value="patient">Patient View</option>
                <option value="doctor">Doctor View</option>
              </select>
              {currentUser.role === 'doctor' && (
                <select onChange={handleDoctorChange} value={currentUser.id} className="bg-primary-dark border border-primary-light text-white rounded-lg px-3 py-2 text-base font-semibold focus:ring-secondary focus:border-secondary focus:outline-none transition-all">
                  {doctors.map(doc => (
                    <option key={doc.id} value={doc.id}>{doc.name}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
          {/* Mobile nav */}
          <div className="md:hidden flex items-center">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-primary-dark focus:outline-none"
              aria-label="Toggle menu"
              onClick={() => setMenuOpen(m => !m)}
            >
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-primary-dark rounded-b-lg shadow-lg py-2 px-4 animate-fade-in">
            <div className="flex flex-col space-y-2">
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => `px-4 py-2 rounded-lg text-base font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-secondary ${isActive ? 'bg-primary text-white shadow' : 'text-white hover:bg-primary hover:text-white'}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="flex items-center space-x-2 bg-primary p-2 rounded-lg mt-2">
                <select onChange={handleRoleChange} value={currentUser.role} className="bg-primary-dark border border-primary-light text-white rounded-lg px-3 py-2 text-base font-semibold focus:ring-secondary focus:border-secondary focus:outline-none transition-all">
                  <option value="patient">Patient View</option>
                  <option value="doctor">Doctor View</option>
                </select>
                {currentUser.role === 'doctor' && (
                  <select onChange={handleDoctorChange} value={currentUser.id} className="bg-primary-dark border border-primary-light text-white rounded-lg px-3 py-2 text-base font-semibold focus:ring-secondary focus:border-secondary focus:outline-none transition-all">
                    {doctors.map(doc => (
                      <option key={doc.id} value={doc.id}>{doc.name}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
