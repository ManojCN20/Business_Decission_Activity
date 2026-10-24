MILLENIAL EVENTS
A React presentation app for Manoj's founders meetup session

WHAT IS INCLUDED
The app now opens with a simple business decision talk:
11 connected slides, customer feedback, an illustrative profit improvement,
three audience choices, and 5-, 7- or 10-minute timing.
Default: 7 minutes. The only control needed while presenting is Next.
The rehearsal view includes a speaking script and a specific action per slide.
Use Present to audience to hide that script from the projector.
Print public/simple-speaking-guide.html to keep the script beside you.
The original three-activity workshop remains available through the link below
the simple talk's speaker notes.
The short talk now includes all eight complaint messages, the 5/2/1 analysis,
a courier and packaging change, a reconciled direct-cost breakdown and a
final business comparison. BrewBox gross profit changes from Rs 50,000 to
Rs 3 lakh at constant sales in a clearly labelled fictional scenario.

ORIGINAL WORKSHOP
15 connected slides with a full 25-minute speaking script.
A 10-minute route through all three activities.
Activity 1: Would You Back This Business? Host-recorded votes and cost reveal.
Activity 2: Guess the Customer Complaint. Eight comments, a guess and answer key.
Activity 3: AI Opportunity Clinic. Four prepared tasks, a custom task and a calculator.
Presentation mode, per-slide timers, speaker notes, local saving and JSON export.
Complete printable facilitator guide and participant cards in public/.

RUN LOCALLY
Install Node.js 22.12 or newer.
Open this folder in a terminal and run:
  npm install
  npm run dev
Open the localhost URL printed by Vite. If the default port is occupied, Vite
uses the next free port. There is no backend to start.

BUILD
  npm run build
This also regenerates the printable materials from src/session.js.
  npm run preview
Preview serves the production files in dist/.
  npm run check
Runs the content and calculation checks.

NETLIFY
Option A: connect the contents of this folder as a Git repository.
Build command: npm run build
Publish directory: dist
The included netlify.toml sets these values and pins Node 22.
If the app is inside a larger repository, set Netlify's base directory to
the app folder containing package.json and netlify.toml.

Option B: run npm run build and upload the CONTENTS of dist/ to Netlify's
manual deploy interface. The supplied Netlify ZIP contains those built files
at its root. Do not upload the React source as a static manual deploy.

Netlify's Vite instructions:
https://docs.netlify.com/build/frameworks/framework-setup-guides/vite/

PRESENTING
Choose 25 min or 10 min in the top bar.
Change the presenter name in Settings.
Open Speaker notes in rehearsal. Present hides the notes and sidebar.
Use the separate browser full-screen button if desired.
The timer is per slide, starts manually and resets when the slide changes.
Use the on-screen plus/minus buttons to tally raised hands. There is no
remote audience polling or synchronisation across devices.

Keyboard: Right/Space next, Left previous, T timer, P presentation,
F full screen, N rehearsal notes, O overview, ? controls, Esc exit.
Shortcuts pause while typing or focusing a control.

WORKSHOP MATERIALS
public/facilitator-guide.html: complete script, running order, answer keys,
example bank and common questions. Open it in a browser and print/save PDF.
public/activity-cards.html: printable participant pages covering all three
activities and the final networking exercise. Contains no reveal answers.
Both pages also work as standalone local HTML files.

EDITING CONTENT
src/session.js contains the full script, messages, preset plans and route timing.
src/App.jsx contains the slide layouts and interactions.
src/styles.css contains the responsive design.
Run npm run materials after changing the script during development.
The production build runs this step automatically.

OFFLINE USE
The production build includes a service worker that caches the app and printed
materials. Open the deployed app online and wait for “Offline ready” before
the event. Then it can run without a live connection in that same browser.
Offline support needs HTTPS or localhost and browser storage permission.
Private browsing or clearing site data can remove the cache.
The development server intentionally does not install a service worker.
The built index.html needs a web server; do not open it using file://.

DATA AND AI
No backend, database, analytics, external fonts or AI API calls are used.
Workshop state stays in localStorage on that browser. Settings includes an
export button and a reset button. Export before resetting if needed.
AI Opportunity Clinic is a deterministic planning worksheet, clearly labelled
in the interface. It does not generate live AI responses.
The businesses, customer comments, financial numbers and calculator defaults
are fictional. Estimates of released staff capacity are not guaranteed cash
savings. Pilot time should include human review. Setup effort is additional.

IMAGES AND FINAL SLIDE
The opening and final slide use photos from the organiser's website.
The operational-change slide uses an AI-generated coffee-packaging image.
All images are stored locally in public/images/ and cached for offline use.
The final slide explains the connection in both directions: businesses meet
potential investors and investors meet founders to explore opportunities.
Image sources and the generation prompt are in public/image-credits.txt.
