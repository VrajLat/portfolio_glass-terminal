/* Portfolio app — wiring, cursor lens, corner mode toggle, and mount. */
const { useEffect, useRef, useState } = React;

const ACCENTS = {
  teal:   { teal: '#5dd2c9', azure: '#7aa9ff' },
  amber:  { teal: '#f0b85e', azure: '#ff8a6b' },
  violet: { teal: '#a892ff', azure: '#dd92ff' },
  mono:   { teal: '#7a8699', azure: '#a3adbf' },
};
const MOTION_SCALE = { off: 0.0001, calm: 1, lively: 2 };

function CursorLens({ enabled }) {
  const ref = useRef(null);
  const [shrunk, setShrunk] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    let tx = x, ty = y;
    const onMove = (e) => { tx = e.clientX; ty = e.clientY; };
    const onOver = (e) => {
      const isHover = !!e.target.closest('a, button, .work-card, .nav .cta, .contact-grid a, .tag, .stack-group, .mode-toggle');
      setShrunk(isHover);
    };
    let raf;
    const tick = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      if (ref.current) ref.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);
  if (!enabled) return null;
  return <div ref={ref} className={`cursor-lens ${shrunk ? 'shrink' : ''}`} />;
}

/* Two-mode toggle, fixed bottom-right. Looks like a light/dark switch. */
function ModeToggle({ preset, onChange }) {
  return (
    <div className="mode-toggle glass" data-active={preset}>
      <div className="indicator" />
      <button
        type="button"
        data-active={preset === 'glass'}
        onClick={() => onChange('glass')}
        aria-label="Glass mode"
      >
        <span className="glyph" aria-hidden="true">
          <svg viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M7 1.5 A5.5 5.5 0 0 1 7 12.5 Z" fill="currentColor" opacity="0.55" />
          </svg>
        </span>
        Glass
      </button>
      <button
        type="button"
        data-active={preset === 'terminal'}
        onClick={() => onChange('terminal')}
        aria-label="Terminal mode"
      >
        <span className="glyph" aria-hidden="true">
          <svg viewBox="0 0 14 14" fill="none">
            <rect x="1.4" y="2.4" width="11.2" height="9.2" rx="1" stroke="currentColor" strokeWidth="1.2" />
            <path d="M4 6 L6 7.5 L4 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7.4 9.2 L10 9.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </span>
        Terminal
      </button>
    </div>
  );
}

function App() {
  const defaults = window.__TWEAK_DEFAULTS__ || { preset:'glass', motion:'calm', cursor:true, accent:'amber' };
  const [t, setTweak] = useTweaks(defaults);

  // Only two modes are exposed in UI; clamp anything else to glass.
  const preset = (t.preset === 'terminal') ? 'terminal' : 'glass';

  // Apply preset + motion + accent to <html>
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-preset', preset);
    root.style.setProperty('--motion-scale', String(MOTION_SCALE[t.motion] || 1));
    const a = ACCENTS[t.accent] || ACCENTS.amber;
    root.style.setProperty('--teal', a.teal);
    root.style.setProperty('--azure', a.azure);
  }, [preset, t.motion, t.accent]);

  return (
    <div className="page" data-screen-label="01 Portfolio">

      <div className="ambient">
        <div className="orb o1" />
        <div className="orb o2" />
        <div className="orb o3" />
      </div>
      <div className="caustics" />
      <div className="scanlines" />

      <CursorLens enabled={t.cursor !== false} />

      <div className="stage">
        <Nav tweaks={t} />
        <Hero tweaks={t} />
        <Work />
        <Stack />
        <Journey />
        <About />
        <Foot />
      </div>

      <ModeToggle preset={preset} onChange={(p) => setTweak('preset', p)} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
