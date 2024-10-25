import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Calendar, Users, BarChart2, Menu } from 'lucide-react';

export function Layout() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold">CallOff Tracker</Link>
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden md:flex items-center space-x-4">
              <NavLinks />
            </div>
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden bg-indigo-500 text-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLinks />
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

function NavLinks() {
  const links = [
    { to: "/", icon: Calendar, text: "Call-offs" },
    { to: "/employees", icon: Users, text: "Employees" },
    { to: "/reports", icon: BarChart2, text: "Reports" },
  ];

  return (
    <>
      {links.map(({ to, icon: Icon, text }) => (
        <Link
          key={to}
          to={to}
          className="flex items-center px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          <Icon className="h-5 w-5 mr-2" />
          {text}
        </Link>
      ))}
    </>
  );
}