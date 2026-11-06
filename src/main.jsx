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
  const stageRef = React.useRef(null);
  const cursorRef = React.useRef(null);
  useEffect(() => {
    const stage = stageRef.current;
    const source = document.getElementById("root");
    if (!stage || !source) return;
    const originalScroll = window.scrollY;
    const clone = source.cloneNode(true);
    clone.id = "rebuild-copy";
    clone.querySelectorAll(".rebuild-overlay,script").forEach(node => node.remove());
    clone.querySelectorAll(".progress,.swarm-canvas").forEach(node => node.remove());
    clone.querySelectorAll("a,button").forEach(node => { node.setAttribute("tabindex","-1"); node.style.pointerEvents="none"; });
    stage.appendChild(clone);
    document.documentElement.classList.add("rebuild-running");
    const selector = ".header,.hero-topline,.hero-copy,.hero-art,.hero-bottom,.metric-card,.section-label,.about-grid,.focus-row,.timeline-row,.project-card,.contact-foot,.footer";
    const items = [...clone.querySelectorAll(selector)];
    items.forEach(el => { el.classList.add("rebuild-item"); });
    const cursor = cursorRef.current;
    const wait = ms => new Promise(resolve => setTimeout(resolve,ms));
    let cancelled = false;
    const moveCursor = (cursor, el, index) => {
      if (!cursor || !el) return;
      const r = el.getBoundingClientRect();
      const x = Math.max(18,Math.min(innerWidth-25,r.left+r.width*(.2+(index%4)*.18)));
      const y = Math.max(20,Math.min(innerHeight-30,r.top+Math.min(r.height*.45,45)));
      cursor.style.transform = `translate3d(${x}px,${y}px,0)`;
      cursor.style.opacity = "1";
    };
    const build = async () => {
      await wait(250);
      for (let i=0;i<items.length;i++) {
        if (cancelled) return;
        const el=items[i];
        const top=el.offsetTop;
        const target=Math.max(0,top- Math.min(110,innerHeight*.14));
        stage.scrollTo({top:target,behavior:"smooth"});
        await wait(240);
        moveCursor(cursor,el,i);
        el.classList.add("is-building");
        await wait(95);
        el.classList.add("is-built");
        await wait(115);
        if (i%5===4) await wait(120);
      }
      if (cancelled) return;
      stage.scrollTo({top:0,behavior:"smooth"});
      await wait(650);
      stage.classList.add("rebuild-finish");
      if(cursor) cursor.style.opacity="0";
      await wait(550);
      document.documentElement.classList.remove("rebuild-running");
      window.scrollTo(0,originalScroll);
      onDone();
    };
    build();
    return () => {
      cancelled=true;
      document.documentElement.classList.remove("rebuild-running");
      window.scrollTo(0,originalScroll);
      clone.remove();
    };
  },[onDone]);
  return <div className="rebuild-overlay" aria-hidden="true">
    <div className="rebuild-stage" ref={stageRef}/>
    <div className="rebuild-cursor" ref={cursorRef}><span/><i/></div>
    <div className="rebuild-hud"><span>AS / LIVE INTERFACE ASSEMBLY</span><span>DESIGN SYSTEM · 2026</span></div>
  </div>;
}

function App() {
  const [menu,setMenu]=useState(false),[swarm,setSwarm]=useState(true);
  const finish=React.useCallback(()=>setSwarm(false),[]);
  useEffect(()=>{const scroll=()=>{const max=document.documentElement.scrollHeight-innerHeight;document.documentElement.style.setProperty("--progress",max>0?scrollY/max*100+"%":"0%")};addEventListener("scroll",scroll,{passive:true});scroll();return()=>removeEventListener("scroll",scroll)},[]);
  const links=[["01","Profile","#about"],["02","Education","#education"],["03","Focus","#focus"],["04","Journey","#journey"],["05","Work","#work"]];
  return <>
    <div className="progress"/>
    <header className="header">
      <a className="brand" href="#top">AS<span>_</span><small>PERSONAL PORTFOLIO / 2026</small></a>
      <button className="menu-button" onClick={()=>setMenu(!menu)} aria-label="Toggle menu">☰</button>
      <nav className={menu?"nav open":"nav"}>{links.map(([n,t,h])=><a key={h} href={h} onClick={()=>setMenu(false)}><small>{n}</small>{t}</a>)}<a className="nav-cta" href="#contact">Initiate contact ↗</a></nav>
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
          <Reveal><article className="education-card"><span>01 / SECONDARY</span><h3>Class X</h3><p>CBSE · Secondary education</p><small>Central Board of Secondary Education</small></article></Reveal>
          <Reveal delay={.08}><article className="education-card"><span>02 / SENIOR SECONDARY · 2026</span><h3>Class XII</h3><p>CBSE · Humanities</p><small>Rajkiya Pratibha Vikas Vidyalaya, Lajpat Rai Khand, Delhi</small><div className="education-subjects"><b>SUBJECTS</b><i>English · Hindi · History · Political Science · Economics · Physical Education</i></div></article></Reveal>
          <Reveal delay={.16}><article className="education-card"><span>03 / UNDERGRADUATE</span><h3>Bachelor of Computer Applications</h3><p>Indira Gandhi National Open University (IGNOU)</p><small>Undergraduate programme · Enrolled</small></article></Reveal>
        </div>
      </section>
      <section className="section shell" id="focus">
        <Reveal><div className="section-label"><span>03 / AREAS OF INTEREST</span><span>AREAS OF FOCUS</span></div><h2 className="section-heading">A few interests.<br/><em>Room to explore.</em></h2></Reveal>
        <div className="focus-list">{focus.map(([n,t,d],i)=><Reveal key={n} delay={i*.07}><article className="focus-row"><span className="number">{n}</span><h3>{t}</h3><p>{d}</p><b>↗</b></article></Reveal>)}</div>
      </section>
      <section className="section shell" id="journey">
        <Reveal><div className="section-label"><span>04 / PERSONAL JOURNEY</span><span>LEARNING IN PROGRESS</span></div><h2 className="section-heading">Progress is a practice.<br/><em>Not a finish line.</em></h2></Reveal>
        <div className="timeline">{journey.map(([t,s,d],i)=><Reveal key={t} delay={i*.1}><article className="timeline-row"><span className="number">0{i+1}</span><div><h3>{t}</h3><p>{s}</p><small>{d}</small></div><b>↗</b></article></Reveal>)}</div>
      </section>
      <section className="section shell" id="work">
        <Reveal><div className="section-label"><span>05 / SELECTED WORK</span><span>PROJECT ARCHIVE</span></div><div className="work-title"><h2 className="section-heading">Proof of <em>practice.</em></h2><span>01—03 / INDEX</span></div></Reveal>
        <div className="project-grid">
          <Reveal><article className="project-card"><div className="project-visual visual-one"><span>AS / 001</span><b>01</b><i>WEB</i></div><div className="project-meta"><small>PERSONAL PLATFORM / 2026</small><h3>Personal Portfolio</h3><p>A digital home for my story, interests, experiments and future work.</p><span>REACT · VITE · DESIGN</span></div></article></Reveal>
          <Reveal delay={.08}><article className="project-card"><div className="project-visual visual-two"><span>AS / 002</span><b>02</b><i>FITNESS</i></div><div className="project-meta"><small>PERSONAL PRACTICE / 2026</small><h3>Fitness</h3><p>Building strength, endurance and healthy habits through consistent training.</p><span>STRENGTH · ENDURANCE · WELLBEING</span></div></article></Reveal>
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
