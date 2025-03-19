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
  arrayRemove,
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
  FlipHorizontal,
  Trash2,
} from "lucide-react";
import * as XLSX from "xlsx";
import QrScanner from "react-qr-scanner";
import { toast } from 'sonner'

export default function EventDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("details");
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitloading, setSubmitloading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(null);
  const [admissionNo, setAdmissionNo] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  // States for Register and Reports tabs
  const [registeredStudents, setRegisteredStudents] = useState([]);
  const [attendedStudents, setAttendedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState(null);
  // Camera states
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  // New student form data
  const [newStudent, setNewStudent] = useState({
    name: "",
    admissionNo: "",
    rollNo: "",
    department: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  // Confirmation dialog state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  useEffect(() => {
    // Get available cameras when scanning is active
    if (isScanning) {
      const getCameras = async () => {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = devices.filter(device => device.kind === 'videoinput');
          setCameras(videoDevices);
          
          // If we have cameras and none is selected yet, select the back camera by default
          if (videoDevices.length > 0 && !selectedCamera) {
            // Try to find back camera (usually contains "back" or is not the first camera)
            const backCamera = videoDevices.find(device => 
              device.label.toLowerCase().includes('back') || 
              device.label.toLowerCase().includes('rear')
            );
            
            // If we found a likely back camera, use it, otherwise use the last camera (often the back one)
            setSelectedCamera(backCamera ? backCamera.deviceId : videoDevices[videoDevices.length - 1].deviceId);
          }
        } catch (error) {
          console.error("Error accessing cameras:", error);
        }
      };
      
      getCameras();
    }
  }, [isScanning]);

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

  const toggleCamera = () => {
    if (cameras.length <= 1) return; // If only one camera, do nothing
    
    // Find current camera index
    const currentIndex = cameras.findIndex(camera => camera.deviceId === selectedCamera);
    // Select next camera (or first if at the end)
    const nextIndex = (currentIndex + 1) % cameras.length;
    setSelectedCamera(cameras[nextIndex].deviceId);
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setSubmitloading(true);
    try {
      if (admissionNo.trim() === "") return;

      // Find student in the registered students list using admission number
      const studentData = registeredStudents.find(
        (student) => student.admissionNo === admissionNo
      );

      if (!studentData) {
        toast("Student is not registered for this event.");
        return;
      }

      const studentId = studentData.id; // Extract student ID

      // Check if student is already marked as attended
      if (attendedStudents.some((student) => student.id === studentId)) {
        toast("Student already marked as attended!");
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
    } finally {
      setSubmitloading(false);
    }
  };

  // Function to show delete confirmation
  const promptDelete = (student) => {
    setStudentToDelete(student);
    setShowDeleteConfirm(true);
  };

  // Function to handle the actual deletion
  const handleDeleteStudent = async () => {
    if (!studentToDelete) return;
    
    setDeleteLoading(true);
    try {
      const studentId = studentToDelete.id;
      
      // Update Firestore: Remove student ID from the event's attendedStudents list
      const eventRef = doc(db, "events", id);
      await updateDoc(eventRef, {
        attendedStudents: arrayRemove(studentId),
      });

      // Update Firestore: Remove event ID from the student's attendedEvents list
      const userRef = doc(db, "users", studentId);
      await updateDoc(userRef, {
        attendedEvents: arrayRemove(id),
      });

      // Update local state to reflect UI changes
      setAttendedStudents(attendedStudents.filter(student => student.id !== studentId));

      alert("Student removed from attendance successfully!");
    } catch (error) {
      console.error("Error removing student:", error);
      alert("Failed to remove student");
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
      setStudentToDelete(null);
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

  // Filtered attended students based on search term
  const filteredAttendedStudents = attendedStudents?.filter(
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
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">
                      {cameras.length > 0 ? `Camera: ${cameras.find(c => c.deviceId === selectedCamera)?.label || 'Unknown'}` : 'Accessing camera...'}
                    </span>
                    {cameras.length > 1 && (
                      <button 
                        onClick={toggleCamera} 
                        className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md flex items-center gap-1 text-sm"
                      >
                        <FlipHorizontal size={16} />
                        Switch Camera
                      </button>
                    )}
                  </div>
                  
                  <QrScanner
                    delay={300}
                    onError={handleError}
                    onScan={handleScan}
                    style={{ width: "100%" }}
                    constraints={{
                      video: {
                        deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
                        facingMode: selectedCamera ? undefined : { ideal: "environment" }
                      }
                    }}
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
                    <th className="py-2 px-2">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-green-50">
                  {filteredAttendedStudents?.length > 0 ? (
                    filteredAttendedStudents?.map((student, index) => (
                      <tr
                        key={index}
                        className="border-t text-center text-gray-700"
                      >
                        <td className="py-2 px-2">{index + 1}</td>
                        <td className="py-2 px-2">{student.name}</td>
                        <td className="py-2 px-2">{student.admissionNo}</td>
                        <td className="py-2 px-2">{student.rollNo}</td>
                        <td className="py-2 px-2">{student.department}</td>
                        <td className="py-2 px-2">
                          <button
                            onClick={() => promptDelete(student)}
                            className="p-1 text-red-600 rounded hover:bg-red-100 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="text-center">
                      <td colSpan="6" className="py-4 text-gray-500">
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

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
              <p className="text-gray-700 mb-4">
                Are you sure you want to remove <span className="font-semibold">{studentToDelete?.name}</span> from the attendance list?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteStudent}
                  className="px-4 py-2 bg-red-600 text-white rounded-md flex items-center gap-1"
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}