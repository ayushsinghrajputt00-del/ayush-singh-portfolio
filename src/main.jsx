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
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    let w=0,h=0,dpr=1,raf=0,startTime=0,px=-1000,py=-1000;
    let scrollProgress=0,scrollEnergy=0,lastScroll=window.scrollY;
    const palette=["#f05b49","#e9b65f","#66c9bd","#b69be8","#e9e2d5"];
    let particles=[];
    const makeTargets=()=>{
      const off=document.createElement("canvas"),c=off.getContext("2d");
      off.width=Math.max(1,Math.floor(w));off.height=Math.max(1,Math.floor(h));
      c.fillStyle="#fff";c.textAlign="center";c.textBaseline="middle";
      const mainSize=Math.min(w*.19,150),subSize=Math.min(w*.075,48);
      c.font="700 "+mainSize+"px Arial";c.fillText("AYUSH",w/2,h*.44);
      c.font="500 "+subSize+"px Arial";c.fillText("SINGH",w/2,h*.61);
      const data=c.getImageData(0,0,off.width,off.height).data,points=[];
      const step=Math.max(3,Math.round(w/260));
      for(let y=0;y<h;y+=step)for(let x=0;x<w;x+=step)
        if(data[(y*off.width+x)*4+3]>100)points.push({x,y});
      return points;
    };
    const resize=()=>{
      const rect=canvas.getBoundingClientRect();
      dpr=Math.min(devicePixelRatio||1,2);w=rect.width;h=rect.height;
      canvas.width=Math.max(1,Math.floor(w*dpr));canvas.height=Math.max(1,Math.floor(h*dpr));
      ctx.setTransform(dpr,0,0,dpr,0,0);
      const targets=makeTargets(),count=Math.min(620,Math.max(260,targets.length));
      particles=Array.from({length:count},(_,i)=>{
        const angle=Math.random()*Math.PI*2,dist=Math.max(w,h)*(.35+Math.random()*.8);
        return {x:w/2+Math.cos(angle)*dist,y:h/2+Math.sin(angle)*dist,
          vx:(Math.random()-.5)*3,vy:(Math.random()-.5)*3,
          target:targets[Math.floor(i*targets.length/count)]||{x:w/2,y:h/2},
          size:1.1+Math.random()*1.6,phase:Math.random()*Math.PI*2,
          color:palette[i%palette.length]};
      });
    };
    const pointer=e=>{
      const rect=canvas.getBoundingClientRect();
      px=e.clientX-rect.left;py=e.clientY-rect.top;
    };
    const scroll=()=>{
      const max=document.documentElement.scrollHeight-innerHeight;
      scrollProgress=max>0?window.scrollY/max:0;
      const delta=window.scrollY-lastScroll;
      scrollEnergy=Math.min(1,scrollEnergy+Math.min(1,Math.abs(delta)/90));
      lastScroll=window.scrollY;
    };
    const draw=now=>{
      if(!startTime)startTime=now;
      const elapsed=(now-startTime)/1000,cycle=elapsed%16;
      const gather=Math.max(0,Math.min(1,(cycle-1.1)/3.8));
      const disperse=cycle>11.5?Math.min(1,(cycle-11.5)/1.8):0;
      const scrollWave=Math.sin(scrollProgress*Math.PI*5);
      const settle=gather*(1-disperse);
      ctx.clearRect(0,0,w,h);
      for(const p of particles){
        const orbit=1-settle;
        const swirl=elapsed*.65+p.phase+scrollProgress*5;
        const waveX=Math.sin(scrollProgress* Math.PI*8+p.phase)*scrollProgress*34;
        const waveY=Math.cos(scrollProgress* Math.PI*6+p.phase)*scrollProgress*24;
        const tx=p.target.x+Math.cos(swirl)*orbit*95+waveX;
        const ty=p.target.y+Math.sin(swirl*1.13)*orbit*65+waveY;
        const dx=tx-p.x,dy=ty-p.y;
        const spring=settle>.8?.035:.012;
        p.vx=(p.vx+dx*spring)*.91;
        p.vy=(p.vy+dy*spring)*.91;
        const mx=p.x-px,my=p.y-py,d=Math.hypot(mx,my);
        if(d<155&&d>0){
          const influence=(1-d/155);
          const swirlForce=influence*(1.25+scrollEnergy*1.8);
          p.vx+=(-my/d)*swirlForce + (mx/d)*influence*.18;
          p.vy+=(mx/d)*swirlForce + (my/d)*influence*.18;
        }
        if(disperse>.05){p.vx+=Math.cos(swirl)*disperse*.32;p.vy+=Math.sin(swirl)*disperse*.32}
        p.x+=p.vx;p.y+=p.vy;
        const speed=Math.hypot(p.vx,p.vy);
        if(speed>5){p.vx=p.vx/speed*5;p.vy=p.vy/speed*5}
        const s=p.size,alpha=.5+settle*.45;
        ctx.save();ctx.translate(p.x,p.y);
        ctx.globalAlpha=alpha;ctx.fillStyle=p.color;ctx.shadowColor=p.color;
        ctx.shadowBlur=settle>.65?8:3;
        ctx.beginPath();ctx.arc(0,0,s*(.8+settle*.35+scrollEnergy*.25),0,Math.PI*2);ctx.fill();ctx.restore();
      }
      if(px>-500){
        ctx.save();ctx.globalAlpha=.18+scrollEnergy*.15;ctx.strokeStyle="#e9b65f";ctx.lineWidth=1;
        ctx.beginPath();ctx.arc(px,py,12+scrollEnergy*18+Math.sin(elapsed*4)*3,0,Math.PI*2);ctx.stroke();ctx.restore();
      }
      scrollEnergy*=.94;
      raf=requestAnimationFrame(draw);
    };
    resize();scroll();
    addEventListener("resize",resize);addEventListener("pointermove",pointer,{passive:true});
    addEventListener("scroll",scroll,{passive:true});
    raf=requestAnimationFrame(draw);
    return()=>{cancelAnimationFrame(raf);removeEventListener("resize",resize);removeEventListener("pointermove",pointer);removeEventListener("scroll",scroll)};
  },[motionEnabled,reduce]);
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
