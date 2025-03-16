import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCalendarAlt,
  faMapMarkerAlt,
  faHome,
  faHistory,
  faUser,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import profile from "../../asset/studentpage/female avatar.svg";
import program from "../../asset/studentpage/TinkHerHack.svg";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../../config/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { format } from "date-fns";

// Main Layout component that will contain the Outlet
const Layout = () => {
  return (
    <div className="bg-gray-100 min-h-screen relative max-w-[1400px] mx-auto">
      <div className="flex flex-col h-screen">
        {/* Main content with Outlet */}
        <div className="flex-1 overflow-auto pb-16">
          <Outlet />
        </div>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-md py-2 px-4 max-w-[1400px] mx-auto">
          <div className="flex justify-around items-center">
            <NavItem icon={faHome} text="Home" to="/student/home" />
            <NavItem icon={faHistory} text="Events" to="/student/events" />
            <NavItem icon={faUser} text="Profile" to="/student/profile" />
          </div>
        </nav>
      </div>
    </div>
  );
};

// Navigation Item Component
const NavItem = ({ icon, text, to }) => (
  <Link
    to={to}
    className="flex flex-col items-center text-gray-600 hover:text-green-500"
  >
    <FontAwesomeIcon icon={icon} className="text-xl" />
    <span className="text-xs mt-1">{text}</span>
  </Link>
);

// HomePage Component (Main Dashboard)
const HomePage = () => {
  const [showIdCard, setShowIdCard] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const user = useAuth();

  const todayStr = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          console.log(user);
          // ✅ Fetch user data
          const userRef = doc(db, "users", user.user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserData(userSnap.data());
            console.log("User Data:", userSnap.data());
          } else {
            console.log("No user document found");
          }

          // ✅ Fetch upcoming events (date > today)
          const eventsRef = collection(db, "events");
          const upcomingQuery = query(
            eventsRef,
            where("startdate", ">", todayStr)
          );
          const upcomingSnap = await getDocs(upcomingQuery);
          setUpcomingEvents(
            upcomingSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          );

          console.log(
            "Upcoming Events:",
            upcomingSnap.docs.map((doc) => doc.data())
          );

          // ✅ Fetch recent events (date <= today && within last 5 days)
          const pastDateStr = format(
            new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            "yyyy-MM-dd"
          );
          const recentQuery = query(
            eventsRef,
            where("startdate", "<=", todayStr),
            where("startdate", ">=", pastDateStr)
          );
          const recentSnap = await getDocs(recentQuery);
          setRecentEvents(
            recentSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          );

          console.log(
            "Recent Events:",
            recentSnap.docs.map((doc) => doc.data())
          );
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <p>Loading...</p>; // Show loading while fetching data
  }

  return (
    <div className="p-4">
      {/* Profile Section */}
      <div
        className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md cursor-pointer"
        onClick={() => setShowIdCard(true)}
      >
        <div className="flex items-center">
          <img
            src={profile}
            alt="Profile"
            className="w-12 h-12 rounded-full mr-3"
          />
          <div>
            <h2 className="text-lg font-semibold">{userData?.name}</h2>
            <p className="text-sm text-gray-500">{userData?.admissionNo}</p>
          </div>
        </div>
        <FontAwesomeIcon icon={faBell} className="text-gray-500 text-xl" />
      </div>

      {/* ID Card Modal */}
      {showIdCard && (
        <IdCardModal data={userData} onClose={() => setShowIdCard(false)} />
      )}

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
      {upcomingEvents.length > 0 ? (
        <Swiper
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 2, // Show 2 slides on small screens (≥640px)
            },
            768: {
              slidesPerView: 3, // Show 3 slides on medium screens (≥768px)
            },
            1024: {
              slidesPerView: 4, // Show 4 slides on large screens (≥1024px)
            },
          }}
          spaceBetween={20}
          loop={true}
          autoplay={{ delay: 3000 }}
          pagination={{
            clickable: true,
            el: ".custom-pagination",
          }}
          modules={[Pagination, Autoplay]}
          className="mt-4 flex"
        >
          {upcomingEvents.map((event) => (
            <SwiperSlide key={event.id}>
              <EventCard
                key={event.id} // Unique key for React lists
                image={event.posterURL} // You might want to use event.image if available
                title={event.title}
                team={event.team_name}
                description={event.description}
                startdate={event.startdate}
                enddate={event.enddate}
                venue={event.venue}
                isGroup={event.isGroup}
                eventID={event.id}
                userID={user.user.uid}
              />
              
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="mt-4 p-4 text-center text-gray-500 bg-gray-100 rounded-lg">
          No upcoming events at the moment. Stay tuned!
        </div>
      )}

      {/* Pagination Dots */}
      <div className="custom-pagination mt-4 flex justify-center" />

      {/* Recent Events */}
      <h3 className="mt-6 text-xl font-semibold">Recent events</h3>
      {recentEvents.length > 0 ? (
        <div className="space-y-4 mt-4 pb-6">
          {recentEvents.map((event) => (
            <RecentEventCard
              key={event.id} // Unique key for React lists
              image={event.posterURL} // You might want to use event.image if available
              title={event.title}
              team={event?.team_name}
              description={event.description}
              startdate={event.startdate}
              enddate={event.enddate}
              venue={event.venue}
            />
          ))}
        </div>
      ) : (
        <div className="mt-4 p-4 text-center text-gray-500 bg-gray-100 rounded-lg">
          No Recent events at the moment. Stay tuned!
        </div>
      )}
    </div>
  );
};

