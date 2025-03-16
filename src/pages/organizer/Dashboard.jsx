import { useEffect, useState } from "react";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db, auth } from "@/config/firebase";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { FiSearch, FiPlus } from "react-icons/fi";
import { Pencil, Trash2 } from "lucide-react";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "events"));
      const eventsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventsList);
      console.log(eventsList)
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        setIsDeleting(true);
        await deleteDoc(doc(db, "events", eventId));
        // Refresh the events list after deletion
        await fetchEvents();
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Failed to delete event. Please try again.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-green-600">Mark It</h1>
        <button onClick={handleSignOut} className="bg-red-600 text-white px-4 py-1 rounded-md shadow cursor-pointer hover:bg-red-400">
          Sign Out
        </button>
      </header>

      {/* Search Bar */}
      <div className="flex items-center bg-white p-2 rounded-lg shadow-md">
        <FiSearch className="text-gray-400 ml-2" />
        <input type="text" placeholder="Search events..." className="flex-grow p-2 outline-none" />
        <button className="bg-green-500 text-white p-2 rounded-lg ml-2" onClick={() => navigate("/organizer/create-event")}>
          <FiPlus />
        </button>
      </div>

      {/* Event List */}
      <div className="mt-4 grid gap-4">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="bg-green-50 p-4 rounded-lg shadow-md flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  {event.posterURL ? (
                    <img 
                      src={event.posterURL} 
                      alt={`${event.title} poster`} 
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-semibold">{event.name}</h2>
                    <p className="text-gray-600 text-sm">Start Date: {event.startdate}</p>
                    <p className="text-gray-600 text-sm">End Date: {event.enddate}</p>
                    <p className="text-gray-600 text-sm">Participant Limit: {event.participantLimit} </p>
                    <p className="text-gray-600 text-sm">Venue: {event.venue} </p>
                  </div>
                </div>
                <button 
                  className="bg-white text-green-600 border border-green-600 px-3 py-1 text-sm rounded-md shadow-sm hover:bg-green-100"
                  onClick={() => navigate(`/organizer/events/${event.id}`)}
                >
                  View details
                </button>
              </div>
              <p className="text-gray-700 text-sm font-semibold">{event.description}</p>
              <div className="flex justify-end gap-2">
                <button 
                  className="text-red-600 hover:text-red-800" 
                  onClick={() => handleDeleteEvent(event.id)}
                  disabled={isDeleting}
                >
                  <Trash2 size={20} />
                </button>
                <button 
                  className="text-green-600 hover:text-green-800" 
                  onClick={() => navigate(`/organizer/edit-event/${event.id}`)}
                >
                  <Pencil size={20} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No events found.</p>
        )}
      </div>
    </div>
  );
};

export default EventList;