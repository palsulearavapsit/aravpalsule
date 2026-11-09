import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import localCertificates from 'virtual:certificates'
import { defaultPortfolioContent, type PortfolioContent } from './portfolioContent'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

export type CertificateImage = { src: string; caption: string; path?: string }

type PortfolioContextValue = {
  content: PortfolioContent
  certificates: CertificateImage[]
  user: User | null
  configured: boolean
  saveContent: (next: PortfolioContent) => Promise<void>
  signIn: (identifier: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  uploadCertificates: (files: FileList | File[]) => Promise<void>
  deleteCertificate: (path: string) => Promise<void>
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null)
const storageBucket = 'portfolio-media'
const editorUsername = 'aravpalsule'
const editorEmail = 'palsulearav934@gmail.com'

function imageCaption(name: string) {
  return name.replace(/^[a-f0-9-]{6,}-/i, '').replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ')
}

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<PortfolioContent>(defaultPortfolioContent as unknown as PortfolioContent)
  const [remoteCertificates, setRemoteCertificates] = useState<CertificateImage[]>([])
  const [user, setUser] = useState<User | null>(null)

  const refreshCertificates = useCallback(async () => {
    if (!supabase) return
    const { data, error } = await supabase.storage.from(storageBucket).list('certificates', {
      limit: 200,
      sortBy: { column: 'name', order: 'asc' },
    })
    if (error) throw error
    const images = (data ?? [])
      .filter(file => file.name && /\.(jpe?g|png|webp)$/i.test(file.name))
      .map(file => {
        const path = `certificates/${file.name}`
        const { data: publicData } = supabase!.storage.from(storageBucket).getPublicUrl(path)
        return { src: publicData.publicUrl, caption: imageCaption(file.name), path }
      })
    setRemoteCertificates(images)
  }, [])

  useEffect(() => {
    if (!supabase) return
    let alive = true
    supabase.auth.getSession().then(({ data }) => {
      if (alive) setUser(data.session?.user ?? null)
    })
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    supabase.from('portfolio_content').select('content').eq('id', 'main').maybeSingle().then(({ data }) => {
      if (alive && data?.content && typeof data.content === 'object') {
        setContent({ ...defaultPortfolioContent, ...(data.content as Partial<PortfolioContent>) } as unknown as PortfolioContent)
      }
    })
    void refreshCertificates().catch(error => console.warn('Certificate storage is not ready yet.', error))
    return () => {
      alive = false
      authListener.subscription.unsubscribe()
    }
  }, [refreshCertificates])

  const saveContent = useCallback(async (next: PortfolioContent) => {
    if (!supabase) throw new Error('Supabase is not configured yet.')
    const { error } = await supabase.from('portfolio_content').upsert({ id: 'main', content: next })
    if (error) throw error
    setContent(next)
  }, [])

  const signIn = useCallback(async (identifier: string, password: string) => {
    if (!supabase) throw new Error('Add the Supabase URL and publishable key to connect this editor.')
    const value = identifier.trim()
    const email = value.toLowerCase() === editorUsername ? editorEmail : value
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    if (data.user.email?.toLowerCase() !== editorEmail) {
      await supabase.auth.signOut()
      throw new Error('This account does not have portfolio editor access.')
    }
  }, [])

  const signOut = useCallback(async () => {
    if (!supabase) return
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }, [])

  const uploadCertificates = useCallback(async (files: FileList | File[]) => {
    if (!supabase) throw new Error('Supabase is not configured yet.')
    const supported = Array.from(files).filter(file => /\.(jpe?g|png|webp)$/i.test(file.name))
    for (const file of supported) {
      const name = `${crypto.randomUUID()}-${file.name}`
      const { error } = await supabase.storage.from(storageBucket).upload(`certificates/${name}`, file, {
        contentType: file.type,
        upsert: false,
      })
      if (error) throw error
    }
    await refreshCertificates()
  }, [refreshCertificates])

  const deleteCertificate = useCallback(async (path: string) => {
    if (!supabase) throw new Error('Supabase is not configured yet.')
    const { error } = await supabase.storage.from(storageBucket).remove([path])
    if (error) throw error
    await refreshCertificates()
  }, [refreshCertificates])

  const value = useMemo<PortfolioContextValue>(() => ({
    content,
    certificates: [...localCertificates, ...remoteCertificates],
    user,
    configured: isSupabaseConfigured,
    saveContent,
    signIn,
    signOut,
    uploadCertificates,
    deleteCertificate,
  }), [content, remoteCertificates, user, saveContent, signIn, signOut, uploadCertificates, deleteCertificate])

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>
}

export function usePortfolio() {
  const value = useContext(PortfolioContext)
  if (!value) throw new Error('usePortfolio must be used inside PortfolioProvider')
  return value
}
