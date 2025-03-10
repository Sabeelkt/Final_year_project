import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCalendarAlt, faClock, faMapMarkerAlt, faCheckDouble, faStar } from "@fortawesome/free-solid-svg-icons";
import eventPoster from '../../asset/studentpage/photo_2025-03-03_21-11-09.svg'; // Adjust path as needed
import { useNavigate } from 'react-router-dom';

const PreviousEvent = () => {
  const navigate = useNavigate();
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState('');

  // Handle star rating
  const handleRating = (rate) => setRating(rate);

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Rating:', rating);
    console.log('Feedback:', feedback);
    // Handle submission logic here (API call, etc.)
    setShowFeedback(false); // Close modal after submission
  };

  return (
    <div className="min-h-screen bg-white p-4 flex flex-col relative">
      
      {/* Header */}
      <div className="flex items-center mb-6">
        <button onClick={() => navigate('/student/*')} className="text-black">
          <FontAwesomeIcon icon={faArrowLeft} className="text-2xl" />
        </button>
        <h2 className="text-xl font-semibold mx-auto">Previous event</h2>
        <div className="w-6" />
      </div>

      {/* Event Title and Description */}
      <h3 className="text-lg font-bold mb-2">Tink-Her-Hack 3.0</h3>
      <p className="text-gray-500 mb-4 text-sm">
        Overnight hackathon for girls presented by Tinkerhub and Connect.
      </p>

      {/* Event Details */}
      <div className="flex space-x-4 items-center text-gray-500 text-sm mb-4">
        <div className="flex items-center">
          <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
          <span>22 Jan 2024</span>
        </div>
        <div className="flex items-center">
          <FontAwesomeIcon icon={faClock} className="mr-1" />
          <span>3 pm - 11 am</span>
        </div>
        <div className="flex items-center">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
          <span>IEDC Room</span>
        </div>
      </div>

      {/* Event Poster */}
      <div className="rounded-xl overflow-hidden mb-8">
        <img src={eventPoster} alt="Event Poster" className="w-full object-cover" />
      </div>

      {/* Attendance Marked */}
      <div className="text-center mb-4">
        <p className="text-green-600 font-semibold text-lg flex justify-center items-center">
          Attendence marked
          <FontAwesomeIcon icon={faCheckDouble} className="ml-2" />
        </p>
      </div>

      {/* Add Feedback */}
      <button
        onClick={() => setShowFeedback(true)}
        className="text-black font-medium underline"
      >
        Add Feedback
      </button>

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-md relative shadow-lg">
            
            {/* Modal Header */}
            <div className="flex items-center mb-4">
              <button
                onClick={() => setShowFeedback(false)}
                className="text-black absolute left-4"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
              </button>
              <h2 className="text-center w-full text-lg font-semibold">Feedback</h2>
            </div>

            {/* Modal Content */}
            <p className="text-center text-gray-600 mb-4">We value your feedback! Rate and review the event.</p>

            {/* Star Rating */}
            <div className="flex justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesomeIcon
                  key={star}
                  icon={faStar}
                  onClick={() => handleRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className={`cursor-pointer text-3xl mx-1 ${
                    (hover || rating) >= star ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Feedback Textarea */}
            <textarea
              className="w-full p-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
              rows="4"
              placeholder="Share your experience..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            ></textarea>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviousEvent;
