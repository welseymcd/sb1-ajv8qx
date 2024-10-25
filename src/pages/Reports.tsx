import React from 'react';
import { calloffDB, employeeDB, type Calloff, type Employee } from '../lib/db';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { BarChart2, Calendar, Users } from 'lucide-react';

export function Reports() {
  const [calloffs, setCalloffs] = React.useState<(Calloff & { employee?: Employee })[]>([]);
  const [selectedMonth, setSelectedMonth] = React.useState(format(new Date(), 'yyyy-MM'));

  React.useEffect(() => {
    async function loadData() {
      const allCalloffs = await calloffDB.getAll();
      const allEmployees = await employeeDB.getAll();
      
      const enrichedCalloffs = allCalloffs.map(calloff => ({
        ...calloff,
        employee: allEmployees.find(emp => emp.id === calloff.employeeId)
      }));

      setCalloffs(enrichedCalloffs);
    }

    loadData();
  }, []);

  const monthStart = startOfMonth(new Date(selectedMonth));
  const monthEnd = endOfMonth(new Date(selectedMonth));
  
  const monthlyCalloffs = calloffs.filter(calloff => {
    const date = new Date(calloff.date);
    return date >= monthStart && date <= monthEnd;
  });

  const stats = {
    total: monthlyCalloffs.length,
    byType: monthlyCalloffs.reduce((acc, curr) => {
      acc[curr.type] = (acc[curr.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byDepartment: monthlyCalloffs.reduce((acc, curr) => {
      const dept = curr.employee?.department || 'Unknown';
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };

  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const dailyData = days.map(day => ({
    date: format(day, 'MMM d'),
    count: monthlyCalloffs.filter(c => format(new Date(c.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')).length
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={Calendar}
          title="Total Call-offs"
          value={stats.total}
          description={`For ${format(monthStart, 'MMMM yyyy')}`}
        />
        <StatCard
          icon={Users}
          title="Most Common Type"
          value={Object.entries(stats.byType).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
          description={`${Object.entries(stats.byType).sort((a, b) => b[1] - a[1])[0]?.[1] || 0} occurrences`}
        />
        <StatCard
          icon={BarChart2}
          title="Department Impact"
          value={Object.entries(stats.byDepartment).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
          description={`${Object.entries(stats.byDepartment).sort((a, b) => b[1] - a[1])[0]?.[1] || 0} call-offs`}
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Daily Distribution</h2>
        <div className="h-64">
          <div className="flex h-full items-end space-x-2">
            {dailyData.map(({ date, count }) => (
              <div
                key={date}
                className="flex-1 bg-indigo-600 rounded-t"
                style={{
                  height: `${                   height: `${(count / Math.max(...dailyData.map(d => d.count)) * 100) || 0}%`
                }}
                title={`${count} call-offs`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            {dailyData.map(({ date }) => (
              <div key={date} className="transform -rotate-45 origin-top-left">
                {date}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">By Type</h2>
          <div className="space-y-4">
            {Object.entries(stats.byType).map(([type, count]) => (
              <div key={type} className="flex items-center">
                <div className="w-32 text-sm text-gray-600 capitalize">{type}</div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${(count / stats.total * 100) || 0}%` }}
                    />
                  </div>
                </div>
                <div className="w-12 text-right text-sm text-gray-600">{count}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">By Department</h2>
          <div className="space-y-4">
            {Object.entries(stats.byDepartment).map(([dept, count]) => (
              <div key={dept} className="flex items-center">
                <div className="w-32 text-sm text-gray-600">{dept}</div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${(count / stats.total * 100) || 0}%` }}
                    />
                  </div>
                </div>
                <div className="w-12 text-right text-sm text-gray-600">{count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: string | number;
  description: string;
}

function StatCard({ icon: Icon, title, value, description }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-500">{title}</div>
          <div className="text-xl font-semibold text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{description}</div>
        </div>
      </div>
    </div>
  );
}