import useHome from "../../hooks/homeHook.js";
import useI18n from "../../hooks/useI18n.js";

export default function Home() {
    const {
        // state
        hoveredCard,
        setHoveredCard,
        openFaq,
        setOpenFaq,

        // data
        testimonials,
        steps,
        helpBoxes,
        therapists,
        faqs,

        // refs
        rowRef,
        therapistsRowRef,

        // handlers
        handleBrowseTherapists,
        handleKnowMore,
        handleBooking,
        handleWatchSessions,
        therapistsPrev,
        therapistsNext,
    } = useHome();

    const { t, i18n } = useI18n();
    // ✅ Normalize "Why Paxify?" cards safely
    const whyCardsRaw = t("home.why.cards", { returnObjects: true });
    const whyCards = Array.isArray(whyCardsRaw)
        ? whyCardsRaw
        : (whyCardsRaw && typeof whyCardsRaw === "object")
            ? Object.values(whyCardsRaw)
            : [];

    // Optional fallback if still empty
    const whyCardsSafe = whyCards.length ? whyCards : [
        { title: "Therapists who listen", desc: "We partner only with therapists known for their expertise and approachable style so your experience stays smooth and supportive." },
        { title: "Full confidentiality", desc: "We use advanced technology to guarantee your privacy and never share your data with third parties." },
        { title: "Immediate sessions", desc: "Start your consultation right away without long waiting lists." },
        { title: "Fits your budget", desc: "Choose the price that works for you and we will recommend the right therapists." },
        { title: "Flexible payment methods", desc: "Pay safely and easily through multiple payment options." },
    ];

    // Optional RTL support
    const isRTL = i18n?.language?.startsWith("ar");
    const dir = isRTL ? "rtl" : "ltr";

    return (
        <div dir={dir} className="min-h-screen bg-white text-[#6B6B6B] overflow-x-hidden max-w-full">
            {/* SECTION 1: HERO */}
            <section className="relative overflow-hidden flex flex-col md:flex-row min-h-[calc(100vh-80px)]">
                {/* Left Half */}
                <div className="w-full md:w-1/2 bg-[#F4EDE4] flex items-center justify-center p-6 sm:p-8 md:p-12 lg:p-16 min-h-[50vh] md:min-h-full">
                    <div className="max-w-lg w-full">
                        <h1
                            className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight break-words"
                            style={{ color: "#2B2B2B", fontWeight: "normal" }}
                        >
                            {t("home.hero.title")}{" "}
                            <span
                                style={{
                                    fontWeight: "bold",
                                    fontStyle: "italic",
                                    fontFamily: '"Playfair Display", "Georgia", "Times New Roman", serif',
                                    position: "relative",
                                    display: "inline-block",
                                    letterSpacing: "0.02em",
                                }}
                            >
                                {t("home.hero.highlight")}
                                <svg
                                    style={{ position: "absolute", bottom: "-6px", left: "0", width: "100%", height: "10px" }}
                                    viewBox="0 0 200 10"
                                    preserveAspectRatio="none"
                                >
                                    <path d="M0,6 Q100,3 200,6" stroke="#4ECDC4" strokeWidth="4" fill="none" strokeLinecap="round" />
                                </svg>
                            </span>
                        </h1>

                        <p className="mt-4 sm:mt-6 text-[#6B6B6B] text-base sm:text-lg md:text-xl font-medium break-words">
                            {t("home.hero.subtitle")}
                        </p>

                        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <button
                                onClick={handleBrowseTherapists}
                                className="rounded-full px-6 py-3 font-semibold bg-[#E68A6C] hover:bg-[#d97a5f] text-white shadow-lg text-center"
                            >
                                {t("actions.browseTherapists")}
                            </button>
                            <button
                                onClick={handleKnowMore}
                                className="rounded-full px-6 py-3 font-semibold bg-white hover:bg-white/80 text-[#2B2B2B] shadow-lg border border-[#4CB5AB]/20 text-center"
                            >
                                {t("actions.knowMore")}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Half */}
                <div
                    className="w-full md:w-1/2 relative flex items-center justify-center p-6 sm:p-8 md:p-12 lg:p-16 min-h-[50vh] md:min-h-full"
                    style={{ backgroundImage: "url('/hero_section.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
                >
                    <div className="absolute inset-0 bg-black/40"></div>

                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl border border-white/20 relative z-10 w-full max-w-sm sm:max-w-md">
                        <h3 className="text-lg sm:text-xl font-semibold text-[#2B2B2B] mb-1">
                            {t("home.quickActions.title")}
                        </h3>
                        <div className="w-12 h-1 bg-gradient-to-r from-[#4CB5AB] to-[#E68A6C] rounded mb-4"></div>

                        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
                            <button
                                onClick={() => handleBooking("in-person")}
                                className="group h-24 sm:h-28 rounded-xl bg-gradient-to-br from-[#4CB5AB] to-[#44A08D] text-white transition-all duration-500 ease-out flex flex-col items-center justify-center relative overflow-hidden hover:shadow-2xl hover:shadow-[#4CB5AB]/30 hover:-translate-y-1 hover:scale-105 before:absolute before:inset-0 before:bg-white/20 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent after:-translate-x-full after:transition-transform after:duration-700 hover:after:translate-x-full"
                            >
                                <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-300 relative z-10">👥</span>
                                <span className="mt-1 sm:mt-2 font-medium text-xs sm:text-sm relative z-10 group-hover:text-white transition-colors text-center px-1 break-words">
                                    {t("home.quickActions.bookClinic")}
                                </span>
                            </button>

                            <button
                                onClick={() => handleBooking("online")}
                                className="group h-24 sm:h-28 rounded-xl bg-gradient-to-br from-[#E68A6C] to-[#D4A44A] text-white transition-all duration-500 ease-out flex flex-col items-center justify-center relative overflow-hidden hover:shadow-2xl hover:shadow-[#E68A6C]/30 hover:-translate-y-1 hover:scale-105 before:absolute before:inset-0 before:bg-white/20 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent after:-translate-x-full after:transition-transform after:duration-700 hover:after:translate-x-full"
                            >
                                <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-300 relative z-10">💻</span>
                                <span className="mt-1 sm:mt-2 font-medium text-xs sm:text-sm relative z-10 group-hover:text-white transition-colors text-center px-1 break-words">
                                    {t("home.quickActions.bookOnline")}
                                </span>
                            </button>

                            <button
                                onClick={() => handleBooking("shop")}
                                className="group h-24 sm:h-28 rounded-xl bg-gradient-to-r from-[#D4B896] via-[#4CB5AB] to-[#E68A6C] text-white transition-all duration-500 ease-out flex flex-col items-center justify-center col-span-2 relative overflow-hidden hover:shadow-2xl hover:shadow-[#4CB5AB]/25 hover:-translate-y-1 hover:scale-105 before:absolute before:inset-0 before:bg-white/20 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/15 after:to-transparent after:-translate-x-full after:transition-transform after:duration-700 hover:after:translate-x-full"
                            >
                                <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-300 relative z-10">🛒</span>
                                <span className="mt-1 sm:mt-2 font-medium text-xs sm:text-sm relative z-10 group-hover:text-white transition-colors text-center px-1 break-words">
                                    {t("home.quickActions.shopTools")}
                                </span>
                            </button>
                        </div>

                        <div className="mt-4 sm:mt-6 p-2 sm:p-3 bg-gradient-to-r from-[#4CB5AB]/10 to-[#E68A6C]/10 rounded-lg hover:from-[#4CB5AB]/15 hover:to-[#E68A6C]/15 transition-all duration-300">
                            <p className="text-xs sm:text-sm text-[#6B6B6B] text-center break-words leading-relaxed">
                                <span className="text-[#4CB5AB] font-medium hover:text-[#44A08D] transition-colors cursor-default">
                                    {t("home.hero.secure")}
                                </span>{" "}
                                •
                                <span className="text-[#E68A6C] font-medium hover:text-[#D4A44A] transition-colors cursor-default">
                                    {" "}{t("home.hero.licensed")}
                                </span>{" "}
                                •
                                <span className="text-[#D4A44A] font-medium hover:text-[#E68A6C] transition-colors cursor-default">
                                    {" "}{t("home.hero.bilingual")}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 2: TESTIMONIALS */}
            <section className="py-16 md:py-20 bg-[#F4EDE4]">
                <div className="container mx-auto max-w-7xl px-6">
                    <h4 className="text-center text-2xl md:text-1xl font-bold text-[#2B2B2B]">
                        {t("home.testimonials.headline")}
                    </h4>
                    <h2 className="text-center text-3xl md:text-4xl font-bold text-[#2B2B2B]">
                        {t("home.testimonials.subheadline")}
                    </h2>

                    <div className="mt-10 relative">
                        {/* Left arrow */}
                        <button
                            onClick={() => {
                                const el = rowRef.current;
                                if (!el) return;
                                el.scrollBy({ left: -el.clientWidth * 0.9, behavior: "smooth" });
                            }}
                            aria-label={t("actions.back")}
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow ring-1 ring-[#4CB5AB]/30 hover:bg-[#F4EDE4] w-10 h-10 rounded-full flex items-center justify-center text-[#2B2B2B]"
                        >
                            ‹
                        </button>

                        {/* Viewport */}
                        <div className="relative overflow-hidden">
                            <div
                                ref={rowRef}
                                className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-px-6 pb-6 -mb-6 pr-2 pl-12 md:pl-14 md:pr-14 hide-scrollbar"
                                onMouseEnter={() => (rowRef.current.__paused = true)}
                                onMouseLeave={() => (rowRef.current.__paused = false)}
                            >
                                {testimonials.map((tst, i) => (
                                    <article key={i} className="min-w-[320px] max-w-[360px] snap-start bg-white rounded-2xl shadow-md p-6 border border-[#4CB5AB]/10">
                                        <p className="text-[#2B2B2B]">"{tst.quote}"</p>
                                        <div className="mt-6 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#4CB5AB]/15 flex items-center justify-center">🗣️</div>
                                            <div>
                                                <p className="font-semibold text-[#2B2B2B]">{tst.name}</p>
                                                <p className="text-sm text-[#6B6B6B]">{tst.role}</p>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>

                        {/* Right arrow */}
                        <button
                            onClick={() => {
                                const el = rowRef.current;
                                if (!el) return;
                                el.scrollBy({ left: el.clientWidth * 0.9, behavior: "smooth" });
                            }}
                            aria-label={t("actions.loadMore")} // or add actions.next for accuracy
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow ring-1 ring-[#4CB5AB]/30 hover:bg-[#F4EDE4] w-10 h-10 rounded-full flex items-center justify-center text-[#2B2B2B]"
                        >
                            ›
                        </button>

                        {/* CTA under row */}
                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={handleBrowseTherapists}
                                className="rounded-full px-6 py-3 font-semibold bg-[#E68A6C] hover:bg-[#d97a5f] text-white shadow"
                            >
                                {t("actions.browseTherapists")}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 4: HOW WE HELP */}
            <section className="py-16 md:py-20 bg-[#F4EDE4]">
                <div className="container mx-auto max-w-7xl px-6">
                    <header className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#2B2B2B]">
                            {t("home.support.title")}
                        </h2>
                    </header>

                    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {helpBoxes.map((box, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-[#4CB5AB]/15 shadow-sm p-6 flex flex-col">
                                <div className="text-3xl" aria-hidden>{box.icon}</div>
                                <h3 className="mt-4 text-lg font-semibold text-[#2B2B2B]">{box.title}</h3>
                                <p className="mt-2 leading-relaxed text-[#6B6B6B]">{box.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 flex justify-center">
                        <button
                            onClick={handleBrowseTherapists}
                            className="rounded-full px-6 py-3 font-semibold bg-[#E68A6C] hover:bg-[#d97a5f] text-white shadow"
                        >
                            {t("actions.browseTherapists")}
                        </button>
                    </div>
                </div>
            </section>

            {/* SECTION 3: HOW IT WORKS */}
            <section className="py-16 md:py-20 bg-white">
                <div className="container mx-auto max-w-5xl px-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-[#2B2B2B]">{t("home.howItWorks.title")}</h2>

                    <div className="mt-12 relative">
                        <div
                            className={`absolute ${
                                isRTL ? "right-4 md:right-1/2 translate-x-1/2" : "left-4 md:left-1/2 -translate-x-1/2"
                            } md:translate-x-0 top-0 bottom-0 w-1 bg-[#4CB5AB]/30 rounded`}
                        ></div>

                        <ol className="space-y-10">
                            {steps.map((s, idx) => {
                                const isEven = idx % 2 === 0;
                                const containerClasses = isRTL
                                    ? `relative md:w-[46%] ${isEven ? "md:mr-auto md:pr-8" : "md:pl-8"}`
                                    : `relative md:w-[46%] ${isEven ? "md:ml-auto md:pl-8" : "md:pr-8"}`;
                                const dotBase =
                                    "absolute top-3 w-6 h-6 rounded-full bg-[#4CB5AB] border-4 border-white shadow";
                                const dotClasses = isRTL
                                    ? `${dotBase} -right-5 md:right-auto md:${isEven ? "-right-5" : "-left-5"}`
                                    : `${dotBase} -left-5 md:left-auto md:${isEven ? "-left-5" : "-right-5"}`;

                                return (
                                    <li key={idx} className="relative">
                                        <div className={containerClasses}>
                                            <span className={dotClasses} />
                                            <div className="bg-[#F4EDE4] rounded-2xl p-6 shadow-sm border border-[#4CB5AB]/10">
                                                <h3 className="text-xl font-semibold text-[#2B2B2B]">{s.title}</h3>
                                                <p className="mt-2 text-[#6B6B6B]">{s.desc}</p>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ol>
                    </div>

                    <div className="mt-12 flex justify-center">
                        <button
                            onClick={handleBrowseTherapists}
                            className="rounded-full px-6 py-3 font-semibold bg-[#E68A6C] hover:bg-[#d97a5f] text-white shadow"
                        >
                            {t("actions.browseTherapists")}
                        </button>
                    </div>
                </div>
            </section>

            {/* SECTION 5: MEET OUR THERAPISTS */}
            <section className="py-16 md:py-20 bg-white">
                <div className="container mx-auto max-w-7xl px-6">
                    <header className="max-w-3xl">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#2B2B2B]">{t("home.therapists.title")}</h2>
                        <h3 className="text-1xl md:text-2xl text-[#2B2B2B]">{t("home.therapists.subtitle")}</h3>
                    </header>

                    <div className="mt-10 relative">
                        <button
                            onClick={therapistsPrev}
                            aria-label={t("actions.back")}
                            className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow ring-1 ring-[#4CB5AB]/30 hover:bg-[#F4EDE4] w-10 h-10 rounded-full items-center justify-center text-[#2B2B2B]"
                        >
                            ‹
                        </button>

                        <div className="relative overflow-hidden">
                            <ul
                                ref={therapistsRowRef}
                                className="flex items-stretch gap-6 overflow-x-auto snap-x snap-mandatory scroll-px-6 pb-6 -mb-6 pr-2 pl-12 md:pl-14 md:pr-14 hide-scrollbar"
                                onMouseEnter={() => (therapistsRowRef.current.__paused = true)}
                                onMouseLeave={() => (therapistsRowRef.current.__paused = false)}
                            >
                                {therapists.map((th, i) => (
                                    <li
                                        key={i}
                                        data-therapist-card="1"
                                        className="snap-start flex-none w-[88%] sm:w-[70%] md:w-[48%] lg:w-[32%] xl:w-[28%] rounded-2xl border border-[#4CB5AB]/15 shadow-sm p-6 hover:shadow-md transition bg-white flex flex-col"
                                    >
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={th.avatar}
                                                alt={th.name}
                                                className="w-16 h-16 rounded-full object-cover bg-[#F4EDE4]"
                                                onError={(e) => {
                                                    e.currentTarget.src =
                                                        "data:image/svg+xml;utf8,\n<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='100%' height='100%' fill='%23F4EDE4'/><text x='50%' y='54%' text-anchor='middle' font-size='14' fill='%234CB5AB'>👩‍⚕️</text></svg>";
                                                }}
                                            />
                                            <div>
                                                <p className="font-semibold text-[#2B2B2B]">{th.name}</p>
                                                {th.availability && <p className="text-sm text-[#6B6B6B]">{th.availability}</p>}
                                            </div>
                                        </div>

                                        <dl className="mt-4 text-sm">
                                            {th.specialty?.length > 0 && (
                                                <div className="flex gap-2 mt-1">
                                                    <dt className="font-medium text-[#2B2B2B] flex-shrink-0">{t("home.therapists.areas")}</dt>
                                                    <dd className="text-[#6B6B6B] flex-1 truncate">{th.specialty.join(", ")}</dd>
                                                </div>
                                            )}
                                            {th.style && (
                                                <div className="flex gap-2 mt-1">
                                                    <dt className="font-medium text-[#2B2B2B] flex-shrink-0">{t("home.therapists.style")}</dt>
                                                    <dd className="text-[#6B6B6B] flex-1 truncate">{th.style}</dd>
                                                </div>
                                            )}
                                            {th.rating !== undefined && (
                                                <div className="flex gap-2 mt-1">
                                                    <dt className="font-medium text-[#2B2B2B]">{t("home.therapists.rating")}</dt>
                                                    <dd className="text-[#6B6B6B]">{th.rating} ⭐</dd>
                                                </div>
                                            )}
                                        </dl>

                                        <button
                                            onClick={handleBrowseTherapists}
                                            className="mt-auto w-full rounded-full px-5 py-3 font-semibold bg-[#E68A6C] hover:bg-[#d97a5f] text-white shadow"
                                        >
                                            {t("actions.browseTherapists")}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button
                            onClick={therapistsNext}
                            aria-label={t("actions.loadMore")} // or actions.next
                            className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow ring-1 ring-[#4CB5AB]/30 hover:bg-[#F4EDE4] w-10 h-10 rounded-full items-center justify-center text-[#2B2B2B]"
                        >
                            ›
                        </button>
                    </div>
                </div>
            </section>

            {/* SECTION 6: WHY PAXIFY? */}
            <section className="py-16 md:py-20 bg-[#F4EDE4]">
                <div className="container mx-auto max-w-7xl px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#2B2B2B] mb-4">{t("home.why.title")}</h2>
                        <p className="text-lg text-[#6B6B6B] max-w-2xl mx-auto">{t("home.why.subtitle")}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 items-stretch">
                        {whyCardsSafe.map((f, i) => (
                            <div
                                key={i}
                                className="group relative overflow-hidden rounded-2xl border border-[#4CB5AB]/15 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#4CB5AB]/30 hover:shadow-lg h-full flex flex-col"
                            >
                                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-[#4CB5AB]/10 to-[#4CB5AB]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                <div className="relative z-10 flex flex-col grow">
                                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4CB5AB]/20 to-[#E68A6C]/20 transition-transform duration-300 group-hover:scale-110">
                                        <span className="text-2xl" role="img" aria-hidden="true">
                                            {["👂", "🔒", "⚡", "💰", "💳"][i] || "✅"}
                                        </span>
                                    </div>

                                    <h3 className="mb-3 text-xl font-bold text-[#2B2B2B] transition-colors duration-300 group-hover:text-[#4CB5AB]">
                                        {f.title}
                                    </h3>

                                    <p className="text-[#6B6B6B] leading-relaxed">{f.desc}</p>
                                    <div className="mt-auto pt-4" />
                                </div>

                                <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-3xl bg-gradient-to-br from-[#4CB5AB]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            </div>
                        ))}
                    </div>

                    {/* CTA under Why */}
                    <div className="mt-12 text-center">
                        <div className="mx-auto max-w-2xl rounded-2xl border border-[#4CB5AB]/20 bg-white p-8 shadow-sm">
                            <h3 className="mb-3 text-2xl font-bold text-[#2B2B2B]">
                                {t("home.cta.title", { defaultValue: "Ready to get started?" })}
                            </h3>
                            <p className="mb-6 text-[#6B6B6B]">
                                {t("home.cta.subtitle", { defaultValue: "Join thousands of families who have found their perfect therapist match." })}
                            </p>

                            <div className="flex flex-col justify-center gap-4 sm:flex-row">
                                <button
                                    onClick={handleBrowseTherapists}
                                    className="group rounded-full bg-[#E68A6C] px-8 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#d97a5f] hover:shadow-xl"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        {t("actions.browseTherapists")}
                                        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                                    </span>
                                </button>

                                <button
                                    onClick={handleKnowMore}
                                    className="rounded-full border-2 border-[#4CB5AB] px-8 py-4 font-semibold text-[#4CB5AB] transition-all duration-300 hover:border-[#44A08D] hover:bg-[#4CB5AB]/10 hover:text-[#44A08D]"
                                >
                                    {t("actions.knowMore")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 7: STRONG CTA */}
            <section className="py-16 md:py-20 bg-[#4CB5AB] text-white">
                <div className="container mx-auto max-w-5xl px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold">
                        {t("home.ctaStrong.title", { defaultValue: isRTL ? "المساعدة على بُعد نقرة" : "Help Is One Click Away" })}
                    </h2>
                    <p className="mt-4 text-white/90 text-lg">
                        {t("home.ctaStrong.subtitle", {
                            defaultValue: isRTL
                                ? "احجز جلستك اليوم واتخذ الخطوة الأولى نحو راحة البال التي تبحث عنها."
                                : "Book your session today and take the first step toward the peace of mind you’ve been searching for.",
                        })}
                    </p>
                    <div className="mt-8">
                        <button
                            onClick={handleBrowseTherapists}
                            className="rounded-full px-8 py-4 font-semibold bg-white text-[#4CB5AB] hover:bg-[#F4EDE4] shadow-lg"
                        >
                            {t("actions.browseTherapists")}
                        </button>
                    </div>
                </div>
            </section>

            {/* SECTION 8: FAQ */}
            <section className="py-16 md:py-20 bg-white">
                <div className="container mx-auto max-w-5xl px-6">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#2B2B2B] mb-6">{t("home.faq.title")}</h2>
                    </div>

                    <div className="divide-y divide-[#4CB5AB]/15 border border-[#4CB5AB]/20 rounded-2xl overflow-hidden">
                        {faqs.map((f, idx) => (
                            <div key={idx} className="bg-white">
                                <button
                                    className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[#F4EDE4] transition-colors duration-200"
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    aria-expanded={openFaq === idx}
                                >
                                    <span className="font-medium text-[#2B2B2B] pr-4">{f.q || f.question}</span>
                                    <span className={`text-[#4CB5AB] text-xl font-bold transition-transform duration-300 flex-shrink-0 ${openFaq === idx ? "rotate-180" : ""}`}>
                                        {openFaq === idx ? "−" : "+"}
                                    </span>
                                </button>
                                {openFaq === idx && <div className="px-6 pb-6 -mt-2 text-[#6B6B6B] animate-fadeIn">{f.a || f.answer}</div>}
                            </div>
                        ))}

                        <div className="text-center py-6 bg-white">
                            <button
                                onClick={handleBrowseTherapists}
                                className="rounded-full px-6 py-3 font-semibold bg-[#E68A6C] hover:bg-[#d97a5f] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                            >
                                {t("actions.browseTherapists")}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
