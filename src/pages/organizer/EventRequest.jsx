import React, { useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EventRequest = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    clubName: "",
    role: "",
    phoneNumber: "",
    photo: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, photo: e.target.files[0] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.clubName || !formData.role || !formData.phoneNumber) {
      alert("Please fill in all required fields");
      return;
    }

    console.log("Form submitted:", formData);
    alert("Your event request has been submitted");

    setFormData({
      clubName: "",
      role: "",
      phoneNumber: "",
      photo: null,
    });

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6 px-4 max-w-md mx-auto">
      <div className="w-full bg-white rounded-xl shadow-sm p-6 max-w-md">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <button onClick={() => navigate("/")} className="mr-auto text-gray-600" aria-label="Go back">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-medium text-center flex-grow">Event Request</h1>
          <div className="w-5"></div> {/* Spacer for centering */}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="clubName" className="block text-sm font-medium text-gray-700">
              Name of Club / Department
            </label>
            <input
              id="clubName"
              name="clubName"
              value={formData.clubName}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring focus:ring-green-300"
              placeholder="Connect"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <input
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring focus:ring-green-300"
              placeholder="Liaison (PT)"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring focus:ring-green-300"
              placeholder="(123) 456-7890"
              type="tel"
            />
          </div>

          {/* Upload Photo */}
          <div className="pt-2">
            <label htmlFor="photo-upload" className="flex items-center gap-2 cursor-pointer w-fit">
              <div className="p-2 rounded-full bg-gray-100">
                <Upload size={18} className="text-gray-600" />
              </div>
              <span className="text-sm font-medium">Upload Photo</span>
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {formData.photo && (
              <p className="text-xs text-gray-500 mt-1">Selected: {formData.photo.name}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventRequest;
