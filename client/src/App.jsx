import { useState, useEffect } from 'react';
import PredictionForm from './components/PredictionForm';
import Leaderboard from './components/Leaderboard';
import FunStats from './components/FunStats';
import RecentPredictions from './components/RecentPredictions';

function App() {
  const [stats, setStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchStats();
    fetchLeaderboard();
  }, [refreshTrigger]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    }
  };

  const handlePredictionSubmitted = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12 float-animation">
          <h1 className="text-6xl md:text-8xl font-bold mb-4 neon-glow">
            🔮 2026 Predictions
          </h1>
          <p className="text-2xl md:text-3xl text-purple-300 mb-2">
            What's Your Wildest Take?
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Drop your boldest predictions for 2026. No limits. No filters.
            Economic collapse? Celebrity chaos? Tech dystopia? Alien contact?
            Make it count. Make it wild. Make it legendary.
          </p>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Prediction Form */}
          <div className="lg:col-span-2">
            <PredictionForm onSubmit={handlePredictionSubmitted} />
          </div>

          {/* Leaderboard */}
          <div>
            <Leaderboard data={leaderboard} />
          </div>
        </div>

        {/* Fun Stats */}
        <FunStats stats={stats} />

        {/* Recent Predictions */}
        <RecentPredictions onVote={handlePredictionSubmitted} />

        {/* Footer */}
        <footer className="text-center text-gray-500 mt-16 pb-8">
          <p>🎲 Remember: The future is unwritten, but your predictions are forever</p>
          <p className="text-sm mt-2">NSFW allowed • No category off limits • May the odds be ever chaotic</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
