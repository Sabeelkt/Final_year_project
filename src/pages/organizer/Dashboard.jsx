import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "@/config/firebase";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { FiSearch, FiPlus } from "react-icons/fi";
import { Pencil } from "lucide-react";


  const EventList = () => {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchEvents = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, "events"));
          const eventsList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setEvents(eventsList);
        } catch (error) {
          console.error("Error fetching events:", error);
        }
      };
  
      fetchEvents();
    }, []);
  
    const handleSignOut = async () => {
      await signOut(auth);
      navigate('/login');
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
                <div>
                  <h2 className="text-lg font-semibold">{event.title}</h2>
                  <p className="text-gray-600 text-sm">Date: {event.date}</p>
                </div>
                <button className="bg-white text-green-600 border border-green-600 px-3 py-1 text-sm rounded-md shadow-sm hover:bg-green-100"
                  onClick={() => navigate(`/organizer/events/${event.id}`)}>
                  View details
                </button>
              </div>
              <p className="text-gray-700 text-sm">{event.description}</p>
              <div className="flex justify-end">
                <button className="text-green-600 hover:text-green-800" onClick={() => navigate(`/organizer/edit-event/${event.id}`)}>
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
