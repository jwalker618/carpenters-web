# AVM Timber Design — website

This is the code behind the AVM Timber Design website. You don't need to be
a programmer to keep it up to date. This guide covers the everyday jobs:
adding projects, editing the About page, changing your contact details, and
how the site goes live.

If anything here is unclear, that's a fault in the guide — ask whoever set
this up to explain it.

---

## How the site is organised

Everything you'll ever need to edit lives in a few places:

| What you want to change          | Where it lives                       |
| -------------------------------- | ------------------------------------ |
| A project (photos, description)  | `src/content/projects/` (one file per project) |
| Project photos                   | `src/assets/projects/`               |
| Your name, email, phone, socials | `src/site.ts`                        |
| The About page wording           | `src/pages/about.astro`              |
| The hero photo / your portrait   | `src/assets/`                        |

You can edit these two ways: directly (editing files on GitHub) or with the
**`/admin` editor**, which is a friendlier point-and-click screen. Both do
the same thing — they save changes to GitHub, and the site rebuilds itself.

---

## Adding a new project

The easiest way is to **copy an existing project and change it**.

1. Go to the `src/content/projects/` folder. You'll see three files, like
   `walnut-dining-table.md`. These are your templates.
2. Make a copy and give it a clear name, all lowercase with dashes instead
   of spaces — e.g. `cherry-coffee-table.md`. **The file name becomes the
   web address of the project**, so keep it tidy.
3. Open your new file. The part between the two `---` lines is the project's
   information. Fill it in:

   - `title` — the project's name.
   - `date` — when it was finished, written as `YYYY-MM-DD`.
   - `category` — one of: `tables`, `chairs`, `cabinetry`, `custom`,
     `restoration`.
   - `materials` — a list; keep one item per line with a `- ` in front.
   - `description` — one short sentence, used on the grid cards.
   - `coverImage` — the main photo (see "Adding photos" below).
   - `gallery` — the other photos, one per line.
   - `featured` — `true` to show it on the home page, `false` to leave it
     off.
   - `testimonial` — optional. Delete these lines if there's no quote.

4. Everything **below** the second `---` is the long description shown on
   the project's own page. Write as much as you like in plain paragraphs.
5. Save the file. Commit the change (if editing on GitHub, that's the green
   "Commit changes" button). The site updates itself within a couple of
   minutes.

### Adding photos

1. Put your photo files in `src/assets/projects/`.
2. Refer to them in the project file with `../../assets/projects/` in front
   of the file name — copy how the example files do it.
3. You can upload full-size photos straight from your camera or phone. The
   site automatically shrinks them and serves fast, modern versions — you
   don't need to resize anything yourself.

---

## Using the `/admin` editor (the point-and-click option)

Instead of editing files, you can go to **yoursite.com/admin** and edit
projects through a form: type in the boxes, drag photos in, hit Publish.

**One-time setup before this works.** Because the site is hosted on
Cloudflare Pages, the editor needs a small "login helper" so it can sign you
in with your GitHub account. This is a setup job for whoever manages the
site — once. The steps:

1. In GitHub: **Settings → Developer settings → OAuth Apps → New OAuth App**.
   For the callback URL, use the helper's address from step 2.
2. Deploy an OAuth helper. The simplest is the community Cloudflare Worker
   for Decap CMS — search "Decap CMS GitHub OAuth Cloudflare Worker". Paste
   in the GitHub app's Client ID and Secret.
3. In `public/admin/config.yml`, uncomment the `base_url:` line and set it
   to the helper's address.

After that, anyone you've given access to the GitHub repository can log into
`/admin` and edit the site. Until it's set up, the `/admin` page will load
but the login won't finish — editing files directly always works regardless.

---

## Editing the About page

Open `src/pages/about.astro`. Near the top you'll find your story written in
plain paragraphs (look for the lines wrapped in `<p>` ... `</p>`). Change the
wording between those tags. Further down are the three "Honest joinery /
Local materials / Hand finishes" blurbs — edit those the same way.

To change your portrait photo, replace `src/assets/about-portrait.jpg` with
a new photo of the same name.

---

## Updating your contact info

Open `src/site.ts`. Change the values in quotes:

- `name`, `carpenterName`, `tagline`
- `email`, `phone`, `workshopLocation`
- `web3formsAccessKey` — see below
- `social` — paste in your Instagram / Facebook / Pinterest links. Leave a
  link as empty quotes `''` to hide it.

Save and commit. These values update across the whole site at once.

### Making the contact form work

The contact form uses a free service called **Web3Forms**. Go to
[web3forms.com](https://web3forms.com), enter your email, and they'll give
you an "access key". Paste that key into `web3formsAccessKey` in
`src/site.ts`. Form messages will then arrive in your inbox. Until you do
this, the form won't send.

---

## How the site goes live (deployment)

The site is hosted free on **Cloudflare Pages**. The rule is simple:

> **Anything committed to the `main` branch goes live automatically**, usually
> within a couple of minutes.

You don't run anything or press a "deploy" button — saving a change to
GitHub is the deploy.

### First-time hosting setup (done once)

1. Sign in at [Cloudflare](https://dash.cloudflare.com) → **Workers & Pages**
   → **Create** → **Import a repository**, and pick this repository.
2. Set the build settings:
   - **Build command:** `npm run build`
   - **Deploy command:** `npx wrangler deploy` (Cloudflare's default)
   - **Environment variable:** add `NODE_VERSION` = `22`
3. Click **Save and Deploy**. Cloudflare gives you a free
   `…workers.dev` address. You can add your own domain name later under the
   project's **Domains & Routes** tab.

(The `wrangler.toml` file in this project already tells Cloudflare to upload
the built `dist/` folder — you don't need to touch it.)

---

## Running the site on your own computer (optional)

Only needed if you want to preview big changes before they go live.

```sh
npm install      # first time only
npm run dev      # then open the address it prints, e.g. http://localhost:4321
```

Press `Ctrl+C` to stop it.

---

## A note for developers

- **Astro 6** (static output) + **Tailwind CSS v4** (via `@tailwindcss/postcss`).
- Content is the `projects` collection defined in `src/content.config.ts`
  (Astro 6 requires this filename — the original brief said
  `src/content/config.ts`, which Astro 6 no longer supports).
- Project photos use Astro's `<Image>` component for responsive WebP.
- `/admin` is Decap CMS with the GitHub backend (Git Gateway is Netlify-only;
  this site targets Cloudflare Pages).
- `src/pages/shop.astro` is a stub for a future Snipcart storefront — wiring
  instructions are in a comment at the top of that file.
- `scripts/generate-placeholders.mjs` regenerates the placeholder photos.
