/* ===========================================================================
   OVERCOOKED WEDDING · 交互逻辑
   配置绑定 / 长按接单 / 限时配餐 / 来电轮播 / 倒计时 / 音乐 / 表单
   =========================================================================== */

(() => {
  const CFG = window.WEDDING_INVITATION || {};
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const onReady = (fn) => (document.readyState === 'loading')
    ? document.addEventListener('DOMContentLoaded', fn) : fn();

  onReady(() => {
    const steps = [
      ['config', bindConfig],
      ['image fallbacks', bindImageFallbacks],
      ['hero entry', bindHeroEntry],
      ['reveal', bindRevealOnScroll],
      ['long press', bindLongPress],
      ['game', initGame],
      ['crew', renderCrew],
      ['schedule', renderSchedule],
      ['countdown', initCountdown],
      ['music', initMusic],
      ['rsvp', bindRSVP],
      ['sticky hud', bindStickyHud],
      ['quick nav', bindQuickNavHighlight],
    ];
    steps.forEach(([name, fn]) => {
      try {
        fn();
      } catch (error) {
        console.error('[WEDDING INIT]', name, error);
      }
    });
  });

  // -------- 配置绑定 --------
  function bindConfig() {
    $$('[data-field]').forEach((el) => {
      const key = el.getAttribute('data-field');
      const v = CFG[key];
      if (typeof v === 'string') el.textContent = v;
    });
    $$('[data-link]').forEach((el) => {
      const key = el.getAttribute('data-link');
      const v = CFG[key];
      if (typeof v === 'string' && /^https?:\/\//.test(v)) el.setAttribute('href', v);
    });
  }

  // -------- 图片加载回退（CSP 兼容，不使用内联 onerror）--------
  function installImageFallback(img) {
    const fallback = img?.dataset?.fallbackSrc;
    if (!img || !fallback) return;
    const swap = () => {
      if (img.getAttribute('src') === fallback) return;
      img.removeAttribute('srcset');
      img.removeAttribute('sizes');
      img.setAttribute('src', fallback);
    };
    img.addEventListener('error', swap, { once: true });
    if (img.complete && img.naturalWidth === 0) swap();
  }

  function bindImageFallbacks() {
    $$('img[data-fallback-src]').forEach(installImageFallback);
  }

  // -------- 首页进入后厨 --------
  function bindHeroEntry() {
    const btn = $('#start-mission');
    const hero = $('#top');
    const target = $('#briefing');
    const quickNav = $('.quick-nav');
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (btn && target) {
      btn.addEventListener('click', () => {
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      });
    }

    if (hero && quickNav) {
      const updateNav = () => {
        const rect = hero.getBoundingClientRect();
        quickNav.classList.toggle('visible', rect.bottom <= window.innerHeight * 0.9);
      };
      updateNav();
      window.addEventListener('scroll', updateNav, { passive: true });
      window.addEventListener('resize', updateNav, { passive: true });
    } else if (quickNav) {
      quickNav.classList.add('visible');
    }
  }

  // -------- 滚动渐入 --------
  function bindRevealOnScroll() {
    const items = $$('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('show'));
      return;
    }

    items.forEach((el) => el.classList.add('reveal-pending'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('show');
        e.target.classList.remove('reveal-pending');
        io.unobserve(e.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px 8% 0px' });
    items.forEach((el) => io.observe(el));

    // Safety net: content must never remain permanently hidden if an embedded
    // browser stops delivering IntersectionObserver callbacks.
    window.setTimeout(() => {
      $$('.reveal-pending').forEach((el) => {
        el.classList.add('show');
        el.classList.remove('reveal-pending');
      });
    }, 1800);
  }

  // -------- 长按接单 --------
  function bindLongPress() {
    const btn = $('#accept-quest');
    if (!btn) return;
    const fill = btn.parentElement.querySelector('.hold-progress i');
    const status = $('#quest-status');
    const complete = $('#mission-complete');
    const DURATION = 1100;
    let timer = null, startedAt = 0, raf = null;

    const reset = () => {
      if (raf) cancelAnimationFrame(raf);
      clearTimeout(timer);
      timer = null; raf = null;
      btn.style.transform = '';
      if (complete.classList.contains('show')) {
        if (fill) fill.style.width = '100%';
        status.textContent = 'ACCEPTED';
        return;
      }
      if (fill) fill.style.width = '0%';
      status.textContent = 'WAITING';
    };
    const start = (e) => {
      if (timer || complete.classList.contains('show')) return;
      e.preventDefault();
      startedAt = Date.now();
      status.textContent = 'ACCEPTING...';
      timer = setTimeout(() => {
        timer = null;
        status.textContent = 'ACCEPTED';
        complete.classList.add('show');
        btn.disabled = true;
        if (fill) fill.style.width = '100%';
        try { navigator.vibrate && navigator.vibrate(40); } catch (_) {}
      }, DURATION);
      const tick = () => {
        const elapsed = Date.now() - startedAt;
        if (fill) fill.style.width = Math.min(100, (elapsed / DURATION) * 100) + '%';
        if (timer && elapsed < DURATION) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    btn.addEventListener('pointerdown', start);
    btn.addEventListener('pointerup', reset);
    btn.addEventListener('pointerleave', reset);
    btn.addEventListener('pointercancel', reset);
    btn.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
    btn.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) start(e);
    });
    btn.addEventListener('keyup', (e) => {
      if (e.key === 'Enter' || e.key === ' ') reset();
    });
  }

  // -------- 限时配餐小游戏 --------
  function initGame() {
    const startBtn = $('#game-start');
    const restartBtn = $('#game-restart');
    const intro = $('#game-intro');
    const result = $('#game-result');
    const stage = $('#game-stage');
    const tilesEl = $('#game-tiles');
    const orderTicket = $('#order-ticket');
    const orderName = $('#order-name');
    const orderParts = $('#order-parts');
    const timeEl = $('#game-time');
    const scoreEl = $('#game-score');
    const comboEl = $('#game-combo');
    const starsEl = $('#game-stars');
    const finalScoreEl = $('#game-final-score');
    const starsFinalEl = $('#game-stars-final');
    const rewardEl = $('#game-reward');
    const bestEl = $('#game-best');
    const hudOrder = $('#hud-order-name');
    const hudScore = $('#hud-score');

    const recipes = Array.isArray(CFG.gameRecipes) && CFG.gameRecipes.length
      ? CFG.gameRecipes
      : [{ name: '芝士汉堡', parts: ['🍞', '🥩', '🧀', '🥬', '🍞'] }];
    const blessings = Array.isArray(CFG.gameBlessings) ? CFG.gameBlessings : [];
    const rewards = Array.isArray(CFG.gameRewards) ? CFG.gameRewards : [];

    const POOL = Array.from(new Set(recipes.flatMap((r) => r.parts)));
    const TIME_LIMIT = 30;
    const TIME_PENALTY = 2;
    const TILE_COUNT = 12;
    const TARGET_ORDERS = 4;
    const STAR_THRESHOLDS = [80, 160, 240];

    let state = null;

    const setBest = (v) => { bestEl.textContent = String(v); try { localStorage.setItem('oc_wedding_best', String(v)); } catch (_) {} };
    const getBest = () => { try { return parseInt(localStorage.getItem('oc_wedding_best') || '0', 10) || 0; } catch (_) { return 0; } };
    setBest(getBest());

    function newOrder() {
      const r = recipes[Math.floor(Math.random() * recipes.length)];
      return { name: r.name, parts: r.parts.slice(), index: 0, completed: false };
    }

    function shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    function renderTiles(current) {
      const remaining = current.parts.slice(current.index);
      const distractors = shuffle(POOL.filter((p) => !remaining.includes(p))).slice(0, Math.max(0, TILE_COUNT - remaining.length));
      const tiles = shuffle([...remaining, ...distractors]);
      tilesEl.innerHTML = '';
      tiles.forEach((emoji) => {
        const el = document.createElement('button');
        el.type = 'button';
        el.className = 'game-tile';
        el.textContent = emoji;
        el.setAttribute('aria-label', '食材 ' + emoji);
        el.addEventListener('click', () => onTap(emoji, el));
        tilesEl.appendChild(el);
      });
    }

    function renderOrderTicket(current) {
      orderName.textContent = current.name;
      orderParts.innerHTML = '';
      current.parts.forEach((p, i) => {
        const chip = document.createElement('span');
        chip.className = 'part-chip' + (i < current.index ? ' done' : (i === current.index ? ' current' : ''));
        chip.textContent = p;
        orderParts.appendChild(chip);
      });
      orderTicket.classList.add('show');
      if (hudOrder) hudOrder.textContent = current.name;
    }

    function updateHUD() {
      timeEl.textContent = state.timeLeft.toFixed(1);
      scoreEl.textContent = String(state.score);
      comboEl.textContent = '×' + state.combo;
      starsEl.textContent = state.starsShown;
      if (hudScore) hudScore.textContent = String(state.score);
    }

    function computeStars(score) {
      if (score >= STAR_THRESHOLDS[2]) return '★★★';
      if (score >= STAR_THRESHOLDS[1]) return '★★☆';
      if (score >= STAR_THRESHOLDS[0]) return '★☆☆';
      return '☆☆☆';
    }

    function onTap(emoji, el) {
      if (!state.running) return;
      const cur = state.order;
      const need = cur.parts[cur.index];
      if (emoji === need) {
        el.classList.add('flash-correct');
        setTimeout(() => el.classList.remove('flash-correct'), 320);
        cur.index++;
        state.combo += 1;
        state.score += 10 + Math.min(state.combo * 2, 20);
        if (cur.index >= cur.parts.length) {
          cur.completed = true;
          state.ordersCompleted += 1;
          state.score += 30;
          pickNextOrder();
        } else {
          renderOrderTicket(cur);
          renderTiles(cur);
        }
      } else {
        el.classList.add('flash-wrong');
        setTimeout(() => el.classList.remove('flash-wrong'), 320);
        state.combo = 0;
        state.timeLeft = Math.max(0, state.timeLeft - TIME_PENALTY);
      }
      updateHUD();
    }

    function pickNextOrder() {
      if (state.ordersCompleted >= TARGET_ORDERS || state.timeLeft <= 0) { finishGame(); return; }
      state.order = newOrder();
      renderOrderTicket(state.order);
      renderTiles(state.order);
    }

    function startGame() {
      intro.hidden = true;
      result.hidden = true;
      tilesEl.style.display = '';
      orderTicket.style.display = '';
      state = {
        running: true,
        timeLeft: TIME_LIMIT,
        score: 0,
        combo: 0,
        ordersCompleted: 0,
        starsShown: '☆☆☆',
        order: newOrder(),
        lastTs: performance.now(),
      };
      renderOrderTicket(state.order);
      renderTiles(state.order);
      updateHUD();
      requestAnimationFrame(tick);
    }

    function tick(now) {
      if (!state || !state.running) return;
      const dt = (now - state.lastTs) / 1000;
      state.lastTs = now;
      state.timeLeft = Math.max(0, state.timeLeft - dt);
      state.starsShown = computeStars(state.score);
      updateHUD();
      if (state.timeLeft <= 0) { finishGame(); return; }
      requestAnimationFrame(tick);
    }

    function finishGame() {
      if (!state) return;
      state.running = false;
      tilesEl.style.display = 'none';
      orderTicket.style.display = 'none';
      const stars = computeStars(state.score);
      const reward = rewards.length ? rewards[Math.floor(Math.random() * rewards.length)] : '婚礼彩蛋已解锁';
      finalScoreEl.textContent = state.score + ' PTS';
      starsFinalEl.textContent = stars;
      rewardEl.textContent = reward;
      result.hidden = false;
      if (state.score > getBest()) setBest(state.score);
      try { localStorage.setItem('oc_wedding_last', JSON.stringify({ score: state.score, stars, ts: Date.now() })); } catch (_) {}
    }

    if (startBtn) startBtn.addEventListener('click', startGame);
    if (restartBtn) restartBtn.addEventListener('click', startGame);
  }

  // -------- 厨房小队来电 --------
  function renderCrew() {
    const slides = $('#crew-slides');
    const nameOut = $('#crew-name');
    const list = Array.isArray(CFG.crewMessages) ? CFG.crewMessages : [];
    if (!slides || !nameOut || !list.length) return;

    slides.replaceChildren();
    list.forEach((c, i) => {
      const el = document.createElement('div');
      el.className = 'crew-slide' + (i === 0 ? ' active' : '');

      const photo = document.createElement('div');
      photo.className = 'crew-photo';
      const img = document.createElement('img');
      const src = typeof c.image === 'string' && c.image ? c.image : './assets/chef-platypus.webp';
      img.src = src;
      img.alt = typeof c.name === 'string' ? c.name : '';
      img.loading = 'lazy';
      img.decoding = 'async';
      if (src.endsWith('.webp')) img.dataset.fallbackSrc = src.replace(/\.webp$/i, '.png');
      installImageFallback(img);
      photo.appendChild(img);

      const name = document.createElement('p');
      name.className = 'crew-name';
      name.textContent = c.name || 'CHEF ' + (i + 1);

      const message = document.createElement('p');
      message.className = 'crew-msg';
      message.textContent = c.message || '';

      el.append(photo, name, message);
      slides.appendChild(el);
    });

    let idx = 0;
    const total = list.length;
    const render = () => {
      $$('.crew-slide', slides).forEach((el, i) => el.classList.toggle('active', i === idx));
      nameOut.textContent = `${list[idx].name || 'CHEF'} · ${idx + 1}/${total}`;
    };
    $$('[data-crew]', slides.closest('.crew-phone') || document).forEach((btn) => {
      btn.addEventListener('click', () => {
        idx = (btn.dataset.crew === 'next') ? (idx + 1) % total : (idx - 1 + total) % total;
        render();
      });
    });
    render();
  }

  // -------- 婚宴菜单 --------
  function renderSchedule() {
    const list = $('#schedule-list');
    if (!list) return;
    const items = Array.isArray(CFG.schedule) ? CFG.schedule : [];
    list.replaceChildren();
    items.forEach((s) => {
      const row = document.createElement('div');
      row.className = 'menu-item';

      const time = document.createElement('span');
      time.className = 'time';
      time.textContent = s.time || '--:--';

      const copy = document.createElement('div');
      const title = document.createElement('h4');
      title.textContent = s.title || '';
      const detail = document.createElement('p');
      detail.textContent = s.detail || '';
      copy.append(title, detail);

      const stars = document.createElement('span');
      stars.className = 'stars';
      stars.textContent = s.stars || '★';

      row.append(time, copy, stars);
      list.appendChild(row);
    });
  }

  // -------- 倒计时 --------
  function initCountdown() {
    const el = $('#days-count');
    if (!el) return;
    const target = new Date(CFG.dateTime || Date.now() + 86400000 * 30);
    const tick = () => {
      const diff = target.getTime() - Date.now();
      const days = Math.max(0, Math.ceil(diff / 86400000));
      el.textContent = String(days);
    };
    tick();
    setInterval(tick, 60000);
  }

  // -------- 背景音乐 --------
  function initMusic() {
    const audio = $('#wedding-bgm');
    const toggle = $('#music-toggle');
    const hint = $('#music-hint');
    if (!audio || !toggle) return;
    if (CFG.musicUrl) audio.src = CFG.musicUrl;
    if (hint && CFG.musicHint) hint.textContent = CFG.musicHint;
    if (!CFG.musicEnabled) { audio.removeAttribute('autoplay'); return; }
    audio.volume = 0.55;
    const setPlaying = (on) => {
      toggle.setAttribute('aria-pressed', on ? 'true' : 'false');
    };
    toggle.addEventListener('click', () => {
      if (audio.paused) {
        audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      } else {
        audio.pause();
        setPlaying(false);
      }
    });
    // Hero 按钮点击时尝试播放
    const startBtn = $('#start-mission');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        if (audio.paused) audio.play().then(() => setPlaying(true)).catch(() => {});
      });
    }
  }

  // -------- 厨师报到（RSVP） --------
  function bindRSVP() {
    const form = $('#rsvp-form');
    const success = $('#rsvp-success');
    const summary = $('#rsvp-success-summary');
    const editBtn = $('#rsvp-edit');
    const errEl = $('#rsvp-error');
    const messageCount = $('#message-count');
    const messageField = form && form.querySelector('textarea[name="message"]');
    const attendanceDetails = $('#attendance-details');

    if (!form) return;

    const setAttendanceState = () => {
      const attending = form.querySelector('input[name="attending"]:checked')?.value === 'yes';
      if (attendanceDetails) {
        attendanceDetails.classList.toggle('is-disabled', !attending);
        attendanceDetails.querySelectorAll('input, select').forEach((field) => {
          field.disabled = !attending;
        });
      }
    };
    form.querySelectorAll('input[name="attending"]').forEach((radio) => {
      radio.addEventListener('change', setAttendanceState);
    });
    setAttendanceState();

    if (messageField && messageCount) {
      messageField.addEventListener('input', () => {
        messageCount.textContent = String(messageField.value.length);
      });
    }

    // 仅本机演示：不请求接口、不跳转第三方，数据只保存在当前浏览器。
    const KEY = 'oc_wedding_rsvp';
    const saved = (() => { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (_) { return null; } })();
    if (saved && typeof saved === 'object') {
      Object.entries(saved).forEach(([k, v]) => {
        const f = form.elements.namedItem(k);
        if (!f) return;
        if (f instanceof RadioNodeList) {
          f.forEach((r) => { if (r.value === v) r.checked = true; });
        } else if ('value' in f) {
          f.value = v;
        }
      });
      if (saved.message && messageCount) messageCount.textContent = String(saved.message.length);
      showSuccess(saved);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      if (!data.guestName || !data.attending) {
        if (errEl) { errEl.textContent = '请填写姓名并选择是否赴约。'; errEl.hidden = false; }
        return;
      }
      try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (_) {}
      if (errEl) errEl.hidden = true;
      showSuccess(data);
    });

    if (editBtn) editBtn.addEventListener('click', () => {
      success.hidden = true;
      form.hidden = false;
      window.scrollTo({ top: form.offsetTop - 80, behavior: 'smooth' });
    });

    function showSuccess(data) {
      if (!success || !summary) return;
      form.hidden = true;
      const partyText = data.attending === 'yes' ? ` · ${data.partySize || '1'} 人` : '';
      summary.textContent = `${data.guestName} · ${data.attending === 'yes' ? '已确认赴约' : '遗憾缺席'}${partyText}。记录仅保存在此浏览器中。`;
      const title = $('#rsvp-success-title');
      if (title) title.textContent = '演示登记已保存';
      success.hidden = false;
    }
  }

  // -------- 滚动 HUD 显示 --------
  function bindStickyHud() {
    const hud = $('.game-hud');
    if (!hud) return;
    const trigger = $('.briefing');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.target === trigger) hud.classList.toggle('visible', !e.isIntersecting && e.boundingClientRect.top < 0);
      });
    });
    obs.observe(trigger);
  }

  // -------- 快捷导航 active 状态 --------
  function bindQuickNavHighlight() {
    const links = $$('.quick-nav a');
    if (!links.length) return;
    const targets = links.map((a) => $(a.getAttribute('href'))).filter(Boolean);
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const i = targets.indexOf(e.target);
        if (i >= 0 && e.isIntersecting) {
          links.forEach((l) => l.classList.remove('active'));
          links[i].classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    targets.forEach((t) => obs.observe(t));
  }
})();
