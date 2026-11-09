import { achievements } from './achievements'
import { projects } from './projects'
import { resumeFiles } from './resumes'
import { siteConfig } from './siteConfig'
import { skillGroups } from './skills'

export const contentSections = ['profile', 'hero', 'about', 'projects', 'experience', 'achievements', 'certificates', 'skills', 'leadership', 'resumes'] as const
export type ContentSection = (typeof contentSections)[number]

export const defaultPortfolioContent = {
  profile: {
    name: siteConfig.name,
    email: siteConfig.email,
    location: siteConfig.location,
    social: { ...siteConfig.social },
  },
  hero: {
    roles: ['AI ENGINEER', 'CREATIVE DEVELOPER', 'DATA SCIENCE STUDENT'],
    headline: ['Building intelligent things.', 'Designing what comes next.'],
    description: 'I build intelligent applications, explore emerging technologies, and turn complex ideas into useful digital experiences.',
    availability: 'OPEN TO OPPORTUNITIES',
    education: 'BE DATA SCIENCE · 2027',
    cgpa: '8.34 / 10',
    coordinates: ["19°12' N", "72°59' E"],
  },
  about: {
    title: 'Curious by nature.\nEngineer by mindset.',
    note: 'A little context behind the code.',
    lead: 'I’m Arav Palsule, a Data Science engineering student at A. P. Shah Institute of Technology.',
    paragraphs: [
      'My interests span artificial intelligence, machine learning, software engineering, and emerging technologies. I enjoy building end-to-end systems, experimenting with new tools, and solving problems through a combination of analytical thinking and engineering.',
      'I’m particularly interested in intelligent applications, agentic systems, and practical AI solutions that make complex things feel simple.',
    ],
    degree: 'B.E. Data Science',
    institute: 'A. P. Shah Institute of Technology',
    graduation: '2023 — 2027',
    city: 'Thane, Maharashtra, India',
    cgpa: '8.34 / 10',
  },
  projects,
  experience: [{
    date: 'SEP 2026 — OCT 2026',
    kind: 'AI INTERNSHIP',
    organization: 'ENNOBLE SOCIAL INNOVATION',
    role: 'AI Intern',
    introduction: 'Built applied AI prototypes and automations for practical business workflows.',
    responsibilities: [
      'Created custom Claude Skills with structured context engineering for business tasks, including PDF formatting to internal standards.',
      'Developed a focus-monitoring prototype using face detection and emotion analysis to estimate focus and flag potential sleep or inactivity events.',
      'Designed screenshot capture and HR reporting workflows, plus Zapier, LLM and API automations for repetitive operations.',
    ],
    tags: ['Claude Skills', 'Computer Vision', 'Zapier', 'LLMs'],
  }],
  achievements,
  certificates: [],
  skills: skillGroups,
  leadership: [
    { date: '2026', role: 'Founding President · Maths & Applied Science Club', description: 'Founded and led the club, organizing 25+ technical events to promote mathematics, science, and technical learning.' },
    { date: '2025 — 2026', role: 'Research Member · DSA Club', description: 'Explored LLMs, RAG, machine learning pipelines and software development; mentored junior members.' },
  ],
  resumes: resumeFiles,
} as const

type DeepMutable<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends readonly (infer Item)[]
        ? DeepMutable<Item>[]
        : T extends object
          ? { -readonly [Key in keyof T]: DeepMutable<T[Key]> }
          : T

export type PortfolioContent = DeepMutable<typeof defaultPortfolioContent>
