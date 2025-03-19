import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Upload } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { db } from "@/config/firebase";
import { collection, addDoc , Timestamp  } from "firebase/firestore";
import { Cloudinary } from "@cloudinary/url-gen";

export default function CreateEvent() {
  const navigate = useNavigate();
  const cld = new Cloudinary({ cloud: { cloudName: "dzcblmi0u" } });
  const [loading, setLoading] = useState(false);
  const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;
  const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;

  const [eventData, setEventData] = useState({
    name: "",
    team_name: "",
    startdate: null,
    starttime: null,
    enddate: null,
    endtime: null,
    venue: "",
    description: "",
    participantLimit: "",
    isGroup: false,
    poster: null,
  });

  const [imageUrl, setImageUrl] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEventData({ ...eventData, poster: file });
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return null;
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", 'markit');
  
    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dzcblmi0u/image/upload', {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Cloudinary Response:", data);
  
      return data.secure_url || null; // Ensure a valid return value
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageUrl = await handleImageUpload(eventData.poster);

      if (!imageUrl) {
        alert("Failed to upload image. Please try again.");
        setLoading(false);
        return;
      }

       // Convert Date & Time to String Format (YYYY-MM-DD and HH:mm)
    const formatDate = (date) => date ? date.toISOString().split("T")[0] : "";
    const formatTime = (time) => time ? time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }) : "";

    // Storing date and time as strings
    const startDateString = formatDate(eventData.startdate);
    const startTimeString = formatTime(eventData.starttime);
    const endDateString = formatDate(eventData.enddate);
    const endTimeString = formatTime(eventData.endtime);

      const docRef = await addDoc(collection(db, "events"), {
        name: eventData.name,
        team_name: eventData.team_name,
        startdate: startDateString,
        starttime: startTimeString,
        enddate: endDateString,
        endtime: endTimeString,
        isGroup: eventData.isGroup,
        venue: eventData.venue,
        description: eventData.description,
        participantLimit: eventData.participantLimit,
        posterURL: imageUrl,
      });

      console.log("Event Created with ID:", docRef.id);

      alert("Event Created Successfully!");
      navigate("/organizer");
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Failed to create event.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-center text-xl font-semibold mb-4">Create Event</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Event Name */}
          <label className="block text-sm font-medium text-gray-700">
            Event Name
          </label>
          <input
            type="text"
            placeholder="Enter event name"
            value={eventData.name}
            onChange={(e) =>
              setEventData({ ...eventData, name: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />

            {/* Event Name */}
            <label className="block text-sm font-medium text-gray-700">
            Team Name
          </label>
          <input
            type="text"
            placeholder="Enter Club/department name"
            value={eventData.team_name}
            onChange={(e) =>
              setEventData({ ...eventData, team_name: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />

          {/*start Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Date Picker */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <DatePicker
                selected={eventData.startdate}
                onChange={(date) =>
                  setEventData({ ...eventData, startdate: date })
                } // Corrected
                className="w-full px-10 py-2 border border-gray-300 rounded-md"
                placeholderText="Select date"
                dateFormat="dd/MM/yyyy"
                popperPlacement="bottom-start"
              />

              <Calendar
                className="absolute left-3 top-8 text-gray-500"
                size={20}
              />
            </div>

            {/* Time Picker */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                Start Time
              </label>
              <DatePicker
                selected={eventData.starttime}
                onChange={(time) =>
                  setEventData({ ...eventData, starttime: time })
                } // Corrected
                className="w-full px-10 py-2 border border-gray-300 rounded-md"
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="hh:mm aa"
                placeholderText="Select time"
                popperPlacement="bottom-start"
              />
              <Clock
                className="absolute left-3 top-8 text-gray-500"
                size={20}
              />
            </div>
          </div>

          {/*end Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Date Picker */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <DatePicker
                selected={eventData.enddate}
                onChange={(date) =>
                  setEventData({ ...eventData, enddate: date })
                } // Corrected
                className="w-full px-10 py-2 border border-gray-300 rounded-md"
                placeholderText="Select date"
                dateFormat="dd/MM/yyyy"
                popperPlacement="bottom-start"
              />

              <Calendar
                className="absolute left-3 top-8 text-gray-500"
                size={20}
              />
            </div>

            {/* Time Picker */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                End Time
              </label>
              <DatePicker
                selected={eventData.endtime}
                onChange={(time) =>
                  setEventData({ ...eventData, endtime: time })
                } // Corrected
                className="w-full px-10 py-2 border border-gray-300 rounded-md"
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="hh:mm aa"
                placeholderText="Select time"
                popperPlacement="bottom-start"
              />

              <Clock
                className="absolute left-3 top-8 text-gray-500"
                size={20}
              />
            </div>
          </div>

          {/* Venue */}
          <label className="block text-sm font-medium text-gray-700">
            Venue
          </label>
          <input
            type="text"
            placeholder="Enter venue"
            value={eventData.venue}
            onChange={(e) =>
              setEventData({ ...eventData, venue: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />

          {/* Description */}
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            placeholder="Enter event description"
            value={eventData.description}
            onChange={(e) =>
              setEventData({ ...eventData, description: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows="3"
            required
          />

          {/* Participant Limit */}
          <label className="block text-sm font-medium text-gray-700">
            Participant Limit
          </label>
          <input
            type="number"
            placeholder="Max Participants"
            value={eventData.participantLimit}
            onChange={(e) =>
              setEventData({ ...eventData, participantLimit: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />

          {/* Group Event Checkbox */}
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={eventData.isGroup}
              onChange={(e) =>
                setEventData({ ...eventData, isGroup: e.target.checked })
              }
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">
              Is this a group event?
            </span>
          </label>

          {/* File Upload */}
          <label className="block text-sm font-medium text-gray-700">
            Event Poster
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="fileUpload"
            />
            <label htmlFor="fileUpload" className="block cursor-pointer">
              <Upload className="mx-auto text-gray-400 mb-2" size={24} />
              <p className="text-sm text-gray-600">Upload Event Poster</p>
            </label>

            {/* Image Preview */}
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Event Poster Preview"
                className="mt-3 mx-auto rounded-md max-h-40"
              />
            )}
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
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
