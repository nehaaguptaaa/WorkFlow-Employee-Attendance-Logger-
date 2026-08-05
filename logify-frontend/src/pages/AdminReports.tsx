import { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import { getMonthlySummary } from "../api/adminApi";
import type { EmployeeAttendanceSummary } from "../types/report";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function AdminReports() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [summary, setSummary] = useState<EmployeeAttendanceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSummary = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getMonthlySummary(month, year);
      setSummary(data);
    } catch {
      setError("Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [month, year]);

  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-800 mb-1">Reports</h2>
      <p className="text-slate-500 text-sm mb-6">Monthly attendance summary for all employees</p>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg px-4 py-2 mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-medium text-slate-800 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Summary
          </h3>
          <div className="flex gap-2">
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="border border-slate-300 px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-slate-400 text-sm bg-white"
            >
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="border border-slate-300 px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-slate-400 text-sm bg-white"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="px-6 py-8 text-center text-slate-400 text-sm">Loading...</div>
        ) : summary.length === 0 ? (
          <div className="px-6 py-8 text-center text-slate-400 text-sm">No data for this period</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-left">
                <th className="px-6 py-3 font-medium">Employee</th>
                <th className="px-6 py-3 font-medium text-center">Present</th>
                <th className="px-6 py-3 font-medium text-center">Absent</th>
                <th className="px-6 py-3 font-medium text-center">Late</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((row, i) => (
                <tr key={i} className="border-t border-slate-100">
                  <td className="px-6 py-3 text-slate-700 font-medium">{row.employeeName}</td>
                  <td className="px-6 py-3 text-center text-green-700 font-medium">{row.totalPresent}</td>
                  <td className="px-6 py-3 text-center text-red-700 font-medium">{row.totalAbsent}</td>
                  <td className="px-6 py-3 text-center text-amber-700 font-medium">{row.totalLate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminReports;