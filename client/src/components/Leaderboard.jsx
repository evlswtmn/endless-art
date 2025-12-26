function Leaderboard({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="prediction-card">
        <h2 className="text-2xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
          🏆 Top Prophets
        </h2>
        <p className="text-center text-gray-400">
          No leaderboard yet. Be the first to make predictions!
        </p>
      </div>
    );
  }

  const medals = ['🥇', '🥈', '🥉', '🎖️', '⭐'];

  return (
    <div className="prediction-card sticky top-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
        🏆 Top Prophets
      </h2>

      <div className="space-y-3">
        {data.map((user, index) => {
          const accuracy = user.total_predictions > 0
            ? Math.round((user.correct_count / user.total_predictions) * 100)
            : 0;

          return (
            <div
              key={user.username}
              className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 rounded-lg border border-yellow-500 border-opacity-30 hover:border-opacity-60 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{medals[index]}</span>
                    <span className="font-bold text-lg text-white truncate">
                      {user.username}
                    </span>
                    {user.has_outrageous === 1 && (
                      <span className="text-xs bg-pink-600 px-2 py-1 rounded-full">
                        🔥 LEGEND
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-400 space-y-1">
                    <div className="flex justify-between">
                      <span>Correct:</span>
                      <span className="text-green-400 font-bold">{user.correct_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Wrong:</span>
                      <span className="text-red-400 font-bold">{user.incorrect_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Accuracy:</span>
                      <span className="text-purple-400 font-bold">{accuracy}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-center text-xs text-gray-500">
        Updated live as predictions are verified
      </div>
    </div>
  );
}

export default Leaderboard;
