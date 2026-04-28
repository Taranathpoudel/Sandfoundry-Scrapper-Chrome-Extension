# Sanfoundry MCQ Scraper Chrome Extension

<p align="center">
  <img src="./images/icon128.png" alt="Sanfoundry MCQ Scraper">
</p>

## Overview

The **Sanfoundry MCQ Scraper** is a Chrome extension designed to effortlessly extract multiple-choice questions and answers from Sanfoundry's educational pages. With a sprinkle of JavaScript magic, it neatly organizes the data into a JSON structure, making it a breeze to use for your learning adventures.

<!-- ![Sanfoundry MCQ Scraper](./images/icon128.png) -->

## Features ✨

- **Sleek Extraction:** Grabs MCQs seamlessly from Sanfoundry pages.
- **JSON Magic:** Formats the extracted data into a clean and organized JSON structure.
- **Clipboard Wizardry:** Copies the formatted data straight to your clipboard.

## Installation 🚀

1. **Download:**
   - Grab the extension files and save them to your local machine.

2. **Chrome Settings:**
   - Open Google Chrome and go to `chrome://extensions/`

3. **Developer Mode:**
   - Enable "Developer mode" in the top right corner.

4. **Load Unpacked:**
   - Click "Load unpacked" and select the folder containing the extension files.

## Usage 🎉

1. **Navigate:**
   - Open Google Chrome and head to any Sanfoundry page with MCQs.

2. **Voila!**
   - Watch as the extension weaves its magic, extracting and formatting the data.

3. **Clipboard Ready:**
   - The formatted JSON data is now copied to your clipboard. Paste it wherever you need!

## Example Output 📋

```json
[
  {
    "id": "1",
    "question": "Which of the following is an utility of state elimination phenomenon?",
    "options": [
      "a) DFA to NFA",
      "b) NFA to DFA",
      "c) DFA to Regular Expression",
      "d) All of the mentioned"
    ],
    "answer": "c",
    "explanation": "We use this algorithm to simplify a finite automaton to regular expression or vice versa. We eliminate states while converting given finite automata to its corresponding regular expression."
  },
  // ... (other questions and answers)
]

```

## Notes 📝

- Ensure the extension is enabled on Sanfoundry pages.
- Some pages may not be supported, and the extension might not work as expected.

## License 📄

This project is licensed under the [MIT License].


