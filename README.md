

# MonkeyUnderMountain.github.io

# MonkeyUnderMountain.github.io

A concise, static personal website repository with a few small helper scripts
for managing note indexes and translations.

## Contents

- Scripts for generating and validating site data (`scripts/`)
- Notes and PDFs (`Notes/`)
- Translation data and loader (`translation/`)

## Key utilities

### Notes index generator

Purpose
-------
Builds `Notes/notes_index.json` describing the structure of the `Notes/`
folder so the site can render foldable note cards.

Usage
-----
From the repository root (PowerShell):

```powershell
python scripts/generate_notes_index.py
```

To limit scanning to specific modules, pass module names as arguments:

```powershell
python scripts/generate_notes_index.py Arithmetic_geometry Misc_notes
```

Or create `Notes/modules.txt` with one module name per line; the script will
use that list if present.

Output
------
- Writes `Notes/notes_index.json` (overwrites if it exists).
- JSON describes modules, chapters, sections, and their PDF files.

Notes for the site
------------------
- `index.html` fetches `Notes/notes_index.json` and renders nested, foldable
  cards using the `pixel-card` style.
- Display rules: underscores in names become spaces; PDF links show the label
  `pdf` and include the original filename in the `title` (tooltip).

Commit guidance
---------------
You may commit the generated `Notes/notes_index.json` (simpler for GitHub
Pages) or add it to `.gitignore` and regenerate locally before viewing.

```powershell
git add Notes/notes_index.json
git commit -m "Add generated notes index"
git push
```

### Translation loader and checker

The site stores UI text in `translation/translations.json` and uses
`translation/translation.js` to populate DOM elements by their `id`.

How to add translatable text
----------------------------
- Add an element with an `id` in the HTML (e.g. `<span id="welcomeMsg"></span>`).
- Add the same key to every language object in `translation/translations.json`.

Supported value formats
-----------------------
- Primitive string: assigned to `textContent` (unless it contains HTML).
- Object form: supports `text`, `href`, `title`, and `html` (boolean). Example:

```json
"myLink": { "text": "Click here", "href": "https://...", "html": false }
```

Best practice
-------------
- Keep a static `href` in anchors as a progressive-enhancement fallback; the
  translation loader will override it when an `href` is provided in JSON.

### Translation checker (`scripts/check_translations.py`)

Purpose
-------
Validate that `translation/translations.json` contains the keys used by the
site and flag missing or unused keys.

What it does
-----------
- Loads `translation/translations.json` and computes the union of keys across languages.
- Scans HTML for `id` attributes on text-bearing tags and checks JS usages
  (e.g. `getElementById`, `querySelector('#...')`).

Usage
-----
From the repository root:

```bash
python scripts/check_translations.py
```

Exit codes
----------
- `0` — OK (no problems found)
- `1` — error (e.g. missing or unreadable `translations.json`)
- `2` — missing translation keys found
- `3` — unused keys present in JSON but not referenced in HTML/JS

Limitations
-----------
The checker uses regex heuristics rather than a full parser, so it may miss
ids constructed dynamically at runtime. To change which tags are treated as
translatable, edit the `allowed_tags` set in `scripts/check_translations.py`.

## Contact and contributions

If you'd like improvements (nicer link icons, allowlist patterns, deeper
recursive scanning, etc.) open an issue or submit a pull request.

---
Updated README: focuses on clarity and quick reference for the repository's
main scripts and translation workflow.