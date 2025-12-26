function FunStats({ stats }) {
  if (!stats) {
    return null;
  }

  const statCards = [];

  // Total stats card
  if (stats.totalStats) {
    statCards.push({
      title: '📊 Total Chaos',
      content: (
        <div className="space-y-2 text-white">
          <div className="flex justify-between">
            <span>Total Predictions:</span>
            <span className="font-bold">{stats.totalStats.total_predictions}</span>
          </div>
          <div className="flex justify-between">
            <span>Brave Souls:</span>
            <span className="font-bold">{stats.totalStats.total_users}</span>
          </div>
          <div className="flex justify-between">
            <span>Came True:</span>
            <span className="font-bold text-green-300">{stats.totalStats.correct_predictions}</span>
          </div>
          <div className="flex justify-between">
            <span>Epic Fails:</span>
            <span className="font-bold text-red-300">{stats.totalStats.incorrect_predictions}</span>
          </div>
        </div>
      )
    });
  }

  // Most popular prediction
  if (stats.mostPopular) {
    statCards.push({
      title: '🔥 Hottest Take',
      content: (
        <div className="text-white">
          <p className="text-sm mb-2 italic">"{stats.mostPopular.prediction_text}"</p>
          <div className="flex justify-between text-xs">
            <span className="text-purple-300">by {stats.mostPopular.username}</span>
            <span className="text-yellow-300">👍 {stats.mostPopular.votes} votes</span>
          </div>
        </div>
      )
    });
  }

  // Most outrageous that came true
  if (stats.mostOutrageous) {
    statCards.push({
      title: '🤯 Most Outrageous Truth',
      content: (
        <div className="text-white">
          <p className="text-sm mb-2 italic">"{stats.mostOutrageous.prediction_text}"</p>
          <p className="text-xs text-pink-300">by {stats.mostOutrageous.username}</p>
          <p className="text-xs text-green-400 mt-2">THEY ACTUALLY CALLED IT 🎯</p>
        </div>
      )
    });
  }

  // Most wrong
  if (stats.mostWrong) {
    statCards.push({
      title: '💀 Most Wrong',
      content: (
        <div className="text-white">
          <p className="text-sm mb-2 italic">"{stats.mostWrong.prediction_text}"</p>
          <div className="flex justify-between text-xs">
            <span className="text-purple-300">by {stats.mostWrong.username}</span>
            <span className="text-red-300">👎 {stats.mostWrong.votes} people believed</span>
          </div>
        </div>
      )
    });
  }

  return (
    <div className="mb-12">
      <h2 className="text-4xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
        🎲 The Stats That Matter
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="stat-box">
            <h3 className="text-xl font-bold mb-3 text-white">{card.title}</h3>
            {card.content}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FunStats;
