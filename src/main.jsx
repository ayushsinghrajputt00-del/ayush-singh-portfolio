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


function SwarmExperience() {
  const canvasRef = React.useRef(null);
  const reduce = useReducedMotion();
  const motionEnabled = useContext(MotionContext);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduce || !motionEnabled) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let width = 0, height = 0, raf = 0, last = 0;
    const touchMode = window.matchMedia("(pointer: coarse)").matches;
    const pointer = { x: window.innerWidth * .5, y: window.innerHeight * .42, active: touchMode };
    const agents = Array.from({ length: 8 }, (_, i) => ({ x: pointer.x, y: pointer.y, angle: 0, hue: i }));
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth; height = window.innerHeight;
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      canvas.style.width = width + "px"; canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const move = e => { pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true; };
    const touchMove = e => { const t = e.touches && e.touches[0]; if (t) move(t); };
    const leave = () => { pointer.active = false; };
    const drawCursor = (x, y, index, alpha) => {
      const size = index === 0 ? 12 : 7;
      const offset = index * .16;
      ctx.save(); ctx.translate(x, y); ctx.rotate(offset);
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = index === 0 ? "rgba(201,170,117,.9)" : index % 3 === 0 ? "rgba(196,91,77,.7)" : "rgba(238,234,227,.42)";
      ctx.lineWidth = index === 0 ? 1.35 : .85;
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(size * .45,size * 1.2); ctx.lineTo(size * .62,size * .72); ctx.lineTo(size * 1.05,size * .58); ctx.closePath(); ctx.stroke();
      if (index === 0) {
        ctx.beginPath(); ctx.arc(0,0,18,0,Math.PI*2); ctx.strokeStyle = "rgba(201,170,117,.22)"; ctx.stroke();
      }
      ctx.restore();
    };
    const tick = time => {
      raf = requestAnimationFrame(tick);
      if (time - last < 32) return;
      last = time;
      ctx.clearRect(0,0,width,height);
      if (!pointer.active) return;
      agents.forEach((a,i) => {
        const lag = .13 - i * .009;
        const ox = Math.cos(i * 2.4) * (i * 3.2);
        const oy = Math.sin(i * 2.4) * (i * 3.2);
        a.x += (pointer.x + ox - a.x) * lag;
        a.y += (pointer.y + oy - a.y) * lag;
        drawCursor(a.x,a.y,i,Math.max(.22,.86-i*.075));
      });
      const lead = agents[0];
      ctx.beginPath(); ctx.arc(lead.x,lead.y,25,0,Math.PI*2);
      ctx.strokeStyle = "rgba(201,170,117,.12)"; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = "rgba(201,170,117,.65)"; ctx.font = "8px 'DM Mono', monospace";
      ctx.fillText("SWARM / ACTIVE", lead.x + 22, lead.y - 19);
    };
    resize();
    window.addEventListener("resize",resize);
    window.addEventListener("pointermove",move,{passive:true});
    window.addEventListener("touchstart",touchMove,{passive:true});
    window.addEventListener("touchmove",touchMove,{passive:true});
    window.addEventListener("blur",leave);
    document.addEventListener("mouseleave",leave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize",resize);
      window.removeEventListener("pointermove",move);
      window.removeEventListener("touchstart",touchMove);
      window.removeEventListener("touchmove",touchMove);
      window.removeEventListener("blur",leave);
      document.removeEventListener("mouseleave",leave);
    };
  }, [reduce,motionEnabled]);
  if (reduce || !motionEnabled) return null;
  return <canvas ref={canvasRef} className="swarm-canvas" aria-hidden="true" />;
}

function App() {
  const [menu,setMenu]=useState(false),[motionOn,setMotionOn]=useState(true);
  useEffect(()=>{const scroll=()=>{const max=document.documentElement.scrollHeight-innerHeight;document.documentElement.style.setProperty("--progress",max>0?scrollY/max*100+"%":"0%")};addEventListener("scroll",scroll,{passive:true});scroll();return()=>removeEventListener("scroll",scroll)},[]);
  const links=[["01","Profile","#about"],["02","Education","#education"],["03","Focus","#focus"],["04","Journey","#journey"],["05","Tools","#skills"],["06","Work","#work"]];
  return <MotionContext.Provider value={motionOn}><>
    <SwarmExperience/><div className="progress"/>
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
