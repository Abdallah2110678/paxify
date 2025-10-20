import useI18n from "../hooks/useI18n";

const LanguageSwitcher = ({ className = "" }) => {
  const { i18n, t } = useI18n();

  const toggle = () => {
    const next = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(next);
  };

  const labelKey = i18n.language === "ar" ? "language.switchToEn" : "language.switchToAr";

  return (
    <button
      type="button"
      onClick={toggle}
      className={`px-3 py-2 rounded-full border border-white/60 text-white/90 hover:text-white hover:bg-white/20 transition-colors text-sm font-medium ${className}`}
    >
      {t(labelKey)}
    </button>
  );
};

export default LanguageSwitcher;

