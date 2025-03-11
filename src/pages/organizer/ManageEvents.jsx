import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Calendar, Users, MapPin } from 'lucide-react';

export default function ManageEvents() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [events] = useState([
    {
      id: '1',
      name: 'Tech Workshop 2024',
      date: '2024-03-15',
      time: '10:00 AM',
      venue: 'Main Auditorium',
      participants: 45,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa'
    },
    {
      id: '2',
      name: 'Web Development Seminar',
      date: '2024-03-20',
      time: '2:00 PM',
      venue: 'Conference Room A',
      participants: 30,
      status: 'upcoming',
      image: 'https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0'
    }
  ]);

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/organizer')}
              className="mr-4"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-semibold">Manage Events</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
            <button
              onClick={() => navigate('/organizer/create-event')}
              className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700"
            >
              Create Event
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <div
              key={event.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <img
                src={event.image}
                alt={event.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold">{event.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    event.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {event.status}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="mr-2" size={16} />
                    <span className="text-sm">{event.date} at {event.time}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="mr-2" size={16} />
                    <span className="text-sm">{event.venue}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="mr-2" size={16} />
                    <span className="text-sm">{event.participants} participants</span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => navigate(`/organizer/events/${event.id}`)}
                    className="text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => navigate(`/organizer/events/${event.id}/edit`)}
                    className="text-gray-600 hover:text-gray-700"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}