const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">About Paxify</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            At Paxify, we believe that mental health care should be accessible, affordable, and stigma-free. 
            Our platform connects you with qualified mental health professionals and provides resources for 
            your wellness journey.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Online Therapy 💻</h3>
              <p className="text-gray-600">Connect with therapists from the comfort of your home</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Mental Health Games 🎮</h3>
              <p className="text-gray-600">Interactive games to support your mental wellness</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Resource Library 📚</h3>
              <p className="text-gray-600">Access to mental health resources and articles</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
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
      </div>
    </div>
  );
};

export default About;
