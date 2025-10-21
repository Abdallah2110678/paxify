import useI18n from "../../hooks/useI18n";

const ACCENT_STYLES = {
  blue: {
    container: "bg-blue-50 p-4 rounded-xl border border-blue-100",
    heading: "text-blue-800",
  },
  green: {
    container: "bg-green-50 p-4 rounded-xl border border-green-100",
    heading: "text-green-800",
  },
  purple: {
    container: "bg-purple-50 p-4 rounded-xl border border-purple-100",
    heading: "text-purple-800",
  },
  yellow: {
    container: "bg-yellow-50 p-4 rounded-xl border border-yellow-100",
    heading: "text-yellow-800",
  },
};

const FALLBACK_CONTENT = {
  title: "About Paxify",
  mission: {
    title: "Our Mission",
    paragraphs: [
      "At Paxify, we believe that mental health care should be accessible, affordable, and stigma-free.",
      "We build products that connect you with qualified professionals and provide clear, evidence-based resources to support your wellness journey.",
    ],
    projectsTitle: "Our Projects",
    projects: [
      {
        title: "Paxify Therapy Platform",
        description: "Book in-person or online sessions with licensed therapists.",
      },
      {
        title: "Mental Health Games Hub",
        description: "Engaging mini-games designed to support mental wellness.",
      },
      {
        title: "Resource Library",
        description: "Curated articles and guides reviewed by professionals.",
      },
      {
        title: "Community Support",
        description: "Safe spaces and tools to connect and share experiences.",
      },
    ],
  },
  offers: {
    title: "What We Offer",
    items: [
      {
        title: "Online Therapy 💻",
        description: "Connect with therapists from the comfort of your home.",
        accent: "blue",
      },
      {
        title: "Mental Health Games 🎮",
        description: "Interactive games to support your mental wellness.",
        accent: "green",
      },
      {
        title: "Resource Library 📚",
        description: "Access mental health resources and articles.",
        accent: "purple",
      },
      {
        title: "Community Support 👥",
        description: "Join our supportive community of users.",
        accent: "yellow",
      },
    ],
  },
  contact: {
    title: "Contact Us",
    text: "Have questions? Reach out to our support team at {{email}} or call us at {{phone}}.",
    email: "support@paxify.com",
    phone: "1-800-PAXIFY",
  },
  faq: {
    badge: "FAQs",
    items: [
      {
        question: "How can I book a same day appointment?",
        answer: "Use our Find Therapists page to filter by availability and choose a time that works for you.",
      },
      {
        question: "Do you accept medical insurance?",
        answer: "Yes. Availability depends on the therapist. You can filter by insurance from the filters.",
      },
      {
        question: "Can I choose a therapist by gender?",
        answer: "Absolutely. Use the Gender filter when searching.",
      },
      {
        question: "Is online therapy available?",
        answer: "Yes, many of our therapists offer secure video sessions.",
      },
      {
        question: "How are therapists rated?",
        answer: "Ratings come from verified patient reviews after each session.",
      },
    ],
  },
  knowledge: {
    badge: "Know more about your health",
    items: [
      {
        question: "What is general practice?",
        answer: "General practice covers comprehensive health care for people of all ages.",
      },
      {
        question: "What diseases does a general practitioner treat?",
        answer: "From common colds to chronic conditions, GPs coordinate your ongoing care.",
      },
      {
        question: "What are Vitamin D deficiency symptoms?",
        answer: "Fatigue, bone pain, mood changes, and frequent illness.",
      },
      {
        question: "What is the HbA1c blood test?",
        answer: "It measures average blood glucose levels over the last 2–3 months.",
      },
      {
        question: "Is a digital blood pressure device accurate?",
        answer: "Yes, when used correctly with the proper cuff size and posture.",
      },
    ],
  },
};

