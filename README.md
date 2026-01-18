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
