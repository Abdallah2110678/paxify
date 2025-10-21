import useI18n from "../../hooks/useI18n";

const Footer = () => {
    const { t, i18n } = useI18n();
    const isRTL = i18n.language?.startsWith("ar");

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <>
            <footer className="w-full bg-[#4CB5AB] text-white z-40">
                <div className="container mx-auto px-6 py-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <img src="/logo.png" alt="Paxify Logo" className="w-7 h-7 object-contain" />
                                <span className="text-xl font-bold tracking-wide">Paxify</span>
                            </div>
                            <p className="text-[#F4EDE4]/90 text-sm">
                                {t("footer.tagline", {
                                    defaultValue:
                                        "Your trusted partner in comprehensive healthcare management and wellness solutions.",
                                })}
                            </p>
                            <div className={`flex ${isRTL ? "space-x-reverse space-x-4" : "space-x-4"} text-xl`}>
                                <a
                                    className="text-[#F4EDE4] hover:text-white transition-colors"
                                    href="#"
                                    aria-label={t("footer.social.facebook", { defaultValue: "Facebook" })}
                                >
                                    📘
                                </a>
                                <a
                                    className="text-[#F4EDE4] hover:text-white transition-colors"
                                    href="#"
                                    aria-label={t("footer.social.twitter", { defaultValue: "Twitter" })}
                                >
                                    🐦
                                </a>
                                <a
                                    className="text-[#F4EDE4] hover:text-white transition-colors"
                                    href="#"
                                    aria-label={t("footer.social.instagram", { defaultValue: "Instagram" })}
                                >
                                    📷
                                </a>
                                <a
                                    className="text-[#F4EDE4] hover:text-white transition-colors"
                                    href="#"
                                    aria-label={t("footer.social.linkedin", { defaultValue: "LinkedIn" })}
                                >
                                    💼
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">{t("footer.quickLinks")}</h3>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a href="#" className="text-[#F4EDE4] hover:text-white transition-colors">
                                        {t("footer.about")}
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-[#F4EDE4] hover:text-white transition-colors">
                                        {t("footer.services")}
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-[#F4EDE4] hover:text-white transition-colors">
                                        {t("footer.findTherapists")}
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-[#F4EDE4] hover:text-white transition-colors">
                                        {t("footer.bookSession")}
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">{t("footer.support")}</h3>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a href="#" className="text-[#F4EDE4] hover:text-white transition-colors">
                                        {t("footer.helpCenter")}
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-[#F4EDE4] hover:text-white transition-colors">
                                        {t("footer.contactUs")}
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-[#F4EDE4] hover:text-white transition-colors">
                                        {t("footer.privacyPolicy")}
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-[#F4EDE4] hover:text-white transition-colors">
                                        {t("footer.termsOfService")}
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">{t("footer.contact")}</h3>
                            <div className="space-y-2 text-sm text-[#F4EDE4]">
                                <p className={`flex items-center ${isRTL ? "space-x-reverse" : ""} space-x-2`}>
                                    <span>📞</span>
                                    <span>{t("footer.phone")}</span>
                                </p>
                                <p className={`flex items-center ${isRTL ? "space-x-reverse" : ""} space-x-2`}>
                                    <span>📧</span>
                                    <span>{t("footer.email")}</span>
                                </p>
                                <p className={`flex items-center ${isRTL ? "space-x-reverse" : ""} space-x-2`}>
                                    <span>📍</span>
                                    <span>{t("footer.address")}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/30 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-[#F4EDE4] text-sm">
                            {t("footer.rights")}
                        </p>
                        <div className={`flex ${isRTL ? "space-x-reverse" : ""} space-x-6 mt-4 md:mt-0`}>
                            <a href="#" className="text-[#F4EDE4] hover:text-white text-sm transition-colors">
                                {t("footer.privacy")}
                            </a>
                            <a href="#" className="text-[#F4EDE4] hover:text-white text-sm transition-colors">
                                {t("footer.terms")}
                            </a>
                            <a href="#" className="text-[#F4EDE4] hover:text-white text-sm transition-colors">
                                {t("footer.cookies")}
                            </a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Back to Top button */}
            <button
                onClick={scrollToTop}
                className="fixed bottom-20 right-6 z-50 group bg-[#E68A6C] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                title={t("footer.backToTop")}
            >
                <div className="w-6 h-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                </div>
            </button>
        </>
    );
};

export default Footer;
