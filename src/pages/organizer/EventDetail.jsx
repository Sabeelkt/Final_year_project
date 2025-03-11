import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react";
import EventImage from '../../asset/studentpage/TinkHerHack.svg'


export default function EventDetails() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center mb-4">
          <button onClick={() => navigate(-1)} className="mr-2">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold">Event details</h1>
        </div>

        {/* Event Title & Description */}
        <h2 className="text-xl font-semibold">Connect Bootcamp</h2>
        <p className="text-gray-600 text-sm mb-4">
          A Bootcamp event organized for new Connect interns.
        </p>

        {/* Event Info (Date, Time, Venue) */}
        <div className="flex items-center gap-4 text-gray-600 text-sm mb-4">
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>28 Nov 2024</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>9 am</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={16} />
            <span>Seminar Hall</span>
          </div>
        </div>

        {/* Event Image */}
        <img
          src={EventImage} // Replace with actual image URL
          alt="Bootcamp Event"
          className="w-full rounded-lg mb-4"
        />

        {/* View Report Button */}
        <button
          onClick={() => navigate("/organizer/event/report")}
          className="w-full bg-green-600 text-white py-2 rounded-md text-center"
        >
          View Report
        </button>
      </div>
    </div>
  );
}



