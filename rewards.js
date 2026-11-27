/* ==========================================================================
   LUMIGO — Currencies (Coins, Diamonds, Money, Energy) & Daily Challenges
   ========================================================================== */
(function () {
  window.LUMIGO = window.LUMIGO || {};

  function getTodayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function getDailyState() {
    const st = window.LUMIGO.storage;
    const today = getTodayKey();
    let state = st.readJSON(st.KEYS.DAILY, null);
    if (!state || state.date !== today) {
      const prevStreak = state && state.streak ? state.streak : 1;
      const yesterday = new Date(Date.now() - 86400000);
      const yKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
      const newStreak = state && state.date === yKey ? prevStreak + 1 : (state ? 1 : 1);

      state = {
        date: today,
        streak: newStreak,
        newGamesTriedToday: [],
        tasks: [
          { id: 'win_3', titleUz: "3 ta o'yinda g'alaba qozon", titleEn: 'Win 3 games', titleRu: 'Выиграй 3 игры', progress: 0, target: 3, coins: 150, diamonds: 5, xp: 200, claimed: false },
          { id: 'solve_10', titleUz: '10 ta puzzle yech', titleEn: 'Solve 10 puzzles', titleRu: 'Реши 10 головоломок', progress: 0, target: 10, coins: 220, diamonds: 8, xp: 260, claimed: false },
          { id: 'earn_500_xp', titleUz: "500 XP to'pla", titleEn: 'Earn 500 XP', titleRu: 'Набери 500 XP', progress: 0, target: 500, coins: 180, diamonds: 10, money: 50, xp: 120, claimed: false },
          { id: 'try_2_games', titleUz: "2 ta yangi o'yin sinab ko'r", titleEn: 'Try 2 different games', titleRu: 'Попробуй 2 разные игры', progress: 0, target: 2, coins: 120, diamonds: 4, xp: 150, claimed: false }
        ]
      };
      st.writeJSON(st.KEYS.DAILY, state);
    }
    return state;
  }

  function saveDailyState(state) {
    const st = window.LUMIGO.storage;
    st.writeJSON(st.KEYS.DAILY, state);
    window.dispatchEvent(new CustomEvent('lumigo:daily-updated', { detail: state }));
  }

  function trackGameResult({ gameId, category, won, score, xpEarned, coinsEarned, diamondsEarned, moneyEarned, energyCost }) {
    const st = window.LUMIGO.storage;
    const active = st.getActiveUser();
    if (!active) return null;

    // 1. Update User Balances & Stats
    st.updateActiveUser(u => {
      u.totalGames = (u.totalGames || 0) + 1;
      if (won) {
        u.wins = (u.wins || 0) + 1;
        u.coins = Math.max(0, (u.coins || 0) + (coinsEarned || 0));
        u.diamonds = Math.max(0, (u.diamonds || 0) + (diamondsEarned || 0));
        u.money = Math.max(0, (u.money || 0) + (moneyEarned || 0));
        u.weeklyScore = (u.weeklyScore || 0) + Math.max(50, Math.round(score || 50));
      } else {
        u.losses = (u.losses || 0) + 1;
        u.energy = Math.max(0, (u.energy ?? 100) - (energyCost || 5));
      }
      // Track recent & tried games
      const recent = [gameId, ...(u.lastPlayedGames || []).filter(id => id !== gameId)].slice(0, 8);
      u.lastPlayedGames = recent;
      const tried = new Set(u.triedGames || []);
      tried.add(gameId);
      u.triedGames = Array.from(tried);
      if (category === 'puzzle' && won) {
        const ach = new Set(u.achievements || []);
        if (u.wins >= 5) ach.add('puzzle_solver');
        u.achievements = Array.from(ach);
      }
      return u;
    });

    // 2. Add XP & check Level Up
    if (xpEarned > 0) {
      window.LUMIGO.levels.addXP(xpEarned);
    }

    // 3. Update Daily Challenges
    const daily = getDailyState();
    daily.tasks.forEach(t => {
      if (t.id === 'win_3' && won) t.progress = Math.min(t.target, t.progress + 1);
      if (t.id === 'solve_10' && won && (category === 'puzzle' || category === 'brain' || category === 'logic')) {
        t.progress = Math.min(t.target, t.progress + 1);
      }
      if (t.id === 'earn_500_xp' && xpEarned > 0) {
        t.progress = Math.min(t.target, t.progress + xpEarned);
      }
    });
    if (!daily.newGamesTriedToday.includes(gameId)) {
      daily.newGamesTriedToday.push(gameId);
      const tryTask = daily.tasks.find(t => t.id === 'try_2_games');
      if (tryTask) tryTask.progress = Math.min(tryTask.target, daily.newGamesTriedToday.length);
    }
    saveDailyState(daily);

    // 4. Update Weekly Tournament score if joined
    const tourney = st.readJSON(st.KEYS.TOURNAMENT, { joined: false, points: 0 });
    if (tourney.joined && won) {
      tourney.points += Math.round((score || 100) * 0.5) + 40;
      st.writeJSON(st.KEYS.TOURNAMENT, tourney);
    }

    return st.getActiveUser();
  }

  function claimDailyTask(taskId) {
    const daily = getDailyState();
    const task = daily.tasks.find(t => t.id === taskId);
    if (!task || task.claimed || task.progress < task.target) return false;
    task.claimed = true;
    saveDailyState(daily);

    const st = window.LUMIGO.storage;
    st.updateActiveUser(u => {
      u.coins = (u.coins || 0) + (task.coins || 0);
      u.diamonds = (u.diamonds || 0) + (task.diamonds || 0);
      u.money = (u.money || 0) + (task.money || 0);
      return u;
    });
    if (task.xp) window.LUMIGO.levels.addXP(task.xp);
    st.addNotification('Kunlik vazifa!', `+${task.coins} 🪙, +${task.diamonds} 💎 qoʻshildi!`, '🎁');
    return true;
  }

  function toast(msg, icon = '✨') {
    let box = document.getElementById('lumigo-toasts');
    if (!box) {
      box = document.createElement('div');
      box.id = 'lumigo-toasts';
      box.className = 'toast-container';
      document.body.appendChild(box);
    }
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = `<span style="font-size:1.25rem;">${icon}</span><span>${msg}</span>`;
    box.appendChild(el);
    setTimeout(() => el.remove(), 3400);
  }

  window.LUMIGO.rewards = {
    getDailyState,
    claimDailyTask,
    trackGameResult,
    toast
  };
})();