const About = () => {
  const { t } = useI18n();
  const content = t("aboutPage", { returnObjects: true }) || {};

  const mission = content.mission || {};
  const missionParagraphs =
    Array.isArray(mission.paragraphs) && mission.paragraphs.length
      ? mission.paragraphs
      : FALLBACK_CONTENT.mission.paragraphs;
  const projectsTitle = mission.projectsTitle || FALLBACK_CONTENT.mission.projectsTitle;
  const projects =
    Array.isArray(mission.projects) && mission.projects.length ? mission.projects : FALLBACK_CONTENT.mission.projects;

  const offers = content.offers || {};
  const offersTitle = offers.title || FALLBACK_CONTENT.offers.title;
  const offerItems =
    Array.isArray(offers.items) && offers.items.length ? offers.items : FALLBACK_CONTENT.offers.items;

  const contact = content.contact || {};
  const contactTitle = contact.title || FALLBACK_CONTENT.contact.title;
  const contactEmail = contact.email || FALLBACK_CONTENT.contact.email;
  const contactPhone = contact.phone || FALLBACK_CONTENT.contact.phone;
  const fallbackContactText = FALLBACK_CONTENT.contact.text
    .replace("{{email}}", contactEmail)
    .replace("{{phone}}", contactPhone);
  const contactText = t("aboutPage.contact.text", {
    email: contactEmail,
    phone: contactPhone,
    defaultValue: fallbackContactText,
  });

  const faq = content.faq || {};
  const faqBadge = faq.badge || FALLBACK_CONTENT.faq.badge;
  const faqItems = Array.isArray(faq.items) && faq.items.length ? faq.items : FALLBACK_CONTENT.faq.items;

  const knowledge = content.knowledge || {};
  const knowledgeBadge = knowledge.badge || FALLBACK_CONTENT.knowledge.badge;
  const knowledgeItems =
    Array.isArray(knowledge.items) && knowledge.items.length ? knowledge.items : FALLBACK_CONTENT.knowledge.items;

  const title = content.title || FALLBACK_CONTENT.title;
  const missionTitle = mission.title || FALLBACK_CONTENT.mission.title;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-8">{title}</h1>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-slate-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{missionTitle}</h2>
          {missionParagraphs.map((paragraph, idx) => (
            <p key={`mission-paragraph-${idx}`} className="text-gray-600 mb-4">
              {paragraph}
            </p>
          ))}

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 md:p-5 mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">{projectsTitle}</h3>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              {projects.map((project, idx) => (
                <li key={`project-${project.title}-${idx}`}>
                  <span className="font-medium">{project.title}</span>{" "}
                  <span className="text-slate-600">— {project.description}</span>
                </li>
              ))}
            </ul>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{offersTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {offerItems.map((offer, idx) => {
              const accentKey = offer.accent && ACCENT_STYLES[offer.accent] ? offer.accent : "blue";
              const accentClasses = ACCENT_STYLES[accentKey] || ACCENT_STYLES.blue;
              return (
                <div key={`offer-${offer.title}-${idx}`} className={accentClasses.container}>
                  <h3 className={`text-lg font-semibold ${accentClasses.heading} mb-2`}>{offer.title}</h3>
                  <p className="text-gray-600">{offer.description}</p>
                </div>
              );
            })}
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{contactTitle}</h2>
          <p className="text-gray-600">{contactText}</p>
        </div>

        <section className="relative mb-10">
          <div className="absolute -top-3 left-6">
            <span className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-1.5 rounded-full shadow-sm">
              <span>{faqBadge}</span>
            </span>
          </div>
          <div className="bg-white rounded-2xl shadow border border-slate-100 p-4 md:p-6">
            <div className="space-y-2">
              {faqItems.map((item, idx) => (
                <details key={`faq-${idx}`} className="group rounded-xl hover:bg-slate-50 transition">
                  <summary className="flex items-center justify-between cursor-pointer list-none px-4 py-3 rounded-xl">
                    <span className="text-slate-800 font-medium">{item.question}</span>
                    <span className="text-slate-400 group-open:rotate-180 transition-transform">▾</span>
                  </summary>
                  <div className="px-4 pb-4 text-slate-600">{item.answer}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="relative mb-10">
          <div className="absolute -top-3 left-6">
            <span className="inline-flex items-center gap-2 bg-blue-700 text-white text-sm font-semibold px-4 py-1.5 rounded-full shadow-sm">
              <span>{knowledgeBadge}</span>
            </span>
          </div>
          <div className="bg-white rounded-2xl shadow border border-slate-100 p-4 md:p-6">
            <div className="space-y-2">
              {knowledgeItems.map((item, idx) => (
                <details key={`knowledge-${idx}`} className="group rounded-xl hover:bg-slate-50 transition">
                  <summary className="flex items-center justify-between cursor-pointer list-none px-4 py-3 rounded-xl">
                    <span className="text-slate-800 font-medium">{item.question}</span>
                    <span className="text-slate-400 group-open:rotate-180 transition-transform">▾</span>
                  </summary>
                  <div className="px-4 pb-4 text-slate-600">{item.answer}</div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
