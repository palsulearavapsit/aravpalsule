import { useEffect, useState, type ChangeEvent, type DragEvent, type FormEvent } from 'react'
import { ArrowUpRight, ImagePlus, LoaderCircle, LockKeyhole, LogOut, Plus, Trash2, X } from 'lucide-react'
import { contentSections, type ContentSection, type PortfolioContent } from '../data/portfolioContent'
import type { Project } from '../data/projects'
import { usePortfolio } from '../data/PortfolioProvider'
import './admin.css'

const sectionLabels: Record<ContentSection, string> = {
  profile: 'Profile & links',
  hero: 'Home / hero',
  about: 'About',
  projects: 'Projects',
  experience: 'Experience',
  achievements: 'Achievements',
  certificates: 'Gallery photos',
  skills: 'Skills',
  leadership: 'Leadership',
  resumes: 'Resumes',
}

function readArray<T>(draft: string, fallback: T[]): T[] {
  try { const value: unknown = JSON.parse(draft); return Array.isArray(value) ? value as T[] : fallback }
  catch { return fallback }
}

function ProjectEditor({ items, onChange }: { items: Project[]; onChange: (items: Project[]) => void }) {
  const update = (index: number, key: keyof Project, value: unknown) => onChange(items.map((project, itemIndex) => itemIndex === index ? { ...project, [key]: value } : project))
  const remove = (index: number) => onChange(items.filter((_, itemIndex) => itemIndex !== index))
  const add = () => onChange([...items, { number: String(items.length + 1).padStart(2, '0'), title: '', category: 'New category', description: '', details: '', tags: [], art: 'routes', githubLinks: [] }])
  return <div className="admin-structured"><p className="admin-help">Add or remove projects and edit their titles, descriptions, technology tags, and repository links.</p>{items.map((project, index) => <article className="admin-project-card" key={`${project.number}-${index}`}><div className="admin-project-heading"><span>PROJECT {project.number}</span><button type="button" onClick={() => remove(index)} aria-label={`Remove project ${project.title || project.number}`}><Trash2 size={15}/></button></div><div className="admin-field-grid"><label>Project title<input value={project.title} onChange={event => update(index, 'title', event.target.value)}/></label><label>Category<input value={project.category} onChange={event => update(index, 'category', event.target.value)}/></label><label>Visual style<select value={project.art} onChange={event => update(index, 'art', event.target.value)}>{['routes', 'crack', 'forecast', 'cinerec', 'sphere', 'review'].map(style => <option key={style} value={style}>{style}</option>)}</select></label><label>Technology tags<input value={project.tags.join(', ')} onChange={event => update(index, 'tags', event.target.value.split(',').map(tag => tag.trim()).filter(Boolean))}/></label></div><label className="admin-full-field">Short description<textarea value={project.description} onChange={event => update(index, 'description', event.target.value)}/></label><label className="admin-full-field">Project details<textarea value={project.details} onChange={event => update(index, 'details', event.target.value)}/></label><label className="admin-full-field">Repository links <small>One per line: label | https://github.com/…</small><textarea value={(project.githubLinks ?? []).map(link => `${link.label} | ${link.url}`).join('\n')} onChange={event => update(index, 'githubLinks', event.target.value.split('\n').map(line => { const [label, url] = line.split('|').map(part => part.trim()); return label && url ? { label, url } : null }).filter((link): link is { label: string; url: string } => link !== null))}/></label></article>)}<button className="admin-add-button" type="button" onClick={add}><Plus size={15}/> Add project</button></div>
}

function SkillsEditor({ groups, onChange }: { groups: string[][]; onChange: (groups: string[][]) => void }) {
  const update = (index: number, group: string[]) => onChange(groups.map((item, itemIndex) => itemIndex === index ? group : item))
  return <div className="admin-structured"><p className="admin-help">Change category names, edit skill lists, add a skill by typing it after a comma, or remove a category.</p>{groups.map((group, index) => <article className="admin-skill-card" key={`${group[0]}-${index}`}><label>Category<input value={group[0] ?? ''} onChange={event => update(index, [event.target.value, ...group.slice(1)])}/></label><label>Skills, separated by commas<input value={group.slice(1).join(', ')} onChange={event => update(index, [group[0] ?? '', ...event.target.value.split(',').map(skill => skill.trim()).filter(Boolean)])}/></label><button type="button" onClick={() => onChange(groups.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Remove ${group[0]} category`}><Trash2 size={14}/> Remove category</button></article>)}<button className="admin-add-button" type="button" onClick={() => onChange([...groups, ['New category', 'New skill']])}><Plus size={15}/> Add skill category</button></div>
}

export function AdminPanel() {
  const { content, certificates, user, configured, signIn, signOut, saveContent, uploadCertificates, deleteCertificate } = usePortfolio()
  const [open, setOpen] = useState(false)
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [activeSection, setActiveSection] = useState<ContentSection>('projects')
  const [draft, setDraft] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    if (!open || !user) return
    setDraft(JSON.stringify(content[activeSection], null, 2))
  }, [open, user, activeSection, content])

  useEffect(() => {
    if (!open) return
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', closeOnEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', closeOnEscape)
      document.body.style.overflow = ''
    }
  }, [open])

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true); setError(''); setMessage('')
    try { await signIn(identifier, password); setPassword(''); setMessage('Signed in. Portfolio edits are ready.') }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Sign-in failed.') }
    finally { setBusy(false) }
  }

  const handleSave = async () => {
    setBusy(true); setError(''); setMessage('')
    try {
      const parsed: unknown = JSON.parse(draft)
      if (['projects', 'skills', 'achievements', 'experience', 'leadership', 'resumes'].includes(activeSection) && !Array.isArray(parsed)) throw new Error('This section must be a JSON list.')
      if (activeSection === 'projects' && (parsed as Project[]).some(project => !project.title || !project.category)) throw new Error('Every project needs a title and category.')
      const next = { ...content, [activeSection]: parsed } as PortfolioContent
      await saveContent(next)
      setMessage(`${sectionLabels[activeSection]} saved.`)
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not save these changes.') }
    finally { setBusy(false) }
  }

  const uploadFiles = async (files: FileList | File[]) => {
    if (!files.length) return
    const selected = Array.from(files)
    if (selected.some(file => !/\.(jpe?g|png|webp)$/i.test(file.name))) {
      setError('Use JPG, PNG, or WEBP images.')
      return
    }
    if (selected.some(file => file.size > 10 * 1024 * 1024)) {
      setError('Each photo must be 10 MB or smaller.')
      return
    }
    setBusy(true); setError(''); setMessage('')
    try { await uploadCertificates(files); setMessage('Photos added to the Gallery.') }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Photo upload failed.') }
    finally { setBusy(false) }
  }

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget
    const files = input.files
    if (files?.length) void uploadFiles(files).finally(() => { input.value = '' })
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragging(false)
    if (event.dataTransfer.files.length) void uploadFiles(event.dataTransfer.files)
  }

  const handleDelete = async (path: string) => {
    setBusy(true); setError(''); setMessage('')
    try { await deleteCertificate(path); setMessage('Gallery photo removed.') }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not remove that photo.') }
    finally { setBusy(false) }
  }

  return <>
    <button className="admin-trigger" onClick={() => { setOpen(true); setError(''); setMessage('') }}><LockKeyhole size={13}/> Login</button>
    {open && <div className="admin-overlay" onMouseDown={event => { if (event.target === event.currentTarget) setOpen(false) }}>
      <section className="admin-panel" role="dialog" aria-modal="true" aria-labelledby="admin-title">
        <header className="admin-header"><div><p className="eyebrow">PORTFOLIO CONTROL</p><h2 id="admin-title">Manage your site</h2></div><button className="modal-close" onClick={() => setOpen(false)} aria-label="Close editor"><X/></button></header>
        {!configured ? <div className="admin-notice"><h3>Connect Supabase to continue</h3><p>Add your Supabase project URL and publishable key to <code>.env.local</code>, then add the same values to Vercel environment variables. Run the setup SQL from <code>supabase/schema.sql</code> and create your editor user in Supabase Auth.</p></div> : !user ? <form className="admin-login" onSubmit={handleSignIn}>
          <p>Sign in with the portfolio editor account configured in Supabase Auth.</p>
          <label>Username or email<input autoComplete="username" value={identifier} onChange={event => setIdentifier(event.target.value)} required/></label>
          <label>Password<input type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required/></label>
          <button className="button button-lime" disabled={busy}>{busy ? <LoaderCircle className="spin" size={15}/> : <LockKeyhole size={15}/>} Sign in</button>
        </form> : <>
          <div className="admin-toolbar"><span>Signed in as {user.email}</span><button onClick={() => { void signOut(); setMessage('Signed out.') }}><LogOut size={14}/> Sign out</button></div>
          <div className="admin-editor"><label className="admin-section-select">EDIT SECTION<select value={activeSection} onChange={event => setActiveSection(event.target.value as ContentSection)}>{contentSections.map(section => <option value={section} key={section}>{sectionLabels[section]}</option>)}</select></label>
            {activeSection === 'certificates' ? <div className="admin-media"><div className={`upload-dropzone ${dragging ? 'is-dragging' : ''}`} onDragEnter={event => { event.preventDefault(); setDragging(true) }} onDragOver={event => event.preventDefault()} onDragLeave={event => { event.preventDefault(); if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false) }} onDrop={handleDrop}><ImagePlus size={20}/><strong>Drop photos to add them to your Gallery</strong><span>JPG, PNG or WEBP · up to 10 MB each</span><label className="upload-control">Browse photos<input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleUpload} disabled={busy}/></label></div><div className="admin-media-grid">{certificates.map(image => <figure key={image.src}><img src={image.src} alt={image.caption}/><figcaption>{image.caption}{image.path && <button onClick={() => void handleDelete(image.path!)} aria-label={`Remove ${image.caption}`}><Trash2 size={14}/></button>}</figcaption></figure>)}</div>{certificates.length === 0 && <p className="admin-help">Your Gallery is empty. Add your first photo above.</p>}</div> : <>
              {activeSection === 'projects' ? <ProjectEditor items={readArray<Project>(draft, content.projects)} onChange={items => setDraft(JSON.stringify(items, null, 2))}/> : activeSection === 'skills' ? <SkillsEditor groups={readArray<string[]>(draft, content.skills)} onChange={groups => setDraft(JSON.stringify(groups, null, 2))}/> : <><p className="admin-help">Edit this section as JSON. Add, remove, or change entries, then save. The public portfolio updates as soon as the save succeeds.</p><textarea className="admin-json" spellCheck={false} aria-label={`${sectionLabels[activeSection]} JSON`} value={draft} onChange={event => setDraft(event.target.value)}/></>}
              <button className="button button-lime admin-save" disabled={busy} onClick={() => void handleSave()}>{busy && <LoaderCircle className="spin" size={15}/>} Save changes <ArrowUpRight size={15}/></button>
            </>}
          </div>
        </>}
        {message && <p className="admin-message" role="status">{message}</p>}{error && <p className="admin-error" role="alert">{error}</p>}
      </section>
    </div>}
  </>
}
