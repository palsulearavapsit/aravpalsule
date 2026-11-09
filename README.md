# Arav Palsule — Portfolio

A dark, editorial personal portfolio for Arav Palsule, built with React, Vite, TypeScript, Tailwind CSS, Framer Motion, Lucide React, and Supabase Auth, Database, and Storage.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

Vite outputs the production site to `dist/`.

## Gallery

Open **Gallery** in the navigation to see a responsive masonry layout. Photos keep their natural proportions and the layout adjusts when new images are added. Sign in from the small **Login** button in the footer to drag and drop JPG, PNG, or WEBP photos, or select them from your device. You can also remove uploaded photos from the editor. Images are stored in the public `portfolio-media` Supabase Storage bucket, so additions and removals appear on the Gallery page. For local development without Supabase, files in `public/certificates/` appear after a Vite rebuild.

## Supabase setup

1. Create a Supabase project.
2. In **Authentication → Users**, create the portfolio editor account using the portfolio email address. Use a fresh password set in Supabase; passwords are never stored in this repository. Disable public sign-ups for this project.
3. Run [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL Editor. It creates the public content document, row-level security rules, and the gallery image bucket. Only the matching owner email can write content or upload/delete images.
4. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` plus `VITE_SUPABASE_PUBLISHABLE_KEY` from the Supabase project settings. Never use a service-role key in this frontend.
5. Add those same two variables to Vercel's Production, Preview, and Development environments, then redeploy.

The footer's **Login** button opens the editor sign-in form. It accepts `aravpalsule` or the Supabase account email. The editor stores portfolio sections in Supabase; edit a section, add or remove entries, and save. Gallery photos upload directly to Supabase Storage. The password is entered in the sign-in form and is not stored in this repository or in Vite environment variables.

## Resumes

Replace or add these PDFs in `public/resumes/`:

- `Arav_Palsule_AI_ML_Resume.pdf`
- `Arav_Palsule_Data_Analyst_Resume.pdf`
- `Arav_Palsule_Software_Engineer_Resume.pdf`

The resume links open the matching file in a new tab. Keep the names unchanged or update `src/App.tsx`.

## Social profiles

Edit `src/data/siteConfig.ts` to add LinkedIn and GitHub URLs. Social links remain hidden until configured.

## GitHub setup

Create an empty repository on GitHub, then from this folder run:

```bash
git init
git add .
git commit -m "Build Arav Palsule portfolio"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_PORTFOLIO_REPOSITORY.git
git push -u origin main
```

## Deploy to Vercel

1. Import the GitHub repository into Vercel.
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in Vercel Project Settings if you want the login editor and hosted photo gallery enabled.
3. The included `vercel.json` selects Vite, uses `npm install` and `npm run build`, serves `dist`, and rewrites app routes such as `/gallery` to the Vite entry page.
4. Deploy.

The repository includes a `.gitignore` for dependencies, build output, environment files, editor settings, and OS files. `.env.local` stays private and must not be committed.
