const FindTherapists = () => {
  const therapists = [
    {
      name: "Dr. Sarah Johnson",
      specialty: "Depression & Anxiety",
      experience: "15 years",
      rating: 4.9,
      image: "🧑‍⚕️"
    },
    {
      name: "Dr. Michael Chen",
      specialty: "Relationship Counseling",
      experience: "12 years",
      rating: 4.8,
      image: "👨‍⚕️"
    },
    {
      name: "Dr. Emily Williams",
      specialty: "Stress Management",
      experience: "10 years",
      rating: 4.7,
      image: "👩‍⚕️"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Find Your Therapist</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {therapists.map((therapist) => (
          <div key={therapist.name} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-4xl">{therapist.image}</span>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{therapist.name}</h3>
                <p className="text-blue-600">{therapist.specialty}</p>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <p className="text-gray-600">Experience: {therapist.experience}</p>
              <p className="text-gray-600">Rating: {therapist.rating} ⭐</p>
            </div>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Book Appointment
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FindTherapists;
