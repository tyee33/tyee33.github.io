/* ============================================================================
 * data/projects.js —— 项目作品集
 * ----------------------------------------------------------------------------
 * 复制一份 { ... } 区块即可新增项目。建议放 3-6 个，太多会稀释重点。
 * 字段说明：
 *   title    项目名
 *   summary  一两句话：解决什么问题 + 你的贡献 + 结果（最重要，写结果）
 *   year     年份或时间范围
 *   role     你在项目里的角色
 *   tags     技术标签数组，建议 3-5 个
 *   links    [{ label, href, icon }]，icon 可选 github / link / arrow / doc
 *   featured true 会让卡片占两列（大屏），用来突出最重要的项目
 *   mono     卡片封面上的字母标记，留空则自动取 title 首字母
 *   metric   一个关键数字，显示在卡片右上角（如 '10k+ 用户'），不想要就删掉这行
 * ==========================================================================*/

window.PORTFOLIO = window.PORTFOLIO || {};

window.PORTFOLIO.projects = [
  {
    title: 'Nebula 数据看板',
    summary: '为内部 7 个业务线做的统一数据看板，替换掉原先散落的 12 张 Excel。支持自定义图表与权限隔离，上线后日报整理时间从 2 小时降到 10 分钟。',
    year: '2025',
    role: '独立开发',
    tags: ['TypeScript', 'React', 'ECharts', 'Node'],
    metric: '7 条业务线',
    featured: true,
    mono: 'N',
    links: [
      { label: '代码', href: 'https://github.com/tyee33', icon: 'github' },
      { label: '演示', href: 'https://example.com', icon: 'arrow' }
    ]
  },
  {
    title: 'Pulse 实时监控',
    summary: '一套轻量服务健康监控，异常 5 秒内推送到企业微信。用 SSE 替代轮询，服务端开销降低约 80%。',
    year: '2025',
    role: '后端 + 前端',
    tags: ['Node', 'SSE', 'Redis', 'Docker'],
    metric: '开销 -80%',
    mono: 'P',
    links: [
      { label: '代码', href: 'https://github.com/tyee33', icon: 'github' }
    ]
  },
  {
    title: 'Lumen 文档站',
    summary: '把 Markdown 一键变成团队文档站，带全文搜索与版本对比。零构建，纯静态托管，维护成本几乎为零。',
    year: '2024',
    role: '独立开发',
    tags: ['JavaScript', 'CSS', '静态站点'],
    metric: '40+ 文档',
    mono: 'L',
    links: [
      { label: '代码', href: 'https://github.com/tyee33', icon: 'github' },
      { label: '演示', href: 'https://example.com', icon: 'arrow' }
    ]
  },
  {
    title: 'AI 提示词工作台',
    summary: '面向非技术同事的提示词管理与测试工具：版本管理、A/B 对比、用量统计。让模型调用从「凭感觉」变成可复现。',
    year: '2024',
    role: '全栈',
    tags: ['Python', 'FastAPI', 'LLM', 'SQLite'],
    metric: '120+ 团队用户',
    mono: 'A',
    links: [
      { label: '代码', href: 'https://github.com/tyee33', icon: 'github' }
    ]
  }
];
