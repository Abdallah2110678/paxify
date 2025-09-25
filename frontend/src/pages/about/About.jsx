const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-8">About Paxify</h1>

        {/* Intro / Mission card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-slate-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-4">
            At Paxify, we believe that mental health care should be accessible, affordable, and stigma‑free.
            We build products that connect you with qualified professionals and provide clear, evidence‑based
            resources to support your wellness journey.
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 md:p-5 mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Our Projects</h3>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li><span className="font-medium">Paxify Therapy Platform</span> — book in‑person or online sessions with licensed therapists.</li>
              <li><span className="font-medium">Mental Health Games Hub</span> — engaging mini‑games designed to support mental wellness.</li>
              <li><span className="font-medium">Resource Library</span> — curated articles and guides reviewed by professionals.</li>
              <li><span className="font-medium">Community Support</span> — safe spaces and tools to connect and share experiences.</li>
            </ul>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Online Therapy 💻</h3>
              <p className="text-gray-600">Connect with therapists from the comfort of your home</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Mental Health Games 🎮</h3>
              <p className="text-gray-600">Interactive games to support your mental wellness</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Resource Library 📚</h3>
              <p className="text-gray-600">Access to mental health resources and articles</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Community Support 👥</h3>
              <p className="text-gray-600">Join our supportive community of users</p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
          <p className="text-gray-600">
            Have questions? Reach out to our support team at support@paxify.com or call us at 
            1-800-PAXIFY.
          </p>
        </div>

        {/* FAQs Section */}
        <section className="relative mb-10">
          <div className="absolute -top-3 left-6">
            <span className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-1.5 rounded-full shadow-sm">
              <span>FAQs</span>
            </span>
          </div>
          <div className="bg-white rounded-2xl shadow border border-slate-100 p-4 md:p-6">
            <div className="space-y-2">
              <details className="group rounded-xl hover:bg-slate-50 transition">
                <summary className="flex items-center justify-between cursor-pointer list-none px-4 py-3 rounded-xl">
                  <span className="text-slate-800 font-medium">How can I book a same day appointment?</span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <div className="px-4 pb-4 text-slate-600">
                  Use our Find Therapists page to filter by availability and choose a time that works for you.
                </div>
              </details>
              <details className="group rounded-xl hover:bg-slate-50 transition">
                <summary className="flex items-center justify-between cursor-pointer list-none px-4 py-3 rounded-xl">
                  <span className="text-slate-800 font-medium">Do you accept medical insurance?</span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <div className="px-4 pb-4 text-slate-600">
                  Yes. Availability depends on the therapist. You can filter by insurance from the filters.
                </div>
              </details>
              <details className="group rounded-xl hover:bg-slate-50 transition">
                <summary className="flex items-center justify-between cursor-pointer list-none px-4 py-3 rounded-xl">
                  <span className="text-slate-800 font-medium">Can I choose a therapist by gender?</span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <div className="px-4 pb-4 text-slate-600">
                  Absolutely. Use the Gender filter when searching.
                </div>
              </details>
              <details className="group rounded-xl hover:bg-slate-50 transition">
                <summary className="flex items-center justify-between cursor-pointer list-none px-4 py-3 rounded-xl">
                  <span className="text-slate-800 font-medium">Is online therapy available?</span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <div className="px-4 pb-4 text-slate-600">
                  Yes, many of our therapists offer secure video sessions.
                </div>
              </details>
              <details className="group rounded-xl hover:bg-slate-50 transition">
                <summary className="flex items-center justify-between cursor-pointer list-none px-4 py-3 rounded-xl">
                  <span className="text-slate-800 font-medium">How are therapists rated?</span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <div className="px-4 pb-4 text-slate-600">
                  Ratings come from verified patient reviews after each session.
                </div>
              </details>
            </div>
          </div>
        </section>

        {/* Knowledge Section */}
        <section className="relative mb-10">
          <div className="absolute -top-3 left-6">
            <span className="inline-flex items-center gap-2 bg-blue-700 text-white text-sm font-semibold px-4 py-1.5 rounded-full shadow-sm">
              <span>Know more about your health</span>
            </span>
          </div>
          <div className="bg-white rounded-2xl shadow border border-slate-100 p-4 md:p-6">
            <div className="space-y-2">
              <details className="group rounded-xl hover:bg-slate-50 transition">
                <summary className="flex items-center justify-between cursor-pointer list-none px-4 py-3 rounded-xl">
                  <span className="text-slate-800 font-medium">What is general practice?</span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <div className="px-4 pb-4 text-slate-600">General practice covers comprehensive health care for people of all ages.</div>
              </details>
              <details className="group rounded-xl hover:bg-slate-50 transition">
                <summary className="flex items-center justify-between cursor-pointer list-none px-4 py-3 rounded-xl">
                  <span className="text-slate-800 font-medium">What diseases does a general practitioner treat?</span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <div className="px-4 pb-4 text-slate-600">From common colds to chronic conditions, GPs coordinate your ongoing care.</div>
              </details>
              <details className="group rounded-xl hover:bg-slate-50 transition">
                <summary className="flex items-center justify-between cursor-pointer list-none px-4 py-3 rounded-xl">
                  <span className="text-slate-800 font-medium">What are Vitamin D deficiency symptoms?</span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <div className="px-4 pb-4 text-slate-600">Fatigue, bone pain, mood changes, and frequent illness.</div>
              </details>
              <details className="group rounded-xl hover:bg-slate-50 transition">
                <summary className="flex items-center justify-between cursor-pointer list-none px-4 py-3 rounded-xl">
                  <span className="text-slate-800 font-medium">What is the HbA1c blood test?</span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <div className="px-4 pb-4 text-slate-600">It measures average blood glucose levels over the last 2–3 months.</div>
              </details>
              <details className="group rounded-xl hover:bg-slate-50 transition">
                <summary className="flex items-center justify-between cursor-pointer list-none px-4 py-3 rounded-xl">
                  <span className="text-slate-800 font-medium">Is a digital blood pressure device accurate?</span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <div className="px-4 pb-4 text-slate-600">Yes, when used correctly with the proper cuff size and posture.</div>
              </details>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