// Event Card Component
const EventCard = ({
  image,
  title,
  team,
  description,
  startdate,
  enddate,
  venue,
  isGroup,
  eventID,
  userID,
}) => {
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!userID) {
      alert("Please log in to register.");
      return;
    }

    try {
      // Reference to the event document
      const eventRef = doc(db, "events", eventID);
      // Reference to the user document
      const userRef = doc(db, "users", userID);

      // Update event document (add user ID to registeredStudents array)
      await updateDoc(eventRef, {
        registeredStudents: arrayUnion(userID),
      });

      // Update user document (add event ID to registeredEvents array)
      await updateDoc(userRef, {
        registeredEvents: arrayUnion(eventID),
      });

      alert("Successfully registered for the event!");
    } catch (error) {
      console.error("Error registering for event:", error);
      alert("Failed to register. Please try again.");
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg max-w-[360px] w-full  flex flex-col items-center justify-center mx-auto">
      <img
        src={image}
        alt={title}
        className="w-full h-full md:h-[200px] md:w-[200px] max-h-[300px] object-cover rounded-md"
      />
      <h3 className="text-lg font-semibold mt-2">{title}</h3>
      <h3 className="text-lg font-semibold mt-2">{team}</h3>
      <p className="text-sm text-gray-600">{description}</p>
      <p className="text-sm text-gray-500">
        <strong>
          📅 {startdate} - {enddate}
        </strong>
      </p>
      <p className="text-sm text-gray-500">
        <strong>📍 Venue:</strong> {venue}
      </p>

      <button
        onClick={() => handleRegister()}
        className="mt-3 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
      >
        Register Now
      </button>
    </div>
  );
};
const RegisteredEventCard = ({
  image,
  title,
  description,
  startdate,
  enddate,
  venue,
  isGroup,
  eventID,
  userID,
}) => {
  const navigate = useNavigate();


  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <img
        src={image}
        alt={title}
        className="w-full h-40 object-cover rounded-md"
      />
      <h3 className="text-lg font-semibold mt-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
      <p className="text-sm text-gray-500">
        <strong>
          📅 {startdate} - {enddate}
        </strong>
      </p>
      <p className="text-sm text-gray-500">
        <strong>📍 Venue:</strong> {venue}
      </p>

      <button
        disabled={true}
        className="mt-3 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
      >
        Registered
      </button>
    </div>
  );
};

RegisteredEventCard

// Recent Event Card Component
const RecentEventCard = ({
  image,
  title,
  team,
  description,
  startdate,
  enddate,
  venue,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center bg-white p-4 rounded-lg shadow-md cursor-pointer"
      onClick={() => navigate("/student/previous-event")}
    >
      <img src={image} alt={title} className="w-16 h-16 rounded-lg mr-4" />
      <div>
        <h4 className="font-semibold">{title}</h4>
        <h4 className="font-semibold">{team}</h4>
        <p className="text-sm text-gray-600">{description}</p>
        <div className="flex items-center text-sm text-gray-500 mt-2">
          <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
          {startdate} to {enddate}
        </div>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
          {venue}
        </div>
      </div>
    </div>
  );
};

