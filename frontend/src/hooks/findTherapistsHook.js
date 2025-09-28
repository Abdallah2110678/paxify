import { useEffect, useState, useCallback } from "react";
import { getPublicDoctors } from "../services/doctorService";
import { bookAppointment } from "../services/appointmentService";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-hot-toast";
import { useBookingPatientForm } from "./patientHook";

export default function useFindTherapists() {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const booking = useBookingPatientForm();
  const [pendingBanner, setPendingBanner] = useState("");
  const [refreshKeys, setRefreshKeys] = useState({}); 

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

  // Open modal when user clicks BOOK from the schedule card
  const onBook = useCallback((doctor, slot) => {
    setSelectedDoctor(doctor || null);
    setSelectedSlot(slot || null);
    setPendingBanner("");
  }, []);

  // Actual booking action invoked from the modal
  const confirmBook = useCallback(async ({ slot }) => {
    try {
      if (!slot?.id) throw new Error("No appointment slot selected");
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You must be logged in to book an appointment");
      let patientId;
      try {
        const decoded = jwtDecode(token);
        patientId = decoded?.id || decoded?.userId || decoded?.sub;
      } catch (_) {}
      if (!patientId) throw new Error("Cannot determine patient ID from token");

      const method = booking.form.paymentMethod || "CASH";
      if (method === "VISA") {
        setPendingBanner("Your booking is pending payment confirmation.");
      }
      const p = bookAppointment(slot.id, patientId, method);
      await toast.promise(p, {
        loading: "Booking appointment…",
        success: method === "VISA" ? "Appointment pending payment" : "Appointment booked successfully",
        error: (e) => e?.response?.data?.message || e.message || "Failed to book appointment",
      });
      // bump refresh key for this doctor to trigger schedule refetch
      const did = selectedDoctor?.id || selectedDoctor?.userId || selectedDoctor?.doctorId;
      if (did) {
        setRefreshKeys((prev) => ({ ...prev, [did]: (prev[did] || 0) + 1 }));
      }
      booking.reset();
      setSelectedSlot(null);
      setSelectedDoctor(null);
      setPendingBanner("");
    } catch (e) {
      toast.error(e?.message || "Failed to book appointment");
    }
  }, [booking]);

  const bookingModalProps = {
    open: Boolean(selectedSlot),
    selectedSlot,
    doctor: selectedDoctor ? { name: selectedDoctor.name, address: selectedDoctor.address } : {},
    feeLabel: selectedDoctor?.consultationFee != null ? `L.E ${selectedDoctor.consultationFee}` : "",
    address: selectedDoctor?.address,
    form: booking.form,
    setName: booking.setName,
    setPhone: booking.setPhone,
    setEmail: booking.setEmail,
    paymentMethod: booking.form.paymentMethod,
    onPaymentMethodChange: booking.setPaymentMethod,
    pendingMessage: pendingBanner,
    canBook: booking.canBook,
    onBook: ({ name, phone, email, slot }) => confirmBook({ slot }),
    onClose: () => { setSelectedSlot(null); setSelectedDoctor(null); },
  };

  return { therapists, loading, error, fetchTherapists, onBook, bookingModalProps, refreshKeys };
}
