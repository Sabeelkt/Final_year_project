import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCalendarAlt, faClock, faMapMarkerAlt, faCheckDouble, faStar, faUsers } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import { useAuth } from '../../context/AuthContext';

const PreviousEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasAttended, setHasAttended] = useState(false);

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const eventDoc = await getDoc(doc(db, 'events', id));
        
        if (eventDoc.exists()) {
          const eventData = eventDoc.data();
          setEvent(eventData);
          
          // Check if user has attended this event
          if (user && eventData.registeredStudents && eventData.registeredStudents.includes(user.uid)) {
            setHasAttended(true);
          }
        } else {
          setError('Event not found');
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id, user]);

  // Handle star rating
  const handleRating = (rate) => setRating(rate);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || !id) return;
    
    try {
      // Create feedback object
      const feedbackObj = {
        userId: user.uid,
        rating: rating,
        comment: feedback,
        timestamp: new Date().toISOString()
      };
      
      // Update event document with the feedback
      const eventRef = doc(db, 'events', id);
      await updateDoc(eventRef, {
        feedback: arrayUnion(feedbackObj)
      });
      
      console.log('Feedback submitted successfully');
      setShowFeedback(false);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      alert('Failed to submit feedback. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Loading event details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Event not found</p>
      </div>
    );
  }

  // Format dates for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-white p-4 flex flex-col relative">
      
      {/* Header */}
      <div className="flex items-center mb-6">
        <button onClick={() => navigate('/student')} className="text-black">
          <FontAwesomeIcon icon={faArrowLeft} className="text-2xl" />
        </button>
        <h2 className="text-xl font-semibold mx-auto">Event Details</h2>
        <div className="w-6" />
      </div>

      {/* Event Title and Description */}
      <h3 className="text-lg font-bold mb-2">{event.name}</h3>
      <p className="text-gray-500 mb-4 text-sm">
        {event.description}
      </p>

      {/* Event Details */}
      <div className="flex flex-wrap gap-4 items-center justify-center text-gray-500 text-sm mb-4 mx-auto w-full">
        <div className="flex items-center">
          <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
          <span>{formatDate(event.startdate)} - {formatDate(event.enddate)}</span>
        </div>
        <div className="flex items-center">
          <FontAwesomeIcon icon={faClock} className="mr-1" />
          <span>{event.starttime} - {event.endtime}</span>
        </div>
        <div className="flex items-center">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
          <span>{event.venue}</span>
        </div>
        <div className="flex items-center">
          <FontAwesomeIcon icon={faUsers} className="mr-1" />
          <span>Limit: {event.participantLimit}</span>
        </div>
      </div>

      {/* Team Name */}
      <p className="text-gray-500 mb-4 text-sm w-full text-center">
        <strong>Organized by:</strong> {event.team_name}
      </p>

      {/* Event Poster */}
      {event.posterURL && (
        <div className="rounded-xl overflow-hidden mb-8 w-full flex items-center justify-center">
          <img 
            src={event.posterURL} 
            alt={`${event.name} Poster`} 
            className="w-full max-w-[300px] "
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
            }}
          />
        </div>
      )}

      {/* Attendance Marked */}
      {hasAttended ? (
        <div className="text-center mb-4">
          <p className="text-green-600 font-semibold text-lg flex justify-center items-center">
            Attendance marked
            <FontAwesomeIcon icon={faCheckDouble} className="ml-2" />
          </p>
        </div>
      ):(
        <div className="text-center mb-4">
        <p className="text-red-600 font-semibold text-lg flex justify-center items-center">
          Attendance not marked
          <FontAwesomeIcon icon={faCheckDouble} className="ml-2" />
        </p>
      </div>
      )}

      {/* Add Feedback Button - only show if user has attended */}
      {/* {hasAttended && (
        <button
          onClick={() => setShowFeedback(true)}
          className="text-black font-medium underline"
        >
          Add Feedback
        </button>
      )} */}

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
              disabled={rating === 0}
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