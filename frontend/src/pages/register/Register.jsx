import { useAuth } from "frontend/src/context/AuthContext.jsx";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import useI18n from "../../hooks/useI18n";

export default function Register() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { t } = useI18n();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });
  const [err, setErr] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!form.gender) return setErr(t("auth.errors.selectGender"));
    if (form.password !== form.confirmPassword)
      return setErr(t("auth.errors.passwordsDontMatch"));

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      gender: form.gender.toLowerCase(),
      phoneNumber: form.phone, // backend expects phoneNumber
      address: "Cairo", // default, you can replace with real input later
    };

    try {
      await signup(payload);
      navigate("/login");
    } catch (e) {
      const message =
        e?.response?.data?.message ||
        t("auth.errors.registerFailed");
      setErr(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {t("auth.signUpHeadline")}
        </h1>
        <p className="text-gray-500 mb-6">
          {t("auth.signUpSub")}
        </p>
        {err && <div className="mb-4 text-red-600 text-sm">{err}</div>}

        <form
          onSubmit={submit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-700 mb-1">
              {t("auth.fullName")}
            </label>
            <input
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">{t("auth.email")}</label>
            <input
              type="email"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder={t("form.emailPlaceholder")}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">{t("auth.phone")}</label>
            <input
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder={t("form.phonePlaceholder")}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm text-gray-700 mb-1">{t("auth.password")}</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full border rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder={t("auth.passwordPlaceholder")}
              required
            />
            <button
              type="button"
              aria-label={showPassword ? t("actions.hide") : t("actions.show")}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </button>
          </div>

          {/* {t("auth.confirmPassword")} */}
          <div className="relative">
            <label className="block text-sm text-gray-700 mb-1">
              {t("auth.confirmPassword")}
            </label>
            <input
              type={showConfirm ? "text" : "password"}
              className="w-full border rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              placeholder={t("auth.passwordPlaceholder")}
              required
            />
            <button
              type="button"
              aria-label={showConfirm ? t("actions.hide") : t("actions.show")}
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showConfirm ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </button>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">{t("auth.gender")}</label>
            <select
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              required
            >
              <option value="">{t("auth.selectPlaceholder")}</option>
              <option value="MALE">{t("auth.genderMale")}</option>
              <option value="FEMALE">{t("auth.genderFemale")}</option>
              <option value="OTHER">{t("auth.genderOther")}</option>
            </select>
          </div>

          <button
            type="submit"
            className="md:col-span-2 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            {t("actions.createAccount")}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-6 text-center">
          {t("auth.alreadyHaveAccount")}{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            {t("actions.login")}
          </Link>
        </p>
      </div>
    </div>
  );
}
