import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCalendarAlt, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import profile from '../../asset/studentpage/female avatar.svg';
import program from '../../asset/studentpage/TinkHerHack.svg';
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate


const App = () => {
  const [showIdCard, setShowIdCard] = useState(false); // Modal State

  return (
    <div className="bg-gray-100 min-h-screen p-4 relative">
      {/* Profile Section */}
      <div
        className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md cursor-pointer"
        onClick={() => setShowIdCard(true)} // Show modal on click
      >
        <div className="flex items-center">
          <img src={profile} alt="Profile" className="w-12 h-12 rounded-full mr-3" />
          <div>
            <h2 className="text-lg font-semibold">Fatima</h2>
            <p className="text-sm text-gray-500">24BCSA663</p>
          </div>
        </div>
        <FontAwesomeIcon icon={faBell} className="text-gray-500 text-xl" />
      </div>

      {/* ID Card Modal */}
      {showIdCard && <IdCardModal onClose={() => setShowIdCard(false)} />}

      {/* Search Bar */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Search events..."
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Upcoming Events */}
      <h3 className="mt-6 text-xl font-semibold">Upcoming events</h3>
      <Swiper
        slidesPerView={1}
        spaceBetween={20}
        loop={true}
        autoplay={{ delay: 3000 }}
        pagination={{
          clickable: true,
          el: '.custom-pagination',
        }}
        modules={[Pagination, Autoplay]}
        className="mt-4"
      >
        <SwiperSlide>
          <EventCard title="GigXplore" description="Free Freelance workshop." date="18-02-25" location="Seminar Hall" />
        </SwiperSlide>
        <SwiperSlide>
          <EventCard title="Tink-Her-Hack" description="Overnight Hackathon for girls." date="22-02-25" location="IEDC Room" />
        </SwiperSlide>
        <SwiperSlide>
          <EventCard title="Bootcamp" description="New Connect Bootcamp." date="03-02-25" location="IEDC" />
        </SwiperSlide>
      </Swiper>

      {/* Pagination Dots */}
      <div className="custom-pagination mt-4 flex justify-center" />

      {/* Recent Events */}
      <h3 className="mt-6 text-xl font-semibold">Recent events</h3>
      <div className="space-y-4 mt-4">
        <RecentEventCard
          image={program}
          title="Connect Bootcamp"
          description="Bootcamp arranged for new Connect Interns."
          date="22-01-25"
          location="Seminar Hall"
        />
        <RecentEventCard
          image={program}
          title="Tink-Her-Hack 3.0"
          description="Full day hackathon only for girls."
          date="13-02-25"
          location="IEDC Room"
        />
        <RecentEventCard
          image={program}
          title="SketchUp"
          description="Two day Graphic designing workshop."
          date="22-01-25"
          location="Seminar Hall"
        />
      </div>
    </div>
  );
};

// ✅ Event Card Componentconst EventCard = ({ title, description, date, location }) => {
const EventCard = ({ title, description, date, location }) => {
  const navigate = useNavigate(); // ✅ Initialize navigate here directly
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md min-w-[220px]">
      <h4 className="font-semibold">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
      <div className="flex items-center text-sm text-gray-500 mt-2">
        <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
        {date}
      </div>
      <div className="flex items-center text-sm text-gray-500 mt-1">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
          {location}
      </div>
      <button
        onClick={() => navigate('/student/register')} // ✅ This will now work properly
        className="mt-3 w-full bg-green-500 text-white p-2 rounded-lg"
      >
        Register
      </button>
    </div>
  );
};
  


// ✅ Recent Event Card Component
const RecentEventCard = ({ image, title, description, date, location }) => {
  const navigate = useNavigate(); // ✅ Add this line inside the component

  return (
    <div
      className="flex items-center bg-white p-4 rounded-lg shadow-md cursor-pointer"
      onClick={() => navigate('/student/previous-event')} // ✅ Now works properly
    >
      <img src={image} alt={title} className="w-16 h-16 rounded-lg mr-4" />
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
        <div className="flex items-center text-sm text-gray-500 mt-2">
          <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
          {date}
        </div>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
          {location}
        </div>
      </div>
    </div>
  );
};

// ✅ ID Card Modal Component
const IdCardModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-80 shadow-lg relative transform transition-all duration-300 scale-100">
      <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-black">✕</button>
      <div className="text-center">
        <h3 className="font-semibold mb-2">EMEA COLLEGE OF ARTS & SCIENCE</h3>
        <img src={profile} alt="Profile" className="w-20 h-20 rounded-full mx-auto my-4" />
        <h4 className="font-bold">Fatima</h4>
        <p className="text-sm text-gray-600 mb-4">ftfatima@gmail.com</p>
        <div className="text-left space-y-1 text-sm mb-4">
          <p><strong>Admission No</strong>: 24BCSA663</p>
          <p><strong>Current Sem</strong>: 2</p>
          <p><strong>Batch</strong>: 2024-27</p>
          <p><strong>Department</strong>: Computer Science</p>
        </div>
        <div className="flex justify-center">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=24BCSA663" alt="QR Code" />
        </div>
      </div>
    </div>
  </div>
);

export default App;
