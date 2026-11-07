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



function SwarmCanvas() {
  const motionEnabled = useContext(MotionContext);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!motionEnabled || reduce) return;
    const canvas = document.querySelector(".swarm-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let frame = 0;
    let running = true;
    const pointer = { x: width / 2, y: height / 2, active: false };
    const count = width < 700 ? 30 : 48;
    const boids = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 1.8,
      vy: (Math.random() - 0.5) * 1.8
    }));
    const maxSpeed = 2.15;
    const maxForce = 0.045;
    const neighborRadius = 92;
    const separationRadius = 27;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const onPointerMove = (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };
    const onPointerLeave = () => { pointer.active = false; };
    const onPointerOut = (event) => { if (!event.relatedTarget) onPointerLeave(); };
    const onVisibilityChange = () => {
      running = !document.hidden;
      if (running && !frame) frame = requestAnimationFrame(draw);
    };
    const limit = (x, y, max) => {
      const magnitude = Math.hypot(x, y);
      if (magnitude > max && magnitude > 0) return [x / magnitude * max, y / magnitude * max];
      return [x, y];
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerout", onPointerOut, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    const draw = () => {
      frame = 0;
      if (!running) return;
      ctx.clearRect(0, 0, width, height);
      const next = boids.map((boid, index) => {
        let sepX = 0, sepY = 0, aliX = 0, aliY = 0, cohX = 0, cohY = 0;
        let neighbors = 0, close = 0;
        for (let j = 0; j < boids.length; j++) {
          if (j === index) continue;
          const other = boids[j];
          let dx = other.x - boid.x;
          let dy = other.y - boid.y;
          if (dx > width / 2) dx -= width;
          if (dx < -width / 2) dx += width;
          if (dy > height / 2) dy -= height;
          if (dy < -height / 2) dy += height;
          const distance = Math.hypot(dx, dy);
          if (distance > 0 && distance < neighborRadius) {
            aliX += other.vx;
            aliY += other.vy;
            cohX += dx;
            cohY += dy;
            neighbors++;
            if (distance < separationRadius) {
              sepX -= dx / distance;
              sepY -= dy / distance;
              close++;
            }
          }
        }

        let forceX = 0, forceY = 0;
        if (neighbors) {
          const alignment = limit(aliX / neighbors - boid.vx, aliY / neighbors - boid.vy, maxForce);
          const cohesion = limit(cohX / neighbors * 0.012 - boid.vx * 0.018, cohY / neighbors * 0.012 - boid.vy * 0.018, maxForce);
          forceX += alignment[0] * 0.9 + cohesion[0] * 0.85;
          forceY += alignment[1] * 0.9 + cohesion[1] * 0.85;
        }
        if (close) {
          const separation = limit(sepX / close, sepY / close, maxForce);
          forceX += separation[0] * 1.7;
          forceY += separation[1] * 1.7;
        }

        if (pointer.active) {
          let dx = pointer.x - boid.x;
          let dy = pointer.y - boid.y;
          const distance = Math.hypot(dx, dy);
          if (distance < 260 && distance > 1) {
            const strength = (1 - distance / 260) * 0.026;
            forceX += dx / distance * strength;
            forceY += dy / distance * strength;
          }
        }

        let [ax, ay] = limit(forceX, forceY, maxForce * 2.6);
        let vx = boid.vx + ax;
        let vy = boid.vy + ay;
        [vx, vy] = limit(vx, vy, maxSpeed);
        const speed = Math.hypot(vx, vy);
        if (speed < 0.65) {
          vx += (Math.random() - 0.5) * 0.035;
          vy += (Math.random() - 0.5) * 0.035;
        }
        return { x: (boid.x + vx + width) % width, y: (boid.y + vy + height) % height, vx, vy };
      });
      for (let i = 0; i < next.length; i++) {
        const a = next[i];
        for (let j = i + 1; j < next.length; j++) {
          const b = next[j];
          let dx = a.x - b.x;
          let dy = a.y - b.y;
          if (dx > width / 2) dx -= width;
          if (dx < -width / 2) dx += width;
          if (dy > height / 2) dy -= height;
          if (dy < -height / 2) dy += height;
          const distance = Math.hypot(dx, dy);
          if (distance < 105) {
            ctx.strokeStyle = `rgba(92, 211, 190, ${(1 - distance / 105) * 0.12})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const boid of next) {
        ctx.beginPath();
        ctx.fillStyle = "rgba(112, 226, 205, 0.72)";
        ctx.shadowColor = "rgba(80, 220, 195, 0.65)";
        ctx.shadowBlur = 9;
        ctx.arc(boid.x, boid.y, 1.65, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      for (let i = 0; i < boids.length; i++) Object.assign(boids[i], next[i]);
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerout", onPointerOut);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [motionEnabled, reduce]);

  return <canvas className="swarm-canvas" aria-hidden="true" />;
}

function App() {
  const [menu,setMenu]=useState(false),[motionOn,setMotionOn]=useState(true);
  useEffect(()=>{const scroll=()=>{const max=document.documentElement.scrollHeight-innerHeight;document.documentElement.style.setProperty("--progress",max>0?scrollY/max*100+"%":"0%")};addEventListener("scroll",scroll,{passive:true});scroll();return()=>removeEventListener("scroll",scroll)},[]);
  const links=[["01","Profile","#about"],["02","Education","#education"],["03","Focus","#focus"],["04","Journey","#journey"],["05","Tools","#skills"],["06","Work","#work"]];
  return <MotionContext.Provider value={motionOn}><>
    <SwarmCanvas />
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
