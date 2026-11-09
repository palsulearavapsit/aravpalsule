import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, BriefcaseBusiness, Check, Copy, Menu, X } from 'lucide-react'
import { PortfolioProvider, usePortfolio } from './data/PortfolioProvider'
import { AdminPanel } from './components/AdminPanel'
import type { Project } from './data/projects'
import './index.css'

const navItems = [['Home', 'home'], ['About', 'about'], ['Work', 'work'], ['Experience', 'experience'], ['Achievements', 'achievements'], ['Skills', 'skills'], ['Gallery', 'gallery'], ['Contact', 'contact']]

function useActiveSection() {
  const [active, setActive] = useState('home')
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id) }), { rootMargin: '-40% 0px -50% 0px' })
    navItems.forEach(([, id]) => { const section = document.getElementById(id); if (section) observer.observe(section) })
    return () => observer.disconnect()
  }, [])
  return active
}

function Navbar() {
  const { content } = usePortfolio()
  const active = useActiveSection()
  const [open, setOpen] = useState(false)
  const onGallery = window.location.pathname.replace(/\/$/, '') === '/gallery'
  return <header className="nav-wrap"><a className="brand" href={onGallery ? '/' : '#home'} aria-label={`${content.profile.name} home`}>{content.profile.name}</a><nav className={open ? 'nav-links open' : 'nav-links'} aria-label="Main navigation">{navItems.map(([label, id]) => { const isGalleryLink = id === 'gallery'; const href = isGalleryLink ? '/gallery' : onGallery ? (id === 'home' ? '/' : `/#${id}`) : `#${id}`; const selected = isGalleryLink ? onGallery : !onGallery && active === id; return <a key={id} className={selected ? 'active' : ''} href={href} onClick={() => setOpen(false)}>{label}</a> })}</nav><a className="nav-contact" href={onGallery ? '/#contact' : '#contact'}>Let’s talk <ArrowUpRight size={14}/></a><button className="menu-button" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button></header>
}

function SectionTitle({ eyebrow, title, note }: { eyebrow: string; title: string; note?: string }) { return <div className="section-title"><div><p className="eyebrow">{eyebrow}</p><h2>{title.replace(/\\n/g, '\n')}</h2></div>{note && <p className="title-note">{note}</p>}</div> }

function Hero() {
  const { content } = usePortfolio()
  const { hero, profile } = content
  return <section id="home" className="hero">
    <div className="hero-grid"/>
    <div className="hero-copy">
      <motion.p className="eyebrow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15 }}>
        {hero.roles.map((role, index) => <span className="hero-role" key={`${role}-${index}`}>{index > 0 ? <i/> : null}{role}</span>)}
      </motion.p>
      <motion.h1 initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .75, delay: .25 }}>
        {hero.headline[0]}<br/><em>{hero.headline[1]}</em>
      </motion.h1>
      <motion.div className="hero-bottom" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .7 }}>
        <p>{hero.description}</p>
        <div className="hero-actions">
          <a className="button button-lime" href="#work">Explore my work <ArrowDownRight size={17}/></a>
          <a className="text-link" href="#contact">Get in touch <ArrowUpRight size={15}/></a>
          <a className="text-link" href="#resumes">View resume <ArrowUpRight size={15}/></a>
        </div>
      </motion.div>
    </div>
    <div className="hero-meta"><span><b className="live-dot"/> {hero.availability}</span><span>{profile.location.toUpperCase()} · {hero.education}</span><span>CGPA {hero.cgpa}</span></div>
    <a className="scroll-cue" href="#about"><span>SCROLL TO EXPLORE</span><ArrowDown size={15}/></a>
    <div className="orb orb-a"/><div className="orb orb-b"/>
    <div className="hero-index">{hero.coordinates[0]}<br/>{hero.coordinates[1]}</div>
  </section>
}
function About() {
  const { content: { about } } = usePortfolio()
  return <section id="about" className="section about-section"><SectionTitle eyebrow="01 / ABOUT" title={about.title} note={about.note}/><div className="about-layout"><p className="about-lead">{about.lead}</p><div className="about-body">{about.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}<div className="about-facts"><div><small>EDUCATION</small><b>{about.degree}</b><span>{about.institute}</span></div><div><small>GRADUATION</small><b>{about.graduation}</b><span>{about.city}</span></div><div><small>ACADEMICS</small><b>{about.cgpa}</b><span>Current CGPA</span></div></div></div></div></section>
}

