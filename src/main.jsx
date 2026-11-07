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
    let cancelled = false, raf = 0, scrollTimer = 0;
    let speed = 1, phase = "SCAN", started = 0, items = [], agents = [], swarm = [];
    const oldScroll = window.scrollY;
    const canvas = document.createElement("canvas");
    canvas.className = "rebuild-canvas";
    const ctx = canvas.getContext("2d");
    const hud = document.createElement("div");
    hud.className = "rebuild-hud";
    hud.innerHTML = '<div class="rebuild-head"><span><i></i> SAAI / PAGE RECONSTRUCTION</span><b class="rebuild-phase">SCANNING DOM</b></div><div class="rebuild-progress"><i></i></div><div class="rebuild-meta"><span class="rebuild-count">0 ELEMENTS MAPPED</span><span class="rebuild-percent">00%</span><span>AGENTS / 04</span></div><div class="rebuild-controls"><button data-action="tour">TOUR / AUTO</button><button data-action="speed">SPEED / 1×</button><button data-action="replay">↻ REPLAY</button><button data-action="live">GO LIVE ↗</button><button data-action="close">CLOSE ×</button></div>';
    document.body.append(canvas, hud);
    document.body.classList.add("rebuild-running");
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
      canvas.style.width = innerWidth + "px"; canvas.style.height = innerHeight + "px";
      ctx.setTransform(dpr,0,0,dpr,0,0);
    };
    const scan = () => {
      const nodes = [...root.querySelectorAll("header,section,footer,article,h1,h2,h3,p,a,button,img,svg,.metric-card,.project-visual")];
      items = nodes.map((el,i) => {
        const r=el.getBoundingClientRect();
        const x=r.left+scrollX,y=r.top+scrollY;
        return {x,y,w:r.width,h:r.height,tag:el.tagName.toLowerCase(),text:(el.innerText||el.getAttribute("alt")||"").trim().slice(0,90),i};
      }).filter(o=>o.w>5&&o.h>5&&o.y<document.documentElement.scrollHeight);
      agents = Array.from({length:4},(_,i)=>({x:innerWidth*(.15+i*.22),y:innerHeight*.3,phase:i*.22}));
      const colors=["#f05b49","#e9b65f","#66c9bd","#b69be8"];
      swarm=Array.from({length:760},(_,i)=>{
        const group=i%4, angle=Math.random()*Math.PI*2, radius=35+Math.random()*210;
        return {group,x:group%2===0?-30:innerWidth+30,y:Math.random()*innerHeight,
          tx:innerWidth*(.18+group*.215)+(Math.random()-.5)*150,
          ty:innerHeight*(.28+(group%2)*.42)+(Math.random()-.5)*130,
          vx:0,vy:0,size:.7+Math.random()*1.6,alpha:.35+Math.random()*.6,
          color:colors[group],phase:angle,radius,seed:Math.random()*100};
      });
      hud.querySelector(".rebuild-count").textContent=items.length+" ELEMENTS MAPPED";
    };
    const finish = () => {
      phase="LIVE";
      document.body.classList.remove("rebuild-running");
      canvas.remove(); hud.remove(); window.scrollTo({top:0,behavior:"instant"});
      removeEventListener("resize",resize);
    };
    const replay = () => {
      document.body.classList.add("rebuild-running");
      window.scrollTo({top:0,behavior:"instant"});
      phase="SCAN"; started=performance.now(); scan();
    };
    hud.addEventListener("click",e=>{
      const action=e.target?.dataset?.action;
      if(action==="close"||action==="live") finish();
      if(action==="replay") replay();
      if(action==="speed"){speed=speed===1?1.7:speed===1.7?2.5:1;hud.querySelector('[data-action="speed"]').textContent="SPEED / "+speed+"×";}
      if(action==="tour"){const b=hud.querySelector('[data-action="tour"]');b.textContent=b.textContent.includes("AUTO")?"TOUR / PAUSED":"TOUR / AUTO";}
    });
    const draw = now => {
      if(cancelled)return;
      if(!started)started=now;
      const elapsed=(now-started)/1000;
      const scanDuration=0.01, buildDuration=13/speed;
      if(phase==="SCAN"){
        const p=Math.min(1,elapsed/scanDuration);
        window.scrollTo(0,Math.max(0,(document.documentElement.scrollHeight-innerHeight)*p));
        if(p>=1){scan();phase="BUILD";started=now;window.scrollTo(0,0);}
      } else if(phase==="BUILD"){
        const p=Math.min(1,elapsed/buildDuration);
        const active=Math.floor(items.length*p);
        const maxScroll=Math.max(0,document.documentElement.scrollHeight-innerHeight);
        const targetY=maxScroll*p;
        const tour=hud.querySelector('[data-action="tour"]').textContent.includes("AUTO");
        if(tour)window.scrollTo(0,targetY);
        ctx.clearRect(0,0,innerWidth,innerHeight);
        ctx.fillStyle="rgba(5,7,9,.97)";ctx.fillRect(0,0,innerWidth,innerHeight);
        const scroll=window.scrollY;
        ctx.lineWidth=1;
        items.forEach((o,i)=>{
          const x=o.x,y=o.y-scroll;
          if(y>innerHeight+80||y+o.h< -80)return;
          const done=i<active, current=i>=active&&i<active+10;
          ctx.strokeStyle=done?"rgba(201,170,117,.27)":current?"rgba(239,91,73,.95)":"rgba(135,153,164,.2)";
          ctx.fillStyle=done?"rgba(201,170,117,.035)":"rgba(110,145,165,.025)";
          ctx.fillRect(x,y,o.w,o.h);ctx.strokeRect(x,y,o.w,o.h);
          if(o.h>24&&o.w>45){
            ctx.strokeStyle=done?"rgba(238,234,227,.25)":"rgba(151,169,180,.23)";
            const lines=Math.min(3,Math.max(1,Math.floor(o.h/18)));
            for(let n=0;n<lines;n++){const yy=y+Math.min(o.h-5,10+n*13);ctx.beginPath();ctx.moveTo(x+7,yy);ctx.lineTo(x+Math.max(12,o.w*(.42+((i+n)%4)*.12)),yy);ctx.stroke();}
          }
        });
        agents.forEach((a,i)=>{
          const idx=Math.min(items.length-1,Math.floor(active+(i-1.5)*8));
          const o=items[Math.max(0,idx)]||{x:innerWidth/2,y:scroll+innerHeight/2,w:80,h:40};
          const tx=Math.max(8,Math.min(innerWidth-8,o.x+o.w*.5));
          const ty=o.y-scroll+Math.min(o.h*.5,20);
          a.x+=(tx-a.x)*.14;a.y+=(ty-a.y)*.14;
          ctx.save();ctx.translate(a.x,a.y);ctx.strokeStyle=["#f05b49","#e9b65f","#66c9bd","#b69be8"][i];ctx.lineWidth=1.3;
          ctx.beginPath();ctx.moveTo(-13,0);ctx.lineTo(13,0);ctx.moveTo(0,-13);ctx.lineTo(0,13);ctx.stroke();
          ctx.beginPath();ctx.arc(0,0,4,0,Math.PI*2);ctx.stroke();
          ctx.font="9px monospace";ctx.fillStyle=ctx.strokeStyle;ctx.fillText("AGENT_0"+(i+1),9,-10);ctx.restore();
        });
        hud.querySelector(".rebuild-progress i").style.width=(p*100)+"%";
        hud.querySelector(".rebuild-percent").textContent=String(Math.floor(p*100)).padStart(2,"0")+"%";
        hud.querySelector(".rebuild-phase").textContent=p>=1?"RECONSTRUCTION COMPLETE":"BUILDING LAYERS";
        if(p>=1){phase="SWARM";started=now;hud.querySelector(".rebuild-phase").textContent="SWARM CONVERGENCE";hud.querySelector(".rebuild-count").textContent="760 PARTICLES / 04 GROUPS";}
      } else if(phase==="SWARM"){
        const p=Math.min(1,elapsed/4.2);
        ctx.fillStyle="rgba(5,7,9,.24)";ctx.fillRect(0,0,innerWidth,innerHeight);
        agents.forEach((a,i)=>{
          const gx=innerWidth*(.18+i*.215),gy=innerHeight*(.28+(i%2)*.42);
          a.x+=(gx-a.x)*.055;a.y+=(gy-a.y)*.055;
        });
        swarm.forEach(q=>{
          const spiral=q.phase+now*.0018+q.seed;
          const tx=q.tx+(1-p)*Math.cos(spiral)*q.radius*.35;
          const ty=q.ty+(1-p)*Math.sin(spiral)*q.radius*.35;
          q.vx=(q.vx+(tx-q.x)*.018)*.91;
          q.vy=(q.vy+(ty-q.y)*.018)*.91;
          q.x+=q.vx;q.y+=q.vy;
          ctx.globalAlpha=q.alpha*(.45+p*.55);
          ctx.fillStyle=q.color;ctx.shadowColor=q.color;ctx.shadowBlur=5;
          ctx.beginPath();ctx.arc(q.x,q.y,q.size,0,Math.PI*2);ctx.fill();
          if(Math.random()<.25){ctx.globalAlpha=.14;ctx.strokeStyle=q.color;ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(q.x,q.y);ctx.lineTo(q.x-q.vx*3,q.y-q.vy*3);ctx.stroke();}
        });
        agents.forEach((a,i)=>{
          ctx.globalAlpha=.9;ctx.shadowBlur=0;ctx.strokeStyle=["#f05b49","#e9b65f","#66c9bd","#b69be8"][i];ctx.lineWidth=1.2;
          ctx.beginPath();ctx.moveTo(a.x-12,a.y);ctx.lineTo(a.x+12,a.y);ctx.moveTo(a.x,a.y-12);ctx.lineTo(a.x,a.y+12);ctx.stroke();
        });
        ctx.globalAlpha=1;ctx.shadowBlur=0;
        hud.querySelector(".rebuild-progress i").style.width=(p*100)+"%";
        hud.querySelector(".rebuild-percent").textContent=String(Math.floor(p*100)).padStart(2,"0")+"%";
        hud.querySelector(".rebuild-phase").textContent="GROUPED PARTICLES / CONVERGING";
        if(p>=1){hud.querySelector(".rebuild-phase").textContent="SITE REVEAL";setTimeout(()=>{if(!cancelled)finish()},250);}
      }
      raf=requestAnimationFrame(draw);
    };
    resize();scan();started=performance.now();
    addEventListener("resize",resize);
    raf=requestAnimationFrame(draw);
    return()=>{cancelled=true;cancelAnimationFrame(raf);clearTimeout(scrollTimer);removeEventListener("resize",resize);document.body.classList.remove("rebuild-running");canvas.remove();hud.remove();};
  },[]);
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
