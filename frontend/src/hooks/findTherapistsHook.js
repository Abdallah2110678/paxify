import { useEffect, useState, useCallback } from "react";
import { getPublicDoctors } from "../services/doctorService";

export default function useFindTherapists() {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTherapists = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const list = await getPublicDoctors();
      setTherapists(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to load therapists");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTherapists();
  }, [fetchTherapists]);

  const onBook = useCallback((doctor) => {
    // Placeholder: navigate to booking page or open modal
    // Kept here to keep JSX dumb
    console.log("Book appointment with:", doctor);
  }, []);

  return { therapists, loading, error, fetchTherapists, onBook };
}
