/* ============================================================================
 * data/site.js —— 网站全局信息（导航、首屏、联系方式、页脚）
 * ----------------------------------------------------------------------------
 * 只改这个文件里的文字，就能更新导航栏、首屏和联系区。
 * 字段后面带「← 改这里」的都是示例值，替换成你自己的即可。
 * 注意：字符串用单引号或双引号包住，逗号别漏（最后一项后面不要逗号）。
 * ==========================================================================*/

window.PORTFOLIO = window.PORTFOLIO || {};

window.PORTFOLIO.site = {
  /* ---- 身份 ---- */
  name: 'tyee33',                        // 显示名 / 昵称
  initials: 'TY',                        // 导航栏左侧的方形缩写标记（1-2 个字符最好看）
  role: '全栈开发 / AI 应用',             // 职位定位，会出现在导航栏和首屏
  eyebrow: '// full-stack developer',    // 首屏上方那行等宽小字

  /* ---- 首屏文案 ---- */
  tagline: '把复杂的产品想法，做成简洁、可靠、上线即用的东西。',
  status: '开放远程与合作机会',            // 状态药丸文案，不需要就设为空字符串 ''

  /* ---- 联系方式 ---- */
  email: 'tyee33@example.com',           // ← 改这里
  resume: 'assets/resume.pdf',           // 简历文件路径（替换 assets/resume.pdf）
  siteUrl: 'https://tyee33.github.io/',  // 线上地址，用于分享卡片

  /* ---- 导航（id 必须和 index.html 里的 section id 一致）---- */
  nav: [
    { id: 'projects',   label: '项目' },
    { id: 'skills',     label: '技能' },
    { id: 'experience', label: '经历' },
    { id: 'posts',      label: '文章' },
    { id: 'about',      label: '关于' },
    { id: 'contact',    label: '联系' }
  ],

  /* ---- 首屏按钮：variant 可选 primary（白底黑字）/ ghost（玻璃质感）---- */
  cta: [
    { label: '查看项目', href: '#projects', variant: 'primary' },
    { label: '下载简历', href: 'assets/resume.pdf', variant: 'ghost', download: true }
  ],

  /* ---- 首屏下方的小标签，最多 3-4 个 ---- */
  meta: [
    { label: '坐标', value: '中国 · 远程' },
    { label: '方向', value: 'Web / AI 应用' },
    { label: '状态', value: '可接新项目' }
  ],

  /* ---- 首屏右侧的终端卡片 ---- */
  terminal: {
    title: '~/tyee33',
    lines: [
      '$ whoami',
      'tyee33 — 全栈开发，喜欢做减法',
      '$ stack --now',
      'TypeScript · React · Node · Python',
      '$ echo "let\'s build something"',
      "let's build something"
    ]
  },

  /* ---- 社交链接：icon 可选 github / mail / x / linkedin / zhihu / wechat / link
         wechat 这类没有链接的，用 copy 字段，点击自动复制 ---- */
  socials: [
    { label: 'GitHub',   href: 'https://github.com/tyee33', icon: 'github' },
    { label: 'Email',    href: 'mailto:tyee33@example.com',  icon: 'mail' },
    { label: 'X',        href: 'https://x.com/',             icon: 'x' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/',  icon: 'linkedin' },
    { label: '知乎',     href: 'https://www.zhihu.com/',     icon: 'zhihu' },
    { label: '微信',     copy: 'your-wechat-id',             icon: 'wechat' }
  ],

  /* ---- 页脚 ---- */
  footer: {
    note: '原生 HTML / CSS / JS 手写 · 托管于 GitHub Pages',
    copyrightFrom: 2026                   // 页脚年份显示为 2026 或 2026–当前年
  }
};
