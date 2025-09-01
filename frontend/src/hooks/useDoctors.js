import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDoctors, deleteDoctor } from "../services/doctorService";

const idOf = (row) => row?.id || row?.userId || row?._id;

export default function useDoctors() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [query, setQuery] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const fetchRows = async () => {
    setLoading(true);
    setErr("");
    try {
      const list = await getDoctors();
      setRows(list);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    if (!query) return rows;
    const q = query.toLowerCase();
    return rows.filter((d) =>
      [d?.name, d?.email, d?.specialty, d?.address].some((v) => String(v ?? "").toLowerCase().includes(q))
    );
  }, [rows, query]);

  const onDelete = async (row) => {
    const id = idOf(row);
    if (!id) return alert("Missing doctor id.");
    if (!confirm(`Delete doctor "${row?.name || row?.email || id}"?`)) return;
    try {
      setDeletingId(id);
      await deleteDoctor(id);
      setRows((prev) => prev.filter((r) => idOf(r) !== id));
    } catch (e) {
      alert(e?.response?.data?.message || e.message || "Failed to delete doctor");
    } finally {
      setDeletingId(null);
    }
  };

  const onEdit = (row) => {
    const id = idOf(row);
    if (!id) return alert("Missing doctor id.");
    navigate(`/dashboard/doctors/${id}/edit`);
  };

  const goAddDoctor = () => navigate("/dashboard/add-doctor");

  return {
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
  };
}
