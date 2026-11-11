import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const focus = [
  ["01", "Leadership & responsibility", "Practising clear communication, initiative and responsibility in team settings."],
  ["02", "Technology & digital craft", "Learning frontend development and basic programming by building small projects."],
  ["03", "Discipline & endurance", "Maintaining a regular study and training routine, then reviewing progress honestly."]
];
const tools = [
  ["01", "React", "Component-based interface development"],
  ["02", "Vite", "Frontend development and production builds"],
  ["03", "JavaScript", "Core language used to build this interface"],
  ["04", "Python", "Programming practice and small experiments"],
  ["05", "CSS", "Responsive layouts and visual styling"],
  ["06", "GitHub", "Version control and project source management"]
];
const journey = [
  ["Curiosity", "Question the obvious", "Explore new ideas, understand how things work and keep learning."],
  ["Discipline", "Do the work daily", "Build reliable habits through study, training and deliberate practice."],
  ["Execution", "Turn plans into action", "Create, test, learn from feedback and improve the next attempt."]
];

function App() {
  const [menu,setMenu]=React.useState(false);
  const [theme,setTheme]=React.useState(()=>document.documentElement.dataset.theme==="light"?"light":"dark");
  const [formStatus,setFormStatus]=React.useState({type:"",message:""});
  useEffect(()=>{
    document.documentElement.dataset.theme=theme;
    try{localStorage.setItem("ayush-portfolio-theme",theme);}catch{}
  },[theme]);
  const toggleTheme=(event)=>{
    const next=theme==="dark"?"light":"dark";
    const x=event?.clientX??window.innerWidth/2;
    const y=event?.clientY??40;
    document.documentElement.style.setProperty("--theme-x",x+"px");
    document.documentElement.style.setProperty("--theme-y",y+"px");
    if(document.startViewTransition){
      document.startViewTransition(()=>setTheme(next));
    }else{
      setTheme(next);
    }
  };
  const links=[["01","Profile","#about"],["02","Education","#education"],["03","Focus","#focus"],["04","Journey","#journey"],["05","Tools","#skills"],["06","Work","#work"]];
  const handleContactSubmit=(event)=>{
    event.preventDefault();
    const form=event.currentTarget;
    const data=new FormData(form);
    const name=String(data.get("name")||"").trim();
    const email=String(data.get("email")||"").trim();
    const message=String(data.get("message")||"").trim();
    if(!name||!email||!message||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      setFormStatus({type:"error",message:"Please enter a valid name, email address and message."});
      return;
    }
    try{
      const subject=encodeURIComponent("Portfolio enquiry from "+name);
      const body=encodeURIComponent("Name: "+name+"\nEmail: "+email+"\n\n"+message);
      window.location.href="mailto:ayushsinghrajput00@gmail.com?subject="+subject+"&body="+body;
      setFormStatus({type:"success",message:"Your email app should open with the draft ready. Review it and press Send to finish."});
      form.reset();
    }catch{
      setFormStatus({type:"error",message:"Could not open your email app. Please email ayushsinghrajput00@gmail.com directly."});
    }
  };
  return <>
    <svg className="theme-filter-defs" aria-hidden="true" focusable="false"><filter id="ink-edge" x="-8%" y="-8%" width="116%" height="116%"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.045" numOctaves="2" seed="8" result="noise"><animate attributeName="baseFrequency" values="0.012 0.045;0.018 0.06;0.012 0.045" dur="1.1s" repeatCount="indefinite"/></feTurbulence><feDisplacementMap in="SourceGraphic" in2="noise" scale="42" xChannelSelector="R" yChannelSelector="G"/></filter></svg>
    <header className="header">
      <a className="brand" href="#top" aria-label="Ayush Singh, back to top">AS<span>_</span><small>PERSONAL PORTFOLIO / 2026</small></a>
      <button className="menu-button" type="button" onClick={()=>setMenu(v=>!v)} aria-label={menu?"Close navigation menu":"Open navigation menu"} aria-expanded={menu} aria-controls="primary-navigation">{menu?"✕":"☰"}</button>
      <nav id="primary-navigation" aria-label="Main navigation" className={menu?"nav open":"nav"}>{links.map(([n,t,h])=><a key={h} href={h} onClick={()=>setMenu(false)}><small>{n}</small>{t}</a>)}<a className="nav-cta" href="#contact" onClick={()=>setMenu(false)}>Initiate contact ↗</a><button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme==="dark"?"light":"dark"} mode`} title={`Switch to ${theme==="dark"?"light":"dark"} mode`}><span aria-hidden="true">{theme==="dark"?"☼":"☾"}</span><small>{theme==="dark"?"LIGHT":"DARK"}</small></button></nav>
    </header>
    <main id="top">
      <section className="hero shell">
        <div className="hero-topline"><span><i/> INDEPENDENT MIND / ACTIVE LEARNING</span><span>NEW DELHI, IN</span><span>INDIA</span></div>
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="gold-label">STUDENT · CREATOR · CURIOUS MIND</p>
            <h1>AYUSH<span className="red-dot">.</span><br/><em>Singh</em></h1>
            <p className="hero-desc">I am a BCA student at IGNOU learning web development and software fundamentals. I build small React and Python projects to practise coding, solve practical problems and improve through hands-on work.</p>
            <div className="hero-links"><a className="button" href="#about">Explore profile <span>↘</span></a><a className="under-link" href="#work">View selected work ↗</a></div>
          </div>
          <div className="hero-art">
            <div className="art-grid"/><div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="portrait-mark">A<span>.</span></div>
            <div className="art-index"><span>FIG. 001</span><span>THE HUMAN ELEMENT</span></div>
            <div className="art-stamp">AS<br/><small>IND / 26</small></div>
          </div>
        </div>
        <div className="hero-bottom"><span>SCROLL TO EXPLORE ↓</span><span>DISCIPLINE / CURIOSITY / EXECUTION</span><span>PORTFOLIO INDEX 001-005</span></div>
      </section>
      <section className="section shell" id="about">
        <div className="section-label"><span>01 / PROFILE</span><span>BACKGROUND & PHILOSOPHY</span></div>
        <div className="about-grid"><h2>Curious by nature.<br/><em>Always becoming.</em></h2><div className="body-copy"><p>I'm Ayush, a student from Delhi interested in technology, creativity, fitness and personal growth. I enjoy exploring how things work, learning new skills and turning interesting ideas into something tangible.</p><p>I like keeping an open mind, learning from experience and getting a little better with every project.</p><div className="profile-tags"><span>SELF DEVELOPMENT</span><span>TECHNOLOGY</span><span>LEADERSHIP</span><span>FITNESS</span></div></div></div>
      </section>
      <section className="section shell" id="education">
        <div className="section-label"><span>02 / EDUCATION</span><span>ACADEMIC BACKGROUND</span></div><h2 className="section-heading">Learning, built<br/><em>step by step.</em></h2>
        <div className="education-grid">
          <article className="education-card"><span>01 / SECONDARY · 2024</span><h3>Class X</h3><p>CBSE · Secondary School Examination</p><small>Rajkiya Pratibha Vikas Vidyalaya · New Delhi</small></article>
          <article className="education-card"><span>02 / SENIOR SECONDARY · 2026</span><h3>Class XII</h3><p>CBSE · Humanities</p><small>Rajkiya Pratibha Vikas Vidyalaya · New Delhi</small></article>
          <article className="education-card"><span>03 / UNDERGRADUATE</span><h3>Bachelor of Computer Applications</h3><p>Indira Gandhi National Open University (IGNOU)</p><small>Undergraduate programme · Enrolled</small></article>
        </div>
      </section>
      <section className="section shell" id="focus">
        <div className="section-label"><span>03 / AREAS OF INTEREST</span><span>AREAS OF FOCUS</span></div><h2 className="section-heading">A few interests.<br/><em>Room to explore.</em></h2>
        <div className="focus-list">{focus.map(([n,t,d],i)=><article className="focus-row"><span className="number">{n}</span><h3>{t}</h3><p>{d}</p><b>↗</b></article>)}</div>
      </section>
      <section className="section shell" id="skills">
        <div className="section-label"><span>04 / TOOLS & TECHNOLOGY</span><span>USED IN CURRENT PROJECTS</span></div><h2 className="section-heading">Tools I use to<br/><em>make ideas real.</em></h2>
        <div className="skills-grid">{tools.map(([n,t,d],i)=><article className="skill-card"><span className="number">{n}</span><div><h3>{t}</h3><p>{d}</p></div><b>↗</b></article>)}</div>
        <p className="skills-note">A practical toolset demonstrated through this portfolio project, not a claim of expert-level proficiency.</p>
      </section>
      <section className="section shell" id="journey">
        <div className="section-label"><span>05 / LEARNING JOURNEY</span><span>LEARNING IN PROGRESS</span></div><h2 className="section-heading">Progress is a practice.<br/><em>Not a finish line.</em></h2>
        <div className="timeline">{journey.map(([t,s,d],i)=><article className="timeline-row"><span className="number">0{i+1}</span><div><h3>{t}</h3><p>{s}</p><small>{d}</small></div><b>↗</b></article>)}</div>
      </section>
      <section className="section shell" id="work">
        <div className="section-label"><span>06 / SELECTED WORK</span><span>PROJECT ARCHIVE</span></div><div className="work-title"><h2 className="section-heading">Proof of <em>practice.</em></h2><span>01-03 / INDEX</span></div>
        <div className="project-grid">
          <article className="project-card"><div className="project-visual visual-one"><span>AS / 001</span><b>01</b><i>WEB</i></div><div className="project-meta"><small>PERSONAL PLATFORM / 2026</small><h3>Personal Portfolio</h3><p>A responsive portfolio built with React and CSS to present my background and selected projects.</p><span>REACT · VITE · DESIGN</span></div></article>
          <article className="project-card"><div className="project-visual visual-two"><span>AS / 002</span><b>02</b><i>FITNESS</i></div><div className="project-meta"><small>PERSONAL PRACTICE / 2026</small><h3>Fitness</h3><p>Building strength, endurance and healthy habits through consistent training.</p><span>STRENGTH · ENDURANCE · WELLBEING</span></div></article>
          <article className="project-card"><div className="project-visual visual-three"><span>AS / 003</span><b>03</b><i>EXPERIMENTS</i></div><div className="project-meta"><small>ONGOING / OPEN ENDED</small><h3>Digital Experiments</h3><p>Small coding experiments used to practise Python, interface design and debugging.</p><span>RESEARCH · BUILD · ITERATE</span></div></article>
        </div>
      </section>
      <section className="contact shell" id="contact"><div className="section-label"><span>07 / DIRECT CONNECT</span><span>OPEN TO GOOD CONVERSATIONS</span></div><p className="gold-label">HAVE AN IDEA OR OPPORTUNITY?</p><h2>Have a project<br/><em>or question?</em></h2><div className="contact-foot"><div><p>Use the contact form to prepare an email, or contact me directly at the address below.</p><div className="contact-details"><a href="mailto:ayushsinghrajput00@gmail.com">ayushsinghrajput00@gmail.com</a><a href="tel:+919354895707">+91 93548 95707</a></div></div><div className="contact-links"><a className="button" href="https://www.instagram.com/iiuss__/" target="_blank" rel="noopener noreferrer">Instagram ↗</a><a className="social-link" href="https://github.com/ayushsinghrajputt00-del" target="_blank" rel="noopener noreferrer">GitHub ↗</a></div></div>
      <form className="contact-form" onSubmit={handleContactSubmit} noValidate>
        <div className="form-heading"><span>DIRECT MESSAGE</span><small>YOUR EMAIL APP WILL HANDLE DELIVERY</small></div>
        <div className="form-grid">
          <label>Your name<input name="name" type="text" autoComplete="name" required /></label>
          <label>Your email<input name="email" type="email" autoComplete="email" required /></label>
        </div>
        <label>Your message<textarea name="message" rows="4" required /></label>
        <div className="form-actions"><button className="button" type="submit">Prepare email <span>↗</span></button><p className="form-status" role={formStatus.type==="error"?"alert":"status"} aria-live="polite" data-state={formStatus.type}>{formStatus.message}</p></div>
      </form></section>
    </main>
    <footer className="footer shell"><a className="brand" href="#top">AS<span>_</span></a><span>© {new Date().getFullYear()} AYUSH SINGH / INDIA</span><a href="https://www.instagram.com/iiuss__/" target="_blank" rel="noopener noreferrer">INSTAGRAM ↗</a><a href="https://github.com/ayushsinghrajputt00-del" target="_blank" rel="noopener noreferrer">GITHUB ↗</a><a href="mailto:ayushsinghrajput00@gmail.com">EMAIL ↗</a><a href="tel:+919354895707">CALL ↗</a><a href="/privacy.html">PRIVACY</a><a href="/terms.html">TERMS</a><a href="#top">BACK TO TOP ↑</a><small>BUILT WITH INTENTION.</small></footer>
  </>;
}
createRoot(document.getElementById("root")).render(<React.StrictMode><App/></React.StrictMode>);
