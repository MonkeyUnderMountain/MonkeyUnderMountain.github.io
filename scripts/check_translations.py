#!/usr/bin/env python3
"""
check_translations.py
---------------------
Utility to validate the JSON-based translations used by the site.

What it does
- Loads `translation/translations.json` and computes the union of all keys
  present across languages.
- Scans the repository HTML and JS files for DOM ids (elements that would
  receive translated values) using simple heuristics (id="...", getElementById(),
  querySelector('#...')).
- Reports:
  * Missing keys: keys present in the union but absent in a particular language.
  * Unused keys: keys present in the JSON but not referenced anywhere in the
    site's HTML/JS (possible stale entries).

Why this is helpful
- Keeps translation files consistent between languages.
- Catches translations that are added/removed from HTML but not updated in JSON.

Limitations / heuristics
- The script uses simple regex-based scanning; it intentionally avoids full
  HTML/JS parsing to remain lightweight and dependency-free. It may miss
  dynamically-constructed ids or obscure cases.

Exit codes
- 0: OK (no problems found)
- 1: error (e.g. translations.json missing)
- 2: missing keys found
- 3: unused keys found

Usage
-----
Run locally:

    python scripts/check_translations.py

In CI (example): run the same command and inspect job logs. A non-zero exit
code will cause the workflow to fail so you can quickly spot issues in PRs.

Implementation notes
- `find_used_ids()` collects candidate ids from HTML and JS files using
  straightforward regexes; this is fast but conservative.
- `load_translations()` simply loads JSON using UTF-8.

Suggested workflow
- Run before committing or set up a GitHub Action to run on PRs (I can add
  this if you'd like).
"""

import json
import re
import sys
from pathlib import Path


def load_translations(path: Path):
    """Return parsed JSON from the given path.

    Raises a regular exception if the file can't be read/parsed; the caller
    handles reporting.
    """
    with path.open(encoding='utf-8') as f:
        return json.load(f)


def find_used_ids(root: Path):
    """Scan repository for likely DOM ids used by the translation system.

    Heuristics used:
    - HTML: id="..."
    - JS: getElementById('...') and querySelector('#...')

    Returns a set of id strings.
    """
    ids = set()

    # Scan HTML files for explicit id="..." attributes
    for p in root.rglob('*.html'):
        try:
            text = p.read_text(encoding='utf-8')
        except Exception:
            # Ignore unreadable files
            continue
        ids.update(re.findall(r'id=["\']([^"\']+)["\']', text))

    # Scan JS files for direct DOM access patterns
    for p in root.rglob('*.js'):
        try:
            text = p.read_text(encoding='utf-8')
        except Exception:
            continue
        ids.update(re.findall(r"getElementById\(\s*['\"]([^'\"]+)['\"]\s*\)", text))
        ids.update(re.findall(r"querySelector\(\s*['\"]#([^'\"]+)['\"]\s*\)", text))

    return ids


def main():
    root = Path('.').resolve()
    tpath = root / 'translation' / 'translations.json'
    if not tpath.exists():
        print('ERROR: translation/translations.json not found', file=sys.stderr)
        return 1

    translations = load_translations(tpath)
    langs = sorted(translations.keys())

    # Build set of keys per language and the union of all keys
    keys_per_lang = {lang: set(translations[lang].keys()) for lang in langs}
    all_keys = set().union(*keys_per_lang.values())

    # For each language list keys that are missing compared to the union
    missing = {lang: sorted(list(all_keys - keys_per_lang[lang])) for lang in langs}

    # Find ids referenced in the site's HTML/JS
    used_ids = find_used_ids(root)

    # Keys present in JSON but not referenced in any HTML/JS file
    unused = sorted([k for k in all_keys if k not in used_ids])

    any_missing = any(len(v) for v in missing.values())
    any_unused = len(unused) > 0

    # Print a concise, human-readable summary for CI logs and local runs
    print('Translation check result')
    print('------------------------')
    print(f'Languages found: {", ".join(langs)}')
    print(f'Total translation keys (union): {len(all_keys)}')
    print(f'Unique DOM ids detected in HTML/JS: {len(used_ids)}')
    print()

    if any_missing:
        print('Missing keys by language:')
        for lang, miss in missing.items():
            print(f' - {lang}: {len(miss)} missing')
            for k in miss:
                print(f'    {k}')
        print()
    else:
        print('No missing keys across languages.')
        print()

    if any_unused:
        print(f'Unused translation keys (present in JSON but not found in HTML/JS): {len(unused)}')
        for k in unused:
            print(f'  {k}')
        print()
    else:
        print('No unused translation keys detected.')
        print()

    # Return codes: give precedence to missing keys (2) over unused (3)
    rc = 0
    if any_missing:
        rc = 2
    elif any_unused:
        rc = 3
    return rc


if __name__ == '__main__':
    sys.exit(main())