function ProjectVisual({ art, number }: { art: string; number: string }) { return <div className={`project-visual art-${art}`} aria-hidden="true"><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-core">{art === 'routes' ? <><span>PLAN</span><ArrowUpRight/></> : art === 'crack' ? <div className="road-line"/> : art === 'forecast' ? <svg viewBox="0 0 300 140"><path d="M8 115 C40 90 44 45 88 67 S130 120 164 58 S208 43 231 67 S261 92 292 15"/></svg> : <span>{number}</span>}</div><span className="art-corner">EXP. {number}</span><span className="art-caption">{art === 'routes' ? 'MULTI-AGENT TRIP DESIGN' : art === 'crack' ? 'DAMAGE DETECTION / 01' : art.toUpperCase() + ' / SYSTEM STUDY'}</span></div> }

function Projects() {
  const { content: { projects } } = usePortfolio()
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState<Project | null>(null)
  const filters = useMemo(() => ['All', ...new Set(projects.map(project => project.category))], [projects])
  const shown = useMemo(() => projects.filter(project => filter === 'All' || project.category === filter), [filter, projects])
  useEffect(() => { if (!selected) return; const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setSelected(null) }; window.addEventListener('keydown', closeOnEscape); return () => window.removeEventListener('keydown', closeOnEscape) }, [selected])
  return <section id="work" className="section work-section"><SectionTitle eyebrow="02 / SELECTED WORK" title={'Selected experiments\n& builds.'} note="A selection of systems, models and ideas made tangible."/><div className="filters" role="group" aria-label="Filter projects">{filters.map(category => <button key={category} className={filter === category ? 'filter active' : 'filter'} onClick={() => setFilter(category)}>{category}<span>{category === 'All' ? projects.length : projects.filter(project => project.category === category).length}</span></button>)}</div><div className="projects-list">{shown.map((project, index) => <motion.article layout key={`${project.number}-${project.title}`} className={`project-row ${index % 2 ? 'reverse' : ''}`} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .55 }}><button className="project-open" onClick={() => setSelected(project)} aria-label={`View details for ${project.title}`}><ProjectVisual art={project.art} number={project.number}/><div className="project-info"><div className="project-label"><span>PROJECT {project.number}</span><span>{project.category}</span></div><div className="project-name-line"><h3>{project.title}</h3><span className="circle-arrow"><ArrowUpRight/></span></div><p>{project.description}</p><div className="tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div></button></motion.article>)}</div><AnimatePresence>{selected && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={event => { if (event.target === event.currentTarget) setSelected(null) }}><motion.div className="project-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" initial={{ y: 25, scale: .98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, opacity: 0 }}><button className="modal-close" onClick={() => setSelected(null)} aria-label="Close details"><X/></button><p className="eyebrow">PROJECT {selected.number} / {selected.category}</p><h3 id="modal-title">{selected.title}</h3><p>{selected.details}</p><div className="tags">{selected.tags.map(tag => <span key={tag}>{tag}</span>)}</div><div className="project-links">{selected.githubLinks?.map(link => <a key={link.url} href={link.url} target="_blank" rel="noreferrer"><ArrowUpRight size={14}/>{link.label}</a>)}</div></motion.div></motion.div>}</AnimatePresence></section>
}

