# The Six Degrees 🎬

A dynamic, real-time multiplayer game where players race to connect actors and movies within the vast cinematic universe. Based on the "Six Degrees of Separation" concept, this web application challenges your movie knowledge in a competitive, fast-paced environment.

---

## 🚀 Features

- **Real-time Multiplayer:** Powered by Socket.io for instantaneous game state synchronization across all clients.
- **Dynamic Connection Path:** Build chains between actors and movies. Validations are handled in real-time.
- **Contextual Search:** Integrated with TMDB (The Movie Database) to provide intelligent, connection-aware search suggestions.
- **Host Controls:** Creators have absolute control over the lobby, mission updates, and game starting.
- **Live Leaderboard:** Track scores and rankings as players complete their chains.
- **Responsive Design:** Premium UI built with Tailwind CSS v4, featuring glassmorphism, smooth animations, and a sleek dark theme.

---

## 🛠️ Tech Stack

- **Core:** [React 19](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Real-time Communication:** [Socket.io-client](https://socket.io/docs/v4/client-api/)
- **API Requests:** [Axios](https://axios-http.com/)
- **Icons:** [Lucide React](https://lucide.dev/)

---

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/walex0627/sixdegrees-fe.git
   cd sixdegrees-fe
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your backend API URL:
   ```env
   VITE_API_URL=https://sixdegrees-be-production.up.railway.app
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🎮 How to Play

1. **Enter your nickname:** Start by choosing a unique name for the session.
2. **Create or Join a Lobby:** 
   - **Host:** Search for a starting actor/actress and a target movie to set the challenge.
   - **Player:** Use a unique 6-character PIN to join your friends' lobby.
3. **Connect the Dots:** Once the game starts, find the shortest path of connections (Actor → Movie → Actor → Movie...) to reach the target objective.
4. **Win the Round:** The first player to successfully establish the connection wins the points and the round!

---

## ⚙️ Architecture Highlights

- **GameContext:** Centralized state management using React Context API to handle socket events, player data, and navigation.
- **Socket Integration:** Robust event handling for `round_result`, `mission_updated`, and `player_joined` to ensure all clients stay in sync.
- **Contextual Search Logic:** Optimized search inputs that switch between global TMDB search and contextual connection search based on the current chain state.

---

## 📄 License

This project is private and for educational purposes. All rights reserved by the original authors.
