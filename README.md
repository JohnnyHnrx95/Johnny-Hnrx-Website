# Johnny Hnrx — one-page photography portfolio

Static site: three files plus assets. No build step, no framework, no dependencies to install.
Deploys free on GitHub Pages with a custom domain.

```
johnny-portfolio/
├── index.html            all page content
├── styles.css            all styling and responsive rules
├── script.js             nav, scroll reveal, lightbox, form
├── CNAME                 your custom domain (edit before pushing)
├── .nojekyll             stops GitHub Pages running Jekyll
├── .gitignore
└── assets/
    ├── icons/favicon.svg
    └── images/           placeholders to replace with your photos
```

---

## 1. Open in Visual Studio Code

1. Open VS Code, then `File > Open Folder` and select `johnny-portfolio`.
2. Install the extension **Live Server** (author: Ritwick Dey).
3. Right-click `index.html` > `Open with Live Server`. The site opens at `http://127.0.0.1:5500` and reloads on save.

Optional extensions: **Prettier** (formats HTML/CSS/JS on save), **Image preview**.

---

## 2. Replace the placeholder images

Placeholders are grey SVG files sized to match the layout. Swap in your own files:

1. Export each photo as JPG or WebP, longest edge 1600–2000px, quality 80. Aim under 400KB per file.
2. Save them into `assets/images/`.
3. In `index.html`, change each `src="/assets/images/placeholder-01.svg"` to your filename, for example `src="/assets/images/lisbon-bar-table.jpg"`.
4. Rewrite each `alt` attribute to describe the photo. Alt text drives image search and screen readers.
5. Replace `avatar.svg` with a square headshot (400x400px is plenty) and `og-image.jpg` with a 1200x630px share image.

Add or remove gallery items by copying or deleting a whole `<figure class="gallery__item reveal">` block. The masonry columns reflow automatically.

The gallery uses CSS `column-count`, which fills top to bottom in each column. Order on screen therefore differs from source order. To control exact placement, switch `.gallery` to CSS grid.

---

## 3. Make the contact form work

GitHub Pages serves static files only, so it cannot send email on its own. The form posts to Formspree (free tier: 50 submissions per month, verified on their pricing page — check current limits before you rely on it).

1. Sign up at formspree.io and create a form.
2. Copy the form ID from the endpoint they give you.
3. In `index.html`, replace `YOUR_FORM_ID` in the form `action`.
4. In `script.js`, replace `hello@yourdomain.com` in the error message with your real address.

Alternatives: Netlify Forms (requires hosting on Netlify), Getform, Basin, or replace the form with a `mailto:` link.

---

## 4. Update the rest of the placeholders

| What | Where |
| --- | --- |
| Instagram URL | `index.html`, `href="https://instagram.com/yourhandle"` |
| Page title and meta description | `index.html`, `<head>` |
| Bio and service copy | `index.html`, `.intro__bio` and `.service` blocks |
| Colours, fonts, spacing | `styles.css`, `:root` variables at the top |
| Display typeface | `index.html` Google Fonts link plus `--font-display` in `styles.css` |

The screenshot font was not identified. Poppins 700 is the closest free match. To try others, swap the Google Fonts URL for Outfit, Figtree or Nunito and update `--font-display`.

---

## 5. Push to GitHub

```bash
cd johnny-portfolio
git init
git add .
git commit -m "Add portfolio site"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

The repository must be public for GitHub Pages on a free account.

---

## 6. Turn on GitHub Pages

1. Repository > `Settings` > `Pages`.
2. Source: `Deploy from a branch`.
3. Branch: `main`, folder: `/ (root)`. Save.
4. Wait one to two minutes. The site appears at `https://YOUR-USERNAME.github.io/YOUR-REPO/`.

---

## 7. Point your domain at it

Order matters. Add the domain in GitHub first, then change DNS, or you risk a takeover window on the hostname.

1. In `Settings > Pages > Custom domain`, enter your domain and save. GitHub writes or updates the `CNAME` file in the repo.
2. At your DNS provider, for an apex domain (`yourdomain.com`) create four A records, host `@`:

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

Optionally add AAAA records for IPv6, host `@`:

```
2606:50c0:8000::153
2606:50c0:8001::153
2606:50c0:8002::153
2606:50c0:8003::153
```

3. For `www`, add a CNAME record: host `www`, value `YOUR-USERNAME.github.io`.
4. Delete any existing A, CNAME or parking records for `@` and `www` from the provider's defaults.
5. Back in `Settings > Pages`, tick `Enforce HTTPS` once the certificate is issued. That can take up to 24 hours after DNS propagates.

Verify the current IP list against GitHub's own documentation before you save; these values were correct at the time of writing but GitHub has changed them before.

Check propagation:

```bash
dig yourdomain.com +noall +answer -t A
```

---

## 8. Editing after launch

```bash
git add .
git commit -m "Update portfolio images"
git push
```

Pages rebuilds within a minute or two. Hard-refresh (`Cmd+Shift+R` / `Ctrl+Shift+R`) if the browser caches the old CSS.

---

## Built in

- Sticky header, hamburger menu below 900px
- Masonry gallery, 3 columns > 2 columns > 1 column
- Click or keyboard-activate any photo to open a lightbox; arrow keys navigate, Escape closes
- Fade-up on scroll, disabled under `prefers-reduced-motion`
- Client-side form validation with an inline status message
- Skip link, visible focus rings, lazy-loaded images
