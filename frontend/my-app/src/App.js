// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import { useState} from "react";

const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";
const BOOKS_API_URL = "http://localhost:8080/api";

function generateToken(userId) {
  return btoa(JSON.stringify({ userId, iat: Date.now() }));
}

const MOCK_USERS = { "reader": "reader_001", "bookworm": "bookworm_002", "guest": "guest_003" };

const COLORS = {
  cream: "#FAF7F2",
  ink: "#1A1714",
  rust: "#C4522A",
  sage: "#4A6741",
  sand: "#E8DFD0",
  muted: "#7A7068",
  highlight: "#F0E6D3",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: ${COLORS.cream};
    color: ${COLORS.ink};
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
  }

  .app { min-height: 100vh; display: flex; flex-direction: column; }

  .nav {
    background: ${COLORS.ink};
    padding: 0 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .nav-logo {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem;
    color: ${COLORS.cream};
    font-style: italic;
    letter-spacing: 0.02em;
  }

  .nav-logo span { color: ${COLORS.rust}; }

  .nav-links { display: flex; gap: 0.25rem; align-items: center; }

  .nav-btn {
    background: transparent;
    border: none;
    color: ${COLORS.sand};
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 400;
    padding: 0.4rem 0.8rem;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.15s;
    letter-spacing: 0.03em;
  }

  .nav-btn:hover { background: rgba(255,255,255,0.08); color: ${COLORS.cream}; }
  .nav-btn.active { color: ${COLORS.rust}; }

  .nav-btn.logout {
    border: 1px solid rgba(255,255,255,0.2);
    margin-left: 0.5rem;
    font-size: 0.8rem;
  }

  .page { flex: 1; }

  /* AUTH PAGE */
  .auth-page {
    min-height: calc(100vh - 60px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: ${COLORS.cream};
    position: relative;
    overflow: hidden;
  }

  .auth-page::before {
    content: '"';
    font-family: 'Playfair Display', serif;
    font-size: 40rem;
    color: ${COLORS.sand};
    position: absolute;
    top: -15rem;
    right: -8rem;
    line-height: 1;
    pointer-events: none;
    user-select: none;
  }

  .auth-card {
    background: white;
    border: 1px solid ${COLORS.sand};
    border-radius: 2px;
    padding: 3rem 3.5rem;
    width: 100%;
    max-width: 420px;
    position: relative;
    z-index: 1;
  }

  .auth-card::before {
    content: '';
    position: absolute;
    top: 6px;
    left: 6px;
    right: -6px;
    bottom: -6px;
    background: ${COLORS.sand};
    border-radius: 2px;
    z-index: -1;
  }

  .auth-title {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 400;
    margin-bottom: 0.25rem;
    color: ${COLORS.ink};
  }

  .auth-subtitle {
    color: ${COLORS.muted};
    font-size: 0.9rem;
    margin-bottom: 2.5rem;
    font-weight: 300;
  }

  .auth-tabs {
    display: flex;
    gap: 0;
    margin-bottom: 2rem;
    border-bottom: 1.5px solid ${COLORS.sand};
  }

  .auth-tab {
    background: none;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    color: ${COLORS.muted};
    padding: 0.5rem 1.25rem 0.75rem;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -1.5px;
    transition: all 0.15s;
    font-weight: 400;
  }

  .auth-tab.active {
    color: ${COLORS.rust};
    border-bottom-color: ${COLORS.rust};
    font-weight: 500;
  }

  .form-group { margin-bottom: 1.25rem; }

  .form-label {
    display: block;
    font-size: 0.78rem;
    font-weight: 500;
    color: ${COLORS.muted};
    margin-bottom: 0.4rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .form-input {
    width: 100%;
    padding: 0.65rem 0.9rem;
    border: 1.5px solid ${COLORS.sand};
    border-radius: 2px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    color: ${COLORS.ink};
    background: ${COLORS.cream};
    transition: border-color 0.15s;
    outline: none;
  }

  .form-input:focus { border-color: ${COLORS.rust}; background: white; }

  .form-hint {
    font-size: 0.78rem;
    color: ${COLORS.muted};
    margin-top: 0.3rem;
  }

  .btn-primary {
    width: 100%;
    padding: 0.75rem;
    background: ${COLORS.ink};
    color: ${COLORS.cream};
    border: none;
    border-radius: 2px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s;
    letter-spacing: 0.02em;
    margin-top: 0.75rem;
  }

  .btn-primary:hover { background: ${COLORS.rust}; }
  .btn-primary:disabled { background: ${COLORS.muted}; cursor: not-allowed; }

  .error-msg {
    background: #FEF2F0;
    border: 1px solid #F0C4BB;
    color: #8B3018;
    padding: 0.65rem 0.9rem;
    border-radius: 2px;
    font-size: 0.85rem;
    margin-bottom: 1rem;
  }

  .success-msg {
    background: #F0F4EE;
    border: 1px solid #B8CEAF;
    color: #2D4D2A;
    padding: 0.65rem 0.9rem;
    border-radius: 2px;
    font-size: 0.85rem;
    margin-bottom: 1rem;
  }

  /* SEARCH PAGE */
  .search-page { padding: 3rem 2rem; max-width: 900px; margin: 0 auto; }

  .search-header { margin-bottom: 2.5rem; }

  .search-header h1 {
    font-family: 'Playfair Display', serif;
    font-size: 2.2rem;
    font-weight: 400;
    color: ${COLORS.ink};
    margin-bottom: 0.35rem;
  }

  .search-header p { color: ${COLORS.muted}; font-size: 0.9rem; font-weight: 300; }

  .search-bar {
    display: flex;
    gap: 0;
    margin-bottom: 2rem;
    border: 1.5px solid ${COLORS.sand};
    border-radius: 2px;
    overflow: hidden;
    transition: border-color 0.15s;
    background: white;
  }

  .search-bar:focus-within { border-color: ${COLORS.rust}; }

  .search-input {
    flex: 1;
    padding: 0.8rem 1.1rem;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    color: ${COLORS.ink};
    background: transparent;
    outline: none;
  }

  .search-btn {
    padding: 0.8rem 1.5rem;
    background: ${COLORS.rust};
    color: white;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s;
    white-space: nowrap;
  }

  .search-btn:hover { background: #A8421F; }
  .search-btn:disabled { background: ${COLORS.muted}; cursor: not-allowed; }

  .ai-toggle {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    padding: 0.75rem 1rem;
    background: ${COLORS.highlight};
    border-radius: 2px;
    border: 1px solid ${COLORS.sand};
    font-size: 0.85rem;
    color: ${COLORS.muted};
  }

  .toggle-switch {
    position: relative;
    width: 36px;
    height: 20px;
    flex-shrink: 0;
  }

  .toggle-switch input { opacity: 0; width: 0; height: 0; }

  .toggle-slider {
    position: absolute;
    cursor: pointer;
    inset: 0;
    background: ${COLORS.sand};
    border-radius: 20px;
    transition: 0.2s;
  }

  .toggle-slider::before {
    content: '';
    position: absolute;
    height: 14px;
    width: 14px;
    left: 3px;
    bottom: 3px;
    background: white;
    border-radius: 50%;
    transition: 0.2s;
  }

  .toggle-switch input:checked + .toggle-slider { background: ${COLORS.rust}; }
  .toggle-switch input:checked + .toggle-slider::before { transform: translateX(16px); }

  .ai-label { font-weight: 500; color: ${COLORS.ink}; }

  .results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.5rem;
  }

  .book-card {
    background: white;
    border: 1px solid ${COLORS.sand};
    border-radius: 2px;
    overflow: hidden;
    transition: transform 0.15s, box-shadow 0.15s;
    cursor: pointer;
    position: relative;
  }

  .book-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }

  .book-cover {
    width: 100%;
    height: 200px;
    object-fit: cover;
    display: block;
    background: ${COLORS.sand};
  }

  .book-cover-placeholder {
    width: 100%;
    height: 200px;
    background: linear-gradient(135deg, ${COLORS.sand} 0%, ${COLORS.highlight} 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Playfair Display', serif;
    font-size: 3rem;
    color: ${COLORS.muted};
  }

  .book-info { padding: 1rem; }

  .book-title {
    font-family: 'Playfair Display', serif;
    font-size: 0.95rem;
    font-weight: 700;
    color: ${COLORS.ink};
    margin-bottom: 0.25rem;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .book-author {
    font-size: 0.8rem;
    color: ${COLORS.muted};
    margin-bottom: 0.5rem;
    font-weight: 300;
  }

  .book-genre {
    display: inline-block;
    font-size: 0.7rem;
    font-weight: 500;
    padding: 0.2rem 0.5rem;
    background: ${COLORS.highlight};
    color: ${COLORS.rust};
    border-radius: 2px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 0.75rem;
  }

  .book-rating {
    font-size: 0.8rem;
    color: ${COLORS.muted};
    display: flex;
    align-items: center;
    gap: 0.3rem;
    margin-bottom: 0.75rem;
  }

  .stars { color: #D4A017; letter-spacing: -2px; }

  .save-btn {
    width: 100%;
    padding: 0.5rem;
    background: transparent;
    border: 1.5px solid ${COLORS.sand};
    border-radius: 2px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem;
    font-weight: 500;
    color: ${COLORS.muted};
    cursor: pointer;
    transition: all 0.15s;
  }

  .save-btn:hover { border-color: ${COLORS.rust}; color: ${COLORS.rust}; }
  .save-btn.saved { background: ${COLORS.rust}; border-color: ${COLORS.rust}; color: white; }

  .loading-state {
    text-align: center;
    padding: 3rem;
    color: ${COLORS.muted};
    font-style: italic;
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
  }

  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    color: ${COLORS.muted};
  }

  .empty-state .big-quote {
    font-family: 'Playfair Display', serif;
    font-size: 5rem;
    color: ${COLORS.sand};
    line-height: 1;
    margin-bottom: 1rem;
  }

  .empty-state p { font-size: 0.9rem; font-weight: 300; }

  .ai-result {
    background: white;
    border: 1px solid ${COLORS.sand};
    border-left: 3px solid ${COLORS.rust};
    border-radius: 2px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    font-size: 0.9rem;
    line-height: 1.7;
    color: ${COLORS.ink};
  }

  .ai-result-label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 500;
    color: ${COLORS.rust};
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  /* PROFILE PAGE */
  .profile-page { padding: 3rem 2rem; max-width: 900px; margin: 0 auto; }

  .profile-header {
    display: flex;
    align-items: flex-end;
    gap: 1.5rem;
    margin-bottom: 3rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid ${COLORS.sand};
  }

  .profile-avatar {
    width: 72px;
    height: 72px;
    background: ${COLORS.ink};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem;
    color: ${COLORS.cream};
    font-style: italic;
    flex-shrink: 0;
  }

  .profile-info h1 {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem;
    font-weight: 400;
    color: ${COLORS.ink};
    margin-bottom: 0.2rem;
  }

  .profile-info p { color: ${COLORS.muted}; font-size: 0.85rem; font-weight: 300; }

  .profile-stats {
    display: flex;
    gap: 2rem;
    margin-left: auto;
  }

  .profile-stat { text-align: center; }

  .profile-stat .num {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem;
    font-weight: 700;
    color: ${COLORS.rust};
    display: block;
    line-height: 1;
  }

  .profile-stat .label {
    font-size: 0.75rem;
    color: ${COLORS.muted};
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-weight: 500;
  }

  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem;
    font-weight: 400;
    color: ${COLORS.ink};
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .section-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${COLORS.sand};
  }

  .saved-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.25rem;
  }

  .saved-book-card {
    background: white;
    border: 1px solid ${COLORS.sand};
    border-radius: 2px;
    overflow: hidden;
    position: relative;
  }

  .remove-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 26px;
    height: 26px;
    background: rgba(255,255,255,0.9);
    border: 1px solid ${COLORS.sand};
    border-radius: 50%;
    cursor: pointer;
    font-size: 0.7rem;
    color: ${COLORS.muted};
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
  }

  .remove-btn:hover { background: ${COLORS.rust}; color: white; border-color: ${COLORS.rust}; }

  .genres-section { margin-top: 2.5rem; }

  .genre-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem; }

  .genre-tag {
    padding: 0.35rem 0.8rem;
    background: ${COLORS.highlight};
    border: 1px solid ${COLORS.sand};
    border-radius: 2px;
    font-size: 0.8rem;
    font-weight: 500;
    color: ${COLORS.ink};
    text-transform: capitalize;
  }

  .logout-section {
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid ${COLORS.sand};
  }

  .btn-outline {
    padding: 0.6rem 1.5rem;
    background: transparent;
    border: 1.5px solid ${COLORS.ink};
    border-radius: 2px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 500;
    color: ${COLORS.ink};
    cursor: pointer;
    transition: all 0.15s;
    letter-spacing: 0.02em;
  }

  .btn-outline:hover { background: ${COLORS.ink}; color: ${COLORS.cream}; }

  .spinner {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid ${COLORS.sand};
    border-top-color: ${COLORS.rust};
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    vertical-align: middle;
    margin-right: 6px;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .ai-thinking {
    font-style: italic;
    color: ${COLORS.muted};
    font-size: 0.85rem;
  }

  @media (max-width: 600px) {
    .auth-card { padding: 2rem; }
    .profile-header { flex-direction: column; align-items: flex-start; }
    .profile-stats { margin-left: 0; }
    .search-page, .profile-page { padding: 2rem 1rem; }
  }
`;

function StarRating({ rating }) {
  const stars = Math.round((rating / 5) * 5);
  return (
    <span className="stars">
      {"★".repeat(Math.min(5, stars))}{"☆".repeat(Math.max(0, 5 - stars))}
    </span>
  );
}

function BookCard({ book, isSaved, onSave, onRemove, compact }) {
  const cover = book.volumeInfo?.imageLinks?.thumbnail || book.thumbnail;
  const title = book.volumeInfo?.title || book.title || "Unknown Title";
  const authors = book.volumeInfo?.authors?.join(", ") || book.author || "Unknown";
  const genre = book.volumeInfo?.categories?.[0]?.split("/")[0] || book.genre || "";
  const rating = book.volumeInfo?.averageRating || book.rating || 0;

  return (
    <div className={compact ? "saved-book-card" : "book-card"}>
      {compact && (
        <button className="remove-btn" onClick={() => onRemove?.(book)} title="Remove">×</button>
      )}
      {cover
        ? <img className="book-cover" src={cover.replace("http://", "https://")} alt={title} />
        : <div className="book-cover-placeholder">📚</div>
      }
      <div className="book-info">
        <div className="book-title">{title}</div>
        <div className="book-author">{authors}</div>
        {genre && <div className="book-genre">{genre}</div>}
        {rating > 0 && (
          <div className="book-rating">
            <StarRating rating={rating} />
            <span>{rating.toFixed(1)}</span>
          </div>
        )}
        {!compact && (
          <button
            className={`save-btn ${isSaved ? "saved" : ""}`}
            onClick={() => isSaved ? onRemove?.(book) : onSave?.(book)}
          >
            {isSaved ? "✓ Збережено" : "+ Зберегти"}
          </button>
        )}
      </div>
    </div>
  );
}

function AuthPage({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [regName, setRegName] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin(e) {
    e.preventDefault();

      fetch(BOOKS_API_URL + '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({"email": email, "password": password}),
      })
        .then(response => {
          if (!response.ok) throw new Error('Login failed');
          return response.json();
        })
        .then(userData => {
          onLogin(userData.token);
          // setSuccessMessage('Login successful');
          // setOpenSnackBar(true);
        })
        .catch(() => {
          // setSuccessMessage('Failed to login');
          // setOpenSnackBar(true);
        });

    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const userId = MOCK_USERS[email.toLowerCase()];
      if (userId) {
        const token = generateToken(userId);
        onLogin({ email, userId, token });
      } else {
        setError("Невірне ім'я користувача. Спробуйте: reader, bookworm, guest");
      }
      setLoading(false);
    }, 600);
  }

  function handleRegister(e) {
    e.preventDefault();
    setError("");
    if (!regName.trim()) { setError("Введіть ім'я"); return; }
    setLoading(true);
    setTimeout(() => {
      const userId = "user_" + Date.now();
      MOCK_USERS[regName.toLowerCase()] = userId;
      setSuccess("Акаунт створено! Тепер увійдіть.");
      setTab("login");
      setEmail(regName);
      setLoading(false);
    }, 600);
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Folio</h1>

        <div className="auth-tabs">
          <button className={`auth-tab ${tab === "login" ? "active" : ""}`} onClick={() => { setTab("login"); setError(""); setSuccess(""); }}>Увійти</button>
          <button className={`auth-tab ${tab === "register" ? "active" : ""}`} onClick={() => { setTab("register"); setError(""); setSuccess(""); }}>Реєстрація</button>
        </div>

        {error && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">{success}</div>}

        {tab === "login" ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Ім'я користувача</label>
              <input id="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="reader" required />
              <label className="form-label">Пароль</label>
              <input id="password" className="form-input" value={password} onChange={e => setPassword(e.target.value)} placeholder="reader" required />
            </div>
            <button className="btn-primary" disabled={loading}>
              {loading ? <><span className="spinner" />Вхід...</> : "Увійти"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label">Ім'я користувача</label>
              <input className="form-input" value={regName} onChange={e => setRegName(e.target.value)} placeholder="Ваш нікнейм" required />
            </div>
            <button className="btn-primary" disabled={loading}>
              {loading ? <><span className="spinner" />Реєстрація...</> : "Створити акаунт"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function SearchPage({ user, savedBooks, onSave, onRemove }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiMode, setAiMode] = useState(false);
  const [aiResult, setAiResult] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function searchBooks(q) {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    setAiResult("");
    try {
      const url = `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(q)}&maxResults=12&langRestrict=uk,en`;
      const res = await fetch(url);
      const data = await res.json();
      setResults(data.items || []);
    } catch {
      setResults([]);
    }
    setLoading(false);

    if (aiMode) {
      setAiLoading(true);
      try {
        const resp = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            messages: [{
              role: "user",
              content: `Користувач шукає книги за запитом: "${q}". 
