import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, AlertCircle } from 'lucide-react';
import { calloffDB, employeeDB, type Calloff, type Employee } from '../lib/db';
import { format } from 'date-fns';

export function Dashboard() {
  const [calloffs, setCalloffs] = React.useState<(Calloff & { employee?: Employee })[]>([]);

  React.useEffect(() => {
    async function loadCalloffs() {
      const allCalloffs = await calloffDB.getAll();
      const allEmployees = await employeeDB.getAll();
      
      const enrichedCalloffs = allCalloffs.map(calloff => ({
        ...calloff,
        employee: allEmployees.find(emp => emp.id === calloff.employeeId)
      }));

      setCalloffs(enrichedCalloffs);
    }

    loadCalloffs();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Today's Call-offs</h1>
        <Link
          to="/new-calloff"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Call-off
        </Link>
      </div>

      {calloffs.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No call-offs recorded for today</p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {calloffs.map((calloff) => (
                <tr key={calloff.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {calloff.employee?.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {calloff.employee?.department}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {calloff.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(calloff.date), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${calloff.status === 'approved' ? 'bg-green-100 text-green-800' : 
                        calloff.status === 'denied' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {calloff.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}