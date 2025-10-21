// src/hooks/homeHook.js (or wherever your hook lives)
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getPublicDoctors } from "../services/doctorService";
import api from "../services/api";
import useI18n from "./useI18n";

export default function useHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, i18n } = useI18n();

  const apiBase = useMemo(() => {
    const base = api?.defaults?.baseURL;
    if (!base || typeof base !== "string") return "";
    return base.replace(/\/$/, "");
  }, []);

  const makeAbsoluteUrl = useCallback(
    (url, fallback = "") => {
      if (!url || typeof url !== "string") return fallback;
      if (/^https?:\/\//i.test(url)) return url;
      if (!apiBase) {
        return url.startsWith("/") ? url : `/${url}`;
      }
      return `${apiBase}${url.startsWith("/") ? "" : "/"}${url}`;
    },
    [apiBase]
  );

  // -------------------------
  // UI state
  // -------------------------
  const [hoveredCard, setHoveredCard] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  // -------------------------
  // i18n-derived lists (with fallbacks)
  // -------------------------
  const testimonials = useMemo(() => {
    const list = t("home.testimonials.list", { returnObjects: true });
    if (Array.isArray(list) && list.length) return list;
    // Fallback (English)
    return [
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
  }, [t, i18n.language]);

  const steps = useMemo(() => {
    const list = t("home.steps", { returnObjects: true });
    if (Array.isArray(list) && list.length) return list;
    return [
      {
        title: "Create your account",
        desc: "Enter your email and password to get started.",
      },
      {
        title: "Choose the right therapist",
        desc: "Select based on specialty, years of experience, and the budget that suits you.",
      },
      {
        title: "Book your session",
        desc: "Pick the time and date that work best for you, and pay easily through multiple payment options.",
      },
    ];
  }, [t, i18n.language]);

  // Provide icons consistently; text comes from i18n
  const helpBoxes = useMemo(() => {
    const cards = t("home.support.cards", { returnObjects: true });
    const fallback = [
      {
        title: "Sessions with licensed specialists",
        desc: "Book a session with a qualified therapist in less than 5 minutes — private, secure, and affordable.",
      },
      {
        title: "Store",
        desc: "We’ve created a store with carefully selected products to support you step by step.",
      },
      {
        title: "Therapeutic games",
        desc: "We offer therapeutic games designed by professionals to help you face challenges in a lighter way.",
      },
      {
        title: "Smart reminders",
        desc: "We’ll send you reminders and notifications so you never miss a session.",
      },
    ];
    const base = Array.isArray(cards) && cards.length ? cards : fallback;
    const icons = ["🧑‍⚕️", "🛍️", "🎲", "⏰"];
    return base.map((c, i) => ({ ...c, icon: icons[i] || "💡" }));
  }, [t, i18n.language]);

  const faqs = useMemo(() => {
    const list = t("home.faq.list", { returnObjects: true });
    if (Array.isArray(list) && list.length) {
      // Normalize to include both {q,a} and {question,answer}
      return list.map((item) => ({
        q: item.q || item.question,
        a: item.a || item.answer,
        question: item.q || item.question,
        answer: item.a || item.answer,
      }));
    }
    // Fallback
    return [
      {
        q: "Is my child's information secure?",
        a: "Yes. We use strict security practices and never disclose your child's data without consent.",
        question: "Is my child's information secure?",
        answer:
          "Yes. We use strict security practices and never disclose your child's data without consent.",
      },
      {
        q: "Can I choose between online and in-clinic sessions?",
        a: "Absolutely. You can filter therapists by format and pick what works best for your family.",
        question: "Can I choose between online and in-clinic sessions?",
        answer:
          "Absolutely. You can filter therapists by format and pick what works best for your family.",
      },
      {
        q: "Do therapists have verified credentials?",
        a: "Every therapist on Paxify is licensed and vetted. Profiles include expertise, styles, and reviews.",
        question: "Do therapists have verified credentials?",
        answer:
          "Every therapist on Paxify is licensed and vetted. Profiles include expertise, styles, and reviews.",
      },
      {
        q: "How do reminders and updates work?",
        a: "We send appointment reminders, changes, and invoices to your inbox to keep everything clear.",
        question: "How do reminders and updates work?",
        answer:
          "We send appointment reminders, changes, and invoices to your inbox to keep everything clear.",
      },
    ];
  }, [t, i18n.language]);

  // Therapists (API)
  // -------------------------
  const [therapists, setTherapists] = useState([]);

  const rowRef = useRef(null); // testimonials scroller
  const therapistsRowRef = useRef(null); // therapists scroller

  useEffect(() => {
    (async () => {
      try {
        const list = await getPublicDoctors();

        const mapped = (Array.isArray(list) ? list : [])
          .slice(0, 6)
          .map((d) => {
            const availability =
              d?.availability && !/null/i.test(String(d.availability))
                ? d.availability
                : "";
            const name =
              d?.name ||
              d?.email ||
              t("home.therapists.anon", { defaultValue: "Therapist" });
            const bio = typeof d?.bio === "string" ? d.bio : "";
            const style = bio
              ? bio.slice(0, 60) + (bio.length > 60 ? "…" : "")
              : "";
            const avatar = makeAbsoluteUrl(
              d?.profilePictureUrl,
              "/therapists/placeholder.jpg"
            );
            const specialty =
              d?.specialty && d.specialty !== "null" ? [d.specialty] : [];
            const rating =
              typeof d?.rate === "number" && !Number.isNaN(d.rate)
                ? d.rate
                : undefined;
            return { name, specialty, style, rating, availability, avatar };
          });

        setTherapists(mapped);
      } catch {
        // keep empty state on failure
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------
  // Auto-scroll: therapists carousel (every 5s)
  // -------------------------
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

  // -------------------------
  // Auto-scroll: testimonials (every 3.5s)
  // -------------------------
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

  // -------------------------
  // Navigation handlers
  // -------------------------
  const handleBrowseTherapists = () => {
    if (!user)
      return navigate(`/login?redirect=${encodeURIComponent("/therapists")}`);
    navigate("/therapists");
  };
  const handleKnowMore = () => navigate("/about");
  const handleBooking = (type) =>
    navigate(`/book?type=${encodeURIComponent(type)}`);
  const handleWatchSessions = () => navigate("/sessions");

  return {
    // state
    hoveredCard,
    setHoveredCard,
    openFaq,
    setOpenFaq,

    // data (now driven by i18n)
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