Дай коротку (3-4 речення) персоналізовану рекомендацію: що варто читати в цьому жанрі/темі, яких авторів звернути увагу, та корисну пораду для вибору. 
Відповідай українською мовою у теплому, дружньому тоні бібліотекаря.`
            }]
          })
        });
        const d = await resp.json();
        const text = d.content?.[0]?.text || "";
        setAiResult(text);
      } catch {
        setAiResult("Не вдалося отримати AI-рекомендацію. Перевірте підключення.");
      }
      setAiLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    searchBooks(query);
  }

  const savedIds = new Set(savedBooks.map(b => b.id));

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>Знайдіть свою книгу</h1>
        <p>Шукайте за назвою, автором або темою</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="search-bar">
          <input
            className="search-input"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Пошук книг... (напр. «магічний реалізм», «Маркес»)"
          />
          <button className="search-btn" disabled={loading || !query.trim()}>
            {loading ? <span className="spinner" /> : "Шукати"}
          </button>
        </div>
      </form>

      <div className="ai-toggle">
        <label className="toggle-switch">
          <input type="checkbox" checked={aiMode} onChange={e => setAiMode(e.target.checked)} />
          <span className="toggle-slider" />
        </label>
        <span className="ai-label">AI-рекомендатор</span>
        <span>— отримати персоналізовану пораду від Claude</span>
      </div>

      {aiLoading && (
        <div className="ai-result">
          <div className="ai-result-label">✦ Claude думає...</div>
          <span className="ai-thinking"><span className="spinner" />Аналізую запит...</span>
        </div>
      )}

      {aiResult && !aiLoading && (
        <div className="ai-result">
          <div className="ai-result-label">✦ Порада від Claude</div>
          {aiResult}
        </div>
      )}

      {loading && <div className="loading-state">Шукаємо книги...</div>}

      {!loading && searched && results.length === 0 && (
        <div className="empty-state">
          <div className="big-quote">?</div>
          <p>Нічого не знайдено. Спробуйте інший запит.</p>
        </div>
      )}

      {!loading && !searched && (
        <div className="empty-state">
          <div className="big-quote">"</div>
          <p>Введіть запит, щоб розпочати пошук</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="results-grid">
          {results.map(book => (
            <BookCard
              key={book.id}
              book={book}
              isSaved={savedIds.has(book.id)}
              onSave={onSave}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProfilePage({ user, savedBooks, onRemove, onLogout }) {
  const genres = [...new Set(
    savedBooks.flatMap(b => b.volumeInfo?.categories || b.genre ? [b.genre] : [])
      .filter(Boolean)
      .map(g => g.split("/")[0].trim())
  )];

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.username[0].toUpperCase()}
        </div>
        <div className="profile-info">
          <h1>{user.username}</h1>
          <p>userId: {user.userId}</p>
        </div>
        <div className="profile-stats">
          <div className="profile-stat">
            <span className="num">{savedBooks.length}</span>
            <span className="label">Збережено</span>
          </div>
          <div className="profile-stat">
            <span className="num">{genres.length}</span>
            <span className="label">Жанрів</span>
          </div>
        </div>
      </div>

      {genres.length > 0 && (
        <div className="genres-section">
          <div className="section-title">Улюблені жанри</div>
          <div className="genre-tags">
            {genres.map(g => <span key={g} className="genre-tag">{g}</span>)}
          </div>
        </div>
      )}

      <div className="section-title">Збережені книги</div>

      {savedBooks.length === 0 ? (
        <div className="empty-state">
          <div className="big-quote">♡</div>
          <p>Ще немає збережених книг. Знайдіть щось цікаве!</p>
        </div>
      ) : (
        <div className="saved-grid">
          {savedBooks.map(book => (
            <BookCard key={book.id} book={book} compact onRemove={onRemove} />
          ))}
        </div>
      )}

      <div className="logout-section">
        <button className="btn-outline" onClick={onLogout}>Вийти з акаунту</button>
      </div>
    </div>
  );
}

export default function App() {
  const [token, setToken] = useState(null);
  const [page, setPage] = useState("search");
  const [savedBooks, setSavedBooks] = useState([]);

  function handleLogin(t) {
    setToken(t);
    setPage("search");
  }

  function handleLogout() {
    setToken(null);
    setSavedBooks([]);
    setPage("search");
  }

  function handleSave(book) {
    setSavedBooks(prev => prev.find(b => b.id === book.id) ? prev : [...prev, book]);
  }

  function handleRemove(book) {
    setSavedBooks(prev => prev.filter(b => b.id !== book.id));
  }

  if (!token) return (
    <>
      <style>{css}</style>
      <div className="app">
        <nav className="nav">
          <span className="nav-logo">Folio<span>.</span></span>
        </nav>
        <AuthPage onLogin={handleLogin} />
      </div>
    </>
  );

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <nav className="nav">
          <span className="nav-logo">Folio<span>.</span></span>
          <div className="nav-links">
            <button className={`nav-btn ${page === "search" ? "active" : ""}`} onClick={() => setPage("search")}>Пошук</button>
            <button className={`nav-btn ${page === "profile" ? "active" : ""}`} onClick={() => setPage("profile")}>
              Профіль
              {savedBooks.length > 0 && <span style={{ marginLeft: 4, fontSize: "0.75rem", color: COLORS.rust }}>({savedBooks.length})</span>}
            </button>
            <button className="nav-btn logout" onClick={handleLogout}>Вийти</button>
          </div>
        </nav>
        <div className="page">
          {page === "search"
            ? <SearchPage user={token} savedBooks={savedBooks} onSave={handleSave} onRemove={handleRemove} />
            : <ProfilePage user={token} savedBooks={savedBooks} onRemove={handleRemove} onLogout={handleLogout} />
          }
        </div>
      </div>
    </>
  );
}