import React, { useEffect, useState, useContext } from "react";
import { createRoot } from "react-dom/client";
import { motion, useReducedMotion } from "framer-motion";
import "./styles.css";

const focus = [
  ["01", "Leadership & responsibility", "Learning to take initiative, work with people and stay accountable."],
  ["02", "Technology & digital craft", "Building practical skills through web projects, tools and experimentation."],
  ["03", "Discipline & endurance", "Developing consistency through study, physical training and new challenges."]
];
const tools = [
  ["01", "React", "Component-based interface development"],
  ["02", "Vite", "Frontend development and production builds"],
  ["03", "Framer Motion", "Accessible interface and scroll animations"],
  ["04", "CSS", "Responsive layouts and visual styling"],
  ["05", "GitHub", "Version control and project source management"],
  ["06", "Vercel", "Deployment and production hosting"]
];
const journey = [
  ["Curiosity", "Question the obvious", "Explore new ideas, understand how things work and keep learning."],
  ["Discipline", "Do the work daily", "Build reliable habits through study, training and deliberate practice."],
  ["Execution", "Turn plans into action", "Create, test, learn from feedback and improve the next attempt."]
];

const MotionContext = React.createContext(true);
function Reveal({ children, delay = 0 }) {
  const reduce = useReducedMotion();
  const motionEnabled = useContext(MotionContext);
  const active = motionEnabled && !reduce;
  return <motion.div initial={active ? { opacity: 0, y: 22 } : false} whileInView={active ? { opacity: 1, y: 0 } : undefined} viewport={{ once: true, amount: .15 }} transition={{ duration: .7, delay, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}



function RebuildEffect() {
  useEffect(() => {
    const root = document.getElementById("root");
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0, cancelled = false, revealing = false, revealStarted = 0, finished = false;
    const width = window.innerWidth, height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const canvas = document.createElement("canvas");
    canvas.className = "rebuild-canvas";
    canvas.style.background = "transparent";
    canvas.style.zIndex = "9998";
    canvas.style.pointerEvents = "none";
    canvas.width = Math.ceil(width * dpr);
    canvas.height = Math.ceil(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    document.body.appendChild(canvas);
    document.body.classList.add("rebuild-running");

    const maskScale = Math.min(0.78, 900 / Math.max(width, 1));
    const mask = document.createElement("canvas");
    mask.width = Math.ceil(width * maskScale);
    mask.height = Math.ceil(height * maskScale);
    const maskCtx = mask.getContext("2d");
    maskCtx.setTransform(maskScale, 0, 0, maskScale, 0, 0);
    maskCtx.fillStyle = "#ffffff";
    maskCtx.strokeStyle = "#ffffff";
    maskCtx.lineWidth = 1;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const parent = node.parentElement;
      const value = (node.textContent || "").replace(/\s+/g, " ").trim();
      if (!parent || !value) continue;
      const style = getComputedStyle(parent);
      if (style.display === "none" || style.visibility === "hidden") continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      const rects = Array.from(range.getClientRects()).filter(rect => rect.width > 1 && rect.height > 1);
      if (!rects.length) continue;
      maskCtx.font = style.font || [
        style.fontStyle, style.fontVariant, style.fontWeight, style.fontSize, style.fontFamily
      ].join(" ");
      maskCtx.textBaseline = "alphabetic";
      const words = value.split(" ");
      let line = "", lineIndex = 0;
      const paintLine = () => {
        const rect = rects[Math.min(lineIndex, rects.length - 1)];
        if (line && rect) maskCtx.fillText(line, rect.left, rect.top + rect.height * 0.8, Math.max(4, rect.width));
      };
      for (const word of words) {
        const rect = rects[Math.min(lineIndex, rects.length - 1)];
        if (!rect) break;
        const candidate = line ? line + " " + word : word;
        if (line && maskCtx.measureText(candidate).width > rect.width && lineIndex < rects.length - 1) {
          paintLine();
          lineIndex += 1;
          line = word;
        } else line = candidate;
      }
      paintLine();
    }

    // Keep the page's real dividers and hero orbits, never blueprint boxes.
    root.querySelectorAll(".hero-topline,.hero-bottom,.metrics,.section-label,.focus-row,.timeline-row,.footer,.contact-foot").forEach(element => {
      const rect = element.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > height || rect.width < 10) return;
      const style = getComputedStyle(element);
      const bottom = parseFloat(style.borderBottomWidth) || 0;
      const top = parseFloat(style.borderTopWidth) || 0;
      if (bottom > 0) maskCtx.fillRect(rect.left, rect.bottom - bottom, rect.width, Math.max(1, bottom));
      if (top > 0) maskCtx.fillRect(rect.left, rect.top, rect.width, Math.max(1, top));
    });
    root.querySelectorAll(".hero-art .orbit").forEach(element => {
      const rect = element.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > height) return;
      maskCtx.save();
      maskCtx.beginPath();
      maskCtx.ellipse(rect.left + rect.width / 2, rect.top + rect.height / 2,
        Math.max(2, rect.width * 0.48), Math.max(2, rect.height * 0.48), 0, 0, Math.PI * 2);
      maskCtx.stroke();
      maskCtx.restore();
    });

    const pixels = maskCtx.getImageData(0, 0, mask.width, mask.height).data;
    const targets = [];
    for (let y = 0; y < mask.height; y += 2) {
      for (let x = 0; x < mask.width; x += 2) {
        if (pixels[(y * mask.width + x) * 4 + 3] > 70 && Math.random() < 0.82) {
          targets.push({ x: x / maskScale, y: y / maskScale });
        }
      }
    }
    for (let i = targets.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [targets[i], targets[j]] = [targets[j], targets[i]];
    }
    const maxParticles = width < 700 ? 1250 : 2100;
    const palette = ["#f05b49", "#e9b65f", "#66c9bd", "#b69be8"];
    const particles = targets.slice(0, maxParticles).map(target => {
      const edge = Math.floor(Math.random() * 4);
      let x = Math.random() * width, y = Math.random() * height;
      if (edge === 0) x = -25 - Math.random() * width * 0.25;
      if (edge === 1) x = width + 25 + Math.random() * width * 0.25;
      if (edge === 2) y = -25 - Math.random() * height * 0.25;
      if (edge === 3) y = height + 25 + Math.random() * height * 0.25;
      return {
        sx: x, sy: y, tx: target.x, ty: target.y,
        delay: Math.random() * 0.34,
        size: 0.65 + Math.random() * 1.05,
        color: palette[Math.floor(Math.random() * palette.length)],
        seed: Math.random() * Math.PI * 2
      };
    });

    const started = performance.now(), gatherDuration = 5.1, settleDuration = 0.85, fadeDuration = 1300;
    const onResize = () => finish();
    const finish = () => {
      if (finished) return;
      finished = true;
      document.body.classList.remove("rebuild-running");
      canvas.remove();
      removeEventListener("resize", onResize);
    };
    addEventListener("resize", onResize, { once: true });

    const draw = now => {
      if (cancelled || finished) return;
      const elapsed = (now - started) / 1000;
      if (!revealing && elapsed >= gatherDuration + settleDuration) {
        // Keep the page completely hidden on black until every particle has settled.
        revealing = true;
        revealStarted = now;
        document.body.classList.remove("rebuild-running");
      }
      ctx.clearRect(0, 0, width, height);
      const fade = revealing ? Math.max(0, 1 - (now - revealStarted) / fadeDuration) : 1;
      for (const particle of particles) {
        const progress = Math.max(0, Math.min(1, (elapsed - particle.delay) / (gatherDuration - particle.delay)));
        const eased = 1 - Math.pow(1 - progress, 3);
        const drift = (1 - eased) * 7;
        const x = particle.sx + (particle.tx - particle.sx) * eased + Math.sin(now * 0.0012 + particle.seed) * drift;
        const y = particle.sy + (particle.ty - particle.sy) * eased + Math.cos(now * 0.0011 + particle.seed) * drift;
        ctx.globalAlpha = fade * (0.42 + 0.58 * progress);
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(x, y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (revealing && fade <= 0) {
        finish();
        return;
      }
      raf = requestAnimationFrame(draw);
    };

    if (!particles.length) {
      finish();
      return;
    }
    raf = requestAnimationFrame(draw);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      document.body.classList.remove("rebuild-running");
      canvas.remove();
      removeEventListener("resize", onResize);
    };
  }, []);
  return null;
}
function App() {
  const [menu,setMenu]=useState(false),[motionOn,setMotionOn]=useState(true);
  useEffect(()=>{const scroll=()=>{const max=document.documentElement.scrollHeight-innerHeight;document.documentElement.style.setProperty("--progress",max>0?scrollY/max*100+"%":"0%")};addEventListener("scroll",scroll,{passive:true});scroll();return()=>removeEventListener("scroll",scroll)},[]);
  const links=[["01","Profile","#about"],["02","Education","#education"],["03","Focus","#focus"],["04","Journey","#journey"],["05","Tools","#skills"],["06","Work","#work"]];
  return <MotionContext.Provider value={motionOn}><>
    <RebuildEffect />
    <div className="progress"/>
    <header className="header">
      <a className="brand" href="#top">AS<span>_</span><small>PERSONAL PORTFOLIO / 2026</small></a>
      <button className="menu-button" onClick={()=>setMenu(!menu)} aria-label="Toggle menu">☰</button>
      <nav className={menu?"nav open":"nav"}>{links.map(([n,t,h])=><a key={h} href={h} onClick={()=>setMenu(false)}><small>{n}</small>{t}</a>)}<button className="motion-button" onClick={()=>setMotionOn(v=>!v)} aria-pressed={motionOn}><i/> MOTION / {motionOn?"ON":"OFF"}</button><a className="nav-cta" href="#contact">Initiate contact ↗</a></nav>
    </header>
    <main id="top">
      <section className="hero shell">
        <div className="hero-topline"><span><i/> INDEPENDENT MIND / ACTIVE LEARNING</span><span>NEW DELHI, IN</span><span>28°36' N / 77°12' E</span></div>
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="gold-label">STUDENT · CREATOR · CURIOUS MIND</p>
            <h1>AYUSH<span className="red-dot">.</span><br/><em>Singh</em></h1>
            <p className="hero-desc">Exploring technology, creativity and new ideas. Learning by doing, staying curious and building things that feel meaningful.</p>
            <div className="hero-links"><a className="button" href="#about">Explore profile <span>↘</span></a><a className="under-link" href="#work">View selected work ↗</a></div>
          </div>
          <div className="hero-art">
            <div className="art-grid"/><div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="portrait-mark">A<span>.</span></div>
            <div className="art-index"><span>FIG. 001</span><span>THE HUMAN ELEMENT</span></div>
            <div className="art-stamp">AS<br/><small>IND / 26</small></div>
          </div>
        </div>
        <div className="hero-bottom"><span>SCROLL TO EXPLORE ↓</span><span>DISCIPLINE / CURIOSITY / EXECUTION</span><span>PORTFOLIO INDEX 001—005</span></div>
      </section>
      <section className="metrics shell">
        <div className="metric-card"><small>01 / BASE</small><strong>DELHI</strong><span>India · IST</span></div>
        <div className="metric-card"><small>02 / MODE</small><strong>LEARNING</strong><span>Always in progress</span></div>
        <div className="metric-card"><small>03 / PRINCIPLE</small><strong>DISCIPLINE</strong><span>Consistency over intensity</span></div>
        <div className="metric-card"><small>04 / STATUS</small><strong><i/> ACTIVE</strong><span>Building the next chapter</span></div>
      </section>
      <section className="section shell" id="about">
        <Reveal><div className="section-label"><span>01 / PROFILE</span><span>BACKGROUND & PHILOSOPHY</span></div></Reveal>
        <div className="about-grid"><Reveal><h2>Curious by nature.<br/><em>Always becoming.</em></h2></Reveal><Reveal delay={.1}><div className="body-copy"><p>I'm Ayush, a student from Delhi interested in technology, creativity, fitness and personal growth. I enjoy exploring how things work, learning new skills and turning interesting ideas into something tangible.</p><p>I like keeping an open mind, learning from experience and getting a little better with every project.</p><div className="profile-tags"><span>SELF DEVELOPMENT</span><span>TECHNOLOGY</span><span>LEADERSHIP</span><span>FITNESS</span></div></div></Reveal></div>
      </section>
      <section className="section shell" id="education">
        <Reveal><div className="section-label"><span>02 / EDUCATION</span><span>ACADEMIC BACKGROUND</span></div><h2 className="section-heading">Learning, built<br/><em>step by step.</em></h2></Reveal>
        <div className="education-grid">
          <Reveal><article className="education-card"><span>01 / SECONDARY · 2024</span><h3>Class X</h3><p>CBSE · Secondary School Examination</p><small>Rajkiya Pratibha Vikas Vidyalaya · New Delhi</small></article></Reveal>
          <Reveal delay={.08}><article className="education-card"><span>02 / SENIOR SECONDARY · 2026</span><h3>Class XII</h3><p>CBSE · Humanities</p><small>Rajkiya Pratibha Vikas Vidyalaya · New Delhi</small></article></Reveal>
          <Reveal delay={.16}><article className="education-card"><span>03 / UNDERGRADUATE</span><h3>Bachelor of Computer Applications</h3><p>Indira Gandhi National Open University (IGNOU)</p><small>Undergraduate programme · Enrolled</small></article></Reveal>
        </div>
      </section>
      <section className="section shell" id="focus">
        <Reveal><div className="section-label"><span>03 / AREAS OF INTEREST</span><span>AREAS OF FOCUS</span></div><h2 className="section-heading">A few interests.<br/><em>Room to explore.</em></h2></Reveal>
        <div className="focus-list">{focus.map(([n,t,d],i)=><Reveal key={n} delay={i*.07}><article className="focus-row"><span className="number">{n}</span><h3>{t}</h3><p>{d}</p><b>↗</b></article></Reveal>)}</div>
      </section>
      <section className="section shell" id="skills">
        <Reveal><div className="section-label"><span>04 / TOOLS & TECHNOLOGY</span><span>USED IN CURRENT PROJECTS</span></div><h2 className="section-heading">Tools I use to<br/><em>make ideas real.</em></h2></Reveal>
        <div className="skills-grid">{tools.map(([n,t,d],i)=><Reveal key={n} delay={i*.05}><article className="skill-card"><span className="number">{n}</span><div><h3>{t}</h3><p>{d}</p></div><b>↗</b></article></Reveal>)}</div>
        <p className="skills-note">A practical toolset demonstrated through this portfolio project, not a claim of expert-level proficiency.</p>
      </section>
      <section className="section shell" id="journey">
        <Reveal><div className="section-label"><span>05 / LEARNING JOURNEY</span><span>LEARNING IN PROGRESS</span></div><h2 className="section-heading">Progress is a practice.<br/><em>Not a finish line.</em></h2></Reveal>
        <div className="timeline">{journey.map(([t,s,d],i)=><Reveal key={t} delay={i*.1}><article className="timeline-row"><span className="number">0{i+1}</span><div><h3>{t}</h3><p>{s}</p><small>{d}</small></div><b>↗</b></article></Reveal>)}</div>
      </section>
      <section className="section shell" id="work">
        <Reveal><div className="section-label"><span>06 / SELECTED WORK</span><span>PROJECT ARCHIVE</span></div><div className="work-title"><h2 className="section-heading">Proof of <em>practice.</em></h2><span>01—03 / INDEX</span></div></Reveal>
        <div className="project-grid">
          <Reveal><article className="project-card"><div className="project-visual visual-one"><span>AS / 001</span><b>01</b><i>WEB</i></div><div className="project-meta"><small>PERSONAL PLATFORM / 2026</small><h3>Personal Portfolio</h3><p>A digital home for my story, interests, experiments and future work.</p><span>REACT · VITE · DESIGN</span></div></article></Reveal>
          <Reveal delay={.08}><article className="project-card"><div className="project-visual visual-two"><span>AS / 002</span><b>02</b><i>FITNESS</i></div><div className="project-meta"><small>PERSONAL PRACTICE / 2026</small><h3>Fitness</h3><p>Building strength, endurance and healthy habits through consistent training.</p><span>STRENGTH · ENDURANCE · WELLBEING</span></div></article></Reveal>
          <Reveal delay={.16}><article className="project-card"><div className="project-visual visual-three"><span>AS / 003</span><b>03</b><i>EXPERIMENTS</i></div><div className="project-meta"><small>ONGOING / OPEN ENDED</small><h3>Digital Experiments</h3><p>Learning by making: testing tools, exploring ideas and improving through iteration.</p><span>RESEARCH · BUILD · ITERATE</span></div></article></Reveal>
        </div>
      </section>
      <section className="contact shell" id="contact"><Reveal><div className="section-label"><span>07 / DIRECT CONNECT</span><span>OPEN TO GOOD CONVERSATIONS</span></div><p className="gold-label">HAVE AN IDEA OR OPPORTUNITY?</p><h2>Let's build<br/><em>something real.</em></h2><div className="contact-foot"><div><p>For collaborations, opportunities or a thoughtful conversation, reach out directly.</p><div className="contact-details"><a href="mailto:ayushsinghrajput00@gmail.com">ayushsinghrajput00@gmail.com</a><a href="tel:+919354895707">+91 93548 95707</a></div></div><div className="contact-links"><a className="button" href="https://www.instagram.com/iiuss__/" target="_blank" rel="noreferrer">Instagram ↗</a><a className="social-link" href="https://github.com/ayushsinghrajputt00-del" target="_blank" rel="noreferrer">GitHub ↗</a></div></div></Reveal></section>
    </main>
    <footer className="footer shell"><a className="brand" href="#top">AS<span>_</span></a><span>© {new Date().getFullYear()} AYUSH SINGH / INDIA</span><a href="https://www.instagram.com/iiuss__/" target="_blank" rel="noreferrer">INSTAGRAM ↗</a><a href="#top">BACK TO TOP ↑</a><small>BUILT WITH INTENTION.</small></footer>
  </></MotionContext.Provider>;
}
createRoot(document.getElementById("root")).render(<React.StrictMode><App/></React.StrictMode>);
