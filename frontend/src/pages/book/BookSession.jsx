const BookSession = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Book a Session</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Session Types */}
        {["Individual Therapy", "Couple Therapy", "Group Session"].map((type) => (
          <div key={type} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">{type}</h3>
              <span className="text-3xl">🗓️</span>
            </div>
            <p className="text-gray-600 mb-4">
              Professional therapy sessions tailored to your needs. Choose a convenient time and connect with our expert therapists.
            </p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Schedule Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookSession;
