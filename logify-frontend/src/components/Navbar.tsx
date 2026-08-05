import { useNavigate, Link, useLocation } from "react-router-dom";
import { LogOut, Clock, Calendar, Users, FileText, BarChart3 } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  const employeeLinks = [
    { path: "/employee/dashboard", label: "Dashboard", icon: Clock },
    { path: "/employee/leave", label: "Leave", icon: Calendar },
  ];

  const adminLinks = [
    { path: "/admin/dashboard", label: "Employees", icon: Users },
    { path: "/admin/attendance", label: "Attendance", icon: Clock },
    { path: "/admin/leave", label: "Leave Requests", icon: FileText },
    { path: "/admin/reports", label: "Reports", icon: BarChart3 },
  ];

  const links = role === "ADMIN" ? adminLinks : employeeLinks;

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <h1 className="text-lg font-semibold text-slate-800">Logify</h1>
        <div className="flex gap-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive(link.path) ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-600 transition"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </nav>
  );
}

export default Navbar;