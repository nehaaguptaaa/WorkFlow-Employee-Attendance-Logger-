import { useEffect, useState } from "react";
import { Pencil, X } from "lucide-react";
import { getAllAttendance, getAttendanceByUser, updateAttendance, getAllEmployees } from "../api/adminApi";
import type { AttendanceResponse } from "../types/attendance";
import type { UserResponse } from "../types/user";

const statusColors: Record<string, string> = {
  PRESENT: "bg-green-50 text-green-700 border-green-200",
  LATE: "bg-amber-50 text-amber-700 border-amber-200",
  ABSENT: "bg-red-50 text-red-700 border-red-200",
  ON_LEAVE: "bg-blue-50 text-blue-700 border-blue-200",
};

function AdminAttendance() {
  const [records, setRecords] = useState<AttendanceResponse[]>([]);
  const [employees, setEmployees] = useState<UserResponse[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editRecord, setEditRecord] = useState<AttendanceResponse | null>(null);
  const [editCheckIn, setEditCheckIn] = useState("");
  const [editCheckOut, setEditCheckOut] = useState("");
  const [editStatus, setEditStatus] = useState("PRESENT");
  const [saving, setSaving] = useState(false);

  const fetchData = async (userId: string) => {
    setLoading(true);
    try {
      const data = userId === "ALL" ? await getAllAttendance() : await getAttendanceByUser(Number(userId));
      setRecords(data.sort((a, b) => (a.date < b.date ? 1 : -1)));
    } catch {
      setError("Failed to load attendance records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllEmployees().then(setEmployees).catch(() => {});
    fetchData("ALL");
  }, []);

  useEffect(() => {
    fetchData(selectedUserId);
  }, [selectedUserId]);

  const openEdit = (record: AttendanceResponse) => {
    setEditRecord(record);
    setEditCheckIn(record.checkInTime ? record.checkInTime.slice(0, 8) : "");
    setEditCheckOut(record.checkOutTime ? record.checkOutTime.slice(0, 8) : "");
    setEditStatus(record.status);
  };

  const closeEdit = () => setEditRecord(null);

  const handleSave = async () => {
    if (!editRecord) return;
    setSaving(true);
    try {
      await updateAttendance(editRecord.id, {
        checkInTime: editCheckIn || undefined,
        checkOutTime: editCheckOut || undefined,
        status: editStatus,
      });
      await fetchData(selectedUserId);
      closeEdit();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update record");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-800 mb-1">Attendance Records</h2>
      <p className="text-slate-500 text-sm mb-6">View and override employee attendance</p>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg px-4 py-2 mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-medium text-slate-800">Records</h3>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="border border-slate-300 px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-slate-400 text-sm bg-white"
          >
            <option value="ALL">All Employees</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="px-6 py-8 text-center text-slate-400 text-sm">Loading...</div>
        ) : records.length === 0 ? (
          <div className="px-6 py-8 text-center text-slate-400 text-sm">No records found</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-left">
                <th className="px-6 py-3 font-medium">Employee</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Check-in</th>
                <th className="px-6 py-3 font-medium">Check-out</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className="border-t border-slate-100">
                  <td className="px-6 py-3 text-slate-700 font-medium">{record.employeeName}</td>
                  <td className="px-6 py-3 text-slate-600">{record.date}</td>
                  <td className="px-6 py-3 text-slate-600">
                    {record.checkInTime ? record.checkInTime.slice(0, 8) : "-"}
                  </td>
                  <td className="px-6 py-3 text-slate-600">
                    {record.checkOutTime ? record.checkOutTime.slice(0, 8) : "-"}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusColors[record.status]}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button onClick={() => openEdit(record)} className="text-slate-400 hover:text-slate-700 transition">
                      <Pencil className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editRecord && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-slate-800">
                Edit — {editRecord.employeeName} ({editRecord.date})
              </h3>
              <button onClick={closeEdit} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-3">
              <label className="text-sm font-medium text-slate-700 mb-1 block">Check-in Time</label>
              <input
                type="time"
                step={1}
                value={editCheckIn}
                onChange={(e) => setEditCheckIn(e.target.value)}
                className="w-full border border-slate-300 px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-slate-400 text-sm"
              />
            </div>

            <div className="mb-3">
              <label className="text-sm font-medium text-slate-700 mb-1 block">Check-out Time</label>
              <input
                type="time"
                step={1}
                value={editCheckOut}
                onChange={(e) => setEditCheckOut(e.target.value)}
                className="w-full border border-slate-300 px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-slate-400 text-sm"
              />
            </div>

            <div className="mb-5">
              <label className="text-sm font-medium text-slate-700 mb-1 block">Status</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="w-full border border-slate-300 px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-slate-400 text-sm bg-white"
              >
                <option value="PRESENT">PRESENT</option>
                <option value="LATE">LATE</option>
                <option value="ABSENT">ABSENT</option>
                <option value="ON_LEAVE">ON_LEAVE</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-slate-800 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-slate-900 disabled:opacity-60 transition"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={closeEdit}
                className="flex-1 border border-slate-300 text-slate-700 py-2.5 rounded-lg font-medium text-sm hover:bg-slate-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminAttendance;