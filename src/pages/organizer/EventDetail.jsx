import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Search,
  Plus,
  QrCode,
} from "lucide-react";
import * as XLSX from "xlsx";
import QrScanner from "react-qr-scanner";

export default function EventDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("details");
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitloading,setSubmitloading] = useState(false);
  const [error, setError] = useState(null);
  const [admissionNo, setAdmissionNo] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  // States for Register and Reports tabs
  const [registeredStudents, setRegisteredStudents] = useState([]);
  const [attendedStudents, setAttendedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState(null);
  // New student form data
  const [newStudent, setNewStudent] = useState({
    name: "",
    admissionNo: "",
    rollNo: "",
    department: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const eventRef = doc(db, "events", id);
        const eventDoc = await getDoc(eventRef);

        if (eventDoc.exists()) {
          setEvent({ id: eventDoc.id, ...eventDoc.data() });

          // Fetch registered students after event data is loaded
          fetchRegisteredAndAttendedStudents(eventDoc.id);
        } else {
          setError("Event not found");
        }
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEventDetails();
    } else {
      setError("No event ID provided");
      setLoading(false);
    }
  }, [id]);

  const fetchRegisteredAndAttendedStudents = async (eventId) => {
    try {
      // Reference the specific event document
      const eventRef = doc(db, "events", eventId);
      const eventSnap = await getDoc(eventRef);

      if (eventSnap.exists()) {
        // Extract registered & attended students' IDs
        const registeredStudentIds = eventSnap.data()?.registeredStudents || [];
        const attendedStudentIds = eventSnap.data()?.attendedStudents || [];

        // Fetch student details using their IDs
        const fetchStudents = async (studentIds) => {
          const studentPromises = studentIds.map(async (id) => {
            const userRef = doc(db, "users", id);
            const userSnap = await getDoc(userRef);
            return userSnap.exists()
              ? { id: userSnap.id, ...userSnap.data() }
              : null;
          });

          return (await Promise.all(studentPromises)).filter(Boolean);
        };

        // Fetch both sets of students
        const [registeredStudentsList, attendedStudentsList] =
          await Promise.all([
            fetchStudents(registeredStudentIds),
            fetchStudents(attendedStudentIds),
          ]);

        // Update state
        setRegisteredStudents(registeredStudentsList);
        setAttendedStudents(attendedStudentsList);

        console.log("Registered Students:", registeredStudentsList);
        console.log("Attended Students:", attendedStudentsList);
      } else {
        console.log("Event not found.");
        setRegisteredStudents([]);
        setAttendedStudents([]);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      setRegisteredStudents([]);
      setAttendedStudents([]);
    }
  };

  const handleScan = (data) => {
    if (data) {
      setAdmissionNo(data.text); // Set admission number from QR code
      console.log("Scanned Admission No:", data);
      setIsScanning(false); // Stop scanning
    }
  };

  const handleError = (err) => {
    console.error("QR Scan Error:", err);
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setSubmitloading(true)
    try {
      if (admissionNo.trim() === "") return;

      // Find student in the registered students list using admission number
      const studentData = registeredStudents.find(
        (student) => student.admissionNo === admissionNo
      );

      if (!studentData) {
        alert("Student is not registered for this event.");
        return;
      }

      const studentId = studentData.id; // Extract student ID

      // Check if student is already marked as attended
      if (attendedStudents.some((student) => student.id === studentId)) {
        alert("Student already marked as attended!");
        return;
      }

      // Update Firestore: Add student ID to the event's attendedStudents list
      const eventRef = doc(db, "events", id);
      await updateDoc(eventRef, {
        attendedStudents: arrayUnion(studentId),
      });

      // Update Firestore: Add event ID to the student's attendedEvents list
      const userRef = doc(db, "users", studentId);
      await updateDoc(userRef, {
        attendedEvents: arrayUnion(id),
      });

      // Update local state to reflect UI changes
      setAttendedStudents([...attendedStudents, studentData]);

      alert("Student marked as attended successfully!");
      setAdmissionNo(""); // Clear input field
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding student:", error);
      alert("Failed to add student");
    } finally{
      setSubmitloading(false)
    }
  };

  const handleExport = () => {
    if (!attendedStudents) {
      alert("data is empty bro ");
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(attendedStudents);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Event Attendance");

    // Download the file
    XLSX.writeFile(workbook, `${event?.name}_Attendances.xlsx`);
  };

  // Filtered students based on search term
  const filteredStudents = registeredStudents?.filter(
    (student) =>
      student?.admissionNo.includes(searchTerm) ||
      student?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <p className="text-center">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <div className="flex items-center mb-4">
            <button onClick={() => navigate("/organizer")} className="mr-2">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg font-semibold">Error</h1>
          </div>
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-green-600 text-white py-2 rounded-md text-center mt-4"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex pt-10 justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center mb-4">
          <button onClick={() => navigate("/organizer")} className="mr-2">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold">Event Management</h1>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-4">
          <button
            className={`px-4 py-2 ${
              activeTab === "details"
                ? "border-b-2 border-green-600 text-green-600 font-medium"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "register"
                ? "border-b-2 border-green-600 text-green-600 font-medium"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("register")}
          >
            Register
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "reports"
                ? "border-b-2 border-green-600 text-green-600 font-medium"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("reports")}
          >
            Reports
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "details" && (
          <div>
            {/* Event Title & Description */}
            <h2 className="text-xl font-semibold">{event?.title}</h2>
            <p className="text-gray-600 text-sm mb-4">{event?.description}</p>

            {/* Event Info (Start & End Date, Time, Venue) */}
            <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm mb-4">
              {/* Start Date & Time */}
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>
                  {event?.startdate} ({event?.starttime})
                </span>
              </div>
              to
              {/* End Date & Time */}
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>
                  {event?.enddate} ({event?.endtime})
                </span>
              </div>
              {/* Venue */}
              <div className="flex items-center gap-1">
                <MapPin size={16} />
                <span>{event?.venue}</span>
              </div>
            </div>

            {/* Event Image */}
            {event?.posterURL ? (
              <img
                src={event.posterURL}
                alt={`${event.title} poster`}
                className="w-full rounded-lg mb-4 object-cover h-64"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-lg mb-4 flex items-center justify-center text-gray-400">
                No image available
              </div>
            )}
          </div>
        )}

        {activeTab === "register" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Registration List</h2>
            </div>

            {/* Search Input */}
            <div className="relative mb-4">
              <Search
                className="absolute left-3 top-2.5 text-gray-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none"
              />
            </div>

            {/* Students List */}
            <div className="border rounded-lg overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-green-600 text-white">
                  <tr>
                    <th className="py-2 px-4 text-left">No</th>
                    <th className="py-2 px-4 text-left">Name</th>
                    <th className="py-2 px-4 text-left">Admission No</th>
                    <th className="py-2 px-4 text-left">Roll No</th>
                    <th className="py-2 px-4 text-left">Department</th>
                  </tr>
                </thead>
                <tbody className="bg-green-50">
                  {filteredStudents?.length > 0 ? (
                    filteredStudents?.map((student, index) => (
                      <tr key={student.id} className="border-t text-gray-700">
                        <td className="py-2 px-4">{index + 1}</td>
                        <td className="py-2 px-4">{student.name}</td>
                        <td className="py-2 px-4">{student.admissionNo}</td>
                        <td className="py-2 px-4">{student.rollNo}</td>
                        <td className="py-2 px-4">{student.department}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-4 text-center text-gray-500"
                      >
                        No students registered
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div>
            {/* Header */}
            {/* <div className="flex justify-between items-center mb-4">
            <button onClick={() => navigate(-1)} className="mr-2">
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-xl font-semibold">Event Report</h2>
            <button onClick={() => handleExport()} className="bg-green-600 text-white px-4 py-2 rounded-md">
              Export
            </button>
          </div> */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Attendance List</h2>
            </div>

            {/* Search Input */}
            <div className="relative mb-4">
              <Search
                className="absolute left-3 top-2.5 text-gray-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Search Students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none"
              />
            </div>

            {/* Add Student Section */}
            <div className="bg-white p-4 rounded-lg shadow mb-4">
              <h3 className="text-lg font-semibold mb-2">Add Student</h3>
              <div className="flex items-center gap-2">
                <select
                  value={admissionNo}
                  onChange={(e) => setAdmissionNo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                >
                  <option value="">Select Admission No...</option>
                  {registeredStudents.map((student) => (
                    <option key={student.id} value={student.admissionNo}>
                      {student.admissionNo} - {student.name}
                    </option>
                  ))}
                </select>

                <button
                  disabled={submitloading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                  onClick={handleAddStudent}
                >
                  {submitloading ? 'Adding':'Add'}
                </button>
                <button
                  className="px-4 py-2 bg-gray-600 text-white rounded-md flex items-center gap-1 whitespace-nowrap"
                  onClick={() => setIsScanning(!isScanning)}
                >
                  <QrCode size={18} />
                  {isScanning ? "Stop" : "Scan"} QR
                </button>
              </div>
              {isScanning && (
                <div className="mt-4">
                  <QrScanner
                    delay={300}
                    onError={handleError}
                    onScan={handleScan}
                    style={{ width: "100%" }}
                  />
                </div>
              )}
            </div>

            {/* Students Table */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-green-600 text-white">
                  <tr>
                    <th className="py-2 px-2">No</th>
                    <th className="py-2 px-2">Name</th>
                    <th className="py-2 px-2">Admission No</th>
                    <th className="py-2 px-2">Roll No</th>
                    <th className="py-2 px-2">Department</th>
                  </tr>
                </thead>
                <tbody className="bg-green-50">
                  {attendedStudents?.length > 0 ? (
                    attendedStudents?.map((student, index) => (
                      <tr
                        key={index}
                        className="border-t text-center text-gray-700"
                      >
                        <td className="py-2 px-2">{index + 1}</td>
                        <td className="py-2 px-2">{student.name}</td>
                        <td className="py-2 px-2">{student.admissionNo}</td>
                        <td className="py-2 px-2">{student.rollNo}</td>
                        <td className="py-2 px-2">{student.department}</td>
                      </tr>
                    ))
                  ) : (
                    <tr className="text-center">
                      <td colSpan="5" className="py-4 text-gray-500">
                        No students found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-4">
              <button
                className="px-4 py-2 border border-gray-400 rounded-md"
                onClick={() => setSearchTerm("")}
              >
                Clear
              </button>
              <button
                onClick={() => handleExport()}
                className="px-4 py-2 bg-green-600 text-white rounded-md"
              >
                Export Data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
