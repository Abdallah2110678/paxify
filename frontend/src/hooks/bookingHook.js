import { useCallback, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { bookAppointment } from "../services/appointmentService";
import { toast } from "react-hot-toast";
import { useBookingPatientForm } from "./patientHook";

// Encapsulates booking logic so JSX stays presentational
export default function useBooking() {
  const booking = useBookingPatientForm();
  const [pendingBanner, setPendingBanner] = useState("");

  const confirmBook = useCallback(async ({ slotId }) => {
    if (!slotId) throw new Error("No appointment slot selected");
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

    const p = bookAppointment(slotId, patientId, method);
    await toast.promise(p, {
      loading: "Booking appointment…",
      success: method === "VISA" ? "Appointment pending payment" : "Appointment booked successfully",
      error: (e) => e?.response?.data?.message || e.message || "Failed to book appointment",
    });

    booking.reset();
    setPendingBanner("");
  }, [booking]);

  return {
    form: booking.form,
    setName: booking.setName,
    setPhone: booking.setPhone,
    setEmail: booking.setEmail,
    setPaymentMethod: booking.setPaymentMethod,
    canBook: booking.canBook,
    pendingBanner,
    confirmBook,
    reset: booking.reset,
  };
}
