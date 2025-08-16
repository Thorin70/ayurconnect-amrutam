
import { Doctor, AvailabilitySlot } from '../types';

export const doctors: Doctor[] = [
  {
    id: 'doc1',
    name: 'Dr. Vasant Lad',
    specialization: 'Panchakarma',
    location: 'Pune, India',
    mode: ['Online', 'In-Person'],
    bio: 'A world-renowned Ayurvedic physician, Dr. Lad is a pioneer of Ayurveda in the West, with over 40 years of clinical experience. He is an author of many books on Ayurveda.',
    imageUrl: 'https://picsum.photos/seed/doc1/400/400',
    rating: 4.9,
  },
  {
    id: 'doc2',
    name: 'Dr. Deepika Chopra',
    specialization: 'Herbal Medicine',
    location: 'Los Angeles, USA',
    mode: ['Online'],
    bio: 'Dr. Chopra specializes in mind-body integration and herbal remedies for chronic illnesses. She blends traditional knowledge with modern scientific understanding.',
    imageUrl: 'https://picsum.photos/seed/doc2/400/400',
    rating: 4.8,
  },
  {
    id: 'doc3',
    name: 'Dr. Avinash Lele',
    specialization: 'Ayurvedic Dietetics',
    location: 'Mumbai, India',
    mode: ['Online', 'In-Person'],
    bio: 'With a focus on personalized nutrition, Dr. Lele helps patients achieve balance and health through dietary modifications tailored to their dosha.',
    imageUrl: 'https://picsum.photos/seed/doc3/400/400',
    rating: 4.7,
  },
   {
    id: 'doc4',
    name: 'Dr. Sunita Sharma',
    specialization: 'Panchakarma',
    location: 'Kerala, India',
    mode: ['In-Person'],
    bio: 'An expert in detoxification and rejuvenation therapies, Dr. Sharma runs a wellness retreat specializing in authentic Panchakarma treatments.',
    imageUrl: 'https://picsum.photos/seed/doc4/400/400',
    rating: 4.9,
  },
];

export const generateSlots = (): AvailabilitySlot[] => {
  const slots: AvailabilitySlot[] = [];
  const today = new Date();
  
  doctors.forEach(doctor => {
    for (let day = 0; day < 14; day++) { // Generate slots for the next 14 days
      const date = new Date(today);
      date.setDate(today.getDate() + day);
      
      // Skip weekends for some doctors
      if (doctor.id === 'doc2' && (date.getDay() === 0 || date.getDay() === 6)) {
        continue;
      }

      for (let hour = 9; hour < 17; hour++) { // 9 AM to 5 PM
        if (Math.random() > 0.3) { // Create some gaps in schedule
          const startTime = new Date(date);
          startTime.setHours(hour, 0, 0, 0);

          const endTime = new Date(startTime);
          endTime.setMinutes(startTime.getMinutes() + 45); // 45-minute slots

          slots.push({
            id: `slot-${doctor.id}-${startTime.getTime()}`,
            doctorId: doctor.id,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            status: 'available',
          });
        }
      }
    }
  });
  return slots;
};
