import DoctorHook from "../../hooks/doctorHook";

export default function Doctors() {
    const { list } = DoctorHook();
    const {
        rows,
        loading,
        err,
        query,
        setQuery,
        filtered,
        deletingId,
        fetchRows,
        onDelete,
        onEdit,
        goAddDoctor,
    } = list;

    return (
        <div className="p-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Doctor Management</h2>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search name, email, specialty, address…"
                            className="w-72 rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            onClick={fetchRows}
                            className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50"
                        >
                            ⟳ Reload
                        </button>
                        <button
                            onClick={goAddDoctor}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Add New Doctor
                        </button>
                    </div>
                </div>
                {loading && <div className="p-6 text-center text-slate-500">Loading…</div>}

                {err && !loading && (
                    <div className="p-4 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
                        {err}
                    </div>
                )}

                {!loading && !err && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filtered.length === 0 && (
                                    <tr>
                                        <td className="px-6 py-6 text-center text-slate-500" colSpan={5}>
                                            No doctors found.
                                        </td>
                                    </tr>
                                )}

                                {filtered.map((d) => {
                                    const id = d?.id || d?._id || d?.userId || d?.uuid || d?.doctorId || `${d?.email || d?.name}`;
                                    return (
                                        <tr key={id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{d?.name || "—"}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{d?.email || "—"}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{d?.specialty || "—"}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{d?.address || "—"}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="inline-flex gap-2">
                                                    <button
                                                        onClick={() => onEdit(d)}
                                                        className="px-3 py-1 rounded-lg bg-amber-500/15 text-amber-700 hover:bg-amber-500/20"
                                                        title="Edit"
                                                    >
                                                        ✎ Edit
                                                    </button>
                                                    <button
                                                        onClick={() => onDelete(d)}
                                                        disabled={deletingId === id}
                                                        className={`px-3 py-1 rounded-lg ${deletingId === id
                                                                ? "bg-rose-300/20 text-rose-400"
                                                                : "bg-rose-500/15 text-rose-700 hover:bg-rose-500/20"
                                                            }`}
                                                        title="Delete"
                                                    >
                                                        🗑 {deletingId === id ? "Deleting…" : "Delete"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
