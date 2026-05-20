/* Portfolio sections — exposes Hero, Work, Stack, Journey, About, Footer to window */
const { useEffect, useRef, useState } = React;

/* ---------- shared ---------- */

function Reveal({ children, delay = 0, from = 'bottom', distance, duration, as = 'div', className = '', style = {}, ...rest }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } },
      { threshold: 0.12 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  const d = distance ?? 14;
  const initial = {
    bottom: `translate3d(0, ${d}px, 0)`,
    top:    `translate3d(0, -${d}px, 0)`,
    left:   `translate3d(-${d}px, 0, 0)`,
    right:  `translate3d(${d}px, 0, 0)`,
  }[from] || `translate3d(0, ${d}px, 0)`;
  const Comp = as;
  return (
    <Comp ref={ref} className={`reveal ${seen ? 'in' : ''} ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: duration ? `${duration}ms` : undefined,
        transform: seen ? 'none' : initial,
        ...style,
      }} {...rest}>
      {children}
    </Comp>
  );
}

/* ---------- Bubbles ---------- */

function Bubbles({ density = 6 }) {
  const items = Array.from({ length: density }).map((_, i) => {
    const size = 6 + Math.random() * 18;
    return {
      key: i,
      left: `${Math.random() * 100}%`,
      bottom: `${-20 + Math.random() * 20}%`,
      size,
      drift: `${(Math.random() - 0.5) * 60}px`,
      dur: `${8 + Math.random() * 10}s`,
      delay: `${-Math.random() * 12}s`,
    };
  });
  return (
    <div aria-hidden="true" style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden' }}>
      {items.map(b => (
        <span key={b.key} className="bubble" style={{
          left: b.left, bottom: b.bottom, width: b.size, height: b.size,
          '--drift': b.drift, '--dur': b.dur, '--delay': b.delay,
        }} />
      ))}
    </div>
  );
}

/* ---------- Nav ---------- */

function Nav({ tweaks }) {
  return (
    <nav className="nav glass">
      <div className="brand">
        <span className="dot" />
        <span>Vraj Lathiya</span>
      </div>
      <div className="nav-right">
        <div className="links">
          <a href="#work">Work</a>
          <a href="#stack">Stack</a>
          <a href="#journey">Journey</a>
          <a href="#about">About</a>
        </div>
        <a className="cta" href="#about">Get in touch</a>
      </div>
    </nav>
  );
}

/* ---------- Hero ---------- */

function Hero({ tweaks }) {
  const display = (
    <h1 className="display">
      <span>Engineering at</span><br />
      <span className="em">
        <span className="waterline-wrap">
          <span className="water-text">the waterline.</span>
        </span>
      </span>
    </h1>
  );

  return (
    <section className="hero">
      <Bubbles density={8} />

      <div style={{ position: 'relative' }}>
        <Reveal>
          <div className="pill glass" style={{ marginBottom: 18 }}>
            <span className="signal-dot" />
            MSc Computer Science · Open to AI roles · 2026
          </div>
        </Reveal>

        <Reveal delay={60}>{display}</Reveal>

        <Reveal delay={140}>
          <p className="lede">
            Half my work is research-grade — RAG, agents, LLM orchestration. The
            other half is the unglamorous full-stack scaffolding that lets the
            first half ship. I prefer when the seam is invisible.
          </p>
        </Reveal>

        <Reveal delay={220}>
          <div className="cta-row">
            <a className="btn btn-fill" href="#work">
              <span>See selected work</span><span className="arr">→</span>
            </a>
            <a className="btn btn-glass" href="https://drive.google.com/uc?export=download&id=1qEWHdtXj4uiG4JD7pAW3m1abArqWy9qB" target="_blank" rel="noopener noreferrer">
              <span>Download CV</span>
            </a>
          </div>
        </Reveal>

        <Reveal delay={300}>
          <div className="stats">
            <div>
              <div className="k">Now</div>
              <div className="v">Streaming RAG · Groq</div>
            </div>
            <div>
              <div className="k">Latest</div>
              <div className="v">VerseAI · 6 langs</div>
            </div>
            <div>
              <div className="k">Based</div>
              <div className="v">Leicester · GMT</div>
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal delay={120}>
        <div className="photo-card">
          <div className="frame" />
          <div className="photo">
            <img src="hero.webp" alt="Vraj Lathiya, underwater portrait" />
            <div className="shimmer" />
          </div>
          <div className="signature">— Vraj, 2026</div>
          <div className="msc-badge">
            <div className="k">MSc</div>
            <div className="y">'25</div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------- Work ---------- */

function StreamingChatPreview() {
  const [tokenIdx, setTokenIdx] = useState(0);
  const tokens = [
    "Each", "chunk", "is", "1,000", "tokens", "with", "200", "overlap",
    "—", "embedded", "into", "Chroma", "and", "scored", "by", "MMR",
    " ", "[", "1", "]", " ", "before", "the", "rewrite", "pass."
  ];
  useEffect(() => {
    const id = setInterval(() => {
      setTokenIdx(i => (i + 1) % (tokens.length + 16));
    }, 220);
    return () => clearInterval(id);
  }, []);
  const visible = tokens.slice(0, Math.min(tokenIdx, tokens.length));

  return (
    <div className="chat-stream">
      <div className="row"><span className="who">user</span><span>How does chunking actually work in this pipeline?</span></div>
      <div className="row" style={{ alignItems: 'flex-start' }}>
        <span className="who">groq</span>
        <span>
          {visible.map((t, i) => (
            t.startsWith("[") || t === "1" || t === "]"
              ? <span key={i} className="cit tok">{t}</span>
              : <span key={i} className="tok"> {t}</span>
          ))}
          {tokenIdx < tokens.length && <span className="caret" />}
        </span>
      </div>
      <div style={{ display:'flex', gap:6, marginTop:'auto', paddingTop:8, borderTop:'0.5px solid var(--hair-2)' }}>
        <span className="cit" style={{ background:'rgba(122,169,255,0.18)', color:'var(--azure)' }}>llama-3.1-70b</span>
        <span className="cit" style={{ background:'var(--milk-edge)', color:'var(--ink-3)' }}>132ms TTFB</span>
      </div>
    </div>
  );
}

function PoemPreview() {
  return (
    <div className="poem-card">
      <div className="lines">
        “The river<br />
        forgets its banks —<br />
        the banks remember.”
      </div>
      <div>
        <div className="lang-row">
          <span className="lang">EN</span><span className="lang">हिंदी</span>
          <span className="lang">ગુજરાતી</span><span className="lang">FR</span>
          <span className="lang">ES</span><span className="lang">JP</span>
        </div>
        <div style={{ fontSize:11, color:'var(--ink-4)', marginTop:10, fontWeight:500, letterSpacing:'0.06em', textTransform:'uppercase' }}>
          Mode · Poetic ⇄ Accurate
        </div>
      </div>
    </div>
  );
}

function LatencyChart() {
  // animated SVG that gently morphs — RAF only runs when in viewport
  const [t, setT] = useState(0);
  const containerRef = useRef(null);
  useEffect(() => {
    let raf, start;
    const tick = (ts) => {
      if (!start) start = ts;
      setT((ts - start) / 1000);
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        start = null;
        raf = requestAnimationFrame(tick);
      } else {
        cancelAnimationFrame(raf);
      }
    }, { threshold: 0.1 });
    if (containerRef.current) io.observe(containerRef.current);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, []);
  const pts = [];
  for (let i = 0; i < 60; i++) {
    const x = (i / 59) * 100;
    const y = 35 + Math.sin(i * 0.35 + t * 0.6) * 8 + Math.sin(i * 0.12 + t * 0.3) * 14 + (i > 40 ? -((i-40)*1.2) : 0);
    pts.push(`${x},${y}`);
  }
  const path = `M${pts.join(' L')}`;
  return (
    <div ref={containerRef} className="stream-viz">
      <div className="label-row">
        <span>TTFB · ms</span>
        <span>now · 132ms</span>
      </div>
      <svg viewBox="0 0 100 70" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lg" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--teal)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--teal)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${path} L100,70 L0,70 Z`} fill="url(#lg)" />
        <path d={path} fill="none" stroke="var(--teal)" strokeWidth="1.2" strokeLinejoin="round" />
        {[20, 40, 60].map(y => (
          <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="var(--hair)" strokeWidth="0.4" strokeDasharray="2 3" />
        ))}
      </svg>
      <div style={{ display:'flex', gap:10, fontFamily:'var(--mono)', fontSize:10.5, color:'var(--ink-4)' }}>
        <span>p50 142</span><span>p95 198</span><span>p99 256</span>
      </div>
    </div>
  );
}

