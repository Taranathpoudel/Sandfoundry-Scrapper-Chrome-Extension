# Sanfoundry MCQ Scraper

<p align="center">
  <img src="./images/icon128.png" alt="Sanfoundry MCQ Scraper" width="96"/>
</p>

<p align="center">
  A Chrome extension that extracts MCQs from Sanfoundry pages and bulk downloads them as a clean JSON file.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Manifest-V3-blue?style=flat-square"/>
  <img src="https://img.shields.io/badge/Chrome-Extension-yellow?style=flat-square&logo=googlechrome"/>
  <img src="https://img.shields.io/badge/Version-2.1-green?style=flat-square"/>
</p>

---

## Table of Contents

- [Features](#features)
- [File Structure](#file-structure)
- [Installation](#installation)
- [How to Use](#how-to-use)
  - [Auto Mode](#auto-mode)
  - [Manual Mode](#manual-mode)
  - [Bulk Download](#bulk-download)
  - [Undo Last Page](#undo-last-page)
- [Output Format](#output-format)
- [Notes & Limitations](#notes--limitations)
- [License](#license)

---

## Features

- **Floating on-page widget** — appears on every Sanfoundry page automatically, no need to open the extension popup
- **Auto / Manual toggle** — flip between auto-processing (scrapes the page the moment you land on it) and manual (you decide when to scrape)
- **Multi-page accumulation** — navigate across as many pages as you want, data keeps stacking up in memory
- **Bulk download** — download everything collected across all pages in one timestamped JSON file
- **Undo last page** — made a mistake? Remove the last page's worth of questions in one click
- **Draggable & minimizable widget** — move it anywhere on screen or collapse it out of the way
- **Clean JSON output** — every question includes its ID, question text, options, answer key, and explanation

---

## File Structure

```
sanfoundry-mcq-scraper/
├── manifest.json       # Extension config (MV3)
├── background.js       # Service worker — stores data, handles downloads
├── content.js          # Injected into Sanfoundry pages — widget + scraper
├── popup.html          # Extension popup UI (fallback)
├── popup.js            # Popup logic
├── images/
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

---

## Installation

> No store listing — load it manually in Developer Mode.

1. **Download or clone** this repository to your machine.

2. Open Chrome and navigate to:
   ```
   chrome://extensions/
   ```

3. Enable **Developer mode** using the toggle in the top-right corner.

4. Click **Load unpacked** and select the folder containing the extension files (the one with `manifest.json` in it).

5. The extension is now installed. You'll see its icon in the Chrome toolbar.

---

## How to Use

Navigate to any Sanfoundry MCQ page (e.g. `https://www.sanfoundry.com/...`). A floating dark widget will appear in the bottom-right corner of the page.

---

### Auto Mode

The toggle in the widget switches between **Manual** (default) and **Auto** mode.

- Click the toggle to slide it to the **Auto** side — it glows cyan and the header pulses to show it's active.
- From this point on, every Sanfoundry page you visit will be **scraped automatically** within ~1 second of loading, no clicks needed.
- The **▶ Process This Page** button is hidden in Auto mode since it's not needed.
- Simply navigate from page to page — the counter updates after each.

To stop auto-processing, click the toggle back to **Manual**.

---

### Manual Mode

- The widget starts in Manual mode by default.
- When you're on a page you want to scrape, click **▶ Process This Page**.
- The status message will confirm how many questions were added.
- Navigate to the next page and repeat.

---

### Bulk Download

Once you've processed all the pages you need:

1. Click **⬇ Bulk Download** in the widget.
2. A JSON file named `sanfoundry_mcqs_YYYY-MM-DD.json` will be saved to your Downloads folder.
3. The counter resets to 0 and the collection is cleared, ready for a fresh session.

---

### Undo Last Page

If you accidentally processed the wrong page:

- Click **↩ Undo Last Page** to remove the last page's questions from the collection.
- The status message tells you exactly how many questions were removed.
- You can undo one page at a time, going back through your history.

---

## Output Format

Each question in the downloaded JSON follows this structure:

```json
[
  {
    "id": "1",
    "question": "Which of the following is a utility of state elimination?",
    "options": [
      "a) DFA to NFA",
      "b) NFA to DFA",
      "c) DFA to Regular Expression",
      "d) All of the mentioned"
    ],
    "answer": "c",
    "explanation": "We use this algorithm to simplify a finite automaton to a regular expression or vice versa."
  }
]
```

| Field | Description |
|---|---|
| `id` | Question number on the page |
| `question` | The question text |
| `options` | Array of answer choices |
| `answer` | The correct option letter (e.g. `a`, `b`, `c`, `d`) |
| `explanation` | Explanation provided by Sanfoundry |

---

## Notes & Limitations

- The extension only activates on `https://www.sanfoundry.com/*` pages.
- Data is stored **in memory** in the service worker. If Chrome shuts down the service worker (idle timeout), accumulated data may be lost. Download before closing Chrome for long sessions.
- Pages that don't use Sanfoundry's standard MCQ layout may return 0 questions — the status message will say so.
- The widget guards against double-injection, so refreshing a page in Auto mode will re-scrape and add a fresh batch (use Undo if needed).

---

## License

MIT License — do whatever you want with it.

---

<p align="center">Modified and improved by <strong>Claude (Anthropic)</strong></p>
