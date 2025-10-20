import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "frontend/src/context/AuthContext.jsx";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import useI18n from "../../hooks/useI18n";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (error) {
      setErr(error?.response?.data?.message || t("auth.errors.loginFailed"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{t("auth.welcomeBack")}</h1>
        <p className="text-gray-500 mb-6">
          {t("auth.loginToContinue", { app: t("appName") })}
        </p>

        {err && <div className="mb-4 text-red-600 text-sm">{err}</div>}

        <form onSubmit={submit} className="space-y-4">
          {/* Email */}
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

            {/* Show/Hide password icon */}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={showPassword ? t("actions.hide") : t("actions.show")}
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            {t("actions.login")}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-6 text-center">
          {t("auth.newToApp", { app: t("appName") })}{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            {t("actions.createAccount")}
          </Link>
        </p>
      </div>
    </div>
  );
}
