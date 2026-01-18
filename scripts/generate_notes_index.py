#!/usr/bin/env python3
"""
generate_notes_index.py
------------------------
Create a JSON index describing the Notes folder so the site can render
foldable note cards automatically.

Behavior summary:
 - The script expects a `Notes/` directory next to the `scripts/` folder.
 - It enumerates immediate subdirectories of `Notes/` as "modules" (notes).
 - For each module it collects any PDFs located directly inside the module.
 - It treats subdirectories under `module/chapters/` (if present) as chapters;
   otherwise it treats immediate subdirectories of the module as chapters.
 - For each chapter it collects PDFs directly in the chapter, and treats any
   immediate subdirectories as "sections", recursively collecting PDFs there.
 - Output is written to `Notes/notes_index.json` as a nested list of objects.

This JSON is intentionally small and simple to keep the client-side code
lightweight; filenames are written as relative paths under `Notes/`.
"""

from pathlib import Path
import json
import sys


# Root folder of notes (project-root/Notes)
ROOT = Path(__file__).resolve().parents[1] / 'Notes'
# Output file (created/overwritten)
OUT = ROOT / 'notes_index.json'


def collect_pdfs(d: Path):
    """Return a list of PDF entries found directly inside directory `d`.

    Each entry is a dict with keys:
      - 'name': filename
      - 'relpath': path relative to `Notes/` (POSIX style)
    """
    pdfs = []
    if not d.exists():
        return pdfs
    for p in sorted(d.iterdir()):
        if p.is_file() and p.suffix.lower() == '.pdf':
            pdfs.append({
                'name': p.name,
                'relpath': str(p.relative_to(ROOT).as_posix())
            })
    return pdfs


def build_structure(root: Path):
    """Build and return the nested notes structure as a list of modules.

    Structure example:
    [
      {
        'name': 'Arithmetic_geometry',
        'relpath': 'Arithmetic_geometry',
        'pdfs': [...],
        'chapters': [
           { 'name': 'Affinoid_algebras', 'relpath': 'Affinoid_algebras', 'pdfs': [...], 'sections': [...] },
           ...
        ]
      },
      ...
    ]
    """
    modules = []
    if not root.exists():
        return modules

    # Determine which top-level modules to include. By default we include
    # every directory under `Notes/`, but callers can restrict the list by
    # passing a list of module names to `build_structure` via the global
    # `INCLUDE_MODULES` variable (set in `main()` below).
    for module in sorted(root.iterdir()):
        if not module.is_dir():
            continue
        if 'INCLUDE_MODULES' in globals() and INCLUDE_MODULES is not None:
            if module.name not in INCLUDE_MODULES:
                continue

        mod_entry = {
            'name': module.name,
            'relpath': str(module.relative_to(ROOT).as_posix()),
            'pdfs': collect_pdfs(module),
            'chapters': []
        }

        # Prefer a `chapters/` subfolder if it exists; otherwise use immediate
        # subdirectories of the module as chapter parents.
        chapters_dir = module / 'chapters'
        if chapters_dir.exists() and chapters_dir.is_dir():
            chapter_parents = sorted(chapters_dir.iterdir())
        else:
            chapter_parents = [p for p in sorted(module.iterdir()) if p.is_dir()]

        for chap in chapter_parents:
            if not chap.is_dir():
                continue

            chap_entry = {
                'name': chap.name,
                'relpath': str(chap.relative_to(ROOT).as_posix()),
                'pdfs': collect_pdfs(chap),
                'sections': []
            }

            # Sections are immediate subdirectories of a chapter. Additionally
            # any PDF directly under a chapter is also represented as a
            # lightweight 'section' entry so it can be linked from the UI.
            for sec in sorted(chap.iterdir()):
                if sec.is_dir():
                    sec_entry = {
                        'name': sec.name,
                        'relpath': str(sec.relative_to(ROOT).as_posix()),
                        'pdfs': collect_pdfs(sec)
                    }
                    chap_entry['sections'].append(sec_entry)
                else:
                    # Represent PDFs directly in chapter as a simple section
                    if sec.suffix.lower() == '.pdf':
                        chap_entry['sections'].append({
                            'name': sec.stem,
                            'relpath': str(sec.relative_to(ROOT).as_posix()),
                            'pdfs': [{'name': sec.name, 'relpath': str(sec.relative_to(ROOT).as_posix())}]
                        })

            mod_entry['chapters'].append(chap_entry)

        modules.append(mod_entry)

    return modules


def main():
    """Build the structure and write the JSON output file."""
    # Determine include list from CLI args or Notes/modules.txt (if present).
    # CLI args take precedence.
    args = [a for a in sys.argv[1:] if not a.startswith('-')]
    include = None
    if args:
        include = args
    else:
        modules_txt = ROOT / 'modules.txt'
        if modules_txt.exists():
            include = [line.strip() for line in modules_txt.read_text(encoding='utf-8').splitlines() if line.strip()]

    # Expose to build_structure via global name expected there.
    global INCLUDE_MODULES
    INCLUDE_MODULES = include

    if INCLUDE_MODULES:
        print('Including modules:', ', '.join(INCLUDE_MODULES))

    data = build_structure(ROOT)
    # Write with UTF-8 and preserve non-ascii characters for nicer titles
    OUT.write_text(json.dumps(data, indent=2, ensure_ascii=False))
    print(f'Wrote {OUT}')


if __name__ == '__main__':
    main()
