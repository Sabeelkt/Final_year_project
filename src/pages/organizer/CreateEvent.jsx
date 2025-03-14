import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Upload } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { db } from "@/config/firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "../../context/AuthContext";
export default function CreateEvent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [eventData, setEventData] = useState({
    name: "",
    date: null,
    time: null,
    venue: "",
    description: "",
    participantLimit: "",
    poster: null,
  });
  const user = useAuth()
  console.log(user)
  // Handle File Upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setEventData({ ...eventData, poster: file });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let posterURL = "now nthng";

      // Upload poster to Firebase Storage if selected
      // if (eventData.poster) {
      //   const posterRef = ref(storage, `eventPosters/${eventData.poster.name}`);
      //   await uploadBytes(posterRef, eventData.poster);
      //   posterURL = await getDownloadURL(posterRef);
      // }

      // Store event data in Firestore
      await addDoc(collection(db, "events"), {
        name: eventData.name,
        date: eventData.date?.toISOString() || null,
        time: eventData.time,
        venue: eventData.venue,
        description: eventData.description,
        participantLimit: eventData.participantLimit,
        posterURL: posterURL,
      });

      alert("Event Created Successfully!");
      navigate("/events");
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Failed to create event.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-center text-xl font-semibold mb-4">Create event</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Event Name */}
          <input
            type="text"
            placeholder="Event name"
            value={eventData.name}
            onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Date Picker */}
            <div className="relative">
              <DatePicker
                selected={eventData.date}
                onChange={(date) => setEventData({ ...eventData, date })}
                className="w-full px-10 py-2 border border-gray-300 rounded-md"
                placeholderText="Date"
                dateFormat="dd/MM/yyyy"
                popperPlacement="bottom-start"
              />
              <Calendar className="absolute left-3 top-2.5 text-gray-500" size={20} />
            </div>

            {/* Time Picker */}
            <div className="relative">
              <DatePicker
                selected={eventData.time}
                onChange={(time) => setEventData({ ...eventData, time })}
                className="w-full px-10 py-2 border border-gray-300 rounded-md"
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="hh:mm aa"
                placeholderText="Time"
                popperPlacement="bottom-start"
              />
              <Clock className="absolute left-3 top-2.5 text-gray-500" size={20} />
            </div>
          </div>

          {/* Venue */}
          <input
            type="text"
            placeholder="Venue"
            value={eventData.venue}
            onChange={(e) => setEventData({ ...eventData, venue: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />

          {/* Description */}
          <textarea
            placeholder="Description"
            value={eventData.description}
            onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows="3"
            required
          />

          {/* Participant Limit */}
          <input
            type="number"
            placeholder="Number of Participants (Limit)"
            value={eventData.participantLimit}
            onChange={(e) => setEventData({ ...eventData, participantLimit: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />

          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer relative">
            <input type="file" onChange={handleFileChange} className="hidden" id="fileUpload" />
            <label htmlFor="fileUpload" className="block cursor-pointer">
              <Upload className="mx-auto text-gray-400 mb-2" size={24} />
              <p className="text-sm text-gray-600">Upload Event Poster</p>
            </label>
            {eventData.poster && <p className="text-xs text-gray-500 mt-1">{eventData.poster.name}</p>}
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-4 py-2 border border-gray-400 rounded-md"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
