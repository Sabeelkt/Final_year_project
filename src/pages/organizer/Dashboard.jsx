import React, { useState } from 'react';
import { Bell, Plus, Users, Calendar, BarChart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function Dashboard() {
  const { user } = useAuth();
  const [activeEvents, setActiveEvents] = useState([
    {
      id: 1,
      title: 'SketchUp Workshop',
      registrations: 45,
      attendance: 38,
      date: '28 Jan 2024',
      status: 'active'
    },
    {
      id: 2,
      title: 'Tink-Her-Hack 3.0',
      registrations: 120,
      attendance: 98,
      date: '22 Jan 2024',
      status: 'completed'
    }
  ]);

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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            <Plus className="w-5 h-5" />
            Create Event
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold">Active Events</h3>
            </div>
            <p className="text-3xl font-bold">3</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold">Total Participants</h3>
            </div>
            <p className="text-3xl font-bold">165</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <BarChart className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold">Avg. Attendance</h3>
            </div>
            <p className="text-3xl font-bold">82%</p>
          </div>
        </div>

        <section>
          <h2 className="text-xl font-semibold mb-4">Recent Events</h2>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registrations</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {activeEvents.map(event => (
                  <tr key={event.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{event.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{event.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{event.registrations}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{event.attendance}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        event.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {event.status}
                      </span>
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