/* ==========================================================================
   LUMIGO — Home Page Controller (All 12 Sections + Carousels + Tournament)
   ========================================================================== */
(function () {
  function renderHome() {
    const L = window.LUMIGO;
    const st = L.storage;
    const t = L.i18n.t;
    const user = st.getActiveUser();
    const ageId = st.getAgeGroup() || '18-24';
    const kidsSafe = st.isKidsMode();
    const allFiltered = L.getFilteredGamesByAge(L.GAMES);

    // 1. Hero Stats & Quick Launch
    const heroAge = document.getElementById('hero-age-badge');
    if (heroAge) heroAge.textContent = ageId;

    const kidsBadge = document.getElementById('hero-kids-badge');
    if (kidsBadge) {
      kidsBadge.textContent = kidsSafe ? '🛡️ Kids Safe Mode' : '⚡ Full Arena';
      kidsBadge.className = 'badge ' + (kidsSafe ? 'badge-lime' : 'badge-cyan');
    }

    const heroStats = document.getElementById('hero-stats');
    if (heroStats && user) {
      const rank = L.levels.getRankTitle(user.level || 1);
      heroStats.innerHTML = `
        <div class="hero-stat-pill"><strong>${rank.badge} Lvl ${user.level}</strong><span>${rank.title}</span></div>
        <div class="hero-stat-pill"><strong>🪙 ${user.coins}</strong><span>Coins</span></div>
        <div class="hero-stat-pill"><strong>💎 ${user.diamonds}</strong><span>Diamonds</span></div>
        <div class="hero-stat-pill"><strong>💵 ${user.money}</strong><span>Money</span></div>
        <div class="hero-stat-pill"><strong>⚡ ${user.energy ?? 100}%</strong><span>Energy</span></div>
      `;
    }

    const quickBox = document.getElementById('hero-quick-games');
    if (quickBox) {
      const top4 = allFiltered.slice(0, 4);
      quickBox.innerHTML = top4.map(g => `
        <div class="hero-mini-tile" onclick="window.LUMIGO.launchGame('${g.id}')">
          <div style="font-size:1.8rem;margin-bottom:4px;">${g.icon}</div>
          <div style="font-weight:800;font-size:0.9rem;">${g.title}</div>
          <div style="font-size:0.74rem;color:var(--text-secondary);">${g.category.toUpperCase()}</div>
        </div>
      `).join('');
    }

    // 2-5. Carousels
    function fillCarousel(id, items, ms) {
      const wrap = document.getElementById(id);
      if (!wrap) return;
      const track = wrap.querySelector('.carousel-track');
      track.innerHTML = items.map(L.renderGameCardHTML).join('');
      L.carousel.initCarousel(wrap, ms);
    }
    fillCarousel('car-featured', allFiltered.filter(g => g.featured), 3500);
    fillCarousel('car-trending', allFiltered.filter(g => g.trending), 3900);
    fillCarousel('car-popular', allFiltered.filter(g => g.popular), 4200);
    fillCarousel('car-new', allFiltered.filter(g => g.newGame), 3700);

    // 6. Continue Playing
    const contBox = document.getElementById('grid-continue');
    if (contBox) {
      const recentIds = (user && user.lastPlayedGames) || ['memory', 'snake', 'game-2048'];
      const recentGames = recentIds.map(id => allFiltered.find(g => g.id === id)).filter(Boolean).slice(0, 4);
      contBox.innerHTML = recentGames.map(L.renderGameCardHTML).join('');
    }

    // 7. Recommended For You
    const recBox = document.getElementById('grid-recommended');
    const recNote = document.getElementById('rec-age-note');
    if (recNote) {
      recNote.textContent = kidsSafe
        ? `${ageId} yosh uchun xavfsiz va rivojlantiruvchi oʻyinlar`
        : `${ageId} yosh toifasiga mos tavsiya etilgan oʻyinlar`;
    }
    if (recBox) {
      recBox.innerHTML = allFiltered.slice(0, 4).map(L.renderGameCardHTML).join('');
    }

    // 8. Brain Training
    const brainBox = document.getElementById('grid-brain');
    if (brainBox) {
      brainBox.innerHTML = allFiltered.filter(g => g.category === 'brain' || g.category === 'puzzle').slice(0, 4).map(L.renderGameCardHTML).join('');
    }

    // 9. Multiplayer Games
    const multiBox = document.getElementById('grid-multiplayer');
    if (multiBox) {
      multiBox.innerHTML = allFiltered.filter(g => g.supports2P || g.supportsBot).slice(0, 4).map(L.renderGameCardHTML).join('');
    }

    // 10. Daily Challenges
    renderChallenges();

    // 11. Top Players Podium
    const podBox = document.getElementById('home-podium');
    if (podBox) {
      const sorted = [...st.getUsers()].sort((a, b) => (b.weeklyScore || 0) - (a.weeklyScore || 0)).slice(0, 3);
      podBox.innerHTML = sorted.map((u, idx) => {
        const rank = L.levels.getRankTitle(u.level || 1);
        const rNum = idx + 1;
        return `
          <div class="podium-card rank-${rNum}">
            <div style="font-size:1.4rem;margin-bottom:6px;">${rNum === 1 ? '🥇' : rNum === 2 ? '🥈' : '🥉'} #${rNum}</div>
            <div class="podium-avatar ${u.frame || 'frame-default'}">${u.avatar}</div>
            <h3 style="font-weight:800;">${u.username}</h3>
            <div style="font-size:0.82rem;color:var(--text-secondary);margin:4px 0;">${rank.badge} Lvl ${u.level} • ${rank.title}</div>
            <div class="badge badge-cyan">⭐ ${u.weeklyScore} pts</div>
          </div>
        `;
      }).join('');
    }

    // 12. Weekly Tournament
    renderTournament();
  }

  function renderChallenges() {
    const L = window.LUMIGO;
    const daily = L.rewards.getDailyState();
    const lang = L.i18n.getLang();
    const t = L.i18n.t;

    const streakEl = document.getElementById('home-streak');
    if (streakEl) streakEl.textContent = daily.streak || 1;

    const box = document.getElementById('home-challenges');
    if (!box) return;
    box.innerHTML = daily.tasks.map(task => {
      const title = lang === 'ru' ? task.titleRu : lang === 'en' ? task.titleEn : task.titleUz;
      const pct = Math.min(100, Math.round((task.progress / task.target) * 100));
      const ready = task.progress >= task.target && !task.claimed;
      return `
        <div class="challenge-card">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <strong>${title}</strong>
            <span class="badge badge-purple">${task.progress}/${task.target}</span>
          </div>
          <div class="progress-track"><div class="progress-fill" style="width:${pct}%;"></div></div>
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.82rem;">
            <span>🪙 +${task.coins} • 💎 +${task.diamonds}</span>
            ${task.claimed
              ? `<span class="badge badge-lime">✓ ${t('claimed')}</span>`
              : `<button class="btn btn-sm ${ready ? 'btn-lime' : 'btn-glass'}" ${ready ? '' : 'disabled'} data-claim="${task.id}">${t('claim')}</button>`
            }
          </div>
        </div>
      `;
    }).join('');

    box.querySelectorAll('[data-claim]').forEach(btn => {
      btn.onclick = () => {
        if (L.rewards.claimDailyTask(btn.getAttribute('data-claim'))) {
          L.rewards.toast('Kunlik mukofot olindi!', '🎁');
          renderChallenges();
        }
      };
    });
  }

  function renderTournament() {
    const st = window.LUMIGO.storage;
    const tourney = st.readJSON(st.KEYS.TOURNAMENT, { joined: false, points: 0 });
    const box = document.getElementById('home-tournament');
    if (!box) return;

    box.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:18px;">
        <div>
          <span class="badge badge-orange" style="margin-bottom:8px;">🏆 HAFTALIK TURNIR • LOKAL DEMO LIGA</span>
          <h2 style="font-size:1.6rem;font-weight:900;">LUMIGO Neon Cup — 500 🪙 + 25 💎 Mukofot Jamgʻarmasi</h2>
          <p style="color:var(--text-secondary);max-width:620px;margin-top:4px;">
            Turnirga qoʻshiling va istalgan oʻyinda gʻalaba qozonib turnir ochkolarini toʻplang! Eng yuqori ochko toʻplagan lokal ishtirokchi haftalik chempion boʻladi.
          </p>
        </div>
        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
          ${tourney.joined
            ? `<div class="panel-card" style="padding:12px 18px;text-align:center;">
                 <div style="font-size:0.75rem;color:var(--text-secondary);">Sizning turnir ochkongiz</div>
                 <strong style="font-size:1.35rem;color:var(--cyan);">${tourney.points} pts</strong>
               </div>
               <button class="btn btn-hot" onclick="window.LUMIGO.launchGame('math-battle')">⚡ Turnir o'yinini o'ynash</button>`
            : `<button class="btn btn-primary" id="join-tourney-btn">🔥 Turnirga qoʻshilish</button>`
          }
        </div>
      </div>
    `;
    const joinBtn = box.querySelector('#join-tourney-btn');
    if (joinBtn) {
      joinBtn.onclick = () => {
        st.writeJSON(st.KEYS.TOURNAMENT, { joined: true, points: tourney.points || 0 });
        window.LUMIGO.rewards.toast('Haftalik turnirga qoʻshildingiz!', '🏆');
        renderTournament();
      };
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    window.LUMIGO.app.initShell('home', true);
    renderHome();
    window.addEventListener('lumigo:user-updated', renderHome);
    window.addEventListener('lumigo:age-updated', renderHome);
    window.addEventListener('lumigo:lang-changed', renderHome);
    window.addEventListener('lumigo:daily-updated', renderChallenges);
  });
})();
