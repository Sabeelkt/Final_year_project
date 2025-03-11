import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowLeft } from "lucide-react";
import * as XLSX from "xlsx";

export default function EventReport() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([]);

  // Fetch data from backend
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("https://api.example.com/students"); // Replace with actual API
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, []);

  // Filtered students based on search term
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Export data to Excel
  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(students);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Event Report");

    // Download the file
    XLSX.writeFile(workbook, "Event_Report.xlsx");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center mb-4">
          <button onClick={() => navigate(-1)} className="mr-2">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold">Event Report</h1>
        </div>

        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search Students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none"
          />
        </div>

        {/* Table */}
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
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <tr key={index} className="border-t text-center text-gray-700">
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
                    No students found
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
            className="px-4 py-2 bg-green-600 text-white rounded-md"
            onClick={handleExport}
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
}