function Work() {
  return (
    <section className="section" id="work">
      <div className="section-head">
        <div>
          <Reveal as="div" className="eyebrow">Selected work · 2024–2026</Reveal>
          <Reveal as="h2" delay={80}>
            Two systems, <em style={{ fontFamily:'var(--face-em)', fontStyle:'italic', fontWeight:400, color:'var(--ink-2)' }}>one philosophy</em> — keep the seam invisible.
          </Reveal>
        </div>
        <div className="section-head .index" style={{ fontFamily:'var(--mono)', fontSize:12, color:'var(--ink-4)' }}>02 / Work</div>
      </div>

      <div className="work-grid">

        <Reveal as="div" className="work-card wide glass" from="top" distance="80" duration={1000}>
          <div className="sheen" />
          <div className="body">
            <div className="meta">
              <span>2026</span><span className="sep" /><span>Streaming RAG</span>
            </div>
            <h3>Fast-API RAG Chatbot</h3>
            <p>
              130+ pages of API docs scraped, chunked (1k/200), embedded into Chroma,
              and served through a multi-turn rewriter on Llama-3.1-8B before the
              answer is streamed off Groq's Llama-3.1-70B — clickable citations included.
            </p>
            <div className="tag-row">
              <span className="tag">Next.js</span>
              <span className="tag">Vercel AI SDK</span>
              <span className="tag">LangChain</span>
              <span className="tag">Groq · Llama-3.1-70B</span>
              <span className="tag">Chroma</span>
            </div>
            <a className="open">
              <span>Read case study</span><span className="arr">→</span>
            </a>
          </div>
          <div className="preview"><StreamingChatPreview /></div>
        </Reveal>

        <Reveal as="div" className="work-card glass" from="left" distance="120" duration={1000} delay={120}>
          <div className="sheen" />
          <div>
            <div className="meta">
              <span>Summer 2025</span><span className="sep" /><span>MSc dissertation</span>
            </div>
            <h3>VerseAI — Poetry Generator</h3>
            <p>
              A Django social platform with an iterative GPT-4 / GPT-5 refinement
              loop and a dual translation engine — Poetic and Accurate modes —
              across six languages.
            </p>
            <div className="tag-row">
              <span className="tag">Django · DRF</span>
              <span className="tag">GPT-4 / GPT-5</span>
              <span className="tag">JWT</span>
              <span className="tag">AJAX feeds</span>
            </div>
          </div>
          <PoemPreview />
        </Reveal>

        <Reveal as="div" className="work-card glass" from="right" distance="120" duration={1000} delay={120}>
          <div className="sheen" />
          <div>
            <div className="meta">
              <span>In progress</span><span className="sep" /><span>Internal</span>
            </div>
            <h3>Latency telemetry · Groq</h3>
            <p>
              A small dashboard I built to babysit the streaming pipeline — quantile
              latency, citation-hit rate, and a drift alarm when the rewriter starts
              hallucinating context.
            </p>
            <div className="tag-row">
              <span className="tag">Python</span>
              <span className="tag">D3</span>
              <span className="tag">Postgres</span>
            </div>
          </div>
          <LatencyChart />
        </Reveal>

      </div>
    </section>
  );
}