function Experience() {
  const { content } = usePortfolio()
  return <section id="experience" className="section experience-section"><SectionTitle eyebrow="03 / EXPERIENCE" title={'Experience &\ncontributions.'}/><div className="timeline"><div className="timeline-mark"><span/></div>{content.experience.map((item, index) => <article className="experience-item" key={`${item.role}-${index}`}><div className="experience-date">{item.date}<br/><small>{item.kind}</small></div><div className="experience-content"><p className="eyebrow">{item.organization} <BriefcaseBusiness size={14}/></p><h3>{item.role}</h3><p>{item.introduction}</p><ul>{item.responsibilities.map((responsibility, itemIndex) => <li key={itemIndex}>{responsibility}</li>)}</ul><div className="tags">{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div></article>)}</div><div className="leadership-block"><p className="eyebrow">ALONGSIDE THE WORK</p>{content.leadership.map((item, index) => <div className="leadership-row" key={`${item.role}-${index}`}><span>{item.date}</span><div><h4>{item.role}</h4><p>{item.description}</p></div></div>)}</div></section>
}

function Achievements() {
  const { content: { achievements } } = usePortfolio()
  return <section id="achievements" className="section achievements-section"><SectionTitle eyebrow="04 / MILESTONES" title={'Milestones along\nthe way.'} note="A few markers of curiosity, persistence and teamwork."/><div className="achievement-list">{achievements.map(([number, title, result, description], index) => <article key={`${title}-${index}`} className="achievement-row"><span className="achievement-num">{number}</span><div><h3>{title}</h3><p>{description}</p></div><strong>{result}</strong><ArrowUpRight className="achievement-arrow" size={18}/></article>)}</div></section>
}

function GalleryPage() {
  const { certificates } = usePortfolio()
  const [index, setIndex] = useState<number | null>(null)
  const step = (delta: number) => setIndex(current => current === null ? null : (current + delta + certificates.length) % certificates.length)
  useEffect(() => { if (index === null) return; const key = (event: KeyboardEvent) => { if (event.key === 'Escape') setIndex(null); if (event.key === 'ArrowRight') step(1); if (event.key === 'ArrowLeft') step(-1) }; window.addEventListener('keydown', key); document.body.style.overflow = 'hidden'; return () => { window.removeEventListener('keydown', key); document.body.style.overflow = '' } }, [index, certificates.length])
  return <><AmbientBackground/><Navbar/><main><section id="gallery" className="section gallery-page"><SectionTitle eyebrow="GALLERY" title="Gallery." note="A growing collection of moments, milestones, and things I have made."/>{certificates.length ? <div className="gallery-masonry">{certificates.map((image, imageIndex) => <button key={image.src} className="gallery-photo" onClick={() => setIndex(imageIndex)} aria-label={`View ${image.caption}`}><img src={image.src} alt={image.caption} loading="lazy"/><span>{image.caption}</span></button>)}</div> : <div className="gallery-empty"><p>Your gallery is ready for photos.</p></div>}{index !== null && certificates[index] && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Gallery photo viewer" onClick={event => { if (event.target === event.currentTarget) setIndex(null) }}><button className="modal-close" onClick={() => setIndex(null)} aria-label="Close viewer"><X/></button><button className="lightbox-nav prev" onClick={() => step(-1)} aria-label="Previous photo"><ArrowLeft/></button><figure><img src={certificates[index].src} alt={certificates[index].caption}/><figcaption>{certificates[index].caption} <span>{index + 1} / {certificates.length}</span></figcaption></figure><button className="lightbox-nav next" onClick={() => step(1)} aria-label="Next photo"><ArrowRight/></button></div>}</section></main><Footer/></>
}

function Skills() {
  const { content: { skills } } = usePortfolio()
  const [selected, setSelected] = useState('All')
  const groups = selected === 'All' ? skills : skills.filter(group => group[0] === selected)
  return <section id="skills" className="section skills-section"><SectionTitle eyebrow="06 / TOOLKIT" title={'Tools I use to turn\nideas into reality.'}/><div className="skill-filter">{['All', ...skills.map(group => group[0])].map(category => <button onClick={() => setSelected(category)} className={selected === category ? 'active' : ''} key={category}>{category}</button>)}</div><div className="skill-groups">{groups.map((group, index) => <motion.div layout className="skill-group" key={group[0]}><div><span className="skill-index">{String(index + 1).padStart(2, '0')}</span><h3>{group[0]}</h3></div><div className="skill-tags">{group.slice(1).map(skill => <span key={skill}>{skill}</span>)}</div></motion.div>)}</div></section>
}

function ResumeSelector() {
  const { content: { resumes } } = usePortfolio()
  return <section id="resumes" className="resume-section"><div><p className="eyebrow">A USEFUL PDF</p><h2>Right work.<br/><em>Right version.</em></h2></div><div className="resume-options">{resumes.map(([label, file], index) => <a key={`${file}-${index}`} href={`/resumes/${file}`} target="_blank" rel="noreferrer" aria-label={`${label} resume PDF`}><span>{label} Resume</span><ArrowUpRight size={17}/></a>)}</div></section>
}

function Contact() {
  const { content: { profile } } = usePortfolio()
  const [copied, setCopied] = useState(false)
  const copy = async () => { try { await navigator.clipboard.writeText(profile.email); setCopied(true); window.setTimeout(() => setCopied(false), 1800) } catch { window.location.href = `mailto:${profile.email}` } }
  return <section id="contact" className="section contact-section"><p className="eyebrow">07 / YOUR TURN</p><h2>Have an interesting problem?<br/><em>Let’s build something.</em></h2><div className="contact-bottom"><div><span>EMAIL</span><a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}</a><button className="copy-button" onClick={copy}>{copied ? <Check size={15}/> : <Copy size={15}/>} {copied ? 'Copied' : 'Copy email'}</button></div><div className="contact-social"><span>ELSEWHERE</span>{profile.social.linkedin && <a href={profile.social.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={14}/></a>}{profile.social.github && <a href={profile.social.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14}/></a>}</div></div></section>
}

function Footer() {
  const { content: { profile } } = usePortfolio()
  const onGallery = window.location.pathname.replace(/\/$/, '') === '/gallery'
  return <footer className="footer"><a className="brand" href={onGallery ? '/' : '#home'}>{profile.name}</a><span>INDEPENDENTLY THINKING · INTENTIONALLY BUILDING</span><a href={onGallery ? '#gallery' : '#home'}>BACK TO TOP ↑</a><span>© {new Date().getFullYear()} {profile.name.toUpperCase()}</span><AdminPanel/></footer>
}

function AmbientBackground() { useEffect(() => { const handler = (event: MouseEvent) => { document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`); document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`) }; if (!matchMedia('(prefers-reduced-motion: reduce)').matches) window.addEventListener('pointermove', handler, { passive: true }); return () => window.removeEventListener('pointermove', handler) }, []); return <><div className="ambient"/><div className="noise"/></> }

function PortfolioPage() { return <><AmbientBackground/><Navbar/><main><Hero/><About/><Projects/><Experience/><Achievements/><Skills/><ResumeSelector/><Contact/></main><Footer/></> }

export default function App() { const onGallery = window.location.pathname.replace(/\/$/, '') === '/gallery'; return <PortfolioProvider>{onGallery ? <GalleryPage/> : <PortfolioPage/>}</PortfolioProvider> }
