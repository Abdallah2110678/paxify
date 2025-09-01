import { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api";
import resolveUrl from "../utils/resolveUrl";

export default function useProfile() {
  const { user, logout, refreshUser } = useAuth();

  const [file, setFile] = useState(null);
  const [bust, setBust] = useState(0);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const onFileChange = (e) => setFile(e.target.files?.[0] || null);

  const getRolePath = () => {
    if (user?.role === "PATIENT") return "patient";
    if (user?.role === "DOCTOR") return "doctor";
    return ""; // ADMIN or fallback
  };

  const handleSave = async () => {
    const rolePath = getRolePath();
    const url = rolePath ? `/api/users/${user.id}/${rolePath}` : `/api/users/${user.id}`;
    await api.patch(url, { name: form.name, email: form.email });
    await refreshUser();
    alert("Profile updated successfully!");
  };

  const handlePhotoUpload = async () => {
    if (!file) return alert("Please choose a file first.");
    const formData = new FormData();
    formData.append("file", file);
    await api.post(`/api/users/${user.id}/profile-picture`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    await refreshUser();
    setBust(Date.now());
    alert("Profile picture updated successfully!");
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;
    const rolePath = getRolePath();
    const url = rolePath ? `/api/users/${user.id}/${rolePath}` : `/api/users/${user.id}`;
    await api.delete(url);
    logout();
    window.location.href = "/";
  };

  const avatarSrc = useMemo(() => {
    if (!user?.profilePictureUrl) return "";
    const base = resolveUrl(user.profilePictureUrl);
    return bust ? `${base}?t=${bust}` : base;
  }, [user?.profilePictureUrl, bust]);

  return {
    // data
    user,
    form,
    avatarSrc,

    // setters
    setForm,

    // handlers
    handleChange,
    onFileChange,
    handleSave,
    handlePhotoUpload,
    handleDelete,
  };
}
