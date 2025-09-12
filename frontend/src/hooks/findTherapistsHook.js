import { useEffect, useState, useCallback } from "react";
import { getPublicDoctors } from "../services/doctorService";
import { bookAppointment } from "../services/appointmentService";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-hot-toast";

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

  const onBook = useCallback(async (doctor, slot) => {
    try {
      if (!slot?.id) throw new Error("No appointment slot selected");
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You must be logged in to book an appointment");
      let patientId;
      try {
        const decoded = jwtDecode(token);
        patientId = decoded?.id || decoded?.userId || decoded?.sub;
      } catch (_) {
        // ignore
      }
      if (!patientId) throw new Error("Cannot determine patient ID from token");

      const bookingPromise = bookAppointment(slot.id, patientId);
      await toast.promise(bookingPromise, {
        loading: "Booking appointment…",
        success: "Appointment booked successfully",
        error: (e) => e?.response?.data?.message || e.message || "Failed to book appointment",
      });
    } catch (e) {
      toast.error(e?.message || "Failed to book appointment");
    }
  }, []);

  return { therapists, loading, error, fetchTherapists, onBook };
}
