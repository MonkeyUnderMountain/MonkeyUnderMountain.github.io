

# MonkeyUnderMountain.github.io

My personal website.

## Scripts

### Notes index generator

Purpose
-------
This small utility builds `Notes/notes_index.json` describing the notes in the
`Notes/` folder so the site can render foldable note cards automatically.

How to run
----------
From the repository root (Windows PowerShell example):

```powershell
python scripts/generate_notes_index.py
```

To restrict to specific modules (allowlist), pass module names as arguments:

```powershell
python scripts/generate_notes_index.py Arithmetic_geometry Misc_notes
```

Alternatively create `Notes/modules.txt` with one module name per line; the
script will use that list if present.

Output
------
- Writes `Notes/notes_index.json` (overwrites if exists).
- JSON contains a list of modules; each module has `name`, `relpath`, `pdfs`,
	and `chapters`. Chapters have `sections` with `pdfs` as well.

Client-side notes
-----------------
- The site (`index.html`) fetches `Notes/notes_index.json` and renders nested
	foldable cards using the existing `pixel-card` style.
- Display rules implemented in the page:
	- Module/chapter/section names: underscores `_` are replaced with spaces.
	- PDF links show the label `pdf` and the original filename appears in the
		link `title` attribute (tooltip).

Development / troubleshooting
-----------------------------
- Ensure you run the script with a Python 3 interpreter available on PATH.
- If `Notes/notes_index.json` is missing, the page shows a hint telling you to
	run the generator.
- If you add or remove files under `Notes/` re-run the generator to update the
	JSON before reloading the site.

Committing
----------
You may choose to commit the generated `Notes/notes_index.json` (helps GitHub
Pages serve the file without a build step), or add it to `.gitignore` and
regenerate locally before viewing. Example commit commands:

```powershell
git add Notes/notes_index.json
git commit -m "Add generated notes index"
git push
```

Contact
-------
If you want additional features (e.g., nicer link icons, glob patterns for the
allowlist, or deeper recursive scanning), open an issue or ask me to implement
them.

Translations
------------
The site now centralizes all UI text under `translation/translations.json`.

- Location: `translation/translations.json` — contains language keys (e.g. `zh-CN`, `en-US`).
- Loader: `translation/translation.js` reads the JSON and updates DOM elements whose `id` matches a JSON key.

How to add a new translatable element
- Add an element with an `id` in `index.html` (for example `<span id="welcomeMsg"></span>`).
- Add the same key to every language in `translation/translations.json` with the desired text.

Value formats supported
- Primitive string: set as `textContent` unless it contains HTML tags, then it is set as `innerHTML`.
- Object form: allows setting `text`, `href`, `title`, and `html` (boolean). Example:

```
"myLink": { "text": "Click here", "href": "https://...", "html": false }
```

Notes
- Editing `translation/translations.json` is sufficient; the page will reflect changes on the next reload.
- Keep any HTML in values minimal and trusted (the loader uses `innerHTML` when it detects tags).

- Href fallback and progressive enhancement:
	- Keep a sensible static `href` in anchor elements in `index.html` as a fallback so the link works when JavaScript is disabled or fails to run.
	- The loader (`translation/translation.js`) will override the element's `href` when the translation value is an object that contains an `href` property. Example JSON entry:

```
"Misc_FictionsInMiddleSchool_Snowfield_Link": { "text": "Snowfield", "href": "Misc/Fictions/Snowfield.html", "html": false }
```

	- If you remove the static `href` from the HTML, make sure every language in `translation/translations.json` provides an appropriate `href` for that key; otherwise the anchor will have no destination and may not be clickable.
	- Best practice: keep the static `href` as a progressive-enhancement fallback and let translations override it when present.

Translation checker
-------------------
To help keep translations consistent the repository includes a lightweight
checker at `scripts/check_translations.py`.

What it does
- Loads `translation/translations.json` and computes the union of keys across
	languages.
- Scans HTML and JS files for DOM ids likely to receive translated text.
- Reports missing keys per language and keys present in JSON but not used in
	HTML/JS (possible stale entries).

How to run locally
------------------
Run from the repository root:

```bash
python scripts/check_translations.py
```

Exit codes and meaning
- `0`: OK — no problems found
- `1`: Error — e.g. `translations.json` missing or unreadable
- `2`: Missing keys found (one or more languages are missing keys)
- `3`: Unused keys found (keys in JSON not referenced in HTML/JS)

CI integration
--------------
You can run the same command in a CI job (example: GitHub Actions). When the
script returns non-zero the job fails and you'll see the detailed output in
the workflow logs. This makes it easy to catch translation mistakes in PRs.

Limitations
-----------
The scanner uses simple regex heuristics (id attributes and common DOM access
patterns). It is intentionally dependency-free and fast, but it may miss
ids constructed dynamically at runtime.

Translation checker
-------------------

This repository includes a small translation-validator script at `scripts/check_translations.py` which helps keep `translation/translations.json` in sync with the translatable DOM elements in the site's HTML/JS.

What it does
- Loads `translation/translations.json` and computes the union of translation keys across languages.
- Scans the site files for DOM ids that are likely used to display text, and reports mismatches between the JSON keys and the detected DOM ids.

How it determines which ids to check
- The script uses lightweight regex heuristics (fast and dependency-free) to find HTML start-tags that carry an `id` attribute. It records the HTML tag name together with the id.
- To avoid reporting structural/anchor ids (for example `id="Misc"` used for navigation or layout), the script only treats ids on a set of "text-bearing" tags as translation targets. By default these include: `p`, `span`, `a`, `li`, `h1`–`h6`, `button`, `label`, `strong`, `em`, `blockquote`, `small`, `cite`, `figcaption`.
- The script also scans JS files for `getElementById(...)` and `querySelector('#...')` usages, but will include a JS-referenced id only if the same id appears in an HTML element whose tag is in the allowed set above. This ensures programmatic ids that don't correspond to visible text are not reported.

Usage
- Run the checker from the repository root:

```sh
python scripts/check_translations.py
```

- Exit codes:
	- `0` — OK (no problems found)
	- `1` — error (e.g. `translation/translations.json` missing)
	- `2` — missing translation keys found (or ids referenced in HTML/JS missing from JSON)
	- `3` — unused keys present in the JSON but not detected in HTML/JS

Notes and limitations
- The scanner intentionally uses regular expressions rather than a full HTML/JS parser. This keeps the tool simple and fast but means it may miss dynamically generated ids or id usage created at runtime.
- If you want an id to be ignored even though it appears on a text-bearing tag, you can either remove the `id` (if unused by scripts), change the element to a non-text tag, or adjust the allowed tag list in `scripts/check_translations.py` to suit your needs.
- To change which tags are considered translatable, edit the `allowed_tags` set in `scripts/check_translations.py::find_used_ids`.

Example
- Add a paragraph element in HTML with `id="notes_in_github_repositories_Title"` and then add a matching key in `translation/translations.json` under each language used. The script will detect the id and check for the translation key.