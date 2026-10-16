/* ============================================================================
 * assets/js/main.js —— 把 data/*.js 里的内容渲染成页面
 * ----------------------------------------------------------------------------
 * 一般不需要改这个文件：想更新网站内容，只改 data/ 目录下的文件即可。
 * 这里只负责「数据 → HTML」的映射，字段含义见各 data 文件顶部注释。
 * ==========================================================================*/

(function () {
  'use strict';

  var D = window.PORTFOLIO || {};
  var site = D.site || {};
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var icon = window.svgIcon || function () { return ''; };

  /* ── 小工具 ───────────────────────────────────────────────────────────── */
  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function isExternal(href) { return /^https?:/i.test(href || ''); }
  function linkAttrs(href) {
    return isExternal(href) ? ' target="_blank" rel="noopener noreferrer"' : '';
  }
  function setHTML(sel, html) {
    var node = $(sel);
    if (node) node.innerHTML = html;
    return node;
  }
  function delay(i) { return ' data-delay="' + (i % 4) + '"'; }
  function hasList(v) { return Array.isArray(v) && v.length > 0; }
  function hide(sel) { var n = $(sel); if (n) n.hidden = true; }

  /* ── 首屏 ─────────────────────────────────────────────────────────────── */
  function renderHero() {
    /* 全局文本绑定：data-bind="name|role|initials" */
    Array.prototype.forEach.call(document.querySelectorAll('[data-bind]'), function (node) {
      var key = node.getAttribute('data-bind');
      if (site[key] != null && site[key] !== '') node.textContent = site[key];
    });

    /* 小标题 + 状态药丸放在同一行 */
    var eyebrow = $('#hero-eyebrow');
    if (eyebrow) {
      eyebrow.textContent = site.eyebrow || '';
      var top = document.createElement('div');
      top.className = 'hero__top';
      eyebrow.parentNode.insertBefore(top, eyebrow);
      top.appendChild(eyebrow);
      if (site.status) {
        top.insertAdjacentHTML(
          'beforeend',
          '<span class="pill"><span class="pill__dot"></span>' + esc(site.status) + '</span>'
        );
      }
    }

    setHTML('#hero-tagline', esc(site.tagline || ''));

    var cta = $('#hero-cta');
    if (cta) {
      cta.innerHTML = (site.cta || []).map(function (c) {
        var variant = c.variant === 'primary' ? 'primary' : 'ghost';
        var ic = c.icon ? icon(c.icon) : (c.download ? icon('download') : '');
        return '<a class="btn btn--' + variant + '" href="' + esc(c.href) + '"' +
          linkAttrs(c.href) + (c.download ? ' download' : '') + '>' +
          esc(c.label) + ic + '</a>';
      }).join('');
    }

    var meta = $('#hero-meta');
    if (meta) {
      meta.innerHTML = (site.meta || []).map(function (m) {
        return '<li><span class="meta__k">' + esc(m.label) + '</span>' +
          '<span class="meta__v">' + esc(m.value) + '</span></li>';
      }).join('');
    }

    var term = site.terminal || {};
    var termTitle = $('#terminal-title');
    if (termTitle) termTitle.textContent = term.title || '';
    var body = $('#terminal-body');
    if (body) {
      var lines = term.lines || [];
      body.innerHTML = lines.map(function (line, i) {
        var isCmd = /^\s*\$/.test(line);
        return '<span class="t-line ' + (isCmd ? 'is-cmd' : 'is-out') + '" style="--i:' + i + '">' +
          esc(line) + '</span>';
      }).join('') +
        '<span class="t-line" style="--i:' + lines.length + '"><span class="caret"></span></span>';
    }
  }

  /* ── 导航（内容渲染完再生成，跳过被隐藏的区块）───────────────────────── */
  function renderNav() {
    var box = $('#nav-links');
    if (!box) return;
    var items = (site.nav || []).filter(function (n) {
      var sec = document.getElementById(n.id);
      return sec && !sec.hidden;
    });
    box.innerHTML = items.map(function (n) {
      return '<a class="nav__link" href="#' + esc(n.id) + '">' + esc(n.label) + '</a>';
    }).join('');
  }

  /* ── 项目 ─────────────────────────────────────────────────────────────── */
  function renderProjects() {
    var items = D.projects || [];
    if (!hasList(items)) { hide('#projects'); return; }
    setHTML('#projects-list', items.map(function (p, i) {
      var links = (p.links || []).map(function (l) {
        return '<a class="card__link" href="' + esc(l.href) + '"' + linkAttrs(l.href) + '>' +
          esc(l.label) + icon(l.icon || 'link') + '</a>';
      }).join('');
      var tags = (p.tags || []).map(function (t) {
        return '<span class="chip">' + esc(t) + '</span>';
      }).join('');
      var mono = p.mono || String(p.title || '?').trim().charAt(0).toUpperCase();
      var foot = [p.role, p.year].filter(Boolean).join(' · ');

      return '<article class="card glass reveal' + (p.featured ? ' card--featured' : '') + '"' +
        ' data-glass' + delay(i) + '>' +
        '<div class="card__cover">' +
          (p.metric ? '<span class="card__metric">' + esc(p.metric) + '</span>' : '') +
          '<span class="card__mono">' + esc(mono) + '</span>' +
        '</div>' +
        '<h3 class="card__title">' + esc(p.title) + '</h3>' +
        '<p class="card__summary">' + esc(p.summary) + '</p>' +
        (tags ? '<div class="card__tags">' + tags + '</div>' : '') +
        '<div class="card__foot">' +
          (foot ? '<span class="card__role">' + esc(foot) + '</span>' : '') +
          (links ? '<span class="card__links">' + links + '</span>' : '') +
        '</div>' +
      '</article>';
    }).join(''));
  }

  /* ── 技能 ─────────────────────────────────────────────────────────────── */
  function renderSkills() {
    var groups = D.skills || [];
    if (!hasList(groups)) { hide('#skills'); return; }
    setHTML('#skills-list', groups.map(function (g, i) {
      var rows = (g.items || []).map(function (it) {
        var dots = '';
        if (typeof it.level === 'number') {
          var n = Math.max(0, Math.min(5, it.level));
          dots = '<span class="skill__dots" role="img" aria-label="熟练度 ' + n + ' / 5">';
          for (var d = 1; d <= 5; d++) {
            dots += '<span class="skill__dot' + (d <= n ? ' is-on' : '') + '"></span>';
          }
          dots += '</span>';
        }
        return '<li class="skill"><span class="skill__name">' + esc(it.name) + '</span>' + dots + '</li>';
      }).join('');
      return '<div class="skill-group glass reveal" data-glass' + delay(i) + '>' +
        '<p class="skill-group__title">' + esc(g.group) + '</p>' +
        '<ul class="skill-list">' + rows + '</ul>' +
      '</div>';
    }).join(''));
  }

  /* ── 经历 ─────────────────────────────────────────────────────────────── */
  function renderExperience() {
    var items = D.experience || [];
    if (!hasList(items)) { hide('#experience'); return; }
    setHTML('#experience-list', items.map(function (x, i) {
      var points = (x.points || []).map(function (p) {
        return '<li class="tl__point">' + esc(p) + '</li>';
      }).join('');
      var tags = (x.tags || []).map(function (t) {
        return '<span class="chip">' + esc(t) + '</span>';
      }).join('');
      var org = [x.org, x.location].filter(Boolean).join(' · ');

      return '<li class="tl' + (x.type === 'edu' ? ' tl--edu' : '') + ' reveal"' + delay(i) + '>' +
        '<span class="tl__node" aria-hidden="true"></span>' +
        '<div class="tl__card glass" data-glass>' +
          '<div class="tl__head">' +
            '<h3 class="tl__role">' + esc(x.role) + '</h3>' +
            '<span class="tl__period">' + esc(x.period) + '</span>' +
          '</div>' +
          (org ? '<p class="tl__org">' + esc(org) + '</p>' : '') +
          (points ? '<ul class="tl__points">' + points + '</ul>' : '') +
          (tags ? '<div class="tl__tags">' + tags + '</div>' : '') +
        '</div>' +
      '</li>';
    }).join(''));
  }

  /* ── 文章 ─────────────────────────────────────────────────────────────── */
  function formatDate(value) {
    var m = /^(\d{4})-(\d{1,2})/.exec(String(value || ''));
    if (!m) return String(value || '');
    return m[1] + ' 年 ' + parseInt(m[2], 10) + ' 月';
  }

  function renderPosts() {
    var items = D.posts || [];
    if (!hasList(items)) { hide('#posts'); return; }
    setHTML('#posts-list', items.map(function (p, i) {
      var metaParts = [];
      if (p.tag) metaParts.push(esc(p.tag));
      if (p.readTime) metaParts.push(esc(p.readTime));
      var meta = metaParts.length
        ? '<p class="post__meta">' + metaParts.join('<span class="sep">·</span>') + '</p>'
        : '';

      return '<li class="reveal"' + delay(i) + '>' +
        '<a class="post" href="' + esc(p.href || '#') + '"' + linkAttrs(p.href) + '>' +
          '<span class="post__date">' + esc(formatDate(p.date)) + '</span>' +
          '<span class="post__body">' +
            '<h3 class="post__title">' + esc(p.title) + '</h3>' +
            meta +
            (p.summary ? '<p class="post__summary">' + esc(p.summary) + '</p>' : '') +
          '</span>' +
          '<span class="post__go" aria-hidden="true">' + icon('arrow') + '</span>' +
        '</a>' +
      '</li>';
    }).join(''));
  }

  /* ── 关于 ─────────────────────────────────────────────────────────────── */
  function renderAbout() {
    var box = $('#about-panel');
    var about = D.about;
    if (!box) return;
    if (!about) { hide('#about'); return; }

    var facts = (about.facts || []).map(function (f) {
      return '<li class="fact"><span class="fact__k">' + esc(f.label) + '</span>' +
        '<span class="fact__v">' + esc(f.value) + '</span></li>';
    }).join('');
    var paras = (about.paragraphs || []).map(function (t) {
      return '<p class="about__p">' + esc(t) + '</p>';
    }).join('');
    var now = hasList(about.now)
      ? '<div class="now"><p class="now__title">Now / 最近在做</p>' +
        '<div class="now__list">' + about.now.map(function (t) {
          return '<span class="chip">' + esc(t) + '</span>';
        }).join('') + '</div></div>'
      : '';

    box.innerHTML =
      '<div class="about__card glass reveal" data-glass>' +
        (about.avatar
          ? '<img class="about__avatar" src="' + esc(about.avatar) + '" alt="' +
            esc(site.name || '头像') + '" width="480" height="480" loading="lazy" decoding="async">'
          : '') +
        (facts ? '<ul class="about__facts">' + facts + '</ul>' : '') +
      '</div>' +
      '<div class="about__body reveal" data-delay="1">' + paras + now + '</div>';
  }

  /* ── 联系 / 页脚 ──────────────────────────────────────────────────────── */
  function renderContact() {
    var mail = site.email || '';
    var actions = $('#contact-actions');
    if (actions) {
      var html = '';
      if (mail) {
        html += '<a class="btn btn--primary" href="mailto:' + esc(mail) + '">' +
          icon('mail') + '发送邮件</a>';
        html += '<button class="btn btn--ghost" type="button" data-copy="' + esc(mail) + '">' +
          icon('copy') + '复制邮箱</button>';
      }
      if (site.resume) {
        html += '<a class="btn btn--ghost" href="' + esc(site.resume) + '" download>' +
          icon('download') + '下载简历</a>';
      }
      actions.innerHTML = html;
    }

    var socials = $('#socials-list');
    if (socials) {
      socials.innerHTML = (site.socials || []).map(function (s) {
        var inner = icon(s.icon || 'link') + '<span>' + esc(s.label) + '</span>';
        if (s.href) {
          return '<li><a class="social" href="' + esc(s.href) + '"' + linkAttrs(s.href) + '>' +
            inner + '</a></li>';
        }
        if (s.copy) {
          return '<li><button class="social" type="button" data-copy="' + esc(s.copy) + '">' +
            inner + '</button></li>';
        }
        return '<li><span class="social">' + inner + '</span></li>';
      }).join('');
    }
  }

  function renderFooter() {
    var year = new Date().getFullYear();
    var footer = site.footer || {};
    var from = footer.copyrightFrom;
    var range = from && from < year ? from + '–' + year : String(from || year);
    var note = footer.note ? ' · ' + footer.note : '';
    setHTML('#footer-copy', '© ' + esc(range) + ' ' + esc(site.name || '') + esc(note));
  }

  /* ── 页面标题 / 结构化数据 ────────────────────────────────────────────── */
  function syncMeta() {
    var title = [site.name, site.role].filter(Boolean).join(' · ');
    if (title) {
      document.title = title;
      var og = document.querySelector('meta[property="og:title"]');
      if (og) og.setAttribute('content', title);
    }
  }

  function injectSchema() {
    if (!site.name) return;
    var data = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: site.name,
      jobTitle: site.role,
      description: site.tagline,
      url: site.siteUrl
    };
    if (site.email) data.email = 'mailto:' + site.email;
    var sameAs = (site.socials || [])
      .filter(function (s) { return s.href && isExternal(s.href); })
      .map(function (s) { return s.href; });
    if (sameAs.length) data.sameAs = sameAs;

    var script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  /* ── 复制按钮（事件委托，覆盖后渲染出来的元素）───────────────────────── */
  function initCopy() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('[data-copy]') : null;
      if (!btn || !window.UI) return;
      e.preventDefault();
      window.UI.copyText(btn.getAttribute('data-copy'), '已复制到剪贴板');
    });
  }

  /* ── 启动 ─────────────────────────────────────────────────────────────── */
  function boot() {
    renderHero();
    renderProjects();
    renderSkills();
    renderExperience();
    renderPosts();
    renderAbout();
    renderContact();
    renderFooter();
    renderNav();      /* 必须在内容渲染之后：空的区块会被跳过 */
    syncMeta();
    injectSchema();
    initCopy();
    if (window.UI) window.UI.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
