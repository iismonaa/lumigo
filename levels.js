/* ==========================================================================
   LUMIGO — Level, XP, Rank Titles & Achievements System
   ========================================================================== */
(function () {
  window.LUMIGO = window.LUMIGO || {};

  const RANK_MILESTONES = [
    { level: 100, title: 'Champion', badge: '👑' },
    { level: 75, title: 'Legend', badge: '🐉' },
    { level: 50, title: 'Master', badge: '💎' },
    { level: 30, title: 'Expert', badge: '⚡' },
    { level: 20, title: 'Pro Gamer', badge: '🔥' },
    { level: 10, title: 'Gamer', badge: '🎮' },
    { level: 5, title: 'Rookie', badge: '🚀' },
    { level: 1, title: 'Beginner', badge: '🌱' }
  ];

  const ACHIEVEMENTS = [
    { id: 'first_win', name: 'Birinchi Gʻalaba', icon: '🏆', desc: 'Istalgan oʻyinda 1-gʻalabani qoʻlga kiriting' },
    { id: 'five_wins', name: 'Gʻoliblar Safida', icon: '🔥', desc: '5 ta oʻyinda gʻalaba qozoning' },
    { id: 'puzzle_solver', name: 'Aql Ustasi', icon: '🧠', desc: '5 ta puzzle/mantiqiy oʻyinni yuting' },
    { id: 'explorer_10', name: 'Kashfiyotchi', icon: '🧭', desc: 'Kamida 10 xil oʻyinni sinab koʻring' },
    { id: 'rich_gamer', name: 'Xazina Sohibi', icon: '🪙', desc: '1000+ Coin toʻplang' },
    { id: 'level_10', name: 'Haqiqiy Gamer', icon: '⚡', desc: 'Level 10 ga yeting' }
  ];

  function xpRequiredForLevel(level) {
    // Cumulative XP threshold to reach `level`
    if (level <= 1) return 0;
    return Math.floor(100 * Math.pow(level - 1, 1.35));
  }

  function getLevelFromXP(xp) {
    let lvl = 1;
    while (lvl < 100 && xp >= xpRequiredForLevel(lvl + 1)) {
      lvl++;
    }
    return lvl;
  }

  function getRankTitle(level) {
    const found = RANK_MILESTONES.find(m => level >= m.level);
    return found || RANK_MILESTONES[RANK_MILESTONES.length - 1];
  }

  function getXPProgress(xp) {
    const lvl = getLevelFromXP(xp);
    if (lvl >= 100) return { level: 100, current: 0, needed: 100, pct: 100 };
    const currFloor = xpRequiredForLevel(lvl);
    const nextFloor = xpRequiredForLevel(lvl + 1);
    const span = Math.max(1, nextFloor - currFloor);
    const into = Math.max(0, xp - currFloor);
    return {
      level: lvl,
      current: into,
      needed: span,
      pct: Math.min(100, Math.round((into / span) * 100))
    };
  }

  function showLevelUpCelebration(newLevel) {
    const rank = getRankTitle(newLevel);
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.innerHTML = `
      <div class="modal-box animate-levelup" style="max-width:440px;text-align:center;">
        <div style="font-size:4rem;margin-bottom:8px;">${rank.badge}</div>
        <div class="badge badge-cyan" style="margin-bottom:10px;">LEVEL UP!</div>
        <h2 style="font-size:2rem;font-weight:900;background:var(--grad-hot);-webkit-background-clip:text;background-clip:text;color:transparent;">
          LEVEL ${newLevel}
        </h2>
        <p style="font-size:1.15rem;font-weight:800;margin:6px 0 14px;">${rank.title}</p>
        <p style="color:var(--text-secondary);font-size:0.9rem;margin-bottom:18px;">
          +50 🪙 Coin • +3 💎 Diamond bonus qoʻshildi!
        </p>
        <button class="btn btn-primary" onclick="this.closest('.modal-backdrop').remove()">Awesome! 🚀</button>
      </div>
    `;
    document.body.appendChild(modal);
    if (window.LUMIGO.sfx) window.LUMIGO.sfx.playLevelUp();
  }

  function evaluateAchievements(user) {
    const unlocked = new Set(user.achievements || []);
    if (user.wins >= 1) unlocked.add('first_win');
    if (user.wins >= 5) unlocked.add('five_wins');
    if ((user.triedGames || []).length >= 10) unlocked.add('explorer_10');
    if (user.coins >= 1000) unlocked.add('rich_gamer');
    if (user.level >= 10) unlocked.add('level_10');
    return Array.from(unlocked);
  }

  function addXP(amount) {
    const st = window.LUMIGO.storage;
    const active = st.getActiveUser();
    if (!active || amount <= 0) return null;

    let leveledUpTo = null;
    const updated = st.updateActiveUser(u => {
      const oldLvl = getLevelFromXP(u.xp || 0);
      u.xp = (u.xp || 0) + amount;
      const newLvl = getLevelFromXP(u.xp);
      u.level = newLvl;
      if (newLvl > oldLvl) {
        leveledUpTo = newLvl;
        u.coins = (u.coins || 0) + 50;
        u.diamonds = (u.diamonds || 0) + 3;
      }
      u.achievements = evaluateAchievements(u);
      return u;
    });

    if (leveledUpTo) {
      const rank = getRankTitle(leveledUpTo);
      st.addNotification('LEVEL UP!', `Tabriklaymiz! Level ${leveledUpTo} (${rank.title}) ga chiqdingiz!`, rank.badge);
      showLevelUpCelebration(leveledUpTo);
    }
    return updated;
  }

  window.LUMIGO.levels = {
    RANK_MILESTONES,
    ACHIEVEMENTS,
    xpRequiredForLevel,
    getLevelFromXP,
    getRankTitle,
    getXPProgress,
    addXP,
    evaluateAchievements
  };
})();
