import { useEffect, useMemo, useState } from "react";
import {
    adminListDoctors,
    adminApproveDoctor,
    adminRejectDoctor,
} from "./../../services/doctorService";
import { Link } from "react-router-dom";

export default function AdminDoctors() {
    const [rows, setRows] = useState([]);
    const [status, setStatus] = useState("PENDING"); // default to pending view
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");
    const [q, setQ] = useState("");
    const [rejectingId, setRejectingId] = useState(null);
    const [reason, setReason] = useState("");

    const fetchRows = async () => {
        setErr("");
        setLoading(true);
        try {
            const data = await adminListDoctors(status === "ALL" ? undefined : status);
            setRows(Array.isArray(data) ? data : []);
        } catch (e) {
            setErr(e?.response?.data || e.message || "Failed to load doctors");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRows();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);

    const filtered = useMemo(() => {
        const needle = q.trim().toLowerCase();
        if (!needle) return rows;
        return rows.filter(
            (r) =>
                (r.name && r.name.toLowerCase().includes(needle)) ||
                (r.email && r.email.toLowerCase().includes(needle)) ||
                (r.specialty && r.specialty.toLowerCase().includes(needle))
        );
    }, [rows, q]);

    const onApprove = async (id) => {
        try {
            await adminApproveDoctor(id);
            setRows((prev) =>
                prev.map((r) => (r.id === id ? { ...r, approvalStatus: "APPROVED", reviewedAt: new Date().toISOString(), rejectionReason: null } : r))
            );
        } catch (e) {
            alert(e?.response?.data || e.message || "Failed to approve");
        }
    };

    const onReject = async (id) => {
        try {
            await adminRejectDoctor(id, reason);
            setRows((prev) =>
                prev.map((r) => (r.id === id ? { ...r, approvalStatus: "REJECTED", reviewedAt: new Date().toISOString(), rejectionReason: reason } : r))
            );
            setRejectingId(null);
            setReason("");
        } catch (e) {
            alert(e?.response?.data || e.message || "Failed to reject");
        }
    };

    return (
        <div className="p-6">
            <div className="bg-white rounded-xl shadow p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                    <h2 className="text-xl font-semibold">Doctor Applications</h2>
                    <div className="flex gap-3">
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="border rounded-lg p-2"
                        >
                            <option value="ALL">All</option>
                            <option value="PENDING">Pending</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Search name, email, specialty…"
                            className="border rounded-lg p-2 w-56"
                        />
                        <button onClick={fetchRows} className="px-4 py-2 rounded-lg border">
                            Refresh
                        </button>
                    </div>
                </div>

                {err && <div className="text-red-600 mb-3">{err}</div>}
                {loading ? (
                    <div className="text-gray-500">Loading…</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="text-left border-b">
                                    <th className="py-2 pr-4">Doctor</th>
                                    <th className="py-2 pr-4">Specialty</th>
                                    <th className="py-2 pr-4">Fee</th>
                                    <th className="py-2 pr-4">Status</th>
                                    <th className="py-2 pr-4">Reviewed</th>
                                    <th className="py-2 pr-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-6 text-center text-gray-500">
                                            No doctors found.
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((r) => (
                                        <tr key={r.id} className="border-b">
                                            <td className="py-2 pr-4">
                                                <div className="font-medium">
                                                    <Link to={`/dashboard/doctors/${r.id}`} className="text-blue-600 hover:underline">
                                                        {r.name}
                                                    </Link>
                                                </div>
                                                <div className="text-gray-600">{r.email}</div>
                                                {r.phoneNumber && <div className="text-gray-500">{r.phoneNumber}</div>}
                                            </td>
                                            <td className="py-2 pr-4">{r.specialty || "-"}</td>
                                            <td className="py-2 pr-4">{r.consultationFee ?? "-"}</td>
                                            <td className="py-2 pr-4">
                                                <span
                                                    className={
                                                        "px-2 py-1 rounded text-xs " +
                                                        (r.approvalStatus === "APPROVED"
                                                            ? "bg-green-100 text-green-700"
                                                            : r.approvalStatus === "REJECTED"
                                                                ? "bg-red-100 text-red-700"
                                                                : "bg-yellow-100 text-yellow-700")
                                                    }
                                                >
                                                    {r.approvalStatus}
                                                </span>
                                                {r.rejectionReason && (
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        Reason: {r.rejectionReason}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-2 pr-4">
                                                {r.reviewedAt ? new Date(r.reviewedAt).toLocaleString() : "—"}
                                            </td>
                                            <td className="py-2 pr-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => onApprove(r.id)}
                                                        disabled={r.approvalStatus === "APPROVED"}
                                                        className="px-3 py-1 rounded bg-green-600 text-white disabled:opacity-50"
                                                    >
                                                        Approve
                                                    </button>
                                                    {rejectingId === r.id ? (
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                value={reason}
                                                                onChange={(e) => setReason(e.target.value)}
                                                                placeholder="Reason (optional)"
                                                                className="border rounded p-1"
                                                            />
                                                            <button
                                                                onClick={() => onReject(r.id)}
                                                                className="px-3 py-1 rounded bg-red-600 text-white"
                                                            >
                                                                Confirm
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setRejectingId(null);
                                                                    setReason("");
                                                                }}
                                                                className="px-3 py-1 rounded border"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => {
                                                                setRejectingId(r.id);
                                                                setReason("");
                                                            }}
                                                            disabled={r.approvalStatus === "REJECTED"}
                                                            className="px-3 py-1 rounded bg-red-50 text-red-700 border disabled:opacity-50"
                                                        >
                                                            Reject
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
