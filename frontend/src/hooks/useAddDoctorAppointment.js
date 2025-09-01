import { useState, useCallback } from "react";

export default function useAddDoctorAppointment() {
  const [form, setForm] = useState({ dateTime: "", sessionType: "Online", price: "" });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setErr("");
    try {
      setSubmitting(true);
      // TODO: integrate backend service once API is ready
      // await createAppointment(form)
      console.log("Submitting Appointment:", form);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Failed to add appointment");
    } finally {
      setSubmitting(false);
    }
  }, [form]);

  return { form, submitting, err, handleChange, handleSubmit };
}
