import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCalendarAlt, faClock, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import sketchUpPoster from '../../asset/studentpage/photo_2025-03-03_21-11-09.svg'; // Ensure this path is correct!
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate


const Register = ({ onBack }) => {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col">
      
      {/* Header */}
      <div className="flex items-center mb-4">
        <button onClick={() => navigate('/student/*')} className="text-gray-600">
          <FontAwesomeIcon icon={faArrowLeft} className="text-2xl" />
        </button>
        <h2 className="text-xl font-semibold mx-auto">Event details</h2>
        <div className="w-6" /> {/* Spacer to balance the back button */}
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl p-4 shadow-md">
        {/* Title */}
        <h3 className="text-lg font-semibold mb-1">SketchUp</h3>
        
        {/* Description */}
        <p className="text-gray-600 mb-4">
          Two day Graphic designing workshop provided by experienced designers.
        </p>

        {/* Date, Time, Venue */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-500 text-sm">
            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
            09 Jan 2024
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <FontAwesomeIcon icon={faClock} className="mr-2" />
            10 am - 4 pm
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
            Seminar Hall
          </div>
        </div>

        {/* Poster */}
        <div className="rounded-lg overflow-hidden mb-6">
          <img src={sketchUpPoster} alt="SketchUp Poster" className="w-full object-cover" />
        </div>

        {/* Register Button */}
        <button className="w-full bg-green-600 text-white py-3 rounded-lg text-center text-md font-semibold">
          Register now
        </button>
      </div>
    </div>
  );
};

export default Register;
