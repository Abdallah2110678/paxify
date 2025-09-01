import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getPatients, deletePatient } from "../services/patientService";

const idOf = (row) => row?.id || row?._id || row?.userId;

export default function usePatients() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [query, setQuery] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const list = await getPatients();
      setRows(list);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Failed to load patients");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const filtered = useMemo(() => {
    if (!query) return rows;
    const q = query.toLowerCase();
    return rows.filter((p) => [p?.name, p?.email, p?.phoneNumber, p?.address, p?.gender]
      .some((v) => String(v ?? "").toLowerCase().includes(q)));
  }, [rows, query]);

  const onDelete = useCallback(async (row) => {
    const id = idOf(row);
    if (!id) return alert("Missing patient id.");
    if (!confirm(`Delete patient "${row?.name || row?.email || id}"?`)) return;
    try {
      setDeletingId(id);
      await deletePatient(id);
      setRows((prev) => prev.filter((r) => idOf(r) !== id));
    } catch (e) {
      alert(e?.response?.data?.message || e.message || "Failed to delete patient");
    } finally {
      setDeletingId(null);
    }
  }, []);

  const onEdit = useCallback((row) => {
    const id = idOf(row);
    navigate(`/dashboard/patients/${id}/edit`);
  }, [navigate]);

  const goAddPatient = useCallback(() => navigate("/dashboard/add-patient"), [navigate]);

  return {
    rows,
    loading,
    err,
    query,
    setQuery,
    deletingId,
    filtered,
    fetchRows,
    onDelete,
    onEdit,
    goAddPatient,
  };
}
