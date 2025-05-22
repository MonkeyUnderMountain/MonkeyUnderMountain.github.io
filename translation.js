const translations = {
    'zh-CN': {
        title: '欢迎访问！',
        paragraph: '这是一个段落',
        button: {
            en: 'English',
            zh: '简体中文'
        }
    },
    'en-US': {
        title: 'Welcome!',
        paragraph: 'This is a paragraph',
        button: {
            en: 'English',
            zh: '简体中文'
        }
    }
};

function switchLanguageToChinese() {
    document.getElementById('title').textContent = translations['zh-CN'].title;
    document.getElementById('paragraph').textContent = translations['zh-CN'].paragraph;
}

function switchLanguageToEnglish() {
    document.getElementById('title').textContent = translations['en-US'].title;
    document.getElementById('paragraph').textContent = translations['en-US'].paragraph;
}