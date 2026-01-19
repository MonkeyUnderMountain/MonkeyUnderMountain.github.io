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

  // Update DOM elements from translations and support two JSON shapes:
  // - Old (per-language): { "zh-CN": { key: value, ... }, "en-US": { ... } }
  // - New (per-key): { "key": { "zh-CN": value, "en-US": value }, ... }
  function updateContent() {
    const isOldFormat = !!(translations && (translations['zh-CN'] || translations['en-US']));

    if (isOldFormat) {
      const t = translations[window.currentLanguage] || {};
      Object.keys(t).forEach(key => applyTranslationToElement(key, t[key]));
      return;
    }

    // New format: iterate top-level keys and pick the language-specific
    // value (fall back to en-US then first available value).
    Object.keys(translations).forEach(key => {
      const perLang = translations[key];
      if (perLang == null) return;

      let value = undefined;
      if (perLang && typeof perLang === 'object' && !Array.isArray(perLang)) {
        if (perLang.hasOwnProperty(window.currentLanguage)) value = perLang[window.currentLanguage];
        else if (perLang.hasOwnProperty('en-US')) value = perLang['en-US'];
        else {
          // pick any available language value
          const langs = Object.keys(perLang);
          if (langs.length) value = perLang[langs[0]];
        }
      } else {
        // primitive stored directly (unlikely in new format but keep safe)
        value = perLang;
      }

      applyTranslationToElement(key, value);
    });
  }

  // Apply a resolved translation value to a DOM element with id `key`.
  function applyTranslationToElement(key, value) {
    const el = document.getElementById(key);
    if (!el) return;

    // If the resolved value is an object with a `text` property, treat it
    // as the attr map used previously (text/href/html/title).
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      if (value.hasOwnProperty('text')) {
        if (value.html) el.innerHTML = value.text || '';
        else el.textContent = value.text || '';
      }
      if (value.href && 'href' in el) el.href = value.href;
      if (value.title) el.title = value.title;
      return;
    }

    // Primitive value: decide whether to set as HTML or text.
    if (typeof value === 'string' && /<[^>]+>/.test(value)) {
      el.innerHTML = value;
    } else {
      el.textContent = value == null ? '' : String(value);
    }
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
