# Arav Palsule — Personal Portfolio

A responsive, frontend-first portfolio built with React, Vite, TypeScript, Tailwind CSS, Framer Motion, Lucide React, and Supabase. The site includes a project showcase, experience and achievements, skills, résumé links, contact details, and a photo Gallery.

## Features

- Animated, responsive portfolio with Home, About, Work, Experience, Achievements, Skills, Gallery, and Contact sections.
- Project cards with category filters, details, technology tags, and GitHub links.
- Separate `/gallery` page with a responsive masonry layout that preserves photo proportions and a full-screen viewer.
- Supabase Auth-protected portfolio editor. It can update portfolio content, add or remove projects and skills, and upload or remove Gallery photos.
- Supabase Storage for hosted Gallery photos. The public Gallery is read-only for visitors; uploads and removals require the editor account.
- Local image fallback: supported photos in `public/certificates/` are included in the build.
- Résumé PDFs served from `public/resumes/`.
- Vercel-ready configuration, including an SPA rewrite so direct visits to `/gallery` work.

## Requirements

- Node.js `20.19+` or `22.12+`
- npm
- A Supabase project for hosted Gallery uploads and the content editor

## Run locally

Install dependencies and start the Vite development server:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To build and preview the production bundle locally:

```bash
npm run build
npm run preview
```

The production files are written to `dist/`.

### Local Supabase environment

Create `.env.local` in the project root and add the project URL and publishable key:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

Restart the development server after changing environment variables. `.env.local` is ignored by Git. Never put a Supabase secret or service-role key in a `VITE_` variable or in this frontend.

## Supabase setup

1. Create a Supabase project.
2. In the Supabase Dashboard, open **Authentication → Users** and create the editor user with `palsulearav934@gmail.com`. Set the password in Supabase Auth; it is not stored in this repository. Disable public sign-ups if the project is only for this portfolio.
3. Open the Supabase SQL Editor and run [`supabase/schema.sql`](supabase/schema.sql). It creates the `portfolio_content` table, enables row-level security, adds owner-only write policies, and creates the public `portfolio-media` Storage bucket with owner-only upload and delete policies.
4. Add the Supabase URL and publishable key to `.env.local` for local work and to Vercel for deployment.

**The SQL file does not create the Auth user.** The site accepts the username `aravpalsule` and maps it to the editor email above. The policies in `supabase/schema.sql` and the login check in `src/data/PortfolioProvider.tsx` must refer to the same owner email. If you change the owner email, update it in both places and rerun the SQL policies.

The Supabase publishable key is intended for frontend use with the configured row-level security policies. Do not use a secret or service-role key in this app.

## Edit the portfolio and Gallery

Use the small **Login** button at the bottom of the site and sign in with the Supabase editor account. From the editor:

- Edit projects and skill categories with the structured controls.
- Update other portfolio sections in the JSON editor and save.
- Choose **Gallery photos** to drag and drop images or browse to select them. JPG, PNG, and WEBP are supported, up to 10 MB per photo.
- Remove hosted photos from the Gallery photos list.

Content is saved to Supabase and hosted photos are stored in Supabase Storage. Changes appear on the public site after saving or uploading. The password is entered into Supabase Auth at sign-in and is never stored in source code or environment files.

## Résumé files

The site links to these PDFs in `public/resumes/`:

- `Arav_Palsule_AI_ML_Resume.pdf`
- `Arav_Palsule_Data_Analyst_Resume.pdf`
- `Arav_Palsule_Software_Engineer_Resume.pdf`

Keep these filenames if replacing the PDFs, or update `src/data/resumes.ts` when changing them.

## Update profile links and default content

- Profile name, email, location, GitHub, and LinkedIn: [`src/data/siteConfig.ts`](src/data/siteConfig.ts)
- Default portfolio content and editor sections: [`src/data/portfolioContent.ts`](src/data/portfolioContent.ts)
- Project data: [`src/data/projects.ts`](src/data/projects.ts)
- Skills and achievements: files in `src/data/`
- Supabase schema and access policies: [`supabase/schema.sql`](supabase/schema.sql)

Once a section has been saved in Supabase, its stored content is used by the site. Update it through the editor or change the stored content in Supabase.

## Deploy to Vercel

1. Push this repository to GitHub and import it into Vercel.
2. Use the repository root (`./`) and the Vite framework preset. The checked-in `vercel.json` sets `npm install`, `npm run build`, and `dist` as the output directory.
3. In Vercel **Project Settings → Environment Variables**, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` with the values from Supabase. Select Production and Preview; add Development if using `vercel dev`.
4. Deploy or redeploy the `main` branch. New commits pushed to the connected repository trigger deployments.
5. Open the deployed site and verify the home page, `/gallery`, résumé links, and editor sign-in.

The rewrite in `vercel.json` serves the Vite entry page for client-side routes such as `/gallery`. Supabase must be configured separately; adding a Vercel Supabase integration is optional when the environment variables are already set manually.

## Troubleshooting

- **Invalid login credentials:** Confirm that the Auth user exists in Supabase under the configured owner email and that its password is current. Running `schema.sql` does not create this user.
- **Login/editor says Supabase is not configured:** Check that both `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are present in the local or Vercel environment, then restart or redeploy.
- **Gallery uploads fail:** Confirm `supabase/schema.sql` ran successfully and the authenticated account email matches the owner email in the policies.
- **A Vercel deployment is missing or outdated:** Check the Deployments page and confirm the latest code is on the connected `main` branch. Vercel builds from GitHub; Supabase setup does not deploy the frontend.

## GitHub repository

`https://github.com/palsulearavapsit/aravpalsule`
