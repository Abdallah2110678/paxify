import { useState, useCallback } from "react";
import { createDoctor } from "../services/doctorService";
import { toast } from "react-hot-toast";

export default function useAddDoctor() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    password: "",
    role: "DOCTOR",
    gender: "",
    specialty: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.gender || !form.specialty) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      setLoading(true);
      const payload = {
        name: form.name,
        email: form.email,
        phoneNumber: form.phoneNumber || null,
        address: form.address || null,
        password: form.password,
        role: form.role,
        gender: form.gender,
        specialty: form.specialty,
      };
      const { data } = await createDoctor(payload);
      toast.success(`Doctor ${data.name} added successfully!`);
      setForm({
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
        password: "",
        role: "DOCTOR",
        gender: "",
        specialty: "",
      });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create doctor");
    } finally {
      setLoading(false);
    }
  }, [form]);

  return { form, loading, handleChange, handleSubmit };
}
