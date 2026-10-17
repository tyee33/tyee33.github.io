# tyee33 · Portfolio

极简黑白风格的个人作品集：单页滚动、液体玻璃质感、深色/浅色双主题，**零构建、零依赖、零外部请求**。

线上地址：<https://tyee.is-a.dev/>（自定义域名，由仓库根目录的 `CNAME` 文件指定；`https://tyee33.github.io/` 会自动跳转过来）

---

## 一、更新网站（三分钟）

```
1. 打开 data/ 目录，改里面的 .js 文件（文字、项目、链接都在这里）
2. 双击 index.html 看效果（本站无需构建，file:// 直接能跑）
3. git add . && git commit -m "update" && git push
```

推送后 1 分钟内 GitHub Pages 会自动重新发布。

> 只有一个规则要记住：**文字内容改 `data/`，样式改 `assets/css/`，其它文件平时不用碰。**

---

## 二、文件地图

| 路径 | 作用 | 平时要改吗 |
| --- | --- | --- |
| `index.html` | 页面骨架：各区块的标题、结构、脚本引入 | 很少（增删整节时才改） |
| `data/site.js` | 姓名、职位、首屏文案、导航、邮箱、社交链接、页脚 | ✅ 常改 |
| `data/projects.js` | 项目作品集 | ✅ 常改 |
| `data/skills.js` | 技能栈 | ✅ 常改 |
| `data/experience.js` | 工作与教育经历 | ✅ 常改 |
| `data/posts.js` | 技术文章列表（留空数组即隐藏整节） | ✅ 常改 |
| `data/about.js` | 关于我、头像路径、个人信息条目 | ✅ 常改 |
| `assets/css/tokens.css` | 设计令牌：配色、圆角、字体、玻璃、按钮、背景层 | 想换风格时 |
| `assets/css/main.css` | 各区块布局与组件样式 | 想调版式时 |
| `assets/js/main.js` | 把 data 渲染成 HTML | 一般不动 |
| `assets/js/ui.js` | 主题切换、导航、滚动动效、玻璃高光 | 一般不动 |
| `assets/js/icons.js` | 内联 SVG 图标集 | 想换图标时 |
| `assets/img/avatar.svg` | 头像占位图（换成你的照片） | 一次 |
| `assets/img/og.png` | 社交分享卡片（1200×630） | 可选 |
| `assets/resume.pdf` | 占位简历（**请务必替换**） | 一次 |
| `assets/favicon.svg` | 站点图标 | 可选 |
| `tools/make-assets.py` | 重新生成 og.png 与占位简历（可选） | 可选 |
| `preview.ps1` / `tools/serve.mjs` | 本地起 http 服务预览（可选） | 不用 |

每个 `data/*.js` 文件顶部都有字段说明，照着注释改即可。

---

## 三、常见任务

### 换头像
把你的照片（正方形最佳，≥480×480）放进 `assets/img/`，然后在 `data/about.js` 改：

```js
avatar: 'assets/img/me.jpg',
```

### 换简历
直接用你的 PDF 覆盖 `assets/resume.pdf`（文件名保持一致，按钮和链接都不用改）。

### 加一个项目
在 `data/projects.js` 数组里复制一个 `{ ... }` 区块，放在想要的位置：

```js
{
  title: '项目名',
  summary: '解决什么问题 + 你的贡献 + 结果（写数字最有说服力）',
  year: '2025',
  role: '独立开发',
  tags: ['TypeScript', 'Node'],
  metric: '10k+ 用户',      // 可选，卡片右上角的小标签；不要就删掉这一行
  featured: true,           // 可选，大屏上占两列，用来突出最重要的项目
  mono: 'N',                // 可选，封面上的字母，默认取标题首字母
  links: [
    { label: '代码', href: 'https://github.com/...', icon: 'github' },
    { label: '演示', href: 'https://...', icon: 'arrow' }
  ]
}
```

### 加 / 删技术文章
改 `data/posts.js`。**把数组清空成 `[]`，文章整节和导航里的「文章」会自动隐藏**，不需要改 HTML。

### 改首屏
`data/site.js` 里的 `eyebrow`（小字）、`role`、`tagline`、`status`（状态药丸，留空 `''` 则不显示）、`cta`（按钮）、`meta`（下方三项信息）、`terminal`（右侧终端卡片）。

### 换配色
`assets/css/tokens.css` 顶部：

- `--tint`：极光里那一丝冷色，改成 `0 0% 100%` 就是**纯黑白**。
- `html[data-theme="dark"]` / `html[data-theme="light"]`：两套主题的全部颜色。
- `--blur`：玻璃模糊强度（默认 22px，调大更"厚"，性能消耗也更高）。

### 增删整节
删掉 `index.html` 里对应的 `<section id="...">`，再到 `data/site.js` 的 `nav` 数组里删掉同名项。反过来添加也一样。

