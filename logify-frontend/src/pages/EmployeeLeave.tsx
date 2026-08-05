import { useEffect, useState } from "react";
import { CalendarPlus } from "lucide-react";
import { applyLeave, getMyLeaves } from "../api/leaveApi";
import type { LeaveResponse } from "../types/leave";

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  APPROVED: "bg-green-50 text-green-700 border-green-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
};

function EmployeeLeave() {
  const [leaves, setLeaves] = useState<LeaveResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchLeaves = async () => {
    try {
      const data = await getMyLeaves();
      setLeaves(data.sort((a, b) => (a.appliedOn < b.appliedOn ? 1 : -1)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!fromDate || !toDate || !reason.trim()) {
      setFormError("All fields are required");
      return;
    }
    if (toDate < fromDate) {
      setFormError("To date cannot be before from date");
      return;
    }

    setSubmitting(true);
    try {
      await applyLeave({ fromDate, toDate, reason });
      setFromDate("");
      setToDate("");
      setReason("");
      await fetchLeaves();
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Failed to apply for leave");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredLeaves = filter === "ALL" ? leaves : leaves.filter((l) => l.status === filter);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-800 mb-1">Leave Requests</h2>
      <p className="text-slate-500 text-sm mb-6">Apply for leave and track your requests</p>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h3 className="font-medium text-slate-800 mb-4 flex items-center gap-2">
          <CalendarPlus className="w-4 h-4" />
          Apply for Leave
        </h3>

        {formError && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg px-4 py-2 mb-4">
            {formError}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full border border-slate-300 px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-slate-400 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full border border-slate-300 px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-slate-400 text-sm"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-slate-700 mb-1 block">Reason</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="Reason for leave"
            className="w-full border border-slate-300 px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-slate-400 text-sm resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-slate-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-slate-900 disabled:opacity-60 transition"
        >
          {submitting ? "Submitting..." : "Submit Request"}
        </button>
      </form>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-medium text-slate-800">My Requests</h3>
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
        ) : filteredLeaves.length === 0 ? (
          <div className="px-6 py-8 text-center text-slate-400 text-sm">No leave requests found</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-left">
                <th className="px-6 py-3 font-medium">From</th>
                <th className="px-6 py-3 font-medium">To</th>
                <th className="px-6 py-3 font-medium">Reason</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Reviewed On</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.map((leave) => (
                <tr key={leave.id} className="border-t border-slate-100">
                  <td className="px-6 py-3 text-slate-700">{leave.fromDate}</td>
                  <td className="px-6 py-3 text-slate-700">{leave.toDate}</td>
                  <td className="px-6 py-3 text-slate-700 max-w-xs truncate">{leave.reason}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusColors[leave.status]}`}>
                      {leave.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-slate-500">
                    {leave.reviewedOn ? new Date(leave.reviewedOn).toLocaleDateString("en-IN") : "-"}
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

export default EmployeeLeave;