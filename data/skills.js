/* ============================================================================
 * data/skills.js —— 技能栈
 * ----------------------------------------------------------------------------
 * 按分组维护，每组一个 { group, items } 区块。
 *   level 1-5，表示熟练度圆点；5 = 主力工具，1 = 了解
 *   不想显示熟练度就整组删掉 level 字段，会自动只显示文字标签。
 * ==========================================================================*/

window.PORTFOLIO = window.PORTFOLIO || {};

window.PORTFOLIO.skills = [
  {
    group: '语言',
    items: [
      { name: 'TypeScript', level: 5 },
      { name: 'JavaScript', level: 5 },
      { name: 'Python', level: 4 },
      { name: 'SQL', level: 4 },
      { name: 'Go', level: 2 }
    ]
  },
  {
    group: '前端',
    items: [
      { name: 'React', level: 5 },
      { name: 'CSS / 响应式', level: 5 },
      { name: 'Vite', level: 4 },
      { name: 'Web 动画', level: 4 },
      { name: '可访问性 (a11y)', level: 3 }
    ]
  },
  {
    group: '后端 & 数据',
    items: [
      { name: 'Node.js', level: 5 },
      { name: 'FastAPI', level: 4 },
      { name: 'PostgreSQL', level: 4 },
      { name: 'Redis', level: 3 },
      { name: 'Docker', level: 3 }
    ]
  },
  {
    group: 'AI & 工程',
    items: [
      { name: 'LLM 应用 / RAG', level: 4 },
      { name: '提示词工程', level: 4 },
      { name: 'Git / CI', level: 4 },
      { name: '性能优化', level: 4 },
      { name: '技术写作', level: 3 }
    ]
  }
];