### 想更克制（关掉部分效果）
- 关玻璃高光跟随：删掉 `index.html` 里对应元素上的 `data-glass` 属性即可（玻璃本身还在）。
- 关极光/噪点：在 `index.html` 里删掉 `.bg__aurora` / `.bg__noise` 两个元素。
- 系统开启「减少动态效果」时，所有动画会自动停用（已内建支持）。

---

## 四、首次部署到 GitHub Pages

1. 在 GitHub 新建仓库，名字必须是 **`tyee33.github.io`**（用户主页仓库，地址才是 `https://tyee33.github.io/`）。
2. 本地初始化并推送（如果还没做）：

   ```bash
   git init
   git add .
   git commit -m "init portfolio"
   git branch -M main
   git remote add origin https://github.com/tyee33/tyee33.github.io.git
   git push -u origin main
   ```

3. 仓库 → **Settings → Pages** → Source 选 **Deploy from a branch** → Branch 选 **main** + **/ (root)** → Save。
4. 等 1–2 分钟，访问 <https://tyee.is-a.dev/>（或 <https://tyee33.github.io/>）。
5. 之后每次 `git push` 都会自动更新，无需再配置。

> **自定义域名**：根目录的 `CNAME` 文件（内容是 `tyee.is-a.dev`）就是域名绑定的唯一来源，**不要删它**，删掉后 GitHub Pages 会立刻解绑域名（访问变 404）。这个域名的 DNS 已经指向 `tyee33.github.io`，由 is-a.dev 提供服务。
>
> 想换域名时：改 `CNAME` 的内容 + 在 is-a.dev 那边改 DNS 记录，同时记得把 `index.html` 的 `canonical`/`og:url`/`og:image`、`data/site.js` 的 `siteUrl`、`robots.txt`、`sitemap.xml` 一并改掉。

> 本站是纯静态文件，**不需要 GitHub Actions、不需要 `npm install`**，所以部署方式选"分支"就够了，也最不容易出问题。`.nojekyll` 已就位，下划线开头的文件不会被 Jekyll 吞掉。

---

## 五、本地预览（可选）

- 最省事：直接双击 `index.html`。本站没有任何 `fetch` 请求，`file://` 下功能完全正常。
- 想要更接近线上（真实 http 协议、404 行为）：

  ```powershell
  pwsh -File preview.ps1        # 优先用 Python，其次 Node，访问 http://localhost:8080/
  ```

---

## 六、设计与实现要点

**液体玻璃的四层叠加**（只在 `#f4f4f6` 这类背景上看不出效果，所以背景层是必须的）：

1. `backdrop-filter: blur(22px) saturate(150%)` —— 真实的背景模糊
2. 棱边高光 —— `::before` + `mask-composite` 做 1px 亮线，模拟玻璃边缘折射
3. 指针高光 —— JS 把鼠标坐标写入 `--mx/--my`，`::after` 的径向渐变跟着走
4. 噪点 + 网格 + 漂移极光 —— 给玻璃提供"可被模糊的内容"

**黑白科技感**：全局只有黑白灰 + 一丝冷色（可一键去掉）；层次来自等宽字体标记、细线网格、发光圆点状态药丸与终端卡片。

**性能与降级**：不加载任何外部字体/CDN，首屏只有一个 HTML + 两个 CSS + 三个 JS；`prefers-reduced-motion` 时关闭动画，触屏设备关闭指针高光，`backdrop-filter` 不被支持时自动退化为半透明卡片。

**可访问性**：语义化标签、跳转链接、键盘可达、`aria-*` 标注、`focus-visible` 焦点环、明暗两套配色都保证正文对比度。

**SEO**：`title`/meta 由 `data/site.js` 驱动，自动注入 `Person` 结构化数据，附 `robots.txt` 与 `sitemap.xml`。

---

## 七、常见问题

**推上去样式没变？**
Cloudflare/GitHub 的 CDN 缓存通常 10 分钟内刷新。先 `Ctrl+F5` 强刷，仍不对就去仓库的 Actions 页看部署是否成功。

**换成项目仓库（`用户名.github.io/仓库名/`）怎么办？**
站内所有资源都是相对路径，可以直接工作。需要改的只有 `index.html` 里几处绝对地址：`canonical`、`og:url`、`og:image`、`twitter:image`，以及 `robots.txt` / `sitemap.xml` 里的域名。

**想加真正的博客（本地 Markdown）？**
现在文章列表指向外部链接（掘金/知乎/自建博客都行），这是维护成本最低的做法。如果确实需要站内 Markdown 博客，建议升级到 Astro，内容结构可以直接迁移。

**想加中英双语？**
复制一份 `data/*.js`（如 `site.en.js`），再在 `ui.js` 里加个语言切换把 `window.PORTFOLIO` 换掉即可。

**改了名字，分享图还是旧的？**
`python tools/make-assets.py`（需要 Pillow），脚本顶部常量就是卡片上的文字。

---

## 八、License

内容（文字、图片）归 tyee33 所有；代码部分可自由取用。
