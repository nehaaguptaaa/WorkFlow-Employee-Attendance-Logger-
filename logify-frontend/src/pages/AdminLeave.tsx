import { useEffect, useState } from "react";
import { Check, X as XIcon } from "lucide-react";
import { getLeaves, updateLeaveStatus } from "../api/adminApi";
import type { LeaveResponse, LeaveStatus } from "../types/leave";

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  APPROVED: "bg-green-50 text-green-700 border-green-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
};

function AdminLeave() {
  const [leaves, setLeaves] = useState<LeaveResponse[]>([]);
  const [filter, setFilter] = useState<"ALL" | LeaveStatus>("PENDING");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const fetchLeaves = async (f: "ALL" | LeaveStatus) => {
    setLoading(true);
    try {
      const data = f === "ALL" ? await getLeaves() : await getLeaves(f);
      setLeaves(data.sort((a, b) => (a.appliedOn < b.appliedOn ? 1 : -1)));
    } catch {
      setError("Failed to load leave requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves(filter);
  }, [filter]);

  const handleAction = async (id: number, status: LeaveStatus) => {
    setActionId(id);
    setError("");
    try {
      await updateLeaveStatus(id, status);
      await fetchLeaves(filter);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update leave status");
    } finally {
      setActionId(null);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-800 mb-1">Leave Requests</h2>
      <p className="text-slate-500 text-sm mb-6">Review and manage employee leave applications</p>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg px-4 py-2 mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-medium text-slate-800">Requests</h3>
          <div className="flex gap-1">
            {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition ${
                  filter === f ? "bg-slate-800 text-white" : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="px-6 py-8 text-center text-slate-400 text-sm">Loading...</div>
        ) : leaves.length === 0 ? (
          <div className="px-6 py-8 text-center text-slate-400 text-sm">No leave requests found</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-left">
                <th className="px-6 py-3 font-medium">Employee</th>
                <th className="px-6 py-3 font-medium">From</th>
                <th className="px-6 py-3 font-medium">To</th>
                <th className="px-6 py-3 font-medium">Reason</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave.id} className="border-t border-slate-100">
                  <td className="px-6 py-3 text-slate-700 font-medium">{leave.employeeName}</td>
                  <td className="px-6 py-3 text-slate-600">{leave.fromDate}</td>
                  <td className="px-6 py-3 text-slate-600">{leave.toDate}</td>
                  <td className="px-6 py-3 text-slate-600 max-w-xs truncate">{leave.reason}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusColors[leave.status]}`}>
                      {leave.status}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    {leave.status === "PENDING" ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleAction(leave.id, "APPROVED")}
                          disabled={actionId === leave.id}
                          title="Approve"
                          className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 disabled:opacity-40 transition"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleAction(leave.id, "REJECTED")}
                          disabled={actionId === leave.id}
                          title="Reject"
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-40 transition"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs text-right block">
                        {leave.reviewedOn ? new Date(leave.reviewedOn).toLocaleDateString("en-IN") : "-"}
                      </span>
                    )}
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

export default AdminLeave;