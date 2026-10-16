/* ============================================================================
 * assets/js/ui.js —— 交互与动效
 * ----------------------------------------------------------------------------
 * 主题切换、导航、滚动进度、玻璃高光、页面入场动画、复制与提示。
 * 所有动效都会尊重系统的「减少动态效果」设置。
 * ==========================================================================*/

window.UI = (function () {
  'use strict';

  var root = document.documentElement;
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  /* ── 轻提示 ───────────────────────────────────────────────────────────── */
  var toastEl = null;
  var toastTimer = null;
  function toast(msg, ms) {
    toastEl = toastEl || $('#toast');
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toastEl.classList.remove('is-on');
    }, ms || 2200);
  }

  /* ── 复制到剪贴板（file:// 下自动降级）───────────────────────────────── */
  function copyText(text, okMsg) {
    var done = function () { toast(okMsg || '已复制：' + text); };
    var legacy = function () {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      if (ok) done();
      else toast('复制失败，请手动复制：' + text, 4000);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, legacy);
    } else {
      legacy();
    }
  }

  /* ── 明暗主题 ─────────────────────────────────────────────────────────── */
  function initTheme() {
    var btn = $('#theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) { /* 忽略隐私模式报错 */ }
      toast(next === 'dark' ? '已切换到深色' : '已切换到浅色', 1400);
    });
  }

  /* ── 导航：吸顶、移动端菜单、滚动高亮 ────────────────────────────────── */
  function initNav() {
    var nav = $('#nav');
    var links = $('#nav-links');
    var burger = $('#nav-burger');
    if (!nav) return;

    var onScroll = function () {
      nav.classList.toggle('is-stuck', window.scrollY > 14);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    /* 移动端菜单 */
    if (burger && links) {
      var setOpen = function (open) {
        links.classList.toggle('is-open', open);
        burger.classList.toggle('is-open', open);
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
        burger.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
      };
      burger.addEventListener('click', function () {
        setOpen(!links.classList.contains('is-open'));
      });
      links.addEventListener('click', function (e) {
        if (e.target.closest('a')) setOpen(false);
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') setOpen(false);
      });
      document.addEventListener('click', function (e) {
        if (!links.classList.contains('is-open')) return;
        if (e.target.closest('#nav')) return;
        setOpen(false);
      });
      window.addEventListener('resize', function () {
        if (window.innerWidth > 880) setOpen(false);
      });
    }

    /* 滚动高亮 */
    var items = $$('.nav__link', links || document);
    if (!items.length || !('IntersectionObserver' in window)) return;
    var byId = {};
    items.forEach(function (a) {
      byId[a.getAttribute('href').slice(1)] = a;
    });
    var sections = Object.keys(byId)
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);
    if (!sections.length) return;

    var active = null;
    var setActive = function (id) {
      if (active === id) return;
      active = id;
      items.forEach(function (a) { a.classList.remove('is-active'); });
      if (byId[id]) byId[id].classList.add('is-active');
    };

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (s) { spy.observe(s); });

    window.addEventListener('scroll', function () {
      if (window.scrollY < 80) setActive('');
    }, { passive: true });
  }

  /* ── 滚动进度条 ───────────────────────────────────────────────────────── */
  function initProgress() {
    var bar = $('#scroll-progress');
    if (!bar) return;
    var ticking = false;
    var update = function () {
      ticking = false;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    };
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }

  /* ── 玻璃高光跟随指针 ─────────────────────────────────────────────────── */
  function initGlass() {
    if (reduceMotion.matches || !finePointer.matches) return;
    $$('.glass[data-glass]').forEach(function (el) {
      var rect = null;
      el.addEventListener('pointerenter', function () { rect = el.getBoundingClientRect(); });
      el.addEventListener('pointermove', function (e) {
        if (!rect) rect = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - rect.left).toFixed(1) + 'px');
        el.style.setProperty('--my', (e.clientY - rect.top).toFixed(1) + 'px');
      });
      el.addEventListener('pointerleave', function () {
        rect = null;
        el.style.removeProperty('--mx');
        el.style.removeProperty('--my');
      });
    });
  }

  /* ── 背景光点跟随指针 ─────────────────────────────────────────────────── */
  function initSpot() {
    var spot = $('#bg-spot');
    if (!spot || reduceMotion.matches || !finePointer.matches) return;
    var x = window.innerWidth / 2;
    var y = window.innerHeight * 0.3;
    var raf = 0;
    var apply = function () {
      raf = 0;
      spot.style.transform = 'translate3d(' + x.toFixed(0) + 'px,' + y.toFixed(0) + 'px,0)';
    };
    document.addEventListener('pointermove', function (e) {
      x = e.clientX;
      y = e.clientY;
      spot.classList.add('is-on');
      if (!raf) raf = window.requestAnimationFrame(apply);
    }, { passive: true });
    document.addEventListener('pointerleave', function () {
      spot.classList.remove('is-on');
    });
  }

  /* ── 入场动画 ─────────────────────────────────────────────────────────── */
  function initReveal() {
    var items = $$('.reveal');
    if (!items.length) return;
    if (!('IntersectionObserver' in window) || reduceMotion.matches) {
      items.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    items.forEach(function (el) { io.observe(el); });
  }

  function init() {
    initTheme();
    initNav();
    initProgress();
    initGlass();
    initSpot();
    initReveal();
  }

  /* 供 main.js 复用 */
  return {
    init: init,
    toast: toast,
    copyText: copyText,
    $: $,
    $$: $$,
    icon: window.svgIcon
  };
})();
