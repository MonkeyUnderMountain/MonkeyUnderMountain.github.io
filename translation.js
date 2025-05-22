const translations = {
    'zh-CN': {
        title: '杨天乐',
        greeting: '欢迎来到我的个人主页！',
        simpleIntroductionOfMyself: '我是<a href="https://math.ecnu.edu.cn/">华东师范大学数学科学学院</a>的一名本科生，研究方向为代数几何，特别是代数动力系统。'
    },
    'en-US': {
        title: 'Tianle Yang',
        greeting: 'Welcome to my personal homepage!',
        simpleIntroductionOfMyself: 'I am a undergraduate student from <a href="https://math.ecnu.edu.cn/">School of Mathematical Science, East China Normal University</a>.My academic interest is on algebraic geometry, especially algebraic dynamics.'
    }
};

// 更新语言的函数
function updateContent() {
    document.getElementById('title').textContent = translations[currentLanguage].title;
    document.getElementById('greeting').textContent = translations[currentLanguage].greeting;
    document.getElementById('simpleIntroductionOfMyself').innerHTML = translations[currentLanguage].simpleIntroductionOfMyself;
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
// 检测浏览器语言的函数
function detectBrowserLanguage() {
    const userLang = navigator.language || navigator.userLanguage;
    return userLang.startsWith('zh') ? 'zh-CN' : 'en-US';
}

// 初始化语言设置
let currentLanguage = detectBrowserLanguage();
// 页面加载时初始化
window.addEventListener('DOMContentLoaded', () => {
  updateContent();
});