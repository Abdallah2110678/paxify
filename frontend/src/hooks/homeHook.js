import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getPublicDoctors } from "../services/doctorService";
import api from "../services/api";

export default function useHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

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
      title: "Create your account",
      desc: " Enter your email and password to get started.",
    },
    {
      title: "Choose the right therapist",
      desc:
        "Select based on specialty, years of experience, and the budget that suits you.",
    },
    {
      title: "Book your session",
      desc:
        "Pick the time and date that work best for you, and pay easily through multiple payment options.",
    },
  ];

  const helpBoxes = [
    {
      title: "Sessions with licensed specialists",
      desc:
        " Book a session with a qualified therapist in less than 5 minutes — private, secure, and affordable.",
    },
    {
      title: "Store",
      desc:
        " We’ve created a store with carefully selected products to support you step by step.",
    },
    {
      title: "Therapeutic Games",
      desc:
        " We offer therapeutic games designed by professionals to help you face challenges in a lighter way.",
    },
    {
      title: "Smart Reminders",
      desc: "We’ll send you reminders and notifications so you never miss a session.",
    },
  ];

  const [therapists, setTherapists] = useState([]);

  // Fetch public doctors list for home page (no auth required)
  useEffect(() => {
    (async () => {
      try {
        const list = await getPublicDoctors();
        const base = (api?.defaults?.baseURL || "").replace(/\/$/, "");
        const toAbsUrl = (u) => {
          if (!u || typeof u !== "string") return "/therapists/placeholder.jpg";
          if (/^https?:\/\//i.test(u)) return u;
          return `${base}${u.startsWith("/") ? "" : "/"}${u}`;
        };
        const mapped = (Array.isArray(list) ? list : []).slice(0, 6).map((d) => {
          const availability = (d?.availability && !/null/i.test(String(d.availability)))
            ? d.availability
            : "";
          const name = d?.name || d?.email || "Therapist";
          const bio = typeof d?.bio === "string" ? d.bio : "";
          const style = bio ? bio.slice(0, 60) + (bio.length > 60 ? "…" : "") : "";
          const avatar = d?.profilePictureUrl ? toAbsUrl(d.profilePictureUrl) : "/therapists/placeholder.jpg";
          const specialty = d?.specialty && d.specialty !== "null" ? [d.specialty] : [];
          const rating = (typeof d?.rate === "number" && !Number.isNaN(d.rate)) ? d.rate : undefined;
          return { name, specialty, style, rating, availability, avatar };
        });
        setTherapists(mapped);
      } catch (_) {
        // leave empty state on failure
      }
    })();
  }, []);

  // Auto-scroll therapists carousel every 3s; pause on hover
  useEffect(() => {
    const el = therapistsRowRef.current;
    if (!el) return;

    const timer = setInterval(() => {
      if (el.__paused) return;
      const card = el.querySelector('[data-therapist-card="1"]');
      const cardWidth = card?.getBoundingClientRect().width || 320;
      const gap = 24;
      el.scrollBy({ left: cardWidth + gap, behavior: "smooth" });
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 5) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      }
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const therapistsPrev = () => {
    const el = therapistsRowRef.current;
    if (!el) return;
    el.__paused = true;
    const card = el.querySelector('[data-therapist-card="1"]');
    const cardWidth = card?.getBoundingClientRect().width || 320;
    const gap = 24;
    el.scrollBy({ left: -(cardWidth + gap), behavior: "smooth" });
    // unpause after small delay
    setTimeout(() => (el.__paused = false), 800);
  };

  const therapistsNext = () => {
    const el = therapistsRowRef.current;
    if (!el) return;
    el.__paused = true;
    const card = el.querySelector('[data-therapist-card="1"]');
    const cardWidth = card?.getBoundingClientRect().width || 320;
    const gap = 24;
    el.scrollBy({ left: cardWidth + gap, behavior: "smooth" });
    setTimeout(() => (el.__paused = false), 800);
  };

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

  const handleBrowseTherapists = () => {
    if (!user) return navigate(`/login?redirect=${encodeURIComponent("/therapists")}`);
    navigate("/therapists");
  };
  const handleKnowMore = () => navigate("/about");
  const handleBooking = (type) => navigate(`/book?type=${encodeURIComponent(type)}`);
  const handleWatchSessions = () => navigate("/sessions");

  const rowRef = useRef(null); // testimonials
  const therapistsRowRef = useRef(null); // therapists carousel
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

  return {
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
  };
}
