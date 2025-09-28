import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    adminGetDoctor,
    adminApproveDoctor,
    adminRejectDoctor,
    adminUpdateDoctorReview,
} from "../../services/doctorService";
import { resolveUrl } from "../../hooks/profileHook"; // ← reuse the same resolver

export default function AdminDoctorDetails() {
    const { id } = useParams();
    const [doc, setDoc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const [notes, setNotes] = useState("");
    const [rate, setRate] = useState("");
    const [bust, setBust] = useState(0); // cache-bust like profile

    const load = async () => {
        setErr("");
        setLoading(true);
        try {
            const d = await adminGetDoctor(id);
            setDoc(d);
            setNotes(d?.adminNotes || "");
            setRate(d?.rate ?? "");
            setBust(Date.now());
        } catch (e) {
            setErr(e?.response?.data || e.message || "Failed to load doctor");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const onApprove = async () => {
        try {
            await adminApproveDoctor(id);
            await load();
        } catch (e) {
            alert(e?.response?.data || e.message || "Failed to approve");
        }
    };

    const onReject = async () => {
        const reason = prompt("Enter rejection reason (optional):") || "";
        try {
            await adminRejectDoctor(id, reason);
            await load();
        } catch (e) {
            alert(e?.response?.data || e.message || "Failed to reject");
        }
    };

    const onSave = async () => {
        try {
            await adminUpdateDoctorReview(id, { adminNotes: notes, rate });
            await load();
        } catch (e) {
            alert(e?.response?.data || e.message || "Failed to save review");
        }
    };

    if (loading) return <div className="p-6">Loading…</div>;
    if (err) return <div className="p-6 text-red-600">{err}</div>;
    if (!doc) return <div className="p-6">Not found</div>;

    const photoSrc = doc.profilePictureUrl
        ? `${resolveUrl(doc.profilePictureUrl)}${bust ? `?t=${bust}` : ""}`
        : "";

    return (
        <div className="p-6 space-y-4">
            <div>
                <Link to="/dashboard" className="text-blue-600 hover:underline">
                    ← Back to applications
                </Link>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left: Full Application */}
                <div className="xl:col-span-2 bg-white rounded-xl shadow p-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                        {/* Big photo */}
                        <div className="shrink-0">
                            {photoSrc ? (
                                <img
                                    src={photoSrc}
                                    alt={doc.name}
                                    className="w-40 h-40 rounded-2xl object-cover border"
                                />
                            ) : (
                                <div className="w-40 h-40 rounded-2xl bg-gray-100 grid place-items-center text-gray-400">
                                    No photo
                                </div>
                            )}
                        </div>

                        {/* Identity */}
                        <div className="flex-1">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl font-semibold">{doc.name}</h1>
                                    <div className="mt-1 text-gray-600">{doc.email}</div>
                                    {doc.phoneNumber && (
                                        <div className="text-gray-600">{doc.phoneNumber}</div>
                                    )}
                                    <div className="mt-2 flex flex-wrap items-center gap-2">
                                        <Badge>{doc.gender || "—"}</Badge>
                                        <Badge>{doc.specialty || "—"}</Badge>
                                        <Badge>{doc.approvalStatus}</Badge>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={onApprove}
                                        disabled={doc.approvalStatus === "APPROVED"}
                                        className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-50"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={onReject}
                                        disabled={doc.approvalStatus === "REJECTED"}
                                        className="px-4 py-2 rounded bg-red-50 text-red-700 border disabled:opacity-50"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>

                            {/* Application fields */}
                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field label="Consultation Fee" value={money(doc.consultationFee)} />
                                <Field label="Address" value={doc.address || "—"} />
                                <Field
                                    label="Available From"
                                    value={formatDT(doc.availableFrom) || doc.availability || "—"}
                                />
                                <Field label="Available To" value={formatDT(doc.availableTo) || "—"} />
                                <Field label="Reviewed At" value={formatDT(doc.reviewedAt) || "—"} />
                                <Field label="Rejection Reason" value={doc.rejectionReason || "—"} />
                                <Field label="Rate" value={doc.rate ?? "—"} />
                                <Field label="Updated" value={formatDT(doc.updatedAt) || "—"} />
                                <Field label="Created" value={formatDT(doc.createdAt) || "—"} />
                            </div>

                            {/* Bio */}
                            <div className="mt-6">
                                <h3 className="font-semibold mb-2">Bio</h3>
                                <div className="text-gray-800 whitespace-pre-wrap">
                                    {doc.bio || "—"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Admin Review box */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-semibold mb-3">Admin Review</h3>
                    <div className="mb-3">
                        <label className="block text-sm mb-1">Rate (optional)</label>
                        <input
                            value={rate}
                            onChange={(e) => setRate(e.target.value)}
                            type="number"
                            step="0.1"
                            className="border rounded-lg p-2 w-full"
                            placeholder="e.g., 4.5"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm mb-1">Notes</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="border rounded-lg p-2 w-full min-h-[160px]"
                            placeholder="Write your review/notes about this doctor…"
                        />
                    </div>
                    <button onClick={onSave} className="px-4 py-2 rounded bg-blue-600 text-white">
                        Save Review
                    </button>
                </div>
            </div>
        </div>
    );
}

/* Small UI helpers */

function Field({ label, value }) {
    return (
        <div>
            <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
            <div className="mt-0.5 font-medium text-gray-900">
                {isBlank(value) ? "—" : value}
            </div>
        </div>
    );
}

function Badge({ children }) {
    return (
        <span className="inline-block px-2 py-1 text-xs rounded bg-gray-100 text-gray-700">
            {children}
        </span>
    );
}

function isBlank(v) {
    return v === null || v === undefined || String(v).trim() === "";
}
function formatDT(val) {
    if (!val) return "";
    try {
        if (Array.isArray(val)) {
            const [y, m, d, hh = 0, mm = 0, ss = 0] = val;
            const dt = new Date(y, (m || 1) - 1, d || 1, hh, mm, ss);
            if (!Number.isNaN(dt.getTime())) return dt.toLocaleString();
        }
        const dt = new Date(val);
        if (!Number.isNaN(dt.getTime())) return dt.toLocaleString();
        return String(val);
    } catch {
        return String(val);
    }
}
function money(v) {
    if (v === null || v === undefined || v === "") return "—";
    const n = Number(v);
    return Number.isFinite(n) ? `L.E ${n.toFixed(2)}` : String(v);
}
