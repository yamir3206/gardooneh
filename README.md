# Lucky Draw

A colorful, browser-only random name picker. Add names one at a time or paste one per line, then spin. Edit entries with the pencil and remove them with ×. A middle dot in the list represents a boundary space; the edit field retains the original text. Each duplicate is a separate entry. Names and the last ten winners are stored locally in your browser when storage is available. Reset wheel returns the wheel to its initial orientation; clear all removes participants.

## Selection and privacy

Selection uses the original, unmodified strings. Entries starting with a regular space are excluded; among the remaining entries, those ending in a regular space take priority. Otherwise all eligible entries are in the draw. A name with both is excluded. The list marks excluded and priority entries. Empty lines are ignored during bulk import; all other characters, including spaces and Unicode, are preserved. The selection uses `crypto.getRandomValues` with rejection sampling when available, falling back to `Math.random` in environments without Web Crypto. No names are sent to a server.

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
