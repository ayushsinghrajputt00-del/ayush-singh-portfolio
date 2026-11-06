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
    let raf, frame = 0, alive = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = window.innerWidth, h = window.innerHeight;
    const resize = () => {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + "px"; canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    const gold = "rgba(211,181,126,";
    const origin = { x: w * .5, y: h * .48 };
    const selectors = ["header .brand", ".hero h1", ".hero-desc", ".hero-art", ".quote-band", "#about h2", "#focus .section-heading", ".focus-row", "#journey .section-heading", ".timeline-row", "#work .section-heading", ".empty-work", "#contact h2", ".contact-details"];
    const targets = selectors.flatMap(sel => [...document.querySelectorAll(sel)].slice(0, 8)).map((el, i) => {
      const r = el.getBoundingClientRect();
      return { x: Math.max(12, Math.min(w-12, r.left+r.width/2)), y: Math.max(12, Math.min(h-12, r.top+r.height/2)), width: Math.min(w-24,Math.max(30,r.width)), height: Math.min(h-24,Math.max(18,r.height)), label: el.tagName === "H1" ? "HEADING" : el.id ? el.id.toUpperCase() : ["LAYOUT","TYPE","DETAIL","FORM"][i%4] };
    });
    const count = 22;
    const agents = Array.from({length:count},(_,i)=>({angle:i/count*Math.PI*2, radius:35+Math.random()*30, x:origin.x, y:origin.y, hue:i%4, trail:[]}));
    const ease = t => t<.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2;
    const cursor = (x,y,hue,scale=1) => {
      ctx.save(); ctx.translate(x,y); ctx.scale(scale,scale);
      ctx.fillStyle = ["#f2eee7","#d7b77f","#b8c4d0","#e6d9c4"][hue];
      ctx.strokeStyle = "rgba(8,8,8,.8)"; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,18); ctx.lineTo(5,13); ctx.lineTo(9,22); ctx.lineTo(13,20); ctx.lineTo(9,11); ctx.lineTo(17,10); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.restore();
    };
    const draw = () => {
      if(!alive) return;
      frame++;
      ctx.fillStyle = "rgba(5,5,5,.16)";
      ctx.fillRect(0,0,w,h);
      const t = frame/480;
      const intro = Math.min(frame/90,1);
      const fan = ease(Math.max(0,Math.min(1,(frame-100)/120)));
      const build = Math.max(0,Math.min(1,(frame-180)/250));
      const fade = frame>420 ? Math.max(0,1-(frame-420)/60) : 1;
      agents.forEach((p,i)=>{
        const orbitA = p.angle + frame*(.025 + i*.00025);
        const ox = origin.x + Math.cos(orbitA)*(p.radius*(1-intro*.35));
        const oy = origin.y + Math.sin(orbitA)*(p.radius*(1-intro*.35));
        const target = targets[(i*3)%Math.max(1,targets.length)] || {x:w*(.15+(i%5)*.17),y:h*(.25+Math.floor(i/5)*.2)};
        const spreadX = target.x + Math.cos(p.angle*2)*Math.min(80,w*.08);
        const spreadY = target.y + Math.sin(p.angle*2)*Math.min(50,h*.06);
        const tx = ox+(spreadX-ox)*fan;
        const ty = oy+(spreadY-oy)*fan;
        p.x += (tx-p.x)*.075; p.y += (ty-p.y)*.075;
        p.trail.push({x:p.x,y:p.y}); if(p.trail.length>14)p.trail.shift();
        ctx.beginPath(); p.trail.forEach((pt,j)=>j?ctx.lineTo(pt.x,pt.y):ctx.moveTo(pt.x,pt.y));
        ctx.strokeStyle = gold+(fade*(.04+jitter(i))+.0)+")";
        ctx.lineWidth=1; ctx.stroke();
        cursor(p.x,p.y,p.hue,.72);
      });
      if(frame>150 && targets.length){
        targets.forEach((r,i)=>{
          const progress=Math.max(0,Math.min(1,(frame-160-i*7)/95));
          if(progress<=0)return;
          const a=progress*4;
          ctx.save(); ctx.globalAlpha=fade*.72;
          ctx.strokeStyle="rgba(211,181,126,.68)";ctx.lineWidth=1;
          ctx.setLineDash([5,5]);ctx.strokeRect(r.x-r.width/2,r.y-r.height/2,r.width,r.height);ctx.setLineDash([]);
          const cw=r.width*progress;
          ctx.strokeStyle="rgba(242,238,231,.9)";ctx.beginPath();ctx.moveTo(r.x-r.width/2,r.y-r.height/2);ctx.lineTo(r.x-r.width/2+cw,r.y-r.height/2);ctx.stroke();
          ctx.font="9px monospace";ctx.fillStyle="rgba(211,181,126,.95)";ctx.fillText(r.label,r.x-r.width/2,r.y-r.height/2-7);
          ctx.restore();
        });
      }
      if(frame<480) raf=requestAnimationFrame(draw); else onDone();
    };
    const jitter = i => .16 + .12*Math.sin(frame*.08+i);
    ctx.fillStyle="rgba(5,5,5,.92)";ctx.fillRect(0,0,w,h);
    raf=requestAnimationFrame(draw);
    return ()=>{alive=false;cancelAnimationFrame(raf);window.removeEventListener("resize",resize);};
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
  const toggleMotion = () => { if (swarm) return; setMotionOn(true); setSwarm(true); };
  const links = [["About","#about"],["Focus","#focus"],["Journey","#journey"],["Work","#work"]];
  return <>
    <div className="progress" />
    <header className="header">
      <a className="brand" href="#top">AS<span>.</span><small> / PORTFOLIO</small></a>
      <button className="menu-button" onClick={() => setMenu(!menu)} aria-label="Toggle menu">☰</button>
      <nav className={menu ? "nav open" : "nav"}>
        {links.map(([t,h]) => <a key={h} href={h} onClick={() => setMenu(false)}>{t}</a>)}
        <button className="motion-button" onClick={toggleMotion} disabled={swarm}><i className={motionOn ? "dot live" : "dot"} />{swarm ? "Building…" : "Motion"}</button>
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
        <Reveal><div className="section-label"><span>05 / CONTACT</span><span>OPEN TO GOOD CONVERSATIONS</span></div><p className="gold-label">HAVE SOMETHING IN MIND?</p><h2>Let's make<br/><em>it matter.</em></h2><div className="contact-foot"><div><p>I'd love to connect. Whether it's an idea, an opportunity or just a good conversation, feel free to reach out.</p><div className="contact-details"><a href="mailto:ayushsinghrajputt00@gmail.com">ayushsinghrajputt00@gmail.com</a><a href="tel:+919354895707">+91 93548 95707</a></div></div><div className="contact-links"><a className="button" href="https://www.instagram.com/iiuss__/" target="_blank" rel="noreferrer">Instagram @iiuss__ ↗</a><a className="social-link" href="https://github.com/ayushsinghrajputt00-del" target="_blank" rel="noreferrer">GitHub ↗</a></div></div></Reveal>
      </section>
    </main>
    <footer className="footer shell"><a className="brand" href="#top">AS<span>.</span></a><span>© {new Date().getFullYear()} AYUSH SINGH</span><a href="https://www.instagram.com/iiuss__/" target="_blank" rel="noreferrer">INSTAGRAM ↗</a><a href="#top">BACK TO TOP ↑</a><small>MADE WITH INTENTION.</small></footer>
    <AnimatePresence>{swarm && <Swarm onDone={finish}/>}</AnimatePresence>
  </>;
}

createRoot(document.getElementById("root")).render(<React.StrictMode><App/></React.StrictMode>);