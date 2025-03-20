import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, Users as UsersIcon, GraduationCap, User, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import NavBar from "../../../components/NavBar";
import AuthRoleRequire from "../../../components/router/AuthRoleRequire";
import Users from "../Users/users";
import Students from '../../admin/Students/students'


const AdminDashboard = () => {
  const [departments, setDepartments] = useState([]);
  const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false);
  const [newDepartment, setNewDepartment] = useState("");
  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => {
    // Load departments from localStorage
    const storedDepartments = JSON.parse(localStorage.getItem("departments") || "[]");
    if (storedDepartments.length === 0) {
      // Initialize with sample departments if none exist
      const initialDepartments = [
        { id: "dept_1", name: "B com Co operation" },
        { id: "dept_2", name: "BA English" },
        { id: "dept_3", name: "BA History" },
        { id: "dept_4", name: "BA West Asia" },
        { id: "dept_5", name: "Bcom Co operation" },
        { id: "dept_6", name: "Bsc Computer Science" },
        { id: "dept_7", name: "Bsc BioChemistry" },
        { id: "dept_8", name: "Bsc Double Main" },
        { id: "dept_9", name: "Bsc Biotechnology" }
      ];
      localStorage.setItem("departments", JSON.stringify(initialDepartments));
      setDepartments(initialDepartments);
    } else {
      setDepartments(storedDepartments);
    }
  }, []);

  const handleAddDepartment = () => {
    if (!newDepartment.trim()) {
      toast.error("Department name cannot be empty");
      return;
    }

    const departmentExists = departments.some(
      (dept) => dept.name.toLowerCase() === newDepartment.toLowerCase()
    );

    if (departmentExists) {
      toast.error("Department already exists");
      return;
    }

    const newDepartmentObject = {
      id: `dept_${Date.now()}`,
      name: newDepartment,
    };

    const updatedDepartments = [...departments, newDepartmentObject];
    localStorage.setItem("departments", JSON.stringify(updatedDepartments));
    setDepartments(updatedDepartments);
    setNewDepartment("");
    setIsAddDepartmentOpen(false);
    toast.success("Department added successfully");
  };

  const handleDeleteDepartment = (id) => {
    const updatedDepartments = departments.filter((dept) => dept.id !== id);
    localStorage.setItem("departments", JSON.stringify(updatedDepartments));
    setDepartments(updatedDepartments);
    toast.success("Department deleted successfully");
  };

  return (
    <AuthRoleRequire role={'admin'}>
    <div className="min-h-screen bg-[#0c1221] text-white">
      <NavBar />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-12 mt-8">
          <div className="bg-[#102336] rounded-lg p-1 flex space-x-2">
            {/* <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center space-x-2 px-6 py-3.5 rounded-md ${
                activeTab === "dashboard" ? "bg-[#008170] text-white" : "text-gray-300 hover:bg-[#1e3450]"
              }`}
            >
              <Home size={18} />
              <span>Dashboard</span>
            </button>
             */}
            <button
              onClick={() => setActiveTab("users")}
              className={`flex items-center space-x-2 px-6 py-3.5 rounded-md ${
                activeTab === "users" ? "bg-[#008170] text-white" : "text-gray-300 hover:bg-[#1e3450]"
              }`}
            >
              <UsersIcon size={18} />
              <span>Organizers</span>
            </button>
            
            <button
              onClick={() => setActiveTab("students")}
              className={`flex items-center space-x-2 px-6 py-3.5 rounded-md ${
                activeTab === "students" ? "bg-[#008170] text-white" : "text-gray-300 hover:bg-[#1e3450]"
              }`}
            >
              <GraduationCap size={18} />
              <span>Students</span>
            </button>
            
          
          </div>
        </div>

        <h1 className="text-4xl font-bold text-center mb-14 text-[#00E5B7]">Admin Dashboard</h1>
       
        {activeTab === "dashboard" && (
          <>
            {/* Add Department Button */}
            {/*
            <div className="mb-10">
              <Button 
                className="w-full bg-[#008170] hover:bg-[#00a18f] text-white py-6 text-lg rounded-md flex items-center justify-center space-x-2"
                onClick={() => setIsAddDepartmentOpen(true)}
              >
                <Plus size={20} />
                <span>Add Department</span>
              </Button>
            </div>
            
            {/* Departments Section */}
            
            {/* <div>
              <h2 className="text-2xl font-bold mb-8 text-center text-white">Departments</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {departments.map((department) => (
                  <Card key={department.id} className="bg-[#f1f3f5] text-gray-800 rounded-md flex justify-between items-center p-4">
                    <div className="flex items-center">
                      <div className="flex items-center">
                        <GraduationCap size={20} className="text-gray-500 mr-3" />
                        <span className="font-medium">{department.name}</span>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                      onClick={() => handleDeleteDepartment(department.id)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </Card>
                ))}
              </div>
            </div> */}
          </>
        )}
        
        {activeTab === "users" && (
          <div className="bg-[#102336] rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-white">Users Management</h2>
            {/* <p className="text-gray-300">User management interface would go here.</p> */}
            <Users />
          </div>
        )}
        
        {activeTab === "students" && (
          <div className="bg-[#102336] rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-white">Students Management</h2>
            <p className="text-gray-300">Student management interface would go here.</p>
            <Students/>
          </div>
        )}
        
        {activeTab === "requests" && (
          <div className="bg-[#102336] rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-white">Account Requests</h2>
            <p className="text-gray-300">Account request approval interface would go here.</p>
          </div>
        )} 
      </main>
      
      {/* Add Department Dialog */}
      {/*
      <Dialog open={isAddDepartmentOpen} onOpenChange={setIsAddDepartmentOpen}>
        <DialogContent className="bg-[#102336] text-white border-[#1e3450]">
          <DialogHeader>
            <DialogTitle className="text-[#00E5B7]">Add New Department</DialogTitle>
            <DialogDescription className="text-gray-300">
              Enter the name of the department you want to add.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="department-name" className="text-white">Department Name</Label>
            <Input
              id="department-name"
              value={newDepartment}
              onChange={(e) => setNewDepartment(e.target.value)}
              placeholder="e.g. Computer Science"
              className="bg-[#0c1221] border-[#1e3450] text-white mt-2"
            />
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddDepartmentOpen(false)}
              className="border-[#1e3450] text-gray-300 hover:bg-[#1e3450]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleAddDepartment}
              className="bg-[#008170] hover:bg-[#00a18f] text-white"
            >
              Add Department
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>*/}
    </div>
    </AuthRoleRequire>
  );
};

export default AdminDashboard;
