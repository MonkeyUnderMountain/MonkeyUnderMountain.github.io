/*
  translation/translation.js
  --------------------------
  This script loads the translation data from `translation/translations.json`,
  exposes helper functions (`updateContent`, language switchers), and
  initializes the UI text based on the browser language.

  The main goal is to keep the data in an editable JSON file so you only need
  to update `translation/translations.json` when adding new text elements.
*/

(async function () {
  // Load the translations JSON. This path is relative to the site root,
  // so the loader that includes this file should be placed at the root.
  let translations = {};
  try {
    const resp = await fetch('translation/translations.json');
    if (!resp.ok) throw new Error('Failed to fetch translations.json: ' + resp.status);
    translations = await resp.json();
  } catch (err) {
    console.error('Error loading translations:', err);
    translations = {}; // fall back to empty
  }

  // Expose translations for debugging/other scripts if needed
  window.translations = translations;

  // Update DOM elements from translations[currentLanguage]
  function updateContent() {
    const t = translations[window.currentLanguage] || {};

    // Generic mapper: for every key in the translation object try to find
    // an element with the same id. This allows adding new translatable
    // elements by only adding an `id` in HTML and the matching key in
    // `translation/translations.json`.
    Object.keys(t).forEach(key => {
      const value = t[key];
      const el = document.getElementById(key);
      if (!el) return; // no matching element, skip silently

      // If the JSON value is an object we support setting multiple
      // attributes. Example:
      // { "myLink": { "text": "Click", "href": "...", "html": false } }
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        // set text/html
        if (value.hasOwnProperty('text')) {
          if (value.html) el.innerHTML = value.text || '';
          else el.textContent = value.text || '';
        }
        // set href if present and element supports it
        if (value.href && 'href' in el) el.href = value.href;
        // set title attribute if provided
        if (value.title) el.title = value.title;
        return;
      }

      // Primitive value (string/number): determine whether to write
      // as HTML or plain text. If the string contains a '<' character
      // treat it as HTML (simple heuristic), otherwise set textContent.
      if (typeof value === 'string' && /<[^>]+>/.test(value)) {
        el.innerHTML = value;
      } else {
        el.textContent = value == null ? '' : String(value);
      }
    });
  }

  // Language switch helpers
  function switchLanguageToChinese() {
    window.currentLanguage = 'zh-CN';
    updateContent();
  }
  function switchLanguageToEnglish() {
    window.currentLanguage = 'en-US';
    updateContent();
  }

  // Detect browser language, fall back to en-US
  function detectBrowserLanguage() {
    const userLang = navigator.language || navigator.userLanguage || '';
    return userLang.startsWith('zh') ? 'zh-CN' : 'en-US';
  }

  // Expose switch functions globally so HTML buttons can call them
  window.switchLanguageToChinese = switchLanguageToChinese;
  window.switchLanguageToEnglish = switchLanguageToEnglish;

  // Initialize language and update on DOM ready
  window.currentLanguage = detectBrowserLanguage();
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', updateContent);
  } else {
    updateContent();
  }

})();
