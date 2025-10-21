import { useTranslation } from "react-i18next";

export default function useI18n(namespace = "common") {
  const { t, i18n } = useTranslation(namespace);

  const translate = (key, fallbackOrOptions, maybeOptions) => {
    let fallback = fallbackOrOptions;
    let options = maybeOptions;

    if (typeof fallbackOrOptions === "object" && fallbackOrOptions !== null && maybeOptions === undefined) {
      options = { ...fallbackOrOptions };
      fallback = options.defaultValue;
      delete options.defaultValue;
    }

    const defaultValue = fallback ?? key;
    return t(key, { defaultValue, ...(options || {}) });
  };

  return { t: translate, i18n };
}

