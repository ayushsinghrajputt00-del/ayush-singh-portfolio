import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import "./styles.css";

const focus = [
  ["01", "Leadership & responsibility", "Learning to take initiative, work with people and stay accountable."],
  ["02", "Technology & digital craft", "Building practical skills through web projects, tools and experimentation."],
  ["03", "Discipline & endurance", "Developing consistency through study, physical training and new challenges."]
];
const journey = [
  ["Curiosity", "Question the obvious", "Explore new ideas, understand how things work and keep learning."],
  ["Discipline", "Do the work daily", "Build reliable habits through study, training and deliberate practice."],
  ["Execution", "Turn plans into action", "Create, test, learn from feedback and improve the next attempt."]
];

function Reveal({ children, delay = 0 }) {
  const reduce = useReducedMotion();
  return <motion.div initial={reduce ? false : { opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .7, delay, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}

function Swarm({ onDone }) {
  useEffect(() => {
    const canvas = document.querySelector(".swarm-canvas");
    const ctx = canvas.getContext("2d");
    let raf = 0, frame = 0, alive = true, w = innerWidth, h = innerHeight;
    const dpr = Math.min(devicePixelRatio || 1, 2), gold = "#c9aa75";
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ease = t => 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3);
    const resize = () => { w = innerWidth; h = innerHeight; canvas.width = Math.round(w*dpr); canvas.height = Math.round(h*dpr); canvas.style.width = w+"px"; canvas.style.height = h+"px"; ctx.setTransform(dpr,0,0,dpr,0,0); };
    resize(); addEventListener("resize", resize);
    document.documentElement.classList.add("swarm-running");
    const targets = [...document.querySelectorAll("header,.hero-copy,.hero-art,.section-label,h1,h2,.metric-card,.focus-row,.timeline-row,.project-card,.contact-foot")].map((el,i)=>{const r=el.getBoundingClientRect();return r.width>2&&r.height>2&&r.bottom>0&&r.top<h?{x:r.left,y:r.top,w:r.width,h:r.height,i}:null}).filter(Boolean);
    const colors=["#f1ede6","#c9aa75","#c76b59","#9da9b4"];
    const agents=Array.from({length:22},(_,i)=>({x:w/2,y:h/2,phase:Math.random()*6.28,target:i%Math.max(1,targets.length),trail:[]}));
    const draw=()=>{if(!alive)return;frame++;const p=ease((frame-20)/(reduced?35:220));const fade=frame>(reduced?75:300)?1-ease((frame-(reduced?75:300))/(reduced?20:55)):1;
      ctx.clearRect(0,0,w,h);ctx.fillStyle="rgba(5,6,7,.985)";ctx.fillRect(0,0,w,h);
      ctx.save();ctx.globalAlpha=.13*fade;ctx.strokeStyle=gold;for(let x=0;x<w;x+=36){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke()}for(let y=0;y<h;y+=36){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()}ctx.restore();
      targets.forEach((r,i)=>{const q=ease((frame-22-i*3)/(reduced?40:120));if(!q)return;ctx.save();ctx.globalAlpha=fade*(.2+.8*q);ctx.strokeStyle=i%3===0?gold:"#a7a39b";ctx.setLineDash([4,5]);ctx.strokeRect(r.x,r.y,r.w,r.h);ctx.setLineDash([]);ctx.fillStyle="rgba(201,170,117,.12)";ctx.fillRect(r.x,r.y,r.w*q,r.h);ctx.restore()});
      agents.forEach((a,i)=>{const r=targets[a.target]||{x:w/2,y:h/2,w:1,h:1};const orbit=w/2+Math.cos(frame*.025+a.phase)*Math.min(w*.32,120);const ox=h/2+Math.sin(frame*.03+a.phase)*Math.min(h*.25,80);const tx=r.x+r.w*(.15+.7*(i%6)/5),ty=r.y+r.h*(.2+.6*(i%4)/3);a.x+=(orbit+(tx-orbit)*p-a.x)*.12;a.y+=(ox+(ty-ox)*p-a.y)*.12;a.trail.push([a.x,a.y]);if(a.trail.length>9)a.trail.shift();ctx.beginPath();a.trail.forEach((v,j)=>j?ctx.lineTo(...v):ctx.moveTo(...v));ctx.strokeStyle=colors[i%4]+"66";ctx.stroke();ctx.fillStyle=colors[i%4];ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(a.x,a.y+13);ctx.lineTo(a.x+4,a.y+9);ctx.fill()});
      ctx.fillStyle=gold;ctx.font="9px monospace";ctx.fillText("AS / INTERFACE SEQUENCE",22,h-24);ctx.textAlign="right";ctx.fillText("BUILD "+String(Math.round(p*100)).padStart(3,"0")+"%",w-22,h-24);ctx.textAlign="left";
      if(frame<(reduced?100:355))raf=requestAnimationFrame(draw);else{document.documentElement.classList.remove("swarm-running");onDone()}
    };raf=requestAnimationFrame(draw);
    return()=>{alive=false;cancelAnimationFrame(raf);removeEventListener("resize",resize);document.documentElement.classList.remove("swarm-running")};
  },[onDone]);
  return <canvas className="swarm-canvas" aria-hidden="true"/>;
}

function App() {
  const [menu,setMenu]=useState(false),[swarm,setSwarm]=useState(false);
  const finish=React.useCallback(()=>setSwarm(false),[]);
  useEffect(()=>{const scroll=()=>{const max=document.documentElement.scrollHeight-innerHeight;document.documentElement.style.setProperty("--progress",max>0?scrollY/max*100+"%":"0%")};addEventListener("scroll",scroll,{passive:true});scroll();return()=>removeEventListener("scroll",scroll)},[]);
  const links=[["01","Profile","#about"],["02","Focus","#focus"],["03","Journey","#journey"],["04","Work","#work"]];
  return <>
    <div className="progress"/>
    <header className="header">
      <a className="brand" href="#top">AS<span>_</span><small>PERSONAL SYSTEMS / 2026</small></a>
      <button className="menu-button" onClick={()=>setMenu(!menu)} aria-label="Toggle menu">☰</button>
      <nav className={menu?"nav open":"nav"}>{links.map(([n,t,h])=><a key={h} href={h} onClick={()=>setMenu(false)}><small>{n}</small>{t}</a>)}<button className="motion-button" onClick={()=>setSwarm(true)} disabled={swarm}><i/> {swarm?"Building…":"Motion / ON"}</button><a className="nav-cta" href="#contact">Initiate contact ↗</a></nav>
    </header>
    <main id="top">
      <section className="hero shell">
        <div className="hero-topline"><span><i/> INDEPENDENT MIND / ACTIVE LEARNING</span><span>NEW DELHI, IN</span><span>28°36' N / 77°12' E</span></div>
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="gold-label">STUDENT · BUILDER · FUTURE OFFICER</p>
            <h1>AYUSH<span className="red-dot">.</span><br/><em>Singh</em></h1>
            <p className="hero-desc">Building character through discipline. Exploring technology with curiosity. Turning ambition into consistent action.</p>
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
        <div className="about-grid"><Reveal><h2>Character first.<br/><em>Everything else follows.</em></h2></Reveal><Reveal delay={.1}><div className="body-copy"><p>I'm Ayush, a student from Delhi interested in leadership, technology, fitness and continuous self-improvement. I believe confidence means little without competence, and ambition means little without the discipline to act on it.</p><p>My approach is simple: stay curious, take responsibility, learn from mistakes and keep raising the standard.</p><div className="profile-tags"><span>SELF DEVELOPMENT</span><span>TECHNOLOGY</span><span>LEADERSHIP</span><span>FITNESS</span></div></div></Reveal></div>
      </section>
      <section className="section shell" id="focus">
        <Reveal><div className="section-label"><span>02 / CORE DIRECTIVES</span><span>AREAS OF FOCUS</span></div><h2 className="section-heading">Three priorities.<br/><em>One direction.</em></h2></Reveal>
        <div className="focus-list">{focus.map(([n,t,d],i)=><Reveal key={n} delay={i*.07}><article className="focus-row"><span className="number">{n}</span><h3>{t}</h3><p>{d}</p><b>↗</b></article></Reveal>)}</div>
      </section>
      <section className="section shell" id="journey">
        <Reveal><div className="section-label"><span>03 / DEVELOPMENT LOG</span><span>LEARNING IN PROGRESS</span></div><h2 className="section-heading">Progress is a practice.<br/><em>Not a finish line.</em></h2></Reveal>
        <div className="timeline">{journey.map(([t,s,d],i)=><Reveal key={t} delay={i*.1}><article className="timeline-row"><span className="number">0{i+1}</span><div><h3>{t}</h3><p>{s}</p><small>{d}</small></div><b>↗</b></article></Reveal>)}</div>
      </section>
      <section className="section shell" id="work">
        <Reveal><div className="section-label"><span>04 / SELECTED WORK</span><span>PROJECT ARCHIVE</span></div><div className="work-title"><h2 className="section-heading">Proof of <em>practice.</em></h2><span>01—03 / INDEX</span></div></Reveal>
        <div className="project-grid">
          <Reveal><article className="project-card"><div className="project-visual visual-one"><span>AS / 001</span><b>01</b><i>WEB</i></div><div className="project-meta"><small>PERSONAL PLATFORM / 2026</small><h3>Personal Portfolio</h3><p>A digital home for my story, interests, experiments and future work.</p><span>REACT · VITE · DESIGN</span></div></article></Reveal>
          <Reveal delay={.08}><article className="project-card"><div className="project-visual visual-two"><span>AS / 002</span><b>02</b><i>ENDURANCE</i></div><div className="project-meta"><small>PERSONAL CHALLENGE / 2026</small><h3>Endurance & Cycling</h3><p>Building fitness through measurable challenges, consistency and reflection.</p><span>FITNESS · DISCIPLINE · PROGRESS</span></div></article></Reveal>
          <Reveal delay={.16}><article className="project-card"><div className="project-visual visual-three"><span>AS / 003</span><b>03</b><i>EXPERIMENTS</i></div><div className="project-meta"><small>ONGOING / OPEN ENDED</small><h3>Digital Experiments</h3><p>Learning by making: testing tools, exploring ideas and improving through iteration.</p><span>RESEARCH · BUILD · ITERATE</span></div></article></Reveal>
        </div>
      </section>
      <section className="contact shell" id="contact"><Reveal><div className="section-label"><span>05 / DIRECT CONNECT</span><span>OPEN TO GOOD CONVERSATIONS</span></div><p className="gold-label">HAVE AN IDEA OR OPPORTUNITY?</p><h2>Let's build<br/><em>something real.</em></h2><div className="contact-foot"><div><p>For collaborations, opportunities or a thoughtful conversation, reach out directly.</p><div className="contact-details"><a href="mailto:ayushsinghrajput00@gmail.com">ayushsinghrajput00@gmail.com</a><a href="tel:+919354895707">+91 93548 95707</a></div></div><div className="contact-links"><a className="button" href="https://www.instagram.com/iiuss__/" target="_blank" rel="noreferrer">Instagram ↗</a><a className="social-link" href="https://github.com/ayushsinghrajputt00-del" target="_blank" rel="noreferrer">GitHub ↗</a></div></div></Reveal></section>
    </main>
    <footer className="footer shell"><a className="brand" href="#top">AS<span>_</span></a><span>© {new Date().getFullYear()} AYUSH SINGH / INDIA</span><a href="https://www.instagram.com/iiuss__/" target="_blank" rel="noreferrer">INSTAGRAM ↗</a><a href="#top">BACK TO TOP ↑</a><small>BUILT WITH INTENTION.</small></footer>
    <AnimatePresence>{swarm&&<Swarm onDone={finish}/>}</AnimatePresence>
  </>;
}
createRoot(document.getElementById("root")).render(<React.StrictMode><App/></React.StrictMode>);
