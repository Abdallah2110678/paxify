import { useState } from "react";

const Home = () => {
    const [hoveredCard, setHoveredCard] = useState(null);

    const handleBooking = (type) => {
        console.log(`Booking ${type} session`);
        // Add your booking logic here
    };

    const handleWatchSessions = () => {
        console.log("Opening recorded sessions");
        // Add your watch sessions logic here
    };

    return (
        <>
            <div className="min-h-screen pb-28">
                {/* HERO SECTION */}
                <section className="relative h-screen flex items-center justify-center overflow-hidden">
                    {/* Background Image with Blur */}
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{
                            backgroundImage: "url('/hero_section.jpg')",
                        }}
                    >
                        <div className="absolute inset-0 backdrop-blur-sm bg-black bg-opacity-20"></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                        {/* Main Headline */}
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
                            <span className="bg-gradient-to-r from-blue-200 to-green-200 bg-clip-text text-transparent">
                                Calm Mind
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                                Joyful Life
                            </span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-xl md:text-2xl text-white mb-8 leading-relaxed drop-shadow-lg max-w-3xl mx-auto">
                            Find everything you need to support your mental wellness journey in one place
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <button
                                onClick={() => handleBooking('shop')}
                                className="group bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 px-8 rounded-full text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 min-w-[200px]"
                            >
                                <span className="flex items-center justify-center space-x-2">
                                    <span>🛒</span>
                                    <span>SHOP Here</span>
                                </span>
                            </button>

                            <button
                                onClick={() => handleBooking('services')}
                                className="group bg-sky-300 hover:bg-sky-400 text-white font-bold py-4 px-8 rounded-full text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 min-w-[200px]"
                            >
                                <span className="flex items-center justify-center space-x-2">
                                    <span>🩺</span>
                                    <span>Our Services</span>
                                </span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* BOOKING SERVICES SECTION */}
                <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-green-50">
                    <div className="container mx-auto px-6 max-w-7xl">
                        {/* Intro Text */}
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 leading-tight">
                                Your Mental Wellness Journey
                            </h2>
                            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-5xl mx-auto">
                                Our service aim is to make mental well-being easy and accessible to everyone, with services that cater to your unique needs and lifestyle.
                                Simply answer a few quick questions, and we'll match you with a team of professional therapists ready to support you, tailored to your specific needs.
                            </p>
                        </div>

                        {/* Service Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Card 1 - Book in Person */}
                            <div
                                className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden ${hoveredCard === 1 ? 'scale-105' : ''}`}
                                onMouseEnter={() => setHoveredCard(1)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                {/* Card Header */}
                                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
                                    <div className="flex items-center justify-center mb-4">
                                        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-3xl">
                                            👥
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-center">Book In Person</h3>
                                </div>

                                {/* Card Content */}
                                <div className="p-6">
                                    <p className="text-gray-600 leading-relaxed mb-6">
                                        Experience personalized, face-to-face therapy sessions providing a comfortable and private environment and immediate feedback,
                                        a deeper connection, and the ability to engage in certain therapeutic activities that are best done in person.
                                    </p>

                                    <button
                                        onClick={() => handleBooking('in-person')}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                                    >
                                        📅 Book Now
                                    </button>
                                </div>

                                {/* Hover Effect Border */}
                                <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-300 rounded-2xl transition-all duration-300"></div>
                            </div>

                            {/* Card 2 - Book Online */}
                            <div
                                className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden ${hoveredCard === 2 ? 'scale-105' : ''}`}
                                onMouseEnter={() => setHoveredCard(2)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                {/* Card Header */}
                                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
                                    <div className="flex items-center justify-center mb-4">
                                        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-3xl">
                                            💻
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-center">Book Online</h3>
                                </div>

                                {/* Card Content */}
                                <div className="p-6">
                                    <p className="text-gray-600 leading-relaxed mb-6">
                                        Connect with our professional therapists from the comfort of your home through secure online sessions, allowing you to choose the time that suits you
                                        from any location, flexible, and the ability to maintain a consistent therapy routine even with a busy lifestyle.
                                    </p>

                                    <button
                                        onClick={() => handleBooking('online')}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                                    >
                                        💻 Book Now
                                    </button>
                                </div>

                                {/* Hover Effect Border */}
                                <div className="absolute inset-0 border-2 border-transparent group-hover:border-green-300 rounded-2xl transition-all duration-300"></div>
                            </div>

                            {/* Card 3 - Watch Recorded Sessions */}
                            <div
                                className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden ${hoveredCard === 3 ? 'scale-105' : ''}`}
                                onMouseEnter={() => setHoveredCard(3)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                {/* Card Header */}
                                <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 text-white">
                                    <div className="flex items-center justify-center mb-4">
                                        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-3xl">
                                            📺
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-center">Watch Recorded Sessions</h3>
                                </div>

                                {/* Card Content */}
                                <div className="p-6">
                                    <p className="text-gray-600 leading-relaxed mb-6">
                                        Access a library of pre-recorded therapy sessions that you can watch at your own pace. This option is perfect for those who prefer self-guided therapy
                                        including the ability to learn and reflect at your own pace, lower costs, and access to a wide range of topics.
                                    </p>

                                    <button
                                        onClick={handleWatchSessions}
                                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                                    >
                                        ▶️ Watch Now
                                    </button>
                                </div>

                                {/* Hover Effect Border */}
                                <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-300 rounded-2xl transition-all duration-300"></div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Home;