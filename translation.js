const translations = {
    'zh-CN': {
        title: '欢迎访问！',
        paragraph: '这是一个段落',
    },
    'en-US': {
        title: 'Welcome!',
        paragraph: 'This is a paragraph',
    }
};

// 检测浏览器语言的函数
function detectBrowserLanguage() {
    const userLang = navigator.language || navigator.userLanguage;
    return userLang.startsWith('zh') ? 'zh-CN' : 'en-US';
}
// 更新语言的函数
function updateContent() {
    document.getElementById('title').textContent = translations[currentLanguage].title;
    document.getElementById('paragraph').textContent = translations[currentLanguage].paragraph;
}
// 切换到中文的函数
function switchLanguageToChinese() {
    currentLanguage = 'zh-CN';
    updateContent();
}
// 切换到英文的函数
function switchLanguageToEnglish() {
    currentLanguage = 'en-US';
    updateContent();
}


// 初始化语言设置
let currentLanguage = detectBrowserLanguage();
// 页面加载时初始化
window.addEventListener('DOMContentLoaded', () => {
  updateContent();
});