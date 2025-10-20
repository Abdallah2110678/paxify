import { useTranslation } from "react-i18next";

export default function useI18n(namespace = "common") {
  const { t, i18n } = useTranslation(namespace);

  const translate = (key, fallback, options) =>
    t(key, { defaultValue: fallback ?? key, ...options });

  return { t: translate, i18n };
}

