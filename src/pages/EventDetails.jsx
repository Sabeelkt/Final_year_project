import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, Star } from 'lucide-react';

// Optional: You can define EventCard properly or remove it if not used
const EventCard = ({ title, description, date, location }) => {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(`/event/${title}`)} className="p-4 border rounded cursor-pointer">
      <h3 className="font-bold">{title}</h3>
      <p>{description}</p>
      <p>{date}</p>
      <p>{location}</p>
    </div>
  );
};

function EventDetails() {
  const { id } = useParams();
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);

  // Mock event data
  const event = {
    title: 'SketchUp',
    description: 'Two day Graphic designing workshop provided by experienced designers',
    date: '28 Jan 2024',
    time: '9:00 AM - 4:00 PM',
    venue: 'Seminar Hall',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800&h=400',
    organizer: {
      name: 'EMEA College of Arts and Science',
      logo: 'https://ui-avatars.com/api/?name=EMEA&background=0D8ABC&color=fff'
    },
    attendanceMarked: true
  };

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    console.log({ rating, feedback });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-4">
        <Link to="/" className="inline-flex items-center text-gray-600 mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Link>

        <img
          src={event.image}
          alt={event.title}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />

        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
              <p className="text-gray-600">{event.description}</p>
            </div>
            <img
              src={event.organizer.logo}
              alt={event.organizer.name}
              className="w-12 h-12 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-5 h-5" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-5 h-5" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-5 h-5" />
              <span>{event.venue}</span>
            </div>
          </div>

          {event.attendanceMarked ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 font-medium">Attendance has been marked!</p>
            </div>
          ) : (
            <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors mb-6">
              Mark Attendance
            </button>
          )}

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Event Feedback</h2>
            <form onSubmit={handleSubmitFeedback}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rate your experience
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-1 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Share your thoughts
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Write your feedback here..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Submit Feedback
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
