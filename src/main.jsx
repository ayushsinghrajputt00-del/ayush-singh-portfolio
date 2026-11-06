import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import "./styles.css";

const focus = [
  ["01", "Personal growth", "Learning to take responsibility, work with people and keep improving."],
  ["02", "Technology", "Exploring web development, digital tools and the craft of building useful things."],
  ["03", "Personal discipline", "Building consistency through study, physical training and everyday habits."]
];
const journey = [
  ["Curiosity", "Ask better questions", "Stay open to ideas, people and new perspectives."],
  ["Consistency", "Show up every day", "Turn small efforts into skills through deliberate practice."],
  ["Creating", "Make ideas tangible", "Build, experiment, learn from feedback and improve."]
];
const projects = [];

function Reveal({ children, delay = 0 }) {
  const reduce = useReducedMotion();
  return <motion.div initial={reduce ? false : { opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .75, delay, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}

function Swarm({ onDone }) {
  useEffect(() => {
    const canvas = document.querySelector(".swarm-canvas");
    const ctx = canvas.getContext("2d");
    let raf, frame = 0;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const w = innerWidth, h = innerHeight, cx = w / 2, cy = h / 2;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const particles = Array.from({ length: Math.min(520, Math.floor(w*h/2400)) }, () => {
      const a = Math.random() * Math.PI * 2, r = Math.max(w,h) * (.25 + Math.random()*.7);
      return { a, r, x: cx + Math.cos(a)*r, y: cy + Math.sin(a)*r, size: .5 + Math.random()*1.5, speed: .009 + Math.random()*.024, phase: Math.random()*6.28 };
    });
    const draw = () => {
      frame++; ctx.clearRect(0,0,w,h);
      const gather = Math.min(frame/110,1);
      const fade = frame > 185 ? Math.max(0,1-(frame-185)/65) : Math.min(frame/18,1);
      particles.forEach(p => {
        const a = p.a + frame*p.speed, r = p.r*(1-gather*.82) + Math.sin(frame*.035+p.phase)*10;
        const tx = cx + Math.cos(a)*r, ty = cy + Math.sin(a)*r;
        p.x += (tx-p.x)*.045; p.y += (ty-p.y)*.045;
        ctx.beginPath(); ctx.fillStyle = `rgba(215,185,132,${fade*(.35+.65*Math.sin(p.phase+frame*.025)**2)})`;
        ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill();
      });
      if (frame < 250) raf = requestAnimationFrame(draw); else onDone();
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);
  return <canvas className="swarm-canvas" aria-hidden="true" />;
}

function App() {
  const [menu, setMenu] = useState(false);
  const [swarm, setSwarm] = useState(false);
  const [motionOn, setMotionOn] = useState(true);
  const finish = React.useCallback(() => setSwarm(false), []);
  useEffect(() => {
    const scroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      document.documentElement.style.setProperty("--progress", max > 0 ? `${scrollY/max*100}%` : "0%");
    };
    addEventListener("scroll", scroll, { passive: true });
    return () => removeEventListener("scroll", scroll);
  }, []);
  const toggleMotion = () => { setMotionOn(v => !v); setSwarm(true); };
  const links = [["About","#about"],["Focus","#focus"],["Journey","#journey"],["Work","#work"]];
  return <>
    <div className="progress" />
    <header className="header">
      <a className="brand" href="#top">AS<span>.</span><small> / PORTFOLIO</small></a>
      <button className="menu-button" onClick={() => setMenu(!menu)} aria-label="Toggle menu">☰</button>
      <nav className={menu ? "nav open" : "nav"}>
        {links.map(([t,h]) => <a key={h} href={h} onClick={() => setMenu(false)}>{t}</a>)}
        <button className="motion-button" onClick={toggleMotion}><i className={motionOn ? "dot live" : "dot"} />Motion</button>
        <a className="nav-cta" href="#contact">Let's connect ↗</a>
      </nav>
    </header>

    <main id="top">
      <section className="hero shell">
        <div className="eyebrow"><span /> PERSONAL PORTFOLIO <b>EST. 2008 · INDIA</b></div>
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="gold-label">STUDENT · CREATOR · CURIOUS MIND</p>
            <h1>Built by<br/><em>discipline.</em><br/>Driven by<br/><em>purpose.</em></h1>
            <p className="hero-desc">I'm Ayush — a student who believes character is built through consistency, curiosity and the courage to take responsibility.</p>
            <div className="hero-links"><a className="button" href="#about">Explore my story <span>↘</span></a><a className="under-link" href="#work">Discover work ↗</a></div>
          </div>
          <div className="hero-art" aria-label="Abstract gold monogram A">
            <div className="ring ring-a"/><div className="ring ring-b"/><div className="ring ring-c"/>
            <div className="monogram">A<span>.</span></div>
            <div className="coordinates">28°36' N<br/>77°12' E</div>
            <div className="art-caption"><span>FIG. 01</span><span>THE MAKING OF A MIND</span></div>
          </div>
        </div>
        <div className="hero-foot"><span>SCROLL TO EXPLORE</span><b>↓</b><span>DISCIPLINE · CURIOSITY · PURPOSE</span></div>
      </section>

      <div className="quote-band"><p>“The standard you walk past is the standard you accept.”</p><span>— A PRINCIPLE TO LIVE BY</span></div>

      <section className="section shell" id="about">
        <Reveal><div className="section-label"><span>01 / ABOUT</span><span>A LITTLE CONTEXT</span></div></Reveal>
        <div className="about-grid">
          <Reveal><h2>Not just a<br/><em>destination.</em><br/>A work in progress.</h2></Reveal>
          <Reveal delay={.12}><div className="body-copy"><p>My interests sit at the intersection of technology, creativity and personal growth. Through my studies and my own experiments with fitness and the web, I'm learning to turn ambition into action — one deliberate step at a time.</p><div className="meta"><div><small>BASED IN</small><b>Delhi, India</b></div><div><small>CURRENT FOCUS</small><b>Learning & building</b></div></div></div></Reveal>
        </div>
      </section>

      <section className="section shell" id="focus">
        <Reveal><div className="section-label"><span>02 / AREAS OF FOCUS</span><span>WHAT I'M BUILDING</span></div><h2 className="section-heading">Three directions.<br/><em>One intention.</em></h2></Reveal>
        <div className="focus-list">{focus.map(([n,t,d],i)=><Reveal key={n} delay={i*.07}><article className="focus-row"><span className="number">{n}</span><h3>{t}</h3><p>{d}</p><b>↗</b></article></Reveal>)}</div>
      </section>

      <section className="section shell" id="journey">
        <Reveal><div className="section-label"><span>03 / THE JOURNEY</span><span>LEARNING IN PROGRESS</span></div><h2 className="section-heading">Grounded in learning.<br/><em>Aiming higher.</em></h2></Reveal>
        <div className="timeline">{journey.map(([t,s,d],i)=><Reveal key={t} delay={i*.1}><article className="timeline-row"><span className="number">0{i+1}</span><div><h3>{t}</h3><p>{s}</p><small>{d}</small></div><b>✳</b></article></Reveal>)}</div>
      </section>

      <section className="section shell" id="work">
        <Reveal><div className="section-label"><span>04 / SELECTED WORK</span><span>THE WORK SPEAKS</span></div><div className="work-title"><h2 className="section-heading">Ideas into <em>action.</em></h2><span>(00)</span></div></Reveal>
        <Reveal><div className="empty-work"><div className="star">✳</div><div><h3>The next chapter is being built.</h3><p>This space is reserved for real projects, experiments and things worth sharing. No imaginary client list. We have enough fiction on the internet already.</p></div><small>WORK IN PROGRESS / 2026</small></div></Reveal>
      </section>

      <section className="contact shell" id="contact">
        <Reveal><div className="section-label"><span>05 / CONTACT</span><span>OPEN TO GOOD CONVERSATIONS</span></div><p className="gold-label">HAVE SOMETHING IN MIND?</p><h2>Let's make<br/><em>it matter.</em></h2><div className="contact-foot"><p>I'd love to connect. Find me on Instagram or explore what I'm building on GitHub.</p><div className="contact-links"><a className="button" href="https://www.instagram.com/iiuss__/" target="_blank" rel="noreferrer">Instagram @iiuss__ ↗</a><a className="social-link" href="https://github.com/ayushsinghrajputt00-del" target="_blank" rel="noreferrer">GitHub ↗</a></div></div></Reveal>
      </section>
    </main>
    <footer className="footer shell"><a className="brand" href="#top">AS<span>.</span></a><span>© {new Date().getFullYear()} AYUSH SINGH</span><a href="https://www.instagram.com/iiuss__/" target="_blank" rel="noreferrer">INSTAGRAM ↗</a><a href="#top">BACK TO TOP ↑</a><small>MADE WITH INTENTION.</small></footer>
    <AnimatePresence>{swarm && <Swarm onDone={finish}/>}</AnimatePresence>
  </>;
}

createRoot(document.getElementById("root")).render(<React.StrictMode><App/></React.StrictMode>);