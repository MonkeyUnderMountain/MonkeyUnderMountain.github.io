const translations = {
    'zh-CN': {
        title: '杨天乐',
        greeting: '欢迎来到我的个人主页！',
        footerText: '“我们必须知道，我们必将知道。” -- 大卫·希尔伯特',

        navigationHomepage: '主页',
        navigationNotes: '笔记',
        navigationResearch: '科研',
        navigationMisc: '其它',

        aboutTitleText: '关于我',
        notesTitleText: '笔记',
        researchTitleText: '科研',
        MiscTitleText: '其它',
        research_preprints_Title: '预印本',
        research_publications_Title: '发表',

        simpleIntroductionOfMyself: '我是<a href="https://math.ecnu.edu.cn/" target="_blank" >华东师范大学数学科学学院</a>的一名本科生。',
        academicInterest: '我的研究方向为代数几何，特别是代数动力系统。',
        mySupervisor: '我的导师是<a href="https://math.ecnu.edu.cn/facultydetail.html?uid=smeng" target="_blank" >孟晟研究员</a>。',
        myEmail: '我的邮箱是 <a href="mailto:10211510098@stu.ecnu.edu.cn">10211510098@stu.ecnu.edu.cn</a>。',

        notes_for_ag: '一份我正在写的代数几何笔记，<a href="https://github.com/MonkeyUnderMountain/Note_on_Algebraic_Geometry" target="_blank">点击这里查看</a>。', 
    
        research_publications_none: '现在还什么都没有',

        Misc_TexTemplate_Title: 'LaTeX 模板',
        Misc_Links_Title: '一些网站',
        Misc_Lean4_Title: 'Lean 4',
        Misc_FictionsInMiddleSchool_Title: '中学时写的小说',
    },
    'en-US': {
        title: 'Tianle Yang',
        greeting: 'Welcome to my personal homepage!',
        footerText: '“We must know, we shall know.” -- David Hilbert',

        navigationHomepage: 'Homepage',
        navigationNotes: 'Notes',
        navigationResearch: 'Research',
        navigationMisc: 'Misc',

        aboutTitleText: 'About Me',
        notesTitleText: 'Notes',
        researchTitleText: 'Research',
        MiscTitleText: 'Misc',
        research_preprints_Title: 'Preprints',
        research_publications_Title: 'Publications',

        simpleIntroductionOfMyself: 'I am a undergraduate student from <a href="https://math.ecnu.edu.cn/" target="_blank" >School of Mathematical Science, East China Normal University</a>.',
        academicInterest: 'My academic interest is on algebraic geometry, especially algebraic dynamics.',
        mySupervisor: 'My supervisor is <a href="https://math.ecnu.edu.cn/facultydetail.html?uid=smeng" target="_blank" >Researcher Seng Meng</a>.',
        myEmail: 'My email is <a href="mailto:10211510098@stu.ecnu.edu.cn">10211510098@stu.ecnu.edu.cn</a>.',

        notes_for_ag: 'A note on algebraic geometry that I am currently writing, <a href="https://github.com/MonkeyUnderMountain/Note_on_Algebraic_Geometry" target="_blank">click here to view</a>.',
    
        research_publications_none: 'Nothing here yet',

        Misc_TexTemplate_Title: 'LaTeX Template',
        Misc_Links_Title: 'Some Links',
        Misc_Lean4_Title: 'Lean 4',
        Misc_FictionsInMiddleSchool_Title: 'Fictions I Wrote in Middle School',
    }
};

// 更新语言的函数
function updateContent() {
    document.getElementById('title').textContent = translations[currentLanguage].title;
    document.getElementById('greeting').textContent = translations[currentLanguage].greeting;
    document.getElementById('footerText').textContent = translations[currentLanguage].footerText;

    document.getElementById('navigationHomepage').textContent = translations[currentLanguage].navigationHomepage;
    document.getElementById('navigationNotes').textContent = translations[currentLanguage].navigationNotes;
    document.getElementById('navigationResearch').textContent = translations[currentLanguage].navigationResearch;
    document.getElementById('navigationMisc').textContent = translations[currentLanguage].navigationMisc;

    document.getElementById('aboutTitleText').textContent = translations[currentLanguage].aboutTitleText;
    document.getElementById('notesTitleText').textContent = translations[currentLanguage].notesTitleText;
    document.getElementById('researchTitleText').textContent = translations[currentLanguage].researchTitleText;
    document.getElementById('MiscTitleText').textContent = translations[currentLanguage].MiscTitleText;
    document.getElementById('research_preprints_Title').textContent = translations[currentLanguage].research_preprints_Title;
    document.getElementById('research_publications_Title').textContent = translations[currentLanguage].research_publications_Title;

    document.getElementById('simpleIntroductionOfMyself').innerHTML = translations[currentLanguage].simpleIntroductionOfMyself;
    document.getElementById('academicInterest').textContent = translations[currentLanguage].academicInterest;
    document.getElementById('mySupervisor').innerHTML = translations[currentLanguage].mySupervisor;
    document.getElementById('myEmail').innerHTML = translations[currentLanguage].myEmail;

    document.getElementById('notes_for_ag').innerHTML = translations[currentLanguage].notes_for_ag;

    document.getElementById('research_publications_none').textContent = translations[currentLanguage].research_publications_none;

    document.getElementById('Misc_TexTemplate_Title').textContent = translations[currentLanguage].Misc_TexTemplate_Title;
    document.getElementById('Misc_Links_Title').textContent = translations[currentLanguage].Misc_Links_Title;
    document.getElementById('Misc_Lean4_Title').textContent = translations[currentLanguage].Misc_Lean4_Title;
    document.getElementById('Misc_FictionsInMiddleSchool_Title').textContent = translations[currentLanguage].Misc_FictionsInMiddleSchool_Title;
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