/* ==========================================================================
   LUMIGO — Global App Shell (Navbar, Intro Animation, Age Modal, Auth Modal, Footer)
   ========================================================================== */
(function () {
  window.LUMIGO = window.LUMIGO || {};

  function getBasePrefix() {
    return window.location.pathname.includes('/pages/') ? '../' : '';
  }

  function getPagesPrefix() {
    return window.location.pathname.includes('/pages/') ? '' : 'pages/';
  }

  function getLogoSVG() {
    return `
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="navLogoG1" x1="10" y1="10" x2="110" y2="110" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#8b5cf6"/>
            <stop offset="45%" stop-color="#3b82f6"/>
            <stop offset="75%" stop-color="#22d3ee"/>
            <stop offset="100%" stop-color="#ec4899"/>
          </linearGradient>
          <linearGradient id="navLogoG2" x1="25" y1="95" x2="95" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#ec4899"/>
            <stop offset="50%" stop-color="#f97316"/>
            <stop offset="100%" stop-color="#facc15"/>
          </linearGradient>
        </defs>
        <rect x="8" y="8" width="104" height="104" rx="28" fill="#0b1126" stroke="url(#navLogoG1)" stroke-width="5"/>
        <path d="M60 18 L98 40 L98 80 L60 102 L22 80 L22 40 Z" fill="url(#navLogoG1)" fill-opacity="0.18" stroke="url(#navLogoG1)" stroke-width="2.5"/>
        <path d="M44 34 L44 76 L80 76" stroke="url(#navLogoG2)" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="82" cy="40" r="8" fill="#22d3ee"/>
        <path d="M70 30 L76 42 L68 44 L78 58" stroke="#facc15" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  }

  function injectNavbar(activePage) {
    const base = getBasePrefix();
    const pages = getPagesPrefix();
    const st = window.LUMIGO.storage;
    const user = st.getActiveUser();
    const t = window.LUMIGO.i18n.t;

    const header = document.getElementById('lumigo-navbar');
    if (!header) return;

    header.className = 'navbar';
    header.innerHTML = `
      <div class="navbar-inner">
        <a href="${base}index.html" class="brand-logo">
          ${getLogoSVG()}
          <div class="brand-text">
            <span class="brand-name">LUMIGO</span>
            <span class="brand-tagline">PLAY. THINK. WIN.</span>
          </div>
        </a>

        <ul class="nav-links">
          <li><a href="${base}index.html" class="nav-link ${activePage === 'home' ? 'active' : ''}" data-i18n="nav_home">${t('nav_home')}</a></li>
          <li><a href="${pages}games.html" class="nav-link ${activePage === 'games' ? 'active' : ''}" data-i18n="nav_games">${t('nav_games')}</a></li>
          <li class="nav-dropdown">
            <a href="${pages}games.html#categories" class="nav-link" data-i18n="nav_categories">${t('nav_categories')} ▾</a>
            <div class="nav-dropdown-menu">
              <a href="${pages}games.html?cat=brain" class="dropdown-item">🧠 Brain Training</a>
              <a href="${pages}games.html?cat=puzzle" class="dropdown-item">🧩 Puzzle Games</a>
              <a href="${pages}games.html?cat=arcade" class="dropdown-item">⚡ Arcade & Reflex</a>
              <a href="${pages}games.html?cat=strategy" class="dropdown-item">♟️ Strategy & Board</a>
              <a href="${pages}games.html?cat=code" class="dropdown-item">💻 Coding & Typing</a>
            </div>
          </li>
          <li><a href="${pages}friends.html" class="nav-link ${activePage === 'friends' ? 'active' : ''}" data-i18n="nav_friends">${t('nav_friends')}</a></li>
          <li><a href="${pages}leaderboard.html" class="nav-link ${activePage === 'leaderboard' ? 'active' : ''}" data-i18n="nav_leaderboard">${t('nav_leaderboard')}</a></li>
          <li><a href="${pages}shop.html" class="nav-link ${activePage === 'shop' ? 'active' : ''}" data-i18n="nav_shop">${t('nav_shop')}</a></li>
          <li><a href="${pages}profile.html" class="nav-link ${activePage === 'profile' ? 'active' : ''}" data-i18n="nav_profile">${t('nav_profile')}</a></li>
          <li><a href="${pages}custom-code.html" class="nav-link ${activePage === 'code' ? 'active' : ''}" data-i18n="nav_code">${t('nav_code')}</a></li>
        </ul>

        <div class="nav-actions">
          <button class="nav-search-btn" id="nav-search-trigger" title="Search">
            <span>🔍</span>
            <span class="search-label" data-i18n="search_btn">${t('search_btn')}</span>
          </button>

          <div class="currency-group">
            <div class="currency-pill coins" title="Coins">🪙 <span id="nav-coins">${user ? user.coins : 0}</span></div>
            <div class="currency-pill diamonds" title="Diamonds">💎 <span id="nav-diamonds">${user ? user.diamonds : 0}</span></div>
          </div>

          <select id="lang-select" class="lang-select" aria-label="Language">
            <option value="uz">🇺🇿 O'z</option>
            <option value="en">🇬🇧 EN</option>
            <option value="ru">🇷🇺 RU</option>
          </select>

          <button class="icon-btn" id="theme-toggle-btn" title="Theme">☀️</button>

          <div class="notif-wrapper">
            <button class="icon-btn" id="notif-bell-btn" title="Notifications">
              🔔
              <span class="notif-badge hidden" id="notif-count">0</span>
            </button>
            <div class="notif-popover" id="notif-popover"></div>
          </div>

          <button class="nav-avatar-btn" id="nav-auth-btn" title="Account">
            <span class="nav-avatar-circle">${user ? user.avatar : '👤'}</span>
            <span>${user ? user.username : 'Login'}</span>
          </button>

          <button class="hamburger-btn" id="hamburger-btn" aria-label="Menu">☰</button>
        </div>
      </div>
    `;

    // Mobile drawer
    let drawer = document.getElementById('mobile-drawer');
    if (!drawer) {
      drawer = document.createElement('div');
      drawer.id = 'mobile-drawer';
      drawer.className = 'mobile-drawer';
      document.body.appendChild(drawer);
    }
    drawer.innerHTML = `
      <a href="${base}index.html" class="nav-link">🏠 <span data-i18n="nav_home">${t('nav_home')}</span></a>
      <a href="${pages}games.html" class="nav-link">🎮 <span data-i18n="nav_games">${t('nav_games')}</span></a>
      <a href="${pages}friends.html" class="nav-link">🤝 <span data-i18n="nav_friends">${t('nav_friends')}</span></a>
      <a href="${pages}leaderboard.html" class="nav-link">🏆 <span data-i18n="nav_leaderboard">${t('nav_leaderboard')}</span></a>
      <a href="${pages}shop.html" class="nav-link">🛒 <span data-i18n="nav_shop">${t('nav_shop')}</span></a>
      <a href="${pages}profile.html" class="nav-link">👤 <span data-i18n="nav_profile">${t('nav_profile')}</span></a>
      <a href="${pages}custom-code.html" class="nav-link">💻 <span data-i18n="nav_code">${t('nav_code')}</span></a>
      <div class="panel-card" style="display:flex;justify-content:space-around;">
        <span>🪙 ${user ? user.coins : 0}</span>
        <span>💎 ${user ? user.diamonds : 0}</span>
        <span>💵 ${user ? user.money : 0}</span>
      </div>
    `;

    header.querySelector('#hamburger-btn').onclick = () => drawer.classList.toggle('open');
    header.querySelector('#nav-search-trigger').onclick = () => window.LUMIGO.search.openSearchModal();
    header.querySelector('#theme-toggle-btn').onclick = () => window.LUMIGO.theme.toggleTheme();
    const langSel = header.querySelector('#lang-select');
    langSel.value = window.LUMIGO.i18n.getLang();
    langSel.onchange = (e) => window.LUMIGO.i18n.setLang(e.target.value);

    header.querySelector('#nav-auth-btn').onclick = () => {
      if (user) window.location.href = pages + 'profile.html';
      else openAuthModal();
    };

    const bellBtn = header.querySelector('#notif-bell-btn');
    const popover = header.querySelector('#notif-popover');
    bellBtn.onclick = (e) => {
      e.stopPropagation();
      popover.classList.toggle('open');
      renderNotifications();
    };
    document.addEventListener('click', (e) => {
      if (!popover.contains(e.target) && e.target !== bellBtn) popover.classList.remove('open');
    });

    window.LUMIGO.theme.applyTheme(window.LUMIGO.theme.getTheme());
    window.LUMIGO.i18n.applyTranslations();
    renderNotifications();
  }

  function renderNotifications() {
    const st = window.LUMIGO.storage;
    const t = window.LUMIGO.i18n.t;
    const list = st.getNotifications();
    const unread = list.filter(n => n.unread).length;
    const badge = document.getElementById('notif-count');
    if (badge) {
      badge.textContent = unread;
      badge.classList.toggle('hidden', unread === 0);
    }
    const popover = document.getElementById('notif-popover');
    if (!popover) return;
    popover.innerHTML = `
      <div class="notif-header">
        <strong>🔔 ${t('notifs_title')}</strong>
        <button class="btn btn-glass btn-sm" id="mark-notifs-btn">${t('mark_read')}</button>
      </div>
      ${list.length ? list.map(n => `
        <div class="notif-item ${n.unread ? 'unread' : ''}">
          <div><strong>${n.icon} ${n.title}</strong></div>
          <div style="color:var(--text-secondary);">${n.body}</div>
          <div class="notif-time">${n.time}</div>
        </div>
      `).join('') : `<div style="text-align:center;color:var(--text-secondary);padding:16px;">Hozircha bildirishnoma yoʻq ✨</div>`}
    `;
    const markBtn = popover.querySelector('#mark-notifs-btn');
    if (markBtn) markBtn.onclick = () => st.markAllNotifsRead();
  }

  function syncNavbarBalances() {
    const user = window.LUMIGO.storage.getActiveUser();
    const c = document.getElementById('nav-coins');
    const d = document.getElementById('nav-diamonds');
    const ab = document.getElementById('nav-auth-btn');
    if (c) c.textContent = user ? user.coins : 0;
    if (d) d.textContent = user ? user.diamonds : 0;
    if (ab) {
      ab.innerHTML = `
        <span class="nav-avatar-circle">${user ? user.avatar : '👤'}</span>
        <span>${user ? user.username : 'Login'}</span>
      `;
    }
  }

  /* ========================================================================
     INTRO ANIMATION (3-5 seconds, Neon Particles, 3D Logo, Progress, Portal)
     ======================================================================== */
  function playIntroAnimation(force = false) {
    const seen = sessionStorage.getItem(window.LUMIGO.storage.KEYS.INTRO_SEEN);
    if (!force && seen) return;
    sessionStorage.setItem(window.LUMIGO.storage.KEYS.INTRO_SEEN, '1');

    const overlay = document.createElement('div');
    overlay.className = 'intro-overlay';
    overlay.innerHTML = `
      <canvas id="intro-particles"></canvas>
      <div class="intro-portal-ring"></div>
      <div class="intro-center">
        <div class="intro-logo-wrap">${getLogoSVG()}</div>
        <div class="intro-brand">LUMIGO</div>
        <div class="intro-slogan">PLAY. THINK. WIN.</div>
        <div class="intro-progress-box">
          <div class="intro-progress-track">
            <div class="intro-progress-fill" id="intro-bar"></div>
          </div>
          <div class="intro-progress-meta">
            <span>Loading Gaming Universe...</span>
            <span id="intro-pct">0%</span>
          </div>
        </div>
      </div>
      <button class="intro-skip-btn" id="intro-skip">Skip ⏭</button>
    `;
    document.body.appendChild(overlay);

    // Neon Particles Canvas
    const canvas = overlay.querySelector('#intro-particles');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = ['#8b5cf6', '#3b82f6', '#22d3ee', '#ec4899', '#facc15', '#84cc16'];
    const particles = Array.from({ length: 75 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2.4,
      vy: (Math.random() - 0.5) * 2.4,
      r: 2 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));

    let animRunning = true;
    function drawParticles() {
      if (!animRunning) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 14;
        ctx.shadowColor = p.color;
        ctx.fill();
      });
      requestAnimationFrame(drawParticles);
    }
    drawParticles();

    // 3.6 second progress bar + portal transition
    let pct = 0;
    const bar = overlay.querySelector('#intro-bar');
    const pctTxt = overlay.querySelector('#intro-pct');

    function closeWithPortal() {
      if (overlay.classList.contains('portal-exit')) return;
      clearInterval(progTimer);
      overlay.classList.add('portal-exit');
      setTimeout(() => {
        animRunning = false;
        overlay.remove();
        maybePromptAge();
      }, 820);
    }

    const progTimer = setInterval(() => {
      pct = Math.min(100, pct + 3);
      bar.style.width = pct + '%';
      pctTxt.textContent = pct + '%';
      if (pct >= 100) closeWithPortal();
    }, 105); // ~3.5 seconds

    overlay.querySelector('#intro-skip').onclick = closeWithPortal;
  }

  /* ========================================================================
     AGE SELECTION MODAL
     ======================================================================== */
  function openAgeModal() {
    const st = window.LUMIGO.storage;
    const t = window.LUMIGO.i18n.t;
    const current = st.getAgeGroup();

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'age-modal';
    modal.innerHTML = `
      <div class="modal-box" style="max-width:680px;">
        ${current ? '<button class="modal-close" id="age-close">✕</button>' : ''}
        <div style="text-align:center;">
          <span class="badge badge-cyan" style="margin-bottom:8px;">🛡️ LUMIGO SAFE PLAY</span>
          <h2 style="font-size:1.7rem;font-weight:900;">${t('age_modal_title')}</h2>
          <p style="color:var(--text-secondary);font-size:0.9rem;margin-top:4px;">${t('age_modal_sub')}</p>
        </div>
        <div class="age-grid">
          ${st.AGE_GROUPS.map(g => `
            <div class="age-card ${current === g.id ? 'selected' : ''}" data-age="${g.id}" style="background:${g.color};">
              <div class="age-card-emoji">${g.emoji}</div>
              <div class="age-card-range">${g.label} yosh</div>
              <div class="age-card-label">${t(g.descKey)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('#age-close');
    if (closeBtn) closeBtn.onclick = () => modal.remove();

    modal.querySelectorAll('[data-age]').forEach(card => {
      card.onclick = () => {
        const id = card.getAttribute('data-age');
        st.setAgeGroup(id);
        modal.remove();
        window.LUMIGO.rewards.toast(`Yosh guruhi tanlandi: ${id} yosh`, '🎯');
      };
    });
  }

  function maybePromptAge() {
    if (!localStorage.getItem(window.LUMIGO.storage.KEYS.AGE_GROUP)) {
      openAgeModal();
    }
  }

  /* ========================================================================
     ACCOUNT AUTH MODAL (Login / Register / Forgot Password / Demo Switch)
     ======================================================================== */
  function openAuthModal(defaultTab = 'login') {
    const st = window.LUMIGO.storage;
    const t = window.LUMIGO.i18n.t;
    const avatars = ['🦊', '🎮', '👑', '🥷', '🚀', '🐉', '🤖', '🦄', '⚡', '💎'];

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    let tab = defaultTab;
    let chosenAvatar = '🦊';

    function render() {
      const users = st.getUsers();
      modal.innerHTML = `
        <div class="modal-box" style="max-width:520px;">
          <button class="modal-close" id="auth-close">✕</button>
          <div class="badge badge-purple" style="margin-bottom:10px;">⚡ Frontend Demo Auth</div>
          <p style="font-size:0.78rem;color:var(--text-secondary);margin-bottom:14px;">${t('demo_auth_note')}</p>

          <div class="tabs-bar">
            <button class="tab-btn ${tab === 'login' ? 'active' : ''}" data-tab="login">Login</button>
            <button class="tab-btn ${tab === 'register' ? 'active' : ''}" data-tab="register">Register</button>
            <button class="tab-btn ${tab === 'forgot' ? 'active' : ''}" data-tab="forgot">Forgot Password</button>
          </div>

          <div id="auth-err" style="color:#fb7185;font-size:0.85rem;font-weight:700;margin-bottom:10px;"></div>

          ${tab === 'login' ? `
            <form id="login-form">
              <div class="form-group">
                <label>Username yoki Email</label>
                <input type="text" id="lg-id" class="form-control" required placeholder="PlayerOne">
              </div>
              <div class="form-group">
                <label>Parol</label>
                <input type="password" id="lg-pw" class="form-control" required placeholder="••••••">
              </div>
              <button type="submit" class="btn btn-primary" style="width:100%;">Kirish</button>
            </form>
            <div style="margin-top:18px;border-top:1px solid var(--border-color);padding-top:14px;">
              <div style="font-size:0.82rem;font-weight:700;margin-bottom:8px;">Tezkor Demo Account almashtirish (Do'stlar tizimini test qilish uchun):</div>
              <div style="display:flex;flex-wrap:wrap;gap:6px;">
                ${users.map(u => `<button class="btn btn-glass btn-sm" data-switch="${u.id}">${u.avatar} ${u.username}</button>`).join('')}
              </div>
            </div>
          ` : ''}

          ${tab === 'register' ? `
            <form id="reg-form">
              <div class="form-group">
                <label>Username</label>
                <input type="text" id="rg-user" class="form-control" required placeholder="CyberHero">
              </div>
              <div class="form-group">
                <label>Email</label>
                <input type="email" id="rg-email" class="form-control" required placeholder="hero@lumigo.uz">
              </div>
              <div class="form-group">
                <label>Parol (Web Crypto SHA-256 bilan hashlanadi)</label>
                <input type="password" id="rg-pw" class="form-control" required minlength="4">
              </div>
              <div class="form-group">
                <label>Tugʻilgan sana</label>
                <input type="date" id="rg-dob" class="form-control" required value="2008-05-10">
              </div>
              <div class="form-group">
                <label>Avatar tanlang</label>
                <div style="display:flex;flex-wrap:wrap;gap:6px;">
                  ${avatars.map(av => `<button type="button" class="icon-btn ${chosenAvatar === av ? 'btn-primary' : ''}" data-av="${av}">${av}</button>`).join('')}
                </div>
              </div>
              <button type="submit" class="btn btn-hot" style="width:100%;">Roʻyxatdan oʻtish 🚀</button>
            </form>
          ` : ''}

          ${tab === 'forgot' ? `
            <form id="forgot-form">
              <div class="form-group">
                <label>Username yoki Email</label>
                <input type="text" id="fg-id" class="form-control" required>
              </div>
              <div class="form-group">
                <label>Yangi parol</label>
                <input type="password" id="fg-pw" class="form-control" required minlength="4">
              </div>
              <button type="submit" class="btn btn-primary" style="width:100%;">Parolni tiklash (Demo)</button>
            </form>
          ` : ''}
        </div>
      `;

      modal.querySelector('#auth-close').onclick = () => modal.remove();
      modal.querySelectorAll('[data-tab]').forEach(b => {
        b.onclick = () => { tab = b.getAttribute('data-tab'); render(); };
      });
      modal.querySelectorAll('[data-av]').forEach(b => {
        b.onclick = () => { chosenAvatar = b.getAttribute('data-av'); render(); };
      });
      modal.querySelectorAll('[data-switch]').forEach(b => {
        b.onclick = () => {
          window.LUMIGO.auth.switchDemoUser(b.getAttribute('data-switch'));
          modal.remove();
          window.LUMIGO.rewards.toast('Account almashtirildi!', '🔄');
        };
      });

      const errBox = modal.querySelector('#auth-err');
      const lgForm = modal.querySelector('#login-form');
      if (lgForm) {
        lgForm.onsubmit = async (e) => {
          e.preventDefault();
          const res = await window.LUMIGO.auth.login({
            identifier: modal.querySelector('#lg-id').value,
            password: modal.querySelector('#lg-pw').value
          });
          if (!res.ok) errBox.textContent = res.error;
          else { modal.remove(); window.LUMIGO.rewards.toast(`Xush kelibsiz, ${res.user.username}!`, '🎮'); }
        };
      }

      const rgForm = modal.querySelector('#reg-form');
      if (rgForm) {
        rgForm.onsubmit = async (e) => {
          e.preventDefault();
          const res = await window.LUMIGO.auth.register({
            username: modal.querySelector('#rg-user').value,
            email: modal.querySelector('#rg-email').value,
            password: modal.querySelector('#rg-pw').value,
            birthDate: modal.querySelector('#rg-dob').value,
            avatar: chosenAvatar
          });
          if (!res.ok) errBox.textContent = res.error;
          else { modal.remove(); window.LUMIGO.rewards.toast(`Account yaratildi!`, '🎉'); }
        };
      }

      const fgForm = modal.querySelector('#forgot-form');
      if (fgForm) {
        fgForm.onsubmit = async (e) => {
          e.preventDefault();
          const res = await window.LUMIGO.auth.resetPassword(
            modal.querySelector('#fg-id').value,
            modal.querySelector('#fg-pw').value
          );
          if (!res.ok) errBox.textContent = res.error;
          else { tab = 'login'; render(); window.LUMIGO.rewards.toast('Parol yangilandi!', '✅'); }
        };
      }
    }

    document.body.appendChild(modal);
    render();
  }

  function injectFooter() {
    const footer = document.getElementById('lumigo-footer');
    if (!footer) return;
    const base = getBasePrefix();
    const pages = getPagesPrefix();
    footer.className = 'site-footer';
    footer.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div>
            <div class="brand-logo" style="margin-bottom:10px;">
              ${getLogoSVG()}
              <div class="brand-text">
                <span class="brand-name">LUMIGO</span>
                <span class="brand-tagline">PLAY. THINK. WIN.</span>
              </div>
            </div>
            <p style="font-size:0.85rem;color:var(--text-secondary);max-width:300px;">
              HTML5, CSS3 va Vanilla JS asosida yaratilgan zamonaviy gaming platforma. Barcha maʼlumotlar lokal brauzerda saqlanadi.
            </p>
            <button class="btn btn-glass btn-sm" style="margin-top:12px;" onclick="window.LUMIGO.app.playIntroAnimation(true)">✨ Replay Intro</button>
          </div>
          <div class="footer-links">
            <strong>Platforma</strong>
            <a href="${base}index.html">Bosh sahifa</a>
            <a href="${pages}games.html">25+ Mini-O'yinlar</a>
            <a href="${pages}shop.html">Do'kon & Skinlar</a>
            <a href="${pages}leaderboard.html">Reyting jadvali</a>
          </div>
          <div class="footer-links">
            <strong>Hamjamiyat</strong>
            <a href="${pages}friends.html">Do'stlar tizimi</a>
            <a href="${pages}profile.html">O'yinchi profili</a>
            <a href="${pages}custom-code.html">Custom Code Sandbox</a>
          </div>
          <div class="footer-links">
            <strong>Sozlamalar</strong>
            <button style="text-align:left;color:inherit;" onclick="window.LUMIGO.app.openAgeModal()">🎯 Yosh guruhini tanlash</button>
            <button style="text-align:left;color:inherit;" onclick="window.LUMIGO.theme.toggleTheme()">🌓 Tun / Kun rejimi</button>
            <button style="text-align:left;color:inherit;" onclick="window.LUMIGO.music.toggleDockExpand()">🎵 Musiqa pleyer</button>
          </div>
        </div>
      </div>
    `;
  }

  function initShell(activePage, withIntro = false) {
    window.LUMIGO.theme.initTheme();
    injectNavbar(activePage);
    injectFooter();
    window.LUMIGO.music.initMusic();

    window.addEventListener('lumigo:user-updated', syncNavbarBalances);
    window.addEventListener('lumigo:notif-updated', renderNotifications);

    if (withIntro) {
      playIntroAnimation(false);
    } else {
      maybePromptAge();
    }
  }

  window.LUMIGO.app = {
    initShell,
    playIntroAnimation,
    openAgeModal,
    openAuthModal
  };
})();
