import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// Tailwind notes
// - Primary color: indigo
// - Secondary surfaces: slate/sky
// - Buttons reuse the same CTA style

export default function Home() {
    const navigate = useNavigate();
    const [hoveredCard, setHoveredCard] = useState(null);
    const [openFaq, setOpenFaq] = useState(null);

    // ----- DATA -----
    const testimonials = [
        {
            quote:
                "Within a week we found a therapist who really understood our son. The reminders kept us on track.",
            name: "Mona A.",
            role: "Parent of 10-year-old",
        },
        {
            quote:
                "Booking online made it easy during exam season. Huge relief for our family routines.",
            name: "Karim S.",
            role: "Parent of teen",
        },
        {
            quote:
                "I loved the verified profiles and reviews. We felt safe choosing the right therapist.",
            name: "Nour H.",
            role: "Parent",
        },
        {
            quote:
                "The app made everything simple—booking, invoices, even reminders. Zero confusion.",
            name: "Dalia R.",
            role: "Parent of 7-year-old",
        },
    ];

    const steps = [
        {
            title: "Tell Us What You Need",
            desc:
                "Answer a few questions about your child’s needs, preferences, and schedule.",
        },
        {
            title: "Get Matched with Therapists",
            desc:
                "We suggest verified professionals specialized in supporting kids and teens.",
        },
        {
            title: "Book Online or In‑Clinic",
            desc:
                "Choose the time and format that suits your family’s routine, then confirm in seconds.",
        },
        {
            title: "Stay in the Loop",
            desc:
                "Receive reminders, updates, and invoices right in your inbox—no missed sessions.",
        },
    ];

    const helpBoxes = [
        {
            icon: "📅",
            title: "Book Appointments with Confidence",
            desc:
                "Browse verified therapist profiles and schedule sessions that fit your family’s routine — whether online or in‑clinic.",
        },
        {
            icon: "🧩",
            title: "Explore a Wide Range of Specialties",
            desc:
                "From ADHD to trauma recovery to anxiety and beyond, find professionals who specialize in supporting children and teens.",
        },
        {
            icon: "🛍️",
            title: "Shop Therapist‑Recommended Products",
            desc:
                "Access a curated store of supplements, wellness tools, and sensory aids — all selected to complement your child’s journey.",
        },
        {
            icon: "🔔",
            title: "Stay in the Loop",
            desc:
                "Get clear updates, appointment reminders, and invoices directly to your inbox — no confusion, no missed sessions.",
        },
    ];

    const therapists = [
        {
            name: "Dr. Salma E.",
            specialty: ["Child Psychology", "ADHD"],
            style: "CBT, Play Therapy",
            rating: 4.9,
            availability: "Online & In‑Clinic",
            avatar: "/therapists/salma.jpg",
        },
        {
            name: "Mr. Omar K.",
            specialty: ["Anxiety", "Trauma"],
            style: "DBT, Family Systems",
            rating: 4.8,
            availability: "Online",
            avatar: "/therapists/omar.jpg",
        },
        {
            name: "Dr. Laila R.",
            specialty: ["Autism", "Sensory Processing"],
            style: "Occupational Therapy",
            rating: 4.7,
            availability: "In‑Clinic",
            avatar: "/therapists/laila.jpg",
        },
    ];

    const faqs = [
        {
            q: "Is my child’s information secure?",
            a: "Yes. We use strict security practices and never disclose your child’s data without consent.",
        },
        {
            q: "Can I choose between online and in‑clinic sessions?",
            a: "Absolutely. You can filter therapists by format and pick what works best for your family.",
        },
        {
            q: "Do therapists have verified credentials?",
            a: "Every therapist on Paxify is licensed and vetted. Profiles include expertise, styles, and reviews.",
        },
        {
            q: "How do reminders and updates work?",
            a: "We send appointment reminders, changes, and invoices to your inbox to keep everything clear.",
        },
    ];

    // ----- ACTIONS -----
    const handleBrowseTherapists = () => navigate("/therapists");
    const handleKnowMore = () => navigate("/about");
    const handleBooking = (type) => navigate(`/book?type=${encodeURIComponent(type)}`);
    const handleWatchSessions = () => navigate("/sessions");

    // ----- TESTIMONIAL AUTO-SCROLL -----
    const rowRef = useRef(null);
    // replace your useEffect for autoplay with this
    useEffect(() => {
        const el = rowRef.current;
        if (!el) return;

        const id = setInterval(() => {
            if (el.__paused) return;
            const cardWidth = el.firstChild?.getBoundingClientRect().width || 320;
            const gap = 24;
            el.scrollBy({ left: cardWidth + gap, behavior: "smooth" });
            if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 5) {
                el.scrollTo({ left: 0, behavior: "smooth" });
            }
        }, 3500);

        return () => clearInterval(id);
    }, []);



    return (
        <div className="min-h-screen bg-white text-slate-800">
            {/* SECTION 1: HERO / VEZEETA-LIKE FIRST SECTION */}
            <section className="relative overflow-hidden pt-20 md:pt-24">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/hero_section.jpg')" }}
                />

                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
                <div className="relative container mx-auto max-w-7xl px-6 py-28 md:py-36 grid md:grid-cols-2 gap-10 items-center">
                    {/* Left copy */}
                    <div>
                        <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white">
                            Everything You Need to Protect Your Mental State
                        </h1>
                        <p className="mt-6 text-white/90 text-lg md:text-xl">
                            When your child is struggling, finding the right help shouldn’t feel like another battle. At Paxify, we make it simple, safe, and reassuring to connect with trusted therapists—online or in‑person—so your child can begin healing, and you can start breathing again.
                        </p>

                        <div className="mt-8 flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleBrowseTherapists}
                                className="rounded-full px-6 py-3 font-semibold bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg"
                            >
                                Browse Therapists
                            </button>
                            <button
                                onClick={handleKnowMore}
                                className="rounded-full px-6 py-3 font-semibold bg-white/90 hover:bg-white text-slate-900 shadow-lg"
                            >
                                Know more
                            </button>
                        </div>
                    </div>

                    {/* Right quick actions (mirrors Vezeeta-like utility) */}
                    <div className="bg-white/95 rounded-2xl shadow-2xl p-6 md:p-8 backdrop-blur-sm">
                        <h3 className="text-xl font-semibold">Quick actions</h3>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <button
                                onClick={() => handleBooking("in-person")}
                                className="h-28 rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition flex flex-col items-center justify-center"
                            >
                                <span className="text-2xl">👥</span>
                                <span className="mt-2 font-medium">Book In‑Clinic</span>
                            </button>
                            <button
                                onClick={() => handleBooking("online")}
                                className="h-28 rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition flex flex-col items-center justify-center"
                            >
                                <span className="text-2xl">💻</span>
                                <span className="mt-2 font-medium">Book Online</span>
                            </button>
                            <button
                                onClick={() => handleBooking("shop")}
                                className="h-28 rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition flex flex-col items-center justify-center col-span-2"
                            >
                                <span className="text-2xl">🛒</span>
                                <span className="mt-2 font-medium">Shop Therapeutic Tools</span>
                            </button>
                        </div>
                        <p className="mt-4 text-sm text-slate-500">
                            Secure & private • Licensed therapists • Arabic & English support
                        </p>
                    </div>
                </div>
            </section>

            {/* SECTION 2: WHAT OTHERS ARE SAYING (buttons, scrollbar hidden) */}
            <section className="py-16 md:py-20 bg-slate-50">
                <div className="container mx-auto max-w-7xl px-6">
                    <h2 className="text-center text-3xl md:text-4xl font-bold">
                        You’re Not Alone — Here is what others saying.
                    </h2>

                    <div className="mt-10 relative">
                        {/* Left arrow */}
                        <button
                            onClick={() => {
                                const el = rowRef.current;
                                if (!el) return;
                                el.scrollBy({ left: -el.clientWidth * 0.9, behavior: "smooth" });
                            }}
                            aria-label="Previous testimonials"
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-10
                   bg-white shadow ring-1 ring-slate-200 hover:bg-indigo-50
                   w-10 h-10 rounded-full flex items-center justify-center
                   text-slate-700"
                        >
                            ‹
                        </button>

                        {/* Viewport wrapper hides scrollbar visually */}
                        <div className="relative overflow-hidden">
                            {/* The padding-bottom + negative margin pushes the bar out of view */}
                            <div
                                ref={rowRef}
                                className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-px-6
                     pb-6 -mb-6 pr-2 pl-12 md:pl-14 md:pr-14 hide-scrollbar"
                                onMouseEnter={() => (rowRef.current.__paused = true)}
                                onMouseLeave={() => (rowRef.current.__paused = false)}
                            >
                                {testimonials.map((t, i) => (
                                    <article
                                        key={i}
                                        className="min-w-[320px] max-w-[360px] snap-start bg-white rounded-2xl shadow-md p-6 border border-slate-100"
                                    >
                                        <p className="text-slate-700">“{t.quote}”</p>
                                        <div className="mt-6 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">🗣️</div>
                                            <div>
                                                <p className="font-semibold">{t.name}</p>
                                                <p className="text-sm text-slate-500">{t.role}</p>
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
                            aria-label="Next testimonials"
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-10
                   bg-white shadow ring-1 ring-slate-200 hover:bg-indigo-50
                   w-10 h-10 rounded-full flex items-center justify-center
                   text-slate-700"
                        >
                            ›
                        </button>

                        {/* CTA under row */}
                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={handleBrowseTherapists}
                                className="rounded-full px-6 py-3 font-semibold bg-indigo-500 hover:bg-indigo-600 text-white shadow"
                            >
                                Browse Therapists
                            </button>
                        </div>
                    </div>
                </div>
            </section>


            {/* SECTION 3: HOW IT WORKS (LADDER / TIMELINE) */}
            <section className="py-16 md:py-20 bg-white">
                <div className="container mx-auto max-w-5xl px-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-center">How it works?</h2>
                    <div className="mt-12 relative">
                        {/* Vertical line */}
                        <div className="absolute left-4 md:left-1/2 -translate-x-1/2 md:translate-x-0 top-0 bottom-0 w-1 bg-slate-200 rounded"></div>

                        <ol className="space-y-10">
                            {steps.map((s, idx) => (
                                <li key={idx} className="relative">
                                    <div
                                        className={`relative md:w-[46%] ${idx % 2 === 0 ? "md:ml-auto md:pl-8" : "md:pr-8"
                                            }`}
                                    >
                                        {/* dot */}
                                        <span
                                            className={`absolute -left-5 md:left-auto md:${idx % 2 === 0 ? "-left-5" : "-right-5"
                                                } top-3 w-6 h-6 rounded-full bg-indigo-500 border-4 border-white shadow`}
                                        />
                                        <div className="bg-slate-50 rounded-2xl p-6 shadow-sm border border-slate-200">
                                            <h3 className="text-xl font-semibold">{s.title}</h3>
                                            <p className="mt-2 text-slate-600">{s.desc}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>

                    {/* ✅ Button moved outside the timeline wrapper */}
                    <div className="mt-12 flex justify-center">
                        <button
                            onClick={handleBrowseTherapists}
                            className="rounded-full px-6 py-3 font-semibold bg-indigo-500 hover:bg-indigo-600 text-white shadow"
                        >
                            Browse Therapists
                        </button>
                    </div>
                </div>
            </section>

            {/* SECTION 4: HERE’S HOW WE HELP */}
            <section className="py-16 md:py-20 bg-slate-50">
                <div className="container mx-auto max-w-7xl px-6">
                    <header className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold">
                            Support That’s Thoughtful, Flexible, and Built Around You
                        </h2>
                        <p className="mt-4 text-slate-600">
                            Practical tools and trusted professionals, all in one place.
                        </p>
                    </header>

                    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {helpBoxes.map((box, i) => (
                            <div
                                key={i}
                                className="bg-indigo-50 rounded-2xl border border-indigo-100 shadow-sm p-6 flex flex-col"
                            >
                                <div className="text-3xl" aria-hidden>{box.icon}</div>
                                <h3 className="mt-4 text-lg font-semibold">{box.title}</h3>
                                <p className="mt-2 text-slate-700 leading-relaxed">{box.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 flex justify-center">
                        <button
                            onClick={handleBrowseTherapists}
                            className="rounded-full px-6 py-3 font-semibold bg-indigo-500 hover:bg-indigo-600 text-white shadow"
                        >
                            Browse Therapists
                        </button>
                    </div>
                </div>
            </section>

            {/* SECTION 5: MEET OUR THERAPISTS */}
            <section className="py-16 md:py-20 bg-white">
                <div className="container mx-auto max-w-7xl px-6">
                    <header className="max-w-3xl">
                        <h2 className="text-3xl md:text-4xl font-bold">
                            Your Child Deserves the Right Therapist. We Help You Find Them.
                        </h2>
                        <p className="mt-4 text-slate-600">
                            We partner only with licensed, compassionate professionals who have experience working with children and adolescents.
                        </p>
                    </header>

                    <ul className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {therapists.map((t, i) => (
                            <li
                                key={i}
                                className="rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition"
                            >
                                <div className="flex items-center gap-4">
                                    <img
                                        src={t.avatar}
                                        alt={t.name}
                                        className="w-16 h-16 rounded-full object-cover bg-slate-100"
                                        onError={(e) => {
                                            e.currentTarget.src =
                                                "data:image/svg+xml;utf8,\n                        <svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='100%' height='100%' fill='%23eef2ff'/><text x='50%' y='54%' text-anchor='middle' font-size='14' fill='%235256d4'>👩‍⚕️</text></svg>";
                                        }}
                                    />
                                    <div>
                                        <p className="font-semibold">{t.name}</p>
                                        <p className="text-sm text-slate-500">{t.availability}</p>
                                    </div>
                                </div>
                                <dl className="mt-4 text-sm">
                                    <div className="flex gap-2 mt-1">
                                        <dt className="font-medium">Areas of expertise:</dt>
                                        <dd className="text-slate-600">{t.specialty.join(", ")}</dd>
                                    </div>
                                    <div className="flex gap-2 mt-1">
                                        <dt className="font-medium">Therapy style:</dt>
                                        <dd className="text-slate-600">{t.style}</dd>
                                    </div>
                                    <div className="flex gap-2 mt-1">
                                        <dt className="font-medium">Rating:</dt>
                                        <dd className="text-slate-600">{t.rating} ⭐</dd>
                                    </div>
                                </dl>
                                <button
                                    onClick={handleBrowseTherapists}
                                    className="mt-4 w-full rounded-full px-5 py-3 font-semibold bg-indigo-500 hover:bg-indigo-600 text-white shadow"
                                >
                                    Browse Therapists
                                </button>
                            </li>
                        ))}
                    </ul>

                    {/* Bullet list under heading */}
                    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="rounded-xl bg-slate-50 p-6 border border-slate-200">
                            <h3 className="font-semibold">Every profile includes:</h3>
                            <ul className="mt-4 list-disc pl-6 space-y-1 text-slate-700">
                                <li>Areas of expertise</li>
                                <li>Availability</li>
                                <li>Therapy style</li>
                                <li>Ratings and reviews from other parents like you</li>
                            </ul>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-6 border border-slate-200">
                            <p className="text-slate-600">
                                Filter by language, gender, session format, and more to find the best fit for your child.
                            </p>
                            <button
                                onClick={handleBrowseTherapists}
                                className="mt-4 rounded-full px-5 py-3 font-semibold bg-indigo-500 hover:bg-indigo-600 text-white shadow"
                            >
                                Browse Therapists
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 6: WHY PAXIFY? */}
            <section className="py-16 md:py-20 bg-slate-50">
                <div className="container mx-auto max-w-7xl px-6">
                    <h2 className="text-3xl md:text-4xl font-bold">Why Paxify?</h2>
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                title: "Secure and private",
                                desc: "Your child’s information is always protected and never disclosed.",
                                icon: "🔒",
                            },
                            {
                                title: "Flexible options",
                                desc: "Online or in‑clinic sessions, depending on your comfort and needs.",
                                icon: "🧭",
                            },
                            {
                                title: "All‑in‑one support",
                                desc: "Book sessions, track progress, and shop therapeutic tools in one place.",
                                icon: "🧰",
                            },
                        ].map((f, i) => (
                            <div
                                key={i}
                                className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm"
                            >
                                <div className="text-3xl">{f.icon}</div>
                                <h3 className="mt-3 font-semibold text-lg">{f.title}</h3>
                                <p className="mt-2 text-slate-700">{f.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8">
                        <button
                            onClick={handleBrowseTherapists}
                            className="rounded-full px-6 py-3 font-semibold bg-indigo-500 hover:bg-indigo-600 text-white shadow"
                        >
                            Browse Therapists
                        </button>
                    </div>
                </div>
            </section>

            {/* SECTION 7: STRONG CTA */}
            <section className="py-16 md:py-20 bg-indigo-600 text-white">
                <div className="container mx-auto max-w-5xl px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold">Help Is One Click Away</h2>
                    <p className="mt-4 text-indigo-100 text-lg">
                        Whether you’ve just started looking or have been searching for a while, Paxify makes it easy to move forward — and we’ll be with you every step of the way.
                    </p>
                    <div className="mt-8">
                        <button
                            onClick={handleBrowseTherapists}
                            className="rounded-full px-8 py-4 font-semibold bg-white text-indigo-700 hover:bg-indigo-50 shadow-lg"
                        >
                            Browse Therapists
                        </button>
                    </div>
                </div>
            </section>

            {/* SECTION 8: FAQ */}
            <section className="py-16 md:py-20 bg-white">
                <div className="container mx-auto max-w-5xl px-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl md:text-4xl font-bold">FAQ</h2>
                        <button
                            onClick={handleBrowseTherapists}
                            className="rounded-full px-5 py-3 font-semibold bg-indigo-500 hover:bg-indigo-600 text-white shadow"
                        >
                            Browse Therapists
                        </button>
                    </div>

                    <div className="mt-8 divide-y divide-slate-200 border border-slate-200 rounded-2xl overflow-hidden">
                        {faqs.map((f, idx) => (
                            <div key={idx} className="bg-white">
                                <button
                                    className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50"
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    aria-expanded={openFaq === idx}
                                >
                                    <span className="font-medium">{f.q}</span>
                                    <span className="text-slate-500">{openFaq === idx ? "−" : "+"}</span>
                                </button>
                                {openFaq === idx && (
                                    <div className="px-6 pb-6 -mt-2 text-slate-700">{f.a}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
}