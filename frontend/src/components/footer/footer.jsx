import { useState, useEffect } from "react";

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <>
            <footer className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white z-40">
                <div className="container mx-auto px-6 py-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <img src="/logo.png" alt="Paxify Logo" className="w-7 h-7 object-contain" />
                                <span className="text-xl font-bold tracking-wide">Paxify</span>
                            </div>
                            <p className="text-blue-100/90 text-sm">
                                Your trusted partner in comprehensive healthcare management and wellness solutions.
                            </p>
                            <div className="flex space-x-4 text-xl">
                                <a className="text-blue-100 hover:text-white transition-colors" href="#" aria-label="Facebook">📘</a>
                                <a className="text-blue-100 hover:text-white transition-colors" href="#" aria-label="Twitter">🐦</a>
                                <a className="text-blue-100 hover:text-white transition-colors" href="#" aria-label="Instagram">📷</a>
                                <a className="text-blue-100 hover:text-white transition-colors" href="#" aria-label="LinkedIn">💼</a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="text-blue-100 hover:text-white transition-colors">About Us</a></li>
                                <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Our Services</a></li>
                                <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Find Therapists</a></li>
                                <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Book Session</a></li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Support</h3>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Help Center</a></li>
                                <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Contact Us</a></li>
                                <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Terms of Service</a></li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Contact</h3>
                            <div className="space-y-2 text-sm text-blue-100">
                                <p className="flex items-center space-x-2"><span>📞</span><span>+1 (555) 123-4567</span></p>
                                <p className="flex items-center space-x-2"><span>📧</span><span>support@paxify.com</span></p>
                                <p className="flex items-center space-x-2"><span>📍</span><span>123 Health St, Medical City</span></p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/20 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-blue-100 text-sm">
                            © 2024 Paxify - Health Management System. All rights reserved.
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="#" className="text-blue-100 hover:text-white text-sm transition-colors">Privacy</a>
                            <a href="#" className="text-blue-100 hover:text-white text-sm transition-colors">Terms</a>
                            <a href="#" className="text-blue-100 hover:text-white text-sm transition-colors">Cookies</a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Back to Top button (matches primary) */}
            <button
                onClick={scrollToTop}
                className="fixed bottom-20 right-6 z-50 group bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                title="Back to top"
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
