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
    let raf = 0, frame = 0, alive = true;
    let w = innerWidth, h = innerHeight;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const gold = "#c9aa75";
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ease = t => 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3);
    const resize = () => {
      w = innerWidth; h = innerHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      canvas.style.width = w + "px"; canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    addEventListener("resize", resize);
    document.documentElement.classList.add("swarm-running");
    const selectors = "header, .eyebrow, .hero-copy, .hero-art, .hero-foot, .quote-band, .section-label, h2, .body-copy, .focus-row, .timeline-row, .empty-work, .contact-foot, .footer";
    const targets = [...document.querySelectorAll(selectors)].map((el, i) => {
      const r = el.getBoundingClientRect();
      const visible = r.bottom > 0 && r.top < h && r.right > 0 && r.left < w;
      if (!visible || r.width < 2 || r.height < 2) return null;
      const text = (el.innerText || el.getAttribute("aria-label") || "").replace(/\s+/g, " ").trim().slice(0, 54);
      return { x:r.left, y:r.top, w:r.width, h:r.height, text, type:el.tagName.toLowerCase(), i };
    }).filter(Boolean);
    const palette = ["#f1ede6", "#c9aa75", "#9da9b4", "#d8c7a8"];
    const agents = Array.from({length:Math.max(12,Math.min(28,targets.length*2))},(_,i)=>({
      x:w*.5, y:h*.52, sx:w*.5, sy:h*.52, target:i%Math.max(1,targets.length),
      phase:Math.random()*Math.PI*2, hue:i%palette.length, trail:[]
    }));
    const cursor = (x,y,color,scale=1) => {
      ctx.save(); ctx.translate(x,y); ctx.scale(scale,scale);
      ctx.fillStyle=color; ctx.strokeStyle="#080807"; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,17); ctx.lineTo(5,12); ctx.lineTo(9,21); ctx.lineTo(12,19); ctx.lineTo(8,10); ctx.lineTo(16,9); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.restore();
    };
    const draw = () => {
      if (!alive) return;
      frame++;
      const t = frame/(reduced?100:300);
      const reveal = ease((frame-32)/(reduced?35:205));
      const fade = frame > (reduced?80:320) ? 1-ease((frame-(reduced?80:320))/(reduced?20:55)) : 1;
      ctx.clearRect(0,0,w,h);
      ctx.fillStyle="rgba(5,5,5,.985)"; ctx.fillRect(0,0,w,h);
      // Fine drafting grid gives the scene a technical, editorial blueprint feel.
      ctx.save(); ctx.globalAlpha=.12*fade; ctx.strokeStyle=gold; ctx.lineWidth=.5;
      const step=32;
      for(let x=(w%step)/2;x<w;x+=step){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
      for(let y=(h%step)/2;y<h;y+=step){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
      ctx.restore();
      // Draw a measured page blueprint, then progressively ink its contents.
      targets.forEach((r,i)=>{
        const p=ease((frame-24-i*3)/(reduced?40:115));
        if(p<=0)return;
        ctx.save(); ctx.globalAlpha=fade*(.18+.82*p);
        ctx.strokeStyle=i%3===0?"rgba(201,170,117,.9)":"rgba(232,224,210,.48)";
        ctx.lineWidth=1; ctx.setLineDash([4,5]); ctx.strokeRect(r.x,r.y,r.w,r.h); ctx.setLineDash([]);
        const sweep=Math.max(0,Math.min(r.w,(r.w+28)*p-28));
        ctx.fillStyle="rgba(201,170,117,.12)";ctx.fillRect(r.x,r.y,sweep,r.h);
        ctx.strokeStyle="rgba(201,170,117,.85)";ctx.beginPath();ctx.moveTo(r.x,r.y);ctx.lineTo(r.x+sweep,r.y);ctx.stroke();
        if(r.text && p>.42){
          ctx.globalAlpha=fade*Math.min(1,(p-.42)*2.2)*.72;
          ctx.fillStyle=i%3===0?"#d8bd91":"#d8d2c8";
          ctx.font=(r.type==="h1"||r.type==="h2"?"600 11px":"9px")+" monospace";
          const words=r.text.slice(0,46);
          ctx.fillText(words,r.x+7,Math.min(h-8,r.y+Math.min(r.h-5,18)),Math.max(30,r.w-14));
        }
        ctx.restore();
      });
      agents.forEach((a,i)=>{
        const r=targets[a.target] || {x:w*.5,y:h*.5,w:10,h:10};
        const angle=t*2.1+a.phase;
        const tx=r.x+r.w*(.12+.76*((i%7)/6));
        const ty=r.y+r.h*(.18+.64*((i%5)/4));
        const orbitX=w*.5+Math.cos(angle)*Math.min(w*.36,110+i%5*15);
        const orbitY=h*.5+Math.sin(angle*1.17)*Math.min(h*.3,90+i%4*14);
        const blend=ease((frame-18-i*1.8)/(reduced?40:170));
        a.sx=orbitX+(tx-orbitX)*blend; a.sy=orbitY+(ty-orbitY)*blend;
        a.x+=(a.sx-a.x)*.12; a.y+=(a.sy-a.y)*.12;
        a.trail.push([a.x,a.y]); if(a.trail.length>10)a.trail.shift();
        ctx.beginPath(); a.trail.forEach((p,j)=>j?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
        ctx.strokeStyle=palette[a.hue]+"55";ctx.lineWidth=1;ctx.stroke();
        cursor(a.x,a.y,palette[a.hue],.72);
      });
      // Corner registration marks and a live build readout.
      ctx.save();ctx.globalAlpha=fade*.85;ctx.strokeStyle=gold;ctx.fillStyle=gold;ctx.lineWidth=1;
      [[18,18],[w-18,18],[18,h-18],[w-18,h-18]].forEach(([x,y])=>{ctx.beginPath();ctx.moveTo(x-6,y);ctx.lineTo(x+6,y);ctx.moveTo(x,y-6);ctx.lineTo(x,y+6);ctx.stroke();});
      ctx.font="9px monospace";ctx.fillText("AS / RECONSTRUCTION SEQUENCE",22,h-28);
      ctx.textAlign="right";ctx.fillText("BUILD "+String(Math.min(100,Math.round(reveal*100))).padStart(3,"0")+"%",w-22,h-28);
      ctx.restore();
      if(frame<(reduced?105:380)) raf=requestAnimationFrame(draw);
      else { document.documentElement.classList.remove("swarm-running"); onDone(); }
    };
    raf=requestAnimationFrame(draw);
    return ()=>{alive=false;cancelAnimationFrame(raf);removeEventListener("resize",resize);document.documentElement.classList.remove("swarm-running");};
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