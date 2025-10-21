import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import {
    adminApproveDoctor,
    adminGetDoctor,
    adminRejectDoctor,
    adminUpdateDoctorReview,
} from "../../services/doctorService";
import { resolveUrl } from "../../hooks/profileHook";

export default function AdminDoctorDetails({ doctorId: propDoctorId, showBackLink = true }) {
    const { id: routeId } = useParams();
    const [searchParams] = useSearchParams();
    const doctorId = propDoctorId ?? routeId ?? searchParams.get("id");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [doctor, setDoctor] = useState(null);
    const [notes, setNotes] = useState("");
    const [rate, setRate] = useState("");
    const [cacheBust, setCacheBust] = useState(0);

    useEffect(() => {
        let ignore = false;

        const load = async () => {
            if (!doctorId) {
                setDoctor(null);
                setNotes("");
                setRate("");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");
                const data = await adminGetDoctor(doctorId);
                if (ignore) return;
                setDoctor(data);
                setNotes(data?.adminNotes || "");
                setRate(data?.rate ?? "");
                setCacheBust(Date.now());
            } catch (err) {
                if (ignore) return;
                setError(err?.response?.data || err?.message || "Failed to load doctor");
                setDoctor(null);
            } finally {
                if (!ignore) setLoading(false);
            }
        };

        load();

        return () => {
            ignore = true;
        };
    }, [doctorId]);

    const refresh = async () => {
        if (!doctorId) return;
        try {
            const data = await adminGetDoctor(doctorId);
            setDoctor(data);
            setNotes(data?.adminNotes || "");
            setRate(data?.rate ?? "");
            setCacheBust(Date.now());
        } catch (err) {
            setError(err?.response?.data || err?.message || "Failed to refresh doctor");
        }
    };

    const handleApprove = async () => {
        if (!doctorId) return;
        try {
            await adminApproveDoctor(doctorId);
            await refresh();
        } catch (err) {
            alert(err?.response?.data || err?.message || "Failed to approve");
        }
    };

    const handleReject = async () => {
        if (!doctorId) return;
        const reason = prompt("Enter rejection reason (optional):") || "";
        try {
            await adminRejectDoctor(doctorId, reason);
            await refresh();
        } catch (err) {
            alert(err?.response?.data || err?.message || "Failed to reject");
        }
    };

    const handleSave = async () => {
        if (!doctorId) return;
        try {
            await adminUpdateDoctorReview(doctorId, { adminNotes: notes, rate });
            await refresh();
        } catch (err) {
            alert(err?.response?.data || err?.message || "Failed to save review");
        }
    };

    if (!doctorId) {
        return <div className="p-6 text-gray-500">No doctor selected.</div>;
    }

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-600">{error}</div>;
    }

    if (!doctor) {
        return <div className="p-6">Doctor not found.</div>;
    }

    const photoSrc = doctor.profilePictureUrl
        ? `${resolveUrl(doctor.profilePictureUrl)}${cacheBust ? `?t=${cacheBust}` : ""}`
        : "";

    return (
        <div className="space-y-6">
            {showBackLink && (
                <div>
                    <Link to="/dashboard?tab=Applications" className="text-blue-600 hover:underline">
                        ← Back to applications
                    </Link>
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <section className="xl:col-span-2 bg-white rounded-xl shadow p-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                        <div className="shrink-0">
                            {photoSrc ? (
                                <img src={photoSrc} alt={doctor.name} className="w-40 h-40 rounded-2xl object-cover border" />
                            ) : (
                                <div className="w-40 h-40 rounded-2xl bg-gray-100 grid place-items-center text-gray-400">
                                    No photo
                                </div>
                            )}
                        </div>

                        <div className="flex-1 space-y-6">
                            <header className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl font-semibold text-gray-900">{doctor.name}</h1>
                                    <div className="mt-1 text-gray-600">{doctor.email}</div>
                                    {doctor.phoneNumber && <div className="text-gray-600">{doctor.phoneNumber}</div>}
                                    <div className="mt-3 flex flex-wrap items-center gap-2">
                                        <Badge>{doctor.gender || "N/A"}</Badge>
                                        <Badge>{doctor.specialty || "N/A"}</Badge>
                                        <Badge>{doctor.approvalStatus}</Badge>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={handleApprove}
                                        disabled={doctor.approvalStatus === "APPROVED"}
                                        className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-50"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={handleReject}
                                        disabled={doctor.approvalStatus === "REJECTED"}
                                        className="px-4 py-2 rounded bg-red-50 text-red-700 border disabled:opacity-50"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </header>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field label="Consultation Fee" value={money(doctor.consultationFee)} />
                                <Field label="Address" value={doctor.address || "N/A"} />
                                <Field label="Availability" value={availabilityLabel(doctor)} />
                                <Field label="Reviewed At" value={formatDT(doctor.reviewedAt) || "N/A"} />
                                {doctor.rejectionReason && (
                                    <Field label="Rejection Reason" value={doctor.rejectionReason} />
                                )}
                            </div>

                            <section>
                                <h3 className="font-semibold mb-2 text-gray-900">Bio</h3>
                                <div className="text-gray-800 whitespace-pre-wrap">
                                    {doctor.bio || "N/A"}
                                </div>
                            </section>
                        </div>
                    </div>
                </section>

                <aside className="bg-white rounded-xl shadow p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Admin Review</h3>

                    <label className="block text-sm text-gray-700">
                        <span className="mb-1 block">Rate (optional)</span>
                        <input
                            value={rate}
                            onChange={(e) => setRate(e.target.value)}
                            type="number"
                            step="0.1"
                            className="border rounded-lg p-2 w-full"
                            placeholder="e.g., 4.5"
                        />
                    </label>

                    <label className="block text-sm text-gray-700">
                        <span className="mb-1 block">Notes</span>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="border rounded-lg p-2 w-full min-h-[160px]"
                            placeholder="Write your review/notes about this doctor..."
                        />
                    </label>

                    <button onClick={handleSave} className="w-full px-4 py-2 rounded bg-blue-600 text-white">
                        Save Review
                    </button>
                </aside>
            </div>
        </div>
    );
}

function Field({ label, value }) {
    return (
        <div>
            <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
            <div className="mt-0.5 font-medium text-gray-900">{isBlank(value) ? "N/A" : value}</div>
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

function isBlank(value) {
    return value === null || value === undefined || String(value).trim() === "";
}

function formatDT(value) {
    if (!value) return "";
    try {
        if (Array.isArray(value)) {
            const [y, m, d, hh = 0, mm = 0, ss = 0] = value;
            const dt = new Date(y, (m || 1) - 1, d || 1, hh, mm, ss);
            if (!Number.isNaN(dt.getTime())) return dt.toLocaleString();
        }
        const dt = new Date(value);
        if (!Number.isNaN(dt.getTime())) return dt.toLocaleString();
        return String(value);
    } catch (err) {
        return String(value);
    }
}

function money(value) {
    if (value === null || value === undefined || value === "") return "N/A";
    const num = Number(value);
    return Number.isFinite(num) ? `L.E ${num.toFixed(2)}` : String(value);
}

function availabilityLabel(doctor) {
    const from = formatDT(doctor?.availableFrom);
    const to = formatDT(doctor?.availableTo);
    const plain = doctor?.availability;
    if (from && to) return `${from} → ${to}`;
    if (plain) return String(plain);
    return "N/A";
}
