import React, { useState } from 'react';
import { Bell, UserPlus, Users, Building2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function Dashboard() {
  const { user } = useAuth();
  const [pendingRequests, setPendingRequests] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      department: 'Computer Science',
      role: 'student',
      status: 'pending'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      department: 'Electronics',
      role: 'organizer',
      status: 'pending'
    }
  ]);

  const handleApprove = (id) => {
    setPendingRequests(requests =>
      requests.map(request =>
        request.id === id ? { ...request, status: 'approved' } : request
      )
    );
  };

  const handleReject = (id) => {
    setPendingRequests(requests =>
      requests.map(request =>
        request.id === id ? { ...request, status: 'rejected' } : request
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white p-4 shadow-sm">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src={user?.profileImage || 'https://ui-avatars.com/api/?name=' + user?.name}
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
            <span className="text-gray-700">{user?.name}</span>
          </div>
          <Bell className="w-6 h-6 text-gray-600" />
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold">Total Users</h3>
            </div>
            <p className="text-3xl font-bold">1,234</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Building2 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold">Departments</h3>
            </div>
            <p className="text-3xl font-bold">8</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <ShieldCheck className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold">Active Events</h3>
            </div>
            <p className="text-3xl font-bold">12</p>
          </div>
        </div>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Pending Requests</h2>
            <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              <UserPlus className="w-5 h-5" />
              Add User
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pendingRequests.map(request => (
                  <tr key={request.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{request.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{request.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{request.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {request.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {request.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(request.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(request.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {request.status === 'approved' && (
                        <span className="text-green-600">Approved</span>
                      )}
                      {request.status === 'rejected' && (
                        <span className="text-red-600">Rejected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;