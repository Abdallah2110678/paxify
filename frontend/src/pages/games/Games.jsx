const Games = () => {
  const games = [
    {
      title: "Mindfulness Maze",
      description: "Navigate through a peaceful maze while practicing mindfulness techniques",
      difficulty: "Easy",
      duration: "5-10 mins",
      icon: "🧘‍♀️"
    },
    {
      title: "Emotion Explorer",
      description: "Interactive game to help identify and understand different emotions",
      difficulty: "Medium",
      duration: "10-15 mins",
      icon: "🎮"
    },
    {
      title: "Anxiety Adventure",
      description: "Learn anxiety management techniques through an engaging story",
      difficulty: "Medium",
      duration: "15-20 mins",
      icon: "🎯"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Mental Health Games</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <div key={game.title} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">{game.title}</h3>
              <span className="text-3xl">{game.icon}</span>
            </div>
            <p className="text-gray-600 mb-4">{game.description}</p>
            <div className="flex justify-between text-sm text-gray-500 mb-4">
              <span>Difficulty: {game.difficulty}</span>
              <span>Duration: {game.duration}</span>
            </div>
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
              Play Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Games;
