
import React from 'react';
import { Link } from 'react-router-dom';
import { Doctor } from '../types';
import { StarIcon } from './icons/StarIcon';
import { VideoIcon } from './icons/VideoIcon';
import { LocationIcon } from './icons/LocationIcon';

interface DoctorCardProps {
  doctor: Doctor;
  soonestSlot?: string;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, soonestSlot }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <img className="w-24 h-24 rounded-full object-cover" src={doctor.imageUrl} alt={doctor.name} />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-primary">{doctor.name}</h3>
                <p className="text-md text-gray-600">{doctor.specialization}</p>
              </div>
              <div className="flex items-center bg-yellow-100 text-yellow-800 text-sm font-semibold px-2.5 py-0.5 rounded-full">
                <StarIcon className="w-4 h-4 mr-1 text-yellow-500" />
                {doctor.rating}
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">{doctor.bio}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div className="flex items-center space-x-2">
                {doctor.mode.includes('Online') && <div className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full"><VideoIcon className="w-4 h-4 mr-1"/> Online</div>}
                {doctor.mode.includes('In-Person') && <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full"><LocationIcon className="w-4 h-4 mr-1"/> In-Person</div>}
            </div>
            {soonestSlot ? (
              <div className="text-right">
                <p className="font-semibold text-accent">Next available:</p>
                <p>{new Date(soonestSlot).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</p>
              </div>
            ) : (
                <p className="text-gray-500 font-medium">No upcoming slots</p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <Link
            to={`/doctors/${doctor.id}`}
            className="w-full text-center block bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-300"
          >
            View Availability
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
