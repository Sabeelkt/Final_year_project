import React from "react";
import { FiSearch, FiPlus } from "react-icons/fi";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

const events = [
  {
    title: "Connect Bootcamp",
    date: "23 Nov 2024",
    description: "A bootcamp series organized for new Connect interns.",
  },
  {
    title: "Treasure Hunt",
    date: "26 Dec 2024",
    description: "Elegant treasure hunt organized by XYZ Club.",
  },
  {
    title: "TH!NK-HER-HACK 3.0",
    date: "10 Jan 2025",
    description: "A girls-only hackathon event powered by TechLadies.",
  },
  {
    title: "Hack the Idea",
    date: "15 Feb 2025",
    description: "Learn, plan, and kick-start a creative workshop on thinking.",
  },
];

const EventList = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-green-600">Mark It</h1>
      </header>

      {/* Search Bar */}
      <div className="flex items-center bg-white p-2 rounded-lg shadow-md">
        <FiSearch className="text-gray-400 ml-2" />
        <input
          type="text"
          placeholder="Search events..."
          className="flex-grow p-2 outline-none"
        />
        <button
          className="bg-green-500 text-white p-2 rounded-lg ml-2"
          onClick={() => navigate("/organizer/create-event")}
        >
          <FiPlus />
        </button>
      </div>

      {/* Event List */}
      <div className="mt-4 grid gap-4">
        {events.map((event, index) => (
          <div
            key={index}
            className="bg-green-50 p-4 rounded-lg shadow-md flex flex-col gap-2"
          >
            {/* Event Title & Date */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">{event.title}</h2>
                <p className="text-gray-600 text-sm">Date: {event.date}</p>
              </div>
              <button
                className="bg-white text-green-600 border border-green-600 px-3 py-1 text-sm rounded-md shadow-sm hover:bg-green-100"
                onClick={() => navigate(`/organizer/events/${index}`)}
              >
                View details
              </button>
            </div>

            {/* Event Description */}
            <p className="text-gray-700 text-sm">{event.description}</p>

            {/* Edit Icon */}
            <div className="flex justify-end">
              <button
                className="text-green-600 hover:text-green-800"
                onClick={() => navigate(`/organizer/edit-event/${index}`)}
              >
                <Pencil size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;
