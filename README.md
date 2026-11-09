# Arav Palsule — Portfolio

A dark, editorial personal portfolio for Arav Palsule, built with React, Vite, TypeScript, Tailwind CSS, Framer Motion, and Lucide React. This is a static frontend application with no backend or environment variables.

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

## Certificates

Add JPG, JPEG, PNG, or WEBP certificate photographs to `public/certificates/`. A small Vite plugin indexes this static directory at build time and refreshes the dev page when files are added or removed. Filenames become the image captions. The folder intentionally starts empty; no sample certificates are included.

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
git remote add origin https://github.com/palsulearavapsit/dengue-prediction.git
git push -u origin main
```

## Deploy to Vercel

1. Import the GitHub repository into Vercel.
2. The included `vercel.json` selects Vite, uses `npm install` and `npm run build`, and serves `dist`.
3. Deploy. No environment variables or rewrite rules are required.

The repository includes a `.gitignore` for dependencies, build output, environment files, editor settings, and OS files.
