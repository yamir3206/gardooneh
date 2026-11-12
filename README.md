# Lucky Draw

A colorful, browser-only random name picker. Add names one at a time or paste one per line, then spin. Edit entries with the pencil and remove them with ×. Each duplicate is a separate entry. Names and the last ten winners are stored locally in your browser when storage is available. Reset wheel returns the wheel to its initial orientation; clear all removes participants.

## Privacy

Names and winners stay in your browser; no names are sent to a server. Empty lines are ignored during bulk import, and other characters are preserved. Sound is synthesized locally and can be muted.

## Run locally

No build or dependencies are required. Serve the repository with any static server, for example `python3 -m http.server 8000`, then open `http://localhost:8000`. The optional Google Fonts stylesheet falls back to system fonts if offline. Sound is synthesized locally and can be muted.

Run the automated selection and wheel geometry tests with `npm test` (requires Node.js). No packages need to be installed.

## Deploy to GitHub Pages

1. Push the complete repository to GitHub.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Choose the branch containing the site (typically `main`) and the **/ (root)** folder, then click **Save**.
5. Wait for Pages to publish and open the URL shown in Settings. All asset paths are relative, so the site works at `https://<username>.github.io/<repository>/` as well as at a domain root.

## Architecture

`selection.js` owns eligibility and random selection; `participants.js` handles space-preserving input; `wheel.js` draws the canvas and computes the landing angle; `history.js` handles local history; and `app.js` coordinates the interface and animation. The fixed pointer and the selected segment share the same angular coordinate system.

## Install on a phone

Once the HTTPS GitHub Pages site has loaded, Android users can tap **نصب برنامه** when their browser offers installation (or use the browser's install/add-to-home-screen menu). On iPhone, open the site in Safari, tap Share, then **Add to Home Screen**. The app caches its core files for offline use after the first visit; names and history remain on that device.
