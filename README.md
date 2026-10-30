# iNext Digital — Website

A responsive, single-page digital agency website built with plain HTML, CSS and JavaScript. Designed for free hosting on GitHub Pages.

## Files

- `index.html` — page content, SEO metadata and structured data
- `style.css` — responsive visual design
- `script.js` — mobile navigation and current year
- `assets/` — favicon and social preview artwork

## Publish on GitHub Pages

1. Create a GitHub account with the username `inextdigital` (if available).
2. Create a **public** repository named exactly `inextdigital.github.io`.
3. Upload all files and folders from this package into the repository root.
4. In the repository, open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select branch `main` and folder `/ (root)`, then click **Save**.
7. Wait for deployment, then visit https://inextdigital.github.io/.

The first deployment can take several minutes.

## Add your existing logo

1. Prepare a transparent PNG or SVG version of your logo.
2. Upload it to the `assets` folder as `logo.png` (or `logo.svg`).
3. In `index.html`, replace the two text-based brand blocks (header and footer) with:

```html
<img class="brand-logo" src="assets/logo.png" alt="iNext Digital">
```

4. Add this CSS rule to `style.css`:

```css
.brand-logo {
  display: block;
  width: 165px;
  max-height: 48px;
  object-fit: contain;
}
```

If your logo is SVG, change the image path to `assets/logo.svg`.

## Before publishing

- Confirm that `inextdigital` is your actual GitHub username. GitHub Pages user-site repository names must match the username.
- Confirm the WhatsApp number and email are correct.
- Add your real social media profile URLs in the contact section when ready.
- Only retain the Akshara Interiors portfolio reference if you have permission to show the client name and work.
- Replace the illustrative portfolio graphic with an approved project image when available.
- Update the canonical website URL if you later connect a custom domain.
- Add Google Search Console after the site is live.

## Contact details currently configured

- WhatsApp: +91 93908 94695
- Email: the.businessdesk@outlook.com

## Notes

GitHub Pages hosts static files. It does not run PHP or provide a server-side database. WhatsApp and email links work without a backend. If you add a contact form later, connect a form provider or a separate backend.
