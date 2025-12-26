import { useState, useEffect } from 'react';

function RecentPredictions({ onVote }) {
  const [predictions, setPredictions] = useState([]);
  const [votedPredictions, setVotedPredictions] = useState(new Set());
  const [username, setUsername] = useState('');

  useEffect(() => {
    fetchPredictions();
    // Load voted predictions from localStorage
    const voted = JSON.parse(localStorage.getItem('votedPredictions') || '[]');
    setVotedPredictions(new Set(voted));
  }, []);

  const fetchPredictions = async () => {
    try {
      const response = await fetch('/api/predictions');
      const data = await response.json();
      setPredictions(data);
    } catch (error) {
      console.error('Failed to fetch predictions:', error);
    }
  };

  const handleVote = async (predictionId) => {
    if (!username.trim()) {
      alert('Enter your name to vote!');
      return;
    }

    if (votedPredictions.has(predictionId)) {
      alert('You already voted for this one!');
      return;
    }

    try {
      const response = await fetch(`/api/predictions/${predictionId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });

      if (response.ok) {
        const newVoted = [...votedPredictions, predictionId];
        setVotedPredictions(new Set(newVoted));
        localStorage.setItem('votedPredictions', JSON.stringify(newVoted));
        fetchPredictions();
        onVote?.();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to vote');
      }
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'correct') {
      return <span className="text-xs bg-green-600 px-2 py-1 rounded-full">✅ CAME TRUE</span>;
    }
    if (status === 'incorrect') {
      return <span className="text-xs bg-red-600 px-2 py-1 rounded-full">❌ DIDN'T HAPPEN</span>;
    }
    return <span className="text-xs bg-blue-600 px-2 py-1 rounded-full">⏳ PENDING</span>;
  };

  return (
    <div className="mt-12">
      <h2 className="text-4xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
        🌊 The Prediction Feed
      </h2>

      <div className="mb-6 flex justify-center">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your name (to vote on predictions)"
          className="px-4 py-2 bg-gray-900 bg-opacity-50 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {predictions.slice(0, 30).map((pred) => (
          <div
            key={pred.id}
            className="prediction-card hover:scale-105 transform transition-all"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-purple-400">{pred.category || '🎲 General'}</span>
              {getStatusBadge(pred.status)}
            </div>

            <p className="text-white mb-3 italic">"{pred.prediction_text}"</p>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">by <span className="text-pink-400 font-bold">{pred.username}</span></span>
              <div className="flex items-center gap-2">
                <span className="text-yellow-400">👍 {pred.votes || 0}</span>
                <button
                  onClick={() => handleVote(pred.id)}
                  disabled={votedPredictions.has(pred.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    votedPredictions.has(pred.id)
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                  }`}
                >
                  {votedPredictions.has(pred.id) ? 'VOTED' : 'VOTE'}
                </button>
              </div>
            </div>

            {pred.is_outrageous === 1 && (
              <div className="mt-2 text-xs bg-pink-900 bg-opacity-30 border border-pink-500 rounded px-2 py-1 text-center">
                🔥 CERTIFIED OUTRAGEOUS
              </div>
            )}
          </div>
        ))}
      </div>

      {predictions.length === 0 && (
        <div className="text-center text-gray-400 py-12">
          <p className="text-2xl mb-2">👻</p>
          <p>No predictions yet. Be the first to see the future!</p>
        </div>
      )}
    </div>
  );
}

export default RecentPredictions;
