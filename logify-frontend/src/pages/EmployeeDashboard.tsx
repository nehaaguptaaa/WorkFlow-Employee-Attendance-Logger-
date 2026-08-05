import { useEffect, useState } from "react";
import { LogIn, LogOut } from "lucide-react";
import { checkIn, checkOut, getMyAttendanceHistory } from "../api/attendanceApi";
import type { AttendanceResponse } from "../types/attendance";

const statusColors: Record<string, string> = {
  PRESENT: "bg-green-50 text-green-700 border-green-200",
  LATE: "bg-amber-50 text-amber-700 border-amber-200",
  ABSENT: "bg-red-50 text-red-700 border-red-200",
  ON_LEAVE: "bg-blue-50 text-blue-700 border-blue-200",
};

function EmployeeDashboard() {
  const [history, setHistory] = useState<AttendanceResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const todayRecord = history.find((h) => h.date === today);

  const fetchHistory = async () => {
    try {
      const data = await getMyAttendanceHistory();
      setHistory(data.sort((a, b) => (a.date < b.date ? 1 : -1)));
    } catch {
      setError("Failed to load attendance history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleCheckIn = async () => {
    setError("");
    setActionLoading(true);
    try {
      await checkIn();
      await fetchHistory();
    } catch (err: any) {
      setError(err.response?.data?.message || "Check-in failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setError("");
    setActionLoading(true);
    try {
      await checkOut();
      await fetchHistory();
    } catch (err: any) {
      setError(err.response?.data?.message || "Check-out failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="text-slate-500 text-sm">Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-800 mb-1">Dashboard</h2>
      <p className="text-slate-500 text-sm mb-6">Mark your attendance for today</p>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg px-4 py-2 mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-slate-500">Today</p>
            <p className="text-lg font-medium text-slate-800">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>
          {todayRecord && (
            <span className={`text-xs font-medium px-3 py-1 rounded-full border ${statusColors[todayRecord.status]}`}>
              {todayRecord.status}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 bg-slate-50 rounded-lg p-4">
            <p className="text-xs text-slate-500 mb-1">Check-in</p>
            <p className="text-lg font-semibold text-slate-800">
              {todayRecord?.checkInTime ? todayRecord.checkInTime.slice(0, 8) : "--:--:--"}
            </p>
          </div>
          <div className="flex-1 bg-slate-50 rounded-lg p-4">
            <p className="text-xs text-slate-500 mb-1">Check-out</p>
            <p className="text-lg font-semibold text-slate-800">
              {todayRecord?.checkOutTime ? todayRecord.checkOutTime.slice(0, 8) : "--:--:--"}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button
            onClick={handleCheckIn}
            disabled={actionLoading || !!todayRecord}
            className="flex-1 flex items-center justify-center gap-2 bg-slate-800 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <LogIn className="w-4 h-4" />
            Check In
          </button>
          <button
            onClick={handleCheckOut}
            disabled={actionLoading || !todayRecord || !!todayRecord?.checkOutTime}
            className="flex-1 flex items-center justify-center gap-2 border border-slate-300 text-slate-700 py-2.5 rounded-lg font-medium text-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <LogOut className="w-4 h-4" />
            Check Out
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="font-medium text-slate-800">Attendance History</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-left">
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Check-in</th>
              <th className="px-6 py-3 font-medium">Check-out</th>
              <th className="px-6 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                  No attendance records yet
                </td>
              </tr>
            ) : (
              history.map((record) => (
                <tr key={record.id} className="border-t border-slate-100">
                  <td className="px-6 py-3 text-slate-700">{record.date}</td>
                  <td className="px-6 py-3 text-slate-700">
                    {record.checkInTime ? record.checkInTime.slice(0, 8) : "-"}
                  </td>
                  <td className="px-6 py-3 text-slate-700">
                    {record.checkOutTime ? record.checkOutTime.slice(0, 8) : "-"}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusColors[record.status]}`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EmployeeDashboard;