// ID Card Modal Component
const IdCardModal = ({ data, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-80 shadow-lg relative transform transition-all duration-300 scale-100">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-600 hover:text-black"
      >
        ✕
      </button>
      <div className="text-center">
        <h3 className="font-semibold mb-2">EMEA COLLEGE OF ARTS & SCIENCE</h3>
        <img
          src={profile}
          alt="Profile"
          className="w-20 h-20 rounded-full mx-auto my-4"
        />
        <h4 className="font-bold">{data.name}</h4>
        <p className="text-sm text-gray-600 mb-4">{data.email}</p>
        <div className="text-left space-y-1 text-sm mb-4">
          <p>
            <strong>Admission No</strong>: {data.admissionNo}
          </p>
          <p>
            <strong>Roll No</strong>: {data.rollNo}
          </p>
          <p>
            <strong>joinedYear</strong>: {data.joinedYear}
          </p>
          <p>
            <strong>Department</strong>: {data.department}
          </p>
        </div>
        <div className="flex justify-center">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data.admissionNo}`}
            alt="QR Code"
            className="rounded-lg shadow-md"
          />
        </div>
      </div>
    </div>
  </div>
);

// Event Registration Page
const RegisterPage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Event Registration</h2>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="font-semibold mb-2">Tink-Her-Hack</h3>
        <p className="text-sm text-gray-600 mb-4">
          Overnight Hackathon for girls.
        </p>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Team Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Enter your team name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Team Size</label>
            <select className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none">
              <option>2 Members</option>
              <option>3 Members</option>
              <option>4 Members</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Team Members
            </label>
            <textarea
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Enter team member names and admission numbers"
              rows="3"
            ></textarea>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Previous Event Details Page
const PreviousEventPage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Event Details</h2>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <img
          src={program}
          alt="Event"
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        <h3 className="font-semibold text-lg">Tink-Her-Hack 3.0</h3>
        <p className="text-sm text-gray-600 mb-4">
          Full day hackathon only for girls.
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm">
            <FontAwesomeIcon
              icon={faCalendarAlt}
              className="mr-2 text-gray-500"
            />
            <span>13-02-25</span>
          </div>
          <div className="flex items-center text-sm">
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              className="mr-2 text-gray-500"
            />
            <span>IEDC Room</span>
          </div>
        </div>

        <h4 className="font-medium mb-2">Event Highlights</h4>
        <ul className="list-disc list-inside text-sm text-gray-700 mb-4">
          <li>Full day hackathon exclusively for women in tech</li>
          <li>Participation from 20+ colleges</li>
          <li>Cash prizes worth ₹25,000</li>
          <li>Mentoring sessions by industry experts</li>
        </ul>

        <h4 className="font-medium mb-2">Your Participation</h4>
        <div className="bg-green-100 p-3 rounded-lg mb-4">
          <p className="text-sm">Team: CodeQueens</p>
          <p className="text-sm">Position: Runner-up</p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="w-full bg-green-500 text-white p-2 rounded-lg"
        >
          Back to Events
        </button>
      </div>
    </div>
  );
};

// Profile Page
const ProfilePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [attendedEvents, setAttendedEvents] = useState([]);
  const user = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      try {
        const userRef = doc(db, "users", user.user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userInfo = userSnap.data();
          setUserData(userInfo);

          // ✅ Fetch attended events based on IDs
          if (userInfo.attendedEvents && userInfo.attendedEvents.length > 0) {
            const eventRefs = userInfo.attendedEvents.map((eventID) => doc(db, "events", eventID));
            const eventSnaps = await Promise.all(eventRefs.map(getDoc));
            const events = eventSnaps
              .filter((snap) => snap.exists())
              .map((snap) => ({ id: snap.id, ...snap.data() }));
            setAttendedEvents(events);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Profile</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-col items-center mb-4">
            <img src={profile} alt="Profile" className="w-24 h-24 rounded-full mb-2" />
            <h3 className="font-semibold text-lg">{userData.name}</h3>
            <p className="text-sm text-gray-600">{userData.admissionNo}</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500">Full Name</label>
              <p className="font-medium">{userData.name}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500">Email</label>
              <p className="font-medium">{userData.email}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500">Department</label>
              <p className="font-medium">{userData.department}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500">Batch</label>
              <p className="font-medium">{userData.joinedYear}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500">Roll No</label>
              <p className="font-medium">{userData.rollNo}</p>
            </div>
          </div>

          <button
            className="w-full py-2 bg-red-600 text-red-100 hover:bg-red-400 transition-all ease-in-out rounded-lg mt-4"
            onClick={handleSignOut}
          >
            Logout
          </button>

          {/* 🎯 Participation History */}
          <div className="mt-6">
            <h4 className="font-medium mb-2">Participation History</h4>
            <div className="space-y-2">
              {attendedEvents.length > 0 ? (
                attendedEvents.map((event) => (
                  <div key={event.id} className="bg-gray-100 p-2 rounded">
                    <p className="font-medium">{event.title}</p>
                    <p className="text-xs text-gray-600">
                      {new Date(event.startdate).toLocaleDateString()} • {event.participationType || "Participant"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No participation history found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


// Events List Page
const EventsPage = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [loading, setLoading] = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const user = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsRef = collection(db, "events");
        const snapshot = await getDocs(eventsRef);
        const allEvents = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
        const registeredEventIDs = new Set();
  
        const upcoming = [];
        const past = [];
        let registered = [];
  
        allEvents.forEach((event) => {
          if (user && event.registeredStudents?.includes(user.user.uid)) {
            registered.push(event);
            registeredEventIDs.add(event.id); // Track registered event IDs
          } else if (event.startdate >= today) {
            upcoming.push(event);
          } else {
            past.push(event);
          }
        });
  
        // ✅ Remove past events from registered
        registered = registered.filter((event) => event.startdate >= today);
  
        setUpcomingEvents(upcoming.filter((event) => !registeredEventIDs.has(event.id))); // ✅ Remove registered events from upcoming
        setPastEvents(past);
        setRegisteredEvents(registered);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
      setLoading(false);
    };
  
    fetchData();
  }, [user]);
  

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Events</h2>

      {/* Tab Selector */}
      <div className="flex border-b mb-4">
        {["upcoming", "registered", "past"].map((tab) => (
          <button
            key={tab}
            className={`py-2 px-4 font-medium ${
              activeTab === tab
                ? "border-b-2 border-green-500 text-green-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Events Display */}
      <div className="space-y-4 flex gap-6 items-center justify-start flex-wrap">
        {activeTab === "upcoming" &&
          (upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <EventCard
                key={event.id}
                image={event.posterURL}
                title={event.title}
                description={event.description}
                startdate={event.startdate}
                enddate={event.enddate}
                venue={event.venue}
                isGroup={event.isGroup}
                eventID={event.id}
                userID={user?.user?.uid}
              />
            ))
          ) : (
            <p className="text-gray-500">No upcoming events.</p>
          ))}

        {activeTab === "registered" &&
          (registeredEvents.length > 0 ? (
            registeredEvents.map((event) => (
              <RegisteredEventCard
                key={event.id}
                image={event.posterURL}
                title={event.title}
                description={event.description}
                startdate={event.startdate}
                enddate={event.enddate}
                venue={event.venue}
                isGroup={event.isGroup}
                eventID={event.id}
                userID={user?.user?.uid}
              />
            ))
          ) : (
            <p className="text-gray-500">No registered events.</p>
          ))}

        {activeTab === "past" &&
          (pastEvents.length > 0 ? (
            pastEvents.map((event) => (
              <RecentEventCard
                key={event.id}
                image={event.posterURL}
                title={event.title}
                team={event?.team_name}
                description={event.description}
                startdate={event.startdate}
                enddate={event.enddate}
                venue={event.venue}
                isGroup={event.isGroup}
                eventID={event.id}
                userID={user?.user?.uid}
              />
            ))
          ) : (
            <p className="text-gray-500">No past events.</p>
          ))}
      </div>
    </div>
  );
};

export default EventsPage;

export {
  Layout,
  HomePage,
  RegisterPage,
  PreviousEventPage,
  ProfilePage,
  EventsPage,
};
