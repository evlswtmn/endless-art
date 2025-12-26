# 🔮 2026 Prediction Leaderboard

**What's your wildest take?**

A no-holds-barred prediction platform where users compete to see who can best predict the chaos of 2026. Economic collapse? Celebrity scandals? Tech dystopia? Alien contact? All predictions welcome. NSFW allowed. No category off limits.

## ✨ Features

- **Make 3 Predictions**: Each user submits exactly 3 predictions about 2026
- **Live Leaderboard**: Top 5 prophets ranked by correct predictions
- **Fun Stats Dashboard**:
  - 🔥 Hottest take (most voted current prediction)
  - 🤯 Most outrageous prediction that came true
  - 💀 Most popular prediction that didn't happen
  - 📊 Total chaos metrics
- **Voting System**: Community votes on which predictions they think will happen
- **Category Support**: Entertainment, Economic, Social, Tech, Automotive, Celebrity, Political, Science, Gaming, NSFW, and Wild Card
- **Real-time Updates**: Leaderboard and stats update as predictions are verified
- **Beautiful UI**: Neon-themed, gradient-heavy design with animations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Install all dependencies (root + client)
npm run install:all

# Or manually:
npm install
cd client && npm install && cd ..
```

### Development

```bash
# Run both frontend and backend concurrently
npm run dev

# Frontend will be at http://localhost:5173
# Backend API at http://localhost:3000
```

The frontend dev server proxies API requests to the backend automatically.

### Production Build

```bash
# Build the frontend
npm run build

# Start production server
NODE_ENV=production npm start
```

## 📁 Project Structure

```
endless-art/
├── client/                 # React frontend (Vite + Tailwind)
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Tailwind styles
│   ├── index.html
│   └── package.json
├── server/
│   └── index.js           # Express API server
├── predictions.db         # SQLite database (auto-created)
├── package.json
└── README.md
```

## 🎮 How to Use

### For Users

1. **Submit Predictions**
   - Enter your name/handle
   - Make 3 bold predictions about 2026
   - Optionally categorize each prediction
   - Submit and watch the chaos unfold

2. **Vote on Predictions**
   - Browse the prediction feed
   - Enter your name to vote
   - Vote for predictions you think will come true

3. **Track the Leaderboard**
   - See who's leading the prophet race
   - Watch for legendary "OUTRAGEOUS" badges
   - Check accuracy percentages

### For Admins

Predictions can be marked as correct/incorrect via the API:

```bash
# Mark prediction as correct
curl -X PUT http://localhost:3000/api/admin/predictions/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "correct"}'

# Mark as outrageous
curl -X PUT http://localhost:3000/api/admin/predictions/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "correct", "is_outrageous": true}'
```

## 🎯 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/predictions` | Submit 3 predictions |
| GET | `/api/predictions` | Get all predictions (limit 100) |
| GET | `/api/leaderboard` | Get top 5 users |
| GET | `/api/stats` | Get fun stats |
| POST | `/api/predictions/:id/vote` | Vote for a prediction |
| PUT | `/api/admin/predictions/:id` | Update prediction status (admin) |

## 🗄️ Database Schema

### Users Table
- `id`: Auto-increment primary key
- `username`: Unique username
- `created_at`: Timestamp

### Predictions Table
- `id`: Auto-increment primary key
- `user_id`: Foreign key to users
- `prediction_text`: The prediction content
- `category`: Category (optional)
- `is_outrageous`: Boolean flag for legendary predictions
- `status`: 'pending' | 'correct' | 'incorrect'
- `votes`: Vote count
- `created_at`: Timestamp

### Votes Table
- Tracks who voted for what (prevents double voting)

## 🎨 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: SQLite (better-sqlite3)
- **Styling**: Tailwind with custom neon theme

## 🌟 Future Enhancements

- AI-powered prediction analysis and categorization
- User profiles and history
- Prediction trends and analytics
- Social sharing
- Email notifications when predictions are verified
- Admin dashboard UI
- Rate limiting and spam protection
- Authentication system

## 🎲 Rules & Philosophy

- **No limits**: Any prediction allowed (within legal bounds)
- **NSFW welcome**: No censorship on content
- **All categories**: Economic, celebrity, tech, automotive, political, social, entertainment, science, gaming, and wild cards
- **Permanent record**: All predictions are stored forever
- **Community driven**: Users vote on what they think will happen
- **Fun first**: It's about entertainment and chaos, not serious forecasting

## 📝 License

MIT - Do whatever you want with it

## 🚀 Deployment

### Deploying to Production

1. Set environment variables:
   ```bash
   PORT=3000
   NODE_ENV=production
   ```

2. Build and start:
   ```bash
   npm run build
   npm start
   ```

### Deploy to Platforms

**Railway / Render / Heroku**:
- Connect your GitHub repo
- Set build command: `npm run install:all && npm run build`
- Set start command: `npm start`
- Set `NODE_ENV=production`

**VPS / Digital Ocean**:
- Clone repo
- Run `npm run install:all`
- Run `npm run build`
- Use PM2 or systemd to run `npm start`
- Set up nginx reverse proxy

## 🤝 Contributing

Pull requests welcome! Feel free to:
- Add new features
- Improve UI/UX
- Fix bugs
- Enhance stats calculations
- Add more fun chaos

---

**Remember**: The future is unwritten, but your predictions are forever. Make them count. Make them wild. Make them legendary.

🔮 May the odds be ever chaotic.