/* ---------- Stack ---------- */

function Stack() {
  const marqueeItems = [
    'Python','Next.js','LangChain','Groq','Django','Llama 3.1','GPT-4','GPT-5',
    'Chroma','Postgres','JWT','Tailwind','Java','SQL','Vercel AI SDK','RAG',
    'NLP','Prompt Engineering'
  ];
  const items = [...marqueeItems, ...marqueeItems];

  const groups = [
    { k: 'Languages', items: ['Python','Java','SQL','TypeScript','JavaScript'] },
    { k: 'AI / ML', items: ['RAG','LangChain','Llama 3.1','GPT-4 / 5','Prompt eng.','NLP','Embeddings'] },
    { k: 'Frameworks', items: ['Next.js','Django · DRF','Vercel AI SDK','Tailwind'] },
    { k: 'Data · Infra', items: ['Chroma','Postgres','MySQL','Groq','JWT','Git'] },
  ];

  return (
    <section className="section" id="stack">
      <div className="section-head">
        <div>
          <Reveal as="div" className="eyebrow">Stack · what's loaded</Reveal>
          <Reveal as="h2" delay={80}>The tools I reach for first.</Reveal>
        </div>
        <div style={{ fontFamily:'var(--mono)', fontSize:12, color:'var(--ink-4)' }}>03 / Stack</div>
      </div>

      <div className="marquee">
        <div className="track">
          {items.map((it, i) => <span key={i} className="item">{it}</span>)}
        </div>
      </div>

      <div className="stack-grid">
        {groups.map((g, i) => (
          <Reveal key={g.k} as="div" className="stack-group glass" delay={i * 70}>
            <div className="eyebrow">{g.k}</div>
            <div className="items">
              {g.items.map(t => <span key={t} className="tag">{t}</span>)}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- Journey ---------- */

function Journey() {
  const items = [
    {
      year: '2026',
      title: 'Student Support Specialist',
      meta: 'Cosmic People · Leicester · Jan 2025 – present',
      bullets: [
        'Academic support for students with sensory impairments and complex learning needs across UG and PG disciplines.',
        'Sighted-guide, scribe, reader and invigilator at university-level examinations.',
        'Tailored note-taking — screen-reader formatting, phonetic emphasis — for accessibility.',
      ],
    },
    {
      year: '2025',
      title: 'MSc Advanced Computer Science',
      meta: 'University of Leicester · 2024–2025',
      bullets: [
        'Dissertation: VerseAI — OpenAI-powered poetry generator with community features.',
      ],
    },
    {
      year: '2024',
      title: 'BCA · Java & Python specialisation',
      meta: 'Atmiya University · Rajkot · 2021–2024 · 8.6 GPA',
      bullets: [
        'Coursework in cyber security and networking; CISCO Fundamentals of Networking certified.',
        'Google GDSC hackathon participant — built a Java/SQL prototype within the timeframe.',
      ],
    },
    {
      year: '2021',
      title: 'Junior Technician',
      meta: 'Rushabh Infoworld · Rajkot · Aug 2020 – Aug 2021',
      bullets: [
        'Assembled custom builds to client spec; diagnosed component and OS-level failures.',
        'Translated technical findings to non-technical customers — first taste of building seams that hide themselves.',
      ],
    },
  ];
  return (
    <section className="section" id="journey">
      <div className="section-head">
        <div>
          <Reveal as="div" className="eyebrow">Journey</Reveal>
          <Reveal as="h2" delay={80}>
            From bench-side repairs in Rajkot to <em style={{ fontFamily:'var(--face-em)', fontStyle:'italic', fontWeight:400, color:'var(--ink-2)' }}>streaming inference</em> in Leicester.
          </Reveal>
        </div>
        <div style={{ fontFamily:'var(--mono)', fontSize:12, color:'var(--ink-4)' }}>04 / Journey</div>
      </div>

      <div className="timeline">
        {items.map((it, i) => (
          <React.Fragment key={it.year + i}>
            <div className="tl-year">{it.year}</div>
            <Reveal as="div" className="tl-item" delay={i * 60}>
              <h4>{it.title}</h4>
              <div className="role-meta">{it.meta}</div>
              <ul>{it.bullets.map((b, bi) => <li key={bi}>{b}</li>)}</ul>
            </Reveal>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

/* ---------- About / Contact ---------- */

function About() {
  return (
    <section className="section" id="about">
      <Reveal as="div" className="about-strip glass">
        <div>
          <div className="eyebrow" style={{ marginBottom: 18 }}>About · close enough</div>
          <h3>
            I'm an AI engineer who still <em>solders the cable</em> when the cable
            needs soldering.
          </h3>
          <p>
            Multilingual (EN · हिंदी · ગુજરાતી), based in Leicester, available for
            AI / full-stack roles starting 2026. I'm easiest to reach over email —
            slow ones get faster replies than fast ones.
          </p>
        </div>
        <div className="contact-grid">
          <a href="mailto:vrajlathiya04@gmail.com">
            <span className="k">Email</span>
            <span className="v">vrajlathiya04 →</span>
          </a>
          <a href="https://github.com/VrajLat" target="_blank" rel="noopener noreferrer">
            <span className="k">GitHub</span>
            <span className="v">VrajLat →</span>
          </a>
          <a href="https://www.linkedin.com/in/vraj-lathiya-975209225/" target="_blank" rel="noopener noreferrer">
            <span className="k">LinkedIn</span>
            <span className="v">in/vraj-lathiya →</span>
          </a>
          <a href="https://drive.google.com/uc?export=download&id=1qEWHdtXj4uiG4JD7pAW3m1abArqWy9qB" target="_blank" rel="noopener noreferrer">
            <span className="k">CV</span>
            <span className="v">Resume · PDF →</span>
          </a>
        </div>
      </Reveal>
    </section>
  );
}

function Foot() {
  return (
    <footer className="foot">
      <span>© 2026 Vraj Lathiya · Engineering at the waterline.</span>
      <span style={{ display:'flex', gap:18 }}>
        <span>Leicester · GMT</span>
        <span>Built in HTML, hand-cut.</span>
      </span>
    </footer>
  );
}

Object.assign(window, {
  Reveal, Bubbles, Nav, Hero, Work, Stack, Journey, About, Foot
});
