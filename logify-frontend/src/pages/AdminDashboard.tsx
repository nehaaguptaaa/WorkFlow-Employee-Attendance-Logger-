import { useEffect, useState } from "react";
import { Search, Trash2, ShieldCheck, Building2 } from "lucide-react";
import { getAllEmployees, deleteEmployee, promoteToAdmin } from "../api/adminApi";
import type { UserResponse } from "../types/user";

function AdminDashboard() {
  const [employees, setEmployees] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionId, setActionId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const fetchEmployees = async () => {
    try {
      const data = await getAllEmployees();
      setEmployees(data);
    } catch {
      setError("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    setActionId(id);
    try {
      await deleteEmployee(id);
      await fetchEmployees();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete employee");
    } finally {
      setActionId(null);
    }
  };

  const handlePromote = async (id: number, name: string) => {
    if (!window.confirm(`Promote ${name} to admin?`)) return;
    setActionId(id);
    try {
      await promoteToAdmin(id);
      await fetchEmployees();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to promote employee");
    } finally {
      setActionId(null);
    }
  };

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-800 mb-1">Employees</h2>
      <p className="text-slate-500 text-sm mb-6">Manage all registered users</p>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg px-4 py-2 mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-medium text-slate-800">All Employees ({filtered.length})</h3>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, dept..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-slate-300 pl-9 pr-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-slate-400 text-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="px-6 py-8 text-center text-slate-400 text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-8 text-center text-slate-400 text-sm">No employees found</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-left">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Department</th>
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp) => (
                <tr key={emp.id} className="border-t border-slate-100">
                  <td className="px-6 py-3 text-slate-700 font-medium">{emp.name}</td>
                  <td className="px-6 py-3 text-slate-600">{emp.email}</td>
                  <td className="px-6 py-3 text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {emp.department}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                        emp.role === "ADMIN"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : "bg-slate-50 text-slate-600 border-slate-200"
                      }`}
                    >
                      {emp.role}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-end gap-3">
                      {emp.role !== "ADMIN" && (
                        <button
                          onClick={() => handlePromote(emp.id, emp.name)}
                          disabled={actionId === emp.id}
                          title="Promote to admin"
                          className="text-slate-400 hover:text-purple-600 disabled:opacity-40 transition"
                        >
                          <ShieldCheck className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(emp.id, emp.name)}
                        disabled={actionId === emp.id}
                        title="Delete employee"
                        className="text-slate-400 hover:text-red-600 disabled:opacity-40 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;