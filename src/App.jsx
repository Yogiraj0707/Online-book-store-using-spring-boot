import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { Link, Navigate, NavLink, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { getBooks, isServerUnavailable, login, register } from "./api.js";
import { hasLocalAccount, loginLocalAccount, registerLocalAccount } from "./localAccounts.js";

const categories = ["All books", "Fiction", "Non-fiction", "Mystery", "Self-growth"];
const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const fallbackBooks = [
  {
    id: "1",
    title: "The Midnight Library",
    author: "Matt Haig",
    price: 1536,
    category: "Fiction",
    rating: 4.8,
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780525559474-L.jpg",
    badge: "Bestseller",
  },
  {
    id: "2",
    title: "Atomic Habits",
    author: "James Clear",
    price: 1743,
    category: "Self-growth",
    rating: 4.9,
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg",
    badge: "Reader favorite",
  },
  {
    id: "3",
    title: "The Silent Patient",
    author: "Alex Michaelides",
    price: 1390,
    category: "Mystery",
    rating: 4.7,
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781250301697-L.jpg",
  },
  {
    id: "4",
    title: "Crying in H Mart",
    author: "Michelle Zauner",
    price: 1598,
    category: "Non-fiction",
    rating: 4.8,
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780525657743-L.jpg",
  },
];

function Header({ user, cartCount }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <div className="announcement">A little story goes a long way — free shipping over ₹3,320</div>
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" to="/" onClick={() => setMenuOpen(false)}>
            <span className="brand-mark"><BookOpen size={21} strokeWidth={1.8} /></span>
            <span>paper<span className="brand-amp">&</span>ink</span>
          </Link>
          <button className="mobile-menu" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <nav className={`main-nav ${menuOpen ? "open" : ""}`}>
            <NavLink to="/" end onClick={() => setMenuOpen(false)}>Home</NavLink>
            <NavLink to="/catalogue" onClick={() => setMenuOpen(false)}>Browse books</NavLink>
            <a href="/#about" onClick={() => setMenuOpen(false)}>Our story</a>
          </nav>
          <div className="header-actions">
            <Link className="icon-button search-link" to="/catalogue" aria-label="Search books"><Search size={19} /></Link>
            {user ? (
              <span className="welcome-user">Hello, {user.firstName}</span>
            ) : (
              <Link className="sign-in-link" to="/login">Sign in</Link>
            )}
            <Link className="bag-button" to="/catalogue" aria-label={`Shopping bag, ${cartCount} items`}>
              <ShoppingBag size={19} />
              <span className="bag-count">{cartCount}</span>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}

function BookCard({ book, onAdd }) {
  const [saved, setSaved] = useState(false);
  return (
    <article className="book-card">
      <div className="book-cover-wrap">
        {book.badge && <span className="book-badge">{book.badge}</span>}
        <button
          className={`save-button ${saved ? "saved" : ""}`}
          aria-label={saved ? `Remove ${book.title} from wishlist` : `Save ${book.title} to wishlist`}
          onClick={() => setSaved(!saved)}
        >
          <Heart size={17} fill={saved ? "currentColor" : "none"} />
        </button>
        <img className="book-cover" src={book.coverUrl} alt={`Cover of ${book.title}`} loading="lazy" />
        <button className="quick-add" onClick={() => onAdd(book)}>Add to bag <ArrowRight size={15} /></button>
      </div>
      <div className="book-meta">
        <span className="book-category">{book.category}</span>
        <h3>{book.title}</h3>
        <p className="book-author">by {book.author}</p>
        <div className="book-price-row">
          <span className="book-price">{inrFormatter.format(Number(book.price))}</span>
          <span className="book-rating"><Star size={13} fill="currentColor" /> {book.rating ?? "4.8"}</span>
        </div>
      </div>
    </article>
  );
}

function HomePage({ books, onAdd }) {
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line" /> YOUR NEXT CHAPTER STARTS HERE</div>
          <h1>Find a book.<br />Find <em>yourself.</em></h1>
          <p className="hero-description">Good books have a way of finding us right when we need them. Let’s find yours.</p>
          <div className="hero-actions">
            <Link className="button button-dark" to="/catalogue">Explore the shelves <ArrowRight size={17} /></Link>
            <a className="text-link" href="#featured">See what’s loved <ArrowDown size={15} /></a>
          </div>
          <div className="reader-note">
            <div className="reader-avatars"><span>J</span><span>M</span><span>A</span><span>+</span></div>
            <p><strong>2,400+</strong> readers found their next favorite</p>
          </div>
        </div>
        <div className="hero-art">
          <div className="hero-note"><Sparkles size={16} /> STORIES FOR EVERY MOOD</div>
          <div className="hero-image"></div>
          <div className="floating-book floating-book-one">
            <img src={fallbackBooks[0].coverUrl} alt="The Midnight Library book cover" />
          </div>
          <div className="floating-book floating-book-two">
            <img src={fallbackBooks[1].coverUrl} alt="Atomic Habits book cover" />
          </div>
          <div className="hero-caption"><span>01 / 04</span><span>Turn the page</span></div>
        </div>
        <div className="hero-scroll">SCROLL TO DISCOVER <span></span></div>
      </section>

      <section className="benefits">
        <div><span className="benefit-icon"><BookOpen size={20} /></span><p><strong>Books with a little soul</strong><small>Handpicked by real readers</small></p></div>
        <div><span className="benefit-icon"><ShoppingBag size={20} /></span><p><strong>Wrapped with care</strong><small>A lovely little parcel, every time</small></p></div>
        <div><span className="benefit-icon"><Heart size={20} /></span><p><strong>Read, love, repeat</strong><small>Join a community of book people</small></p></div>
      </section>

      <section className="featured-section page-section" id="featured">
        <div className="section-heading">
          <div><div className="eyebrow"><span className="eyebrow-line" /> THE GOOD STUFF</div><h2>Readers are <em>loving</em></h2></div>
          <Link className="text-link" to="/catalogue">Browse all books <ArrowRight size={16} /></Link>
        </div>
        <div className="book-grid">{books.slice(0, 4).map((book) => <BookCard key={book.id} book={book} onAdd={onAdd} />)}</div>
      </section>

      <section className="quote-banner" id="about">
        <div className="quote-decoration">“</div>
        <p>There is no friend as loyal as a book.</p>
        <span>— Ernest Hemingway</span>
      </section>

      <section className="newsletter page-section">
        <div><div className="eyebrow"><span className="eyebrow-line" /> A LETTER FROM OUR BOOKSHOP</div><h2>Good reads, <em>good news.</em></h2><p>New arrivals, thoughtful recommendations, and the occasional bookish daydream.</p></div>
        <NewsletterForm />
      </section>
    </main>
  );
}

function CataloguePage({ books, onAdd }) {
  const [activeCategory, setActiveCategory] = useState("All books");
  const [query, setQuery] = useState("");
  const visibleBooks = useMemo(() => books.filter((book) => {
    const categoryMatches = activeCategory === "All books" || book.category?.toLowerCase() === activeCategory.toLowerCase();
    const queryMatches = `${book.title} ${book.author} ${book.category}`.toLowerCase().includes(query.toLowerCase());
    return categoryMatches && queryMatches;
  }), [books, activeCategory, query]);

  return (
    <main className="catalogue-page page-section">
      <div className="catalogue-intro"><div className="eyebrow"><span className="eyebrow-line" /> THE BOOKSHELF</div><h1>A world in <em>every book.</em></h1><p>Take your time. There’s a story here with your name on it.</p></div>
      <div className="catalogue-controls">
        <div className="category-tabs">{categories.map((category) => <button key={category} className={activeCategory === category ? "active" : ""} onClick={() => setActiveCategory(category)}>{category}</button>)}</div>
        <label className="catalogue-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a book or author" /><ChevronDown size={15} /></label>
      </div>
      <div className="catalogue-result-count">{visibleBooks.length} lovely {visibleBooks.length === 1 ? "read" : "reads"} to explore</div>
      {visibleBooks.length ? <div className="book-grid catalogue-grid">{visibleBooks.map((book) => <BookCard key={book.id} book={book} onAdd={onAdd} />)}</div> : <div className="empty-state"><BookOpen size={34} /><h2>No books found just yet</h2><p>Try another title, author, or category.</p></div>}
    </main>
  );
}

function AuthPage({ mode, onAuth }) {
  const isRegister = mode === "register";
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [offlineMode, setOfflineMode] = useState(false);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  async function submit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      let user;
      let localOnly = false;
      try {
        user = isRegister ? await register(form) : await login({ email: form.email, password: form.password });
      } catch (requestError) {
        if (isServerUnavailable(requestError)) {
          user = isRegister
            ? await registerLocalAccount(form)
            : await loginLocalAccount({ email: form.email, password: form.password });
          localOnly = true;
        } else if (!isRegister && requestError.status === 401) {
          if (hasLocalAccount(form.email)) {
            user = await loginLocalAccount({ email: form.email, password: form.password });
            localOnly = true;
          } else {
            throw requestError;
          }
        } else {
          throw requestError;
        }
      }
      setOfflineMode(localOnly);
      onAuth({ ...user, localOnly });
      navigate("/");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-art">
        <div className="auth-art-label"><BookOpen size={17} /> PAPER & INK BOOK CLUB</div>
        <div className="auth-art-image"></div>
        <div className="auth-quote"><span>“</span><p>A reader lives a thousand lives before he dies.</p><small>— George R. R. Martin</small></div>
      </div>
      <div className="auth-panel">
        <div className="auth-content">
          <div className="eyebrow"><span className="eyebrow-line" /> YOUR BOOKISH CORNER</div>
          <h1>{isRegister ? <>Make yourself<br />at <em>home.</em></> : <>Lovely to<br />see you <em>again.</em></>}</h1>
          <p className="auth-subtitle">{isRegister ? "Join our little community of curious readers." : "Your next favorite read is waiting for you."}</p>
          {offlineMode && <p className="offline-note" role="status">The server is unavailable. This account is saved only in this browser until the bookstore server is connected.</p>}
          <form className="auth-form" onSubmit={submit}>
            {isRegister && <div className="name-fields"><label>First name<input name="firstName" value={form.firstName} onChange={update} placeholder="Jamie" autoComplete="given-name" required /></label><label>Last name<input name="lastName" value={form.lastName} onChange={update} placeholder="Parker" autoComplete="family-name" required /></label></div>}
            <label>Email address<input name="email" type="email" value={form.email} onChange={update} placeholder="you@example.com" autoComplete="email" required /></label>
            <label>Password<input name="password" type="password" value={form.password} onChange={update} placeholder={isRegister ? "At least 8 characters" : "Your password"} autoComplete={isRegister ? "new-password" : "current-password"} minLength={isRegister ? 8 : undefined} required /></label>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="button button-dark auth-submit" disabled={busy}>{busy ? "One moment..." : isRegister ? "Create your account" : "Sign in"} <ArrowRight size={17} /></button>
          </form>
          <p className="auth-switch">{isRegister ? "Already have an account?" : "New around here?"} <Link to={isRegister ? "/login" : "/register"}>{isRegister ? "Sign in" : "Create an account"}</Link></p>
          <p className="privacy-note"><Check size={14} /> Your details are safe with us. Always.</p>
        </div>
      </div>
    </main>
  );
}

function NewsletterForm() {
  const [subscribed, setSubscribed] = useState(false);
  return <form className="newsletter-form" onSubmit={(event) => { event.preventDefault(); setSubscribed(true); }}>
    {subscribed ? <span className="newsletter-success"><Check size={17} /> You’re on the list. Happy reading!</span> : <><input type="email" placeholder="Your email address" aria-label="Your email address" required /><button className="button button-dark">Count me in <ArrowRight size={16} /></button></>}
  </form>;
}

function Footer() {
  return <footer className="site-footer"><Link className="brand footer-brand" to="/"><span className="brand-mark"><BookOpen size={20} /></span><span>paper<span className="brand-amp">&</span>ink</span></Link><p>For the love of a good story.</p><span className="footer-copy">© 2026 Paper & Ink Bookshop</span></footer>;
}

export default function App() {
  const location = useLocation();
  const [books, setBooks] = useState(fallbackBooks);
  const [catalogueNotice, setCatalogueNotice] = useState("");
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("paper-ink-user")) ?? null; } catch { return null; }
  });
  const [authNotice, setAuthNotice] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("paper-ink-user"))?.localOnly
        ? "You’re using a browser-only account. Your account is saved on this device and isn’t synced to the bookstore database."
        : "";
    } catch {
      return "";
    }
  });
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    getBooks()
      .then((data) => { if (data.length) setBooks(data); })
      .catch(() => setCatalogueNotice("We couldn’t load the live catalogue. Sample titles are shown for now."));
  }, []);

  function handleAuth(authenticatedUser) {
    setUser(authenticatedUser);
    setAuthNotice(authenticatedUser.localOnly
      ? "You’re using a browser-only account. Your account is saved on this device and isn’t synced to the bookstore database."
      : "");
    localStorage.setItem("paper-ink-user", JSON.stringify(authenticatedUser));
  }

  function addToBag() {
    setCartCount((count) => count + 1);
  }

  return (
    <>
      <Header user={user} cartCount={cartCount} />
      {catalogueNotice && location.pathname === "/catalogue" && <p className="api-notice" role="status">{catalogueNotice}</p>}
      {authNotice && <p className="api-notice" role="status">{authNotice}</p>}
      <Routes>
        <Route path="/" element={user ? <HomePage books={books} onAdd={addToBag} /> : <Navigate to="/login" replace />} />
        <Route path="/catalogue" element={<CataloguePage books={books} onAdd={addToBag} />} />
        <Route path="/login" element={<AuthPage mode="login" onAuth={handleAuth} />} />
        <Route path="/register" element={<AuthPage mode="register" onAuth={handleAuth} />} />
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
      </Routes>
      <Footer />
    </>
  );
}
