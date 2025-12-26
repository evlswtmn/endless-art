import { useState } from 'react';

const categories = [
  '🎬 Entertainment',
  '💰 Economic',
  '🌍 Social',
  '💻 Tech',
  '🚗 Automotive',
  '⭐ Celebrity',
  '🏛️ Political',
  '🔬 Science',
  '🎮 Gaming',
  '🌶️ Spicy/NSFW',
  '🎲 Wild Card'
];

function PredictionForm({ onSubmit }) {
  const [username, setUsername] = useState('');
  const [predictions, setPredictions] = useState([
    { text: '', category: '' },
    { text: '', category: '' },
    { text: '', category: '' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handlePredictionChange = (index, field, value) => {
    const newPredictions = [...predictions];
    newPredictions[index][field] = value;
    setPredictions(newPredictions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!username.trim()) {
      setMessage('❌ Enter a username, coward!');
      return;
    }

    if (predictions.some(p => !p.text.trim())) {
      setMessage('❌ All 3 predictions required. No backing out now!');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, predictions })
      });

      if (response.ok) {
        setMessage('✅ Predictions locked in! Your fate is sealed.');
        setPredictions([
          { text: '', category: '' },
          { text: '', category: '' },
          { text: '', category: '' }
        ]);
        setUsername('');
        onSubmit?.();
      } else {
        setMessage('❌ Submission failed. The universe rejected your timeline.');
      }
    } catch (error) {
      setMessage('❌ Network error. Even we can\'t predict this.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="prediction-card pulse-glow">
      <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
        🎯 Drop Your 2026 Predictions
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-purple-300">
            Your Name / Handle
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your name (will be public on leaderboard)"
            className="w-full px-4 py-3 bg-gray-900 bg-opacity-50 border border-purple-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500"
            maxLength={50}
          />
        </div>

        {predictions.map((prediction, index) => (
          <div key={index} className="bg-gray-900 bg-opacity-30 p-4 rounded-lg border border-pink-500 border-opacity-20">
            <label className="block text-sm font-medium mb-2 text-pink-300">
              Prediction #{index + 1}
            </label>
            <textarea
              value={prediction.text}
              onChange={(e) => handlePredictionChange(index, 'text', e.target.value)}
              placeholder={`What's gonna happen in 2026? Be bold. Be wild. ${index === 2 ? 'Go absolutely unhinged if you want.' : ''}`}
              className="w-full px-4 py-3 bg-gray-900 bg-opacity-50 border border-pink-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-500 mb-2"
              rows="3"
              maxLength={500}
            />
            <select
              value={prediction.category}
              onChange={(e) => handlePredictionChange(index, 'category', e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 bg-opacity-50 border border-pink-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-white"
            >
              <option value="">Select category (optional)</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        ))}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
          {isSubmitting ? '🔮 Consulting the crystal ball...' : '🚀 LOCK IN PREDICTIONS'}
        </button>

        {message && (
          <div className={`text-center p-4 rounded-lg ${message.includes('✅') ? 'bg-green-900 bg-opacity-30 border border-green-500' : 'bg-red-900 bg-opacity-30 border border-red-500'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}

export default PredictionForm;
