import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// Color tokens (using hex in Tailwind arbitrary values for fast drop-in)
// Brand
// - Primary (turquoise): #4CB5AB
// - Secondary surface (warm beige/sand): #F4EDE4
// - CTA accents: #E68A6C (muted coral), #D4A44A (warm gold)
// - Text: headlines deep charcoal, body warm gray
// You can later move these to tailwind.config.js theme.extend.colors
// and replace the hex with e.g. bg-brand, text-charcoal, etc.

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
                "Answer a few questions about your child's needs, preferences, and schedule.",
        },
        {
            title: "Get Matched with Therapists",
            desc:
                "We suggest verified professionals specialized in supporting kids and teens.",
        },
        {
            title: "Book Online or In‑Clinic",
            desc:
                "Choose the time and format that suits your family's routine, then confirm in seconds.",
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
                "Browse verified therapist profiles and schedule sessions that fit your family's routine — whether online or in‑clinic.",
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
                "Access a curated store of supplements, wellness tools, and sensory aids — all selected to complement your child's journey.",
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
            q: "Is my child's information secure?",
            a: "Yes. We use strict security practices and never disclose your child's data without consent.",
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
        <div className="min-h-screen bg-white text-[#6B6B6B]">
            {/* SECTION 1: HERO */}
            <section className="relative overflow-hidden pt-20 md:pt-24">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/hero_section.jpg')" }}
                />

                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
                <div className="relative container mx-auto max-w-7xl px-6 py-28 md:py-36 grid md:grid-cols-2 gap-10 items-center">
                    {/* Left copy */}
                    <div>
                        <h1 className="text-4xl md:text-6xl font-bold leading-tight" style={{ color: '#D4B896' }}>
                            Your peace of mind starts here with the <span style={{
                                color: '#4ECDC4',
                                textShadow: '0 0 15px rgba(78, 205, 196, 0.6)',
                                fontWeight: 'bolder'
                            }}>right therapist</span>
                        </h1>
                        <p className="mt-6 text-white/90 text-lg md:text-xl">
                            Book your session online or in-person, with full confidentiality and a price that works for you.
                        </p>

                        <div className="mt-8 flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleBrowseTherapists}
                                className="rounded-full px-6 py-3 font-semibold bg-[#E68A6C] hover:bg-[#d97a5f] text-white shadow-lg"
                            >
                                Browse Therapists
                            </button>
                            <button
                                onClick={handleKnowMore}
                                className="rounded-full px-6 py-3 font-semibold bg-white/90 hover:bg-white text-[#2B2B2B] shadow-lg"
                            >
                                Know more
                            </button>
                        </div>
                    </div>

                    {/* Right quick actions */}
                    <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-[#4CB5AB]/20">
                        <h3 className="text-xl font-semibold text-[#2B2B2B] mb-1">Quick actions</h3>
                        <div className="w-12 h-1 bg-gradient-to-r from-[#4CB5AB] to-[#E68A6C] rounded mb-4"></div>

                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <button
                                onClick={() => handleBooking("in-person")}
                                className="group h-28 rounded-xl bg-gradient-to-br from-[#4CB5AB] to-[#44A08D] text-white transition-all duration-500 ease-out flex flex-col items-center justify-center relative overflow-hidden
            hover:shadow-2xl hover:shadow-[#4CB5AB]/30 hover:-translate-y-1 hover:scale-105
            before:absolute before:inset-0 before:bg-white/20 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100
            after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent after:-translate-x-full after:transition-transform after:duration-700 hover:after:translate-x-full"
                            >
                                <span className="text-2xl group-hover:scale-110 transition-transform duration-300 relative z-10">👥</span>
                                <span className="mt-2 font-medium relative z-10 group-hover:text-white transition-colors">Book In‑Clinic</span>
                            </button>

                            <button
                                onClick={() => handleBooking("online")}
                                className="group h-28 rounded-xl bg-gradient-to-br from-[#E68A6C] to-[#D4A44A] text-white transition-all duration-500 ease-out flex flex-col items-center justify-center relative overflow-hidden
            hover:shadow-2xl hover:shadow-[#E68A6C]/30 hover:-translate-y-1 hover:scale-105
            before:absolute before:inset-0 before:bg-white/20 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100
            after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent after:-translate-x-full after:transition-transform after:duration-700 hover:after:translate-x-full"
                            >
                                <span className="text-2xl group-hover:scale-110 transition-transform duration-300 relative z-10">💻</span>
                                <span className="mt-2 font-medium relative z-10 group-hover:text-white transition-colors">Book Online</span>
                            </button>

                            <button
                                onClick={() => handleBooking("shop")}
                                className="group h-28 rounded-xl bg-gradient-to-r from-[#D4B896] via-[#4CB5AB] to-[#E68A6C] text-white transition-all duration-500 ease-out flex flex-col items-center justify-center col-span-2 relative overflow-hidden
            hover:shadow-2xl hover:shadow-[#4CB5AB]/25 hover:-translate-y-1 hover:scale-105
            before:absolute before:inset-0 before:bg-white/20 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100
            after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/15 after:to-transparent after:-translate-x-full after:transition-transform after:duration-700 hover:after:translate-x-full"
                            >
                                <span className="text-2xl group-hover:scale-110 transition-transform duration-300 relative z-10">🛒</span>
                                <span className="mt-2 font-medium relative z-10 group-hover:text-white transition-colors">Shop Therapeutic Tools</span>
                            </button>
                        </div>

                        <div className="mt-6 p-3 bg-gradient-to-r from-[#4CB5AB]/10 to-[#E68A6C]/10 rounded-lg hover:from-[#4CB5AB]/15 hover:to-[#E68A6C]/15 transition-all duration-300">
                            <p className="text-sm text-[#6B6B6B] text-center">
                                <span className="text-[#4CB5AB] font-medium hover:text-[#44A08D] transition-colors cursor-default">Secure & private</span> •
                                <span className="text-[#E68A6C] font-medium hover:text-[#D4A44A] transition-colors cursor-default"> Licensed therapists</span> •
                                <span className="text-[#D4A44A] font-medium hover:text-[#E68A6C] transition-colors cursor-default"> Arabic & English support</span>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 2: TESTIMONIALS */}
            <section className="py-16 md:py-20 bg-[#F4EDE4]">
                <div className="container mx-auto max-w-7xl px-6">
                    <h2 className="text-center text-3xl md:text-4xl font-bold text-[#2B2B2B]">
                        You're Not Alone — Here is what others saying.
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
                   bg-white shadow ring-1 ring-[#4CB5AB]/30 hover:bg-[#F4EDE4]
                   w-10 h-10 rounded-full flex items-center justify-center
                   text-[#2B2B2B]"
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
                                        className="min-w-[320px] max-w-[360px] snap-start bg-white rounded-2xl shadow-md p-6 border border-[#4CB5AB]/10"
                                    >
                                        <p className="text-[#2B2B2B]">"{t.quote}"</p>
                                        <div className="mt-6 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#4CB5AB]/15 flex items-center justify-center">🗣️</div>
                                            <div>
                                                <p className="font-semibold text-[#2B2B2B]">{t.name}</p>
                                                <p className="text-sm text-[#6B6B6B]">{t.role}</p>
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
                   bg-white shadow ring-1 ring-[#4CB5AB]/30 hover:bg-[#F4EDE4]
                   w-10 h-10 rounded-full flex items-center justify-center
                   text-[#2B2B2B]"
                        >
                            ›
                        </button>

                        {/* CTA under row */}
                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={handleBrowseTherapists}
                                className="rounded-full px-6 py-3 font-semibold bg-[#E68A6C] hover:bg-[#d97a5f] text-white shadow"
                            >
                                Browse Therapists
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3: HOW IT WORKS */}
            <section className="py-16 md:py-20 bg-white">
                <div className="container mx-auto max-w-5xl px-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-[#2B2B2B]">How it works?</h2>
                    <div className="mt-12 relative">
                        {/* Vertical line */}
                        <div className="absolute left-4 md:left-1/2 -translate-x-1/2 md:translate-x-0 top-0 bottom-0 w-1 bg-[#4CB5AB]/30 rounded"></div>

                        <ol className="space-y-10">
                            {steps.map((s, idx) => (
                                <li key={idx} className="relative">
                                    <div
                                        className={`relative md:w-[46%] ${idx % 2 === 0 ? "md:ml-auto md:pl-8" : "md:pr-8"}`}
                                    >
                                        {/* dot */}
                                        <span
                                            className={`absolute -left-5 md:left-auto md:${idx % 2 === 0 ? "-left-5" : "-right-5"}
                                                top-3 w-6 h-6 rounded-full bg-[#4CB5AB] border-4 border-white shadow`}
                                        />
                                        <div className="bg-[#F4EDE4] rounded-2xl p-6 shadow-sm border border-[#4CB5AB]/10">
                                            <h3 className="text-xl font-semibold text-[#2B2B2B]">{s.title}</h3>
                                            <p className="mt-2 text-[#6B6B6B]">{s.desc}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>

                    <div className="mt-12 flex justify-center">
                        <button
                            onClick={handleBrowseTherapists}
                            className="rounded-full px-6 py-3 font-semibold bg-[#E68A6C] hover:bg-[#d97a5f] text-white shadow"
                        >
                            Browse Therapists
                        </button>
                    </div>
                </div>
            </section>

            {/* SECTION 4: HOW WE HELP */}
            <section className="py-16 md:py-20 bg-[#F4EDE4]">
                <div className="container mx-auto max-w-7xl px-6">
                    <header className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#2B2B2B]">
                            Support That's Thoughtful, Flexible, and Built Around You
                        </h2>
                        <p className="mt-4 text-[#6B6B6B]">
                            Practical tools and trusted professionals, all in one place.
                        </p>
                    </header>

                    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {helpBoxes.map((box, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl border border-[#4CB5AB]/15 shadow-sm p-6 flex flex-col"
                            >
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
                            Browse Therapists
                        </button>
                    </div>
                </div>
            </section>

            {/* SECTION 5: MEET OUR THERAPISTS */}
            <section className="py-16 md:py-20 bg-white">
                <div className="container mx-auto max-w-7xl px-6">
                    <header className="max-w-3xl">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#2B2B2B]">
                            Your Child Deserves the Right Therapist. We Help You Find Them.
                        </h2>
                        <p className="mt-4 text-[#6B6B6B]">
                            We partner only with licensed, compassionate professionals who have experience working with children and adolescents.
                        </p>
                    </header>

                    <ul className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {therapists.map((t, i) => (
                            <li
                                key={i}
                                className="rounded-2xl border border-[#4CB5AB]/15 shadow-sm p-6 hover:shadow-md transition"
                            >
                                <div className="flex items-center gap-4">
                                    <img
                                        src={t.avatar}
                                        alt={t.name}
                                        className="w-16 h-16 rounded-full object-cover bg-[#F4EDE4]"
                                        onError={(e) => {
                                            e.currentTarget.src =
                                                "data:image/svg+xml;utf8,\n<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='100%' height='100%' fill='%23F4EDE4'/><text x='50%' y='54%' text-anchor='middle' font-size='14' fill='%234CB5AB'>👩‍⚕️</text></svg>";
                                        }}
                                    />
                                    <div>
                                        <p className="font-semibold text-[#2B2B2B]">{t.name}</p>
                                        <p className="text-sm text-[#6B6B6B]">{t.availability}</p>
                                    </div>
                                </div>
                                <dl className="mt-4 text-sm">
                                    <div className="flex gap-2 mt-1">
                                        <dt className="font-medium text-[#2B2B2B]">Areas of expertise:</dt>
                                        <dd className="text-[#6B6B6B]">{t.specialty.join(", ")}</dd>
                                    </div>
                                    <div className="flex gap-2 mt-1">
                                        <dt className="font-medium text-[#2B2B2B]">Therapy style:</dt>
                                        <dd className="text-[#6B6B6B]">{t.style}</dd>
                                    </div>
                                    <div className="flex gap-2 mt-1">
                                        <dt className="font-medium text-[#2B2B2B]">Rating:</dt>
                                        <dd className="text-[#6B6B6B]">{t.rating} ⭐</dd>
                                    </div>
                                </dl>
                                <button
                                    onClick={handleBrowseTherapists}
                                    className="mt-4 w-full rounded-full px-5 py-3 font-semibold bg-[#E68A6C] hover:bg-[#d97a5f] text-white shadow"
                                >
                                    Browse Therapists
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* SECTION 6: WHY PAXIFY? */}
            <section className="py-16 md:py-20 bg-[#F4EDE4]">
                <div className="container mx-auto max-w-7xl px-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#2B2B2B]">Why Paxify?</h2>
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                title: "Secure and private",
                                desc: "Your child's information is always protected and never disclosed.",
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
                                className="rounded-2xl bg-white border border-[#4CB5AB]/15 p-6 shadow-sm"
                            >
                                <div className="text-3xl">{f.icon}</div>
                                <h3 className="mt-3 font-semibold text-lg text-[#2B2B2B]">{f.title}</h3>
                                <p className="mt-2 text-[#6B6B6B]">{f.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8">
                        <button
                            onClick={handleBrowseTherapists}
                            className="rounded-full px-6 py-3 font-semibold bg-[#E68A6C] hover:bg-[#d97a5f] text-white shadow"
                        >
                            Browse Therapists
                        </button>
                    </div>
                </div>
            </section>

            {/* SECTION 7: STRONG CTA */}
            <section className="py-16 md:py-20 bg-[#4CB5AB] text-white">
                <div className="container mx-auto max-w-5xl px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold">Help Is One Click Away</h2>
                    <p className="mt-4 text-white/90 text-lg">
                        Whether you've just started looking or have been searching for a while, Paxify makes it easy to move forward — and we'll be with you every step of the way.
                    </p>
                    <div className="mt-8">
                        <button
                            onClick={handleBrowseTherapists}
                            className="rounded-full px-8 py-4 font-semibold bg-white text-[#4CB5AB] hover:bg-[#F4EDE4] shadow-lg"
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
                        <h2 className="text-3xl md:text-4xl font-bold text-[#2B2B2B]">FAQ</h2>
                        <button
                            onClick={handleBrowseTherapists}
                            className="rounded-full px-5 py-3 font-semibold bg-[#E68A6C] hover:bg-[#d97a5f] text-white shadow"
                        >
                            Browse Therapists
                        </button>
                    </div>

                    <div className="mt-8 divide-y divide-[#4CB5AB]/15 border border-[#4CB5AB]/20 rounded-2xl overflow-hidden">
                        {faqs.map((f, idx) => (
                            <div key={idx} className="bg-white">
                                <button
                                    className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[#F4EDE4]"
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    aria-expanded={openFaq === idx}
                                >
                                    <span className="font-medium text-[#2B2B2B]">{f.q}</span>
                                    <span className="text-[#6B6B6B]">{openFaq === idx ? "−" : "+"}</span>
                                </button>
                                {openFaq === idx && (
                                    <div className="px-6 pb-6 -mt-2 text-[#6B6B6B]">{f.a}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}