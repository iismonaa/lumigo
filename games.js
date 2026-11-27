/* ==========================================================================
   LUMIGO — Game Catalog (25 Games), Launcher, Countdown & Arena Engine
   ========================================================================== */
(function () {
  window.LUMIGO = window.LUMIGO || {};

  const GAMES = [
    { id: 'memory', title: 'Memory Master', icon: '🃏', category: 'brain', minAge: 3, maxAge: 99, featured: true, trending: true, popular: true, newGame: false, supportsBot: false, supports2P: false, musicCategory: 'Puzzle Music', gradient: 'linear-gradient(135deg,#8b5cf6,#3b82f6)', desc: "Juft kartalarni toping va xotirangizni charxlang!", script: 'memory.js' },
    { id: 'color-rush', title: 'Color Rush', icon: '🎨', category: 'brain', minAge: 6, maxAge: 99, featured: true, trending: true, popular: false, newGame: true, supportsBot: false, supports2P: false, musicCategory: 'Action Music', gradient: 'linear-gradient(135deg,#ec4899,#f97316)', desc: "So'z emas, rangini tezda tanlang! Stroop reaksiya testi.", script: 'color-rush.js' },
    { id: 'math-battle', title: 'Math Battle', icon: '🧮', category: 'brain', minAge: 6, maxAge: 99, featured: true, trending: false, popular: true, newGame: false, supportsBot: true, supports2P: false, musicCategory: 'Gaming Music', gradient: 'linear-gradient(135deg,#06b6d4,#3b82f6)', desc: "Tezkor misollar yechib Botga qarshi jang qiling!", script: 'math-battle.js' },
    { id: 'brain-puzzle', title: 'Brain Puzzle', icon: '🧩', category: 'puzzle', minAge: 6, maxAge: 99, featured: false, trending: true, popular: true, newGame: false, supportsBot: false, supports2P: false, musicCategory: 'Puzzle Music', gradient: 'linear-gradient(135deg,#a855f7,#ec4899)', desc: "Raqamli plitkalarni tartibga keltiring (Sliding Puzzle).", script: 'brain-puzzle.js' },
    { id: 'word-hunter', title: 'Word Hunter', icon: '🔤', category: 'brain', minAge: 9, maxAge: 99, featured: false, trending: false, popular: true, newGame: true, supportsBot: false, supports2P: false, musicCategory: 'Relax Music', gradient: 'linear-gradient(135deg,#22c55e,#06b6d4)', desc: "Harflar jadvalidan yashirin so'zlarni qidirib toping.", script: 'word-hunter.js' },
    { id: 'number-challenge', title: 'Number Challenge', icon: '🔢', category: 'brain', minAge: 6, maxAge: 99, featured: false, trending: true, popular: false, newGame: false, supportsBot: false, supports2P: false, musicCategory: 'Puzzle Music', gradient: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', desc: "1 dan N gacha raqamlarni eng tez tartibda bosing!", script: 'number-challenge.js' },
    { id: 'speed-reaction', title: 'Speed Reaction', icon: '⚡', category: 'arcade', minAge: 6, maxAge: 99, featured: true, trending: true, popular: true, newGame: false, supportsBot: false, supports2P: false, musicCategory: 'Action Music', gradient: 'linear-gradient(135deg,#facc15,#f97316)', desc: "Neon signal yonganda millisekundlar ichida bosing!", script: 'speed-reaction.js' },
    { id: 'maze-escape', title: 'Maze Escape', icon: '🌀', category: 'puzzle', minAge: 6, maxAge: 99, featured: false, trending: false, popular: true, newGame: true, supportsBot: false, supports2P: false, musicCategory: 'Adventure Music', gradient: 'linear-gradient(135deg,#0ea5e9,#22c55e)', desc: "Murakkab labirintdan chiqish eshigigacha yo'l toping.", script: 'maze-escape.js' },
    { id: 'game-2048', title: '2048', icon: '🟨', category: 'puzzle', minAge: 9, maxAge: 99, featured: true, trending: true, popular: true, newGame: false, supportsBot: false, supports2P: false, musicCategory: 'Relax Music', gradient: 'linear-gradient(135deg,#f97316,#eab308)', desc: "Bir xil sonlarni qo'shib 2048 plitkasiga yeting!", script: 'game-2048.js' },
    { id: 'tic-tac-toe', title: 'Tic Tac Toe', icon: '❌', category: 'strategy', minAge: 3, maxAge: 99, featured: false, trending: false, popular: true, newGame: false, supportsBot: true, supports2P: true, musicCategory: 'Gaming Music', gradient: 'linear-gradient(135deg,#ec4899,#8b5cf6)', desc: "Klassik X va O — aqlli AI Bot yoki 2 kishilik duel!", script: 'tic-tac-toe.js' },
    { id: 'rock-paper-scissors', title: 'Rock Paper Scissors', icon: '✊', category: 'arcade', minAge: 3, maxAge: 99, featured: false, trending: false, popular: false, newGame: true, supportsBot: true, supports2P: true, musicCategory: 'Gaming Music', gradient: 'linear-gradient(135deg,#f43f5e,#f97316)', desc: "Tosh, Qaychi, Qog'oz — Bot yoki do'stingizga qarshi!", script: 'rock-paper-scissors.js' },
    { id: 'snake', title: 'Snake', icon: '🐍', category: 'arcade', minAge: 6, maxAge: 99, featured: true, trending: true, popular: true, newGame: false, supportsBot: false, supports2P: false, musicCategory: 'Action Music', gradient: 'linear-gradient(135deg,#22c55e,#84cc16)', desc: "Neon iloncha bilan mevalarni yeb rekord o'rnating!", script: 'snake.js' },
    { id: 'simon-memory', title: 'Simon Memory', icon: '🎵', category: 'brain', minAge: 3, maxAge: 99, featured: false, trending: true, popular: false, newGame: false, supportsBot: false, supports2P: false, musicCategory: 'Puzzle Music', gradient: 'linear-gradient(135deg,#6366f1,#22d3ee)', desc: "Chiroq va tovushlar ketma-ketligini yodlab qaytaring.", script: 'simon-memory.js' },
    { id: 'sudoku', title: 'Sudoku', icon: '🔢', category: 'puzzle', minAge: 13, maxAge: 99, featured: true, trending: false, popular: true, newGame: false, supportsBot: false, supports2P: false, musicCategory: 'Relax Music', gradient: 'linear-gradient(135deg,#2563eb,#06b6d4)', desc: "9x9 haqiqiy Sudoku kataklarini mantiq bilan to'ldiring.", script: 'sudoku.js' },
    { id: 'chess', title: 'Chess', icon: '♟️', category: 'strategy', minAge: 9, maxAge: 99, featured: true, trending: true, popular: true, newGame: false, supportsBot: true, supports2P: true, musicCategory: 'Relax Music', gradient: 'linear-gradient(135deg,#475569,#8b5cf6)', desc: "To'liq shaxmat taxtasi — AI Bot yoki 2 kishilik o'yin!", script: 'chess.js' },
    { id: 'connect-four', title: 'Connect Four', icon: '🔴', category: 'strategy', minAge: 6, maxAge: 99, featured: false, trending: true, popular: true, newGame: false, supportsBot: true, supports2P: true, musicCategory: 'Gaming Music', gradient: 'linear-gradient(135deg,#2563eb,#ec4899)', desc: "4 ta diskni ketma-ket joylashtirib g'alaba qozoning!", script: 'connect-four.js' },
    { id: 'bubble-shooter', title: 'Bubble Shooter', icon: '🫧', category: 'arcade', minAge: 3, maxAge: 99, featured: true, trending: true, popular: true, newGame: true, supportsBot: false, supports2P: false, musicCategory: 'Adventure Music', gradient: 'linear-gradient(135deg,#22d3ee,#ec4899)', desc: "Rangli pufakchalarni nishonga olib portlating!", script: 'bubble-shooter.js' },
    { id: 'pattern-master', title: 'Pattern Master', icon: '🔷', category: 'brain', minAge: 6, maxAge: 99, featured: false, trending: false, popular: false, newGame: true, supportsBot: false, supports2P: false, musicCategory: 'Puzzle Music', gradient: 'linear-gradient(135deg,#7c3aed,#22d3ee)', desc: "Mantiqiy shakllar va sonlar qonuniyatini toping.", script: 'pattern-master.js' },
    { id: 'quick-quiz', title: 'Quick Quiz', icon: '❓', category: 'brain', minAge: 9, maxAge: 99, featured: false, trending: true, popular: true, newGame: false, supportsBot: false, supports2P: false, musicCategory: 'Gaming Music', gradient: 'linear-gradient(135deg,#ec4899,#8b5cf6)', desc: "Bilimingizni sinang! Vaqt tugamasidan to'g'ri javob bering.", script: 'quick-quiz.js' },
    { id: 'logic-quest', title: 'Logic Quest', icon: '💡', category: 'puzzle', minAge: 9, maxAge: 99, featured: false, trending: false, popular: false, newGame: true, supportsBot: false, supports2P: false, musicCategory: 'Puzzle Music', gradient: 'linear-gradient(135deg,#06b6d4,#84cc16)', desc: "Barcha neon chiroqlarni yoqish uchun tugunlarni bosing!", script: 'logic-quest.js' },
    { id: 'shape-match', title: 'Shape Match', icon: '🔺', category: 'arcade', minAge: 3, maxAge: 99, featured: false, trending: false, popular: true, newGame: false, supportsBot: false, supports2P: false, musicCategory: 'Adventure Music', gradient: 'linear-gradient(135deg,#f97316,#ec4899)', desc: "Tushayotgan geometrik shakllarni mos nishonga yo'naltiring.", script: 'shape-match.js' },
    { id: 'typing-speed', title: 'Typing Speed', icon: '⌨️', category: 'code', minAge: 9, maxAge: 99, featured: false, trending: true, popular: true, newGame: false, supportsBot: false, supports2P: false, musicCategory: 'Action Music', gradient: 'linear-gradient(135deg,#3b82f6,#22d3ee)', desc: "WPM va aniqlikni oshiring — eng tez yozuvchi bo'ling!", script: 'typing-speed.js' },
    { id: 'code-master', title: 'Code Master', icon: '💻', category: 'code', minAge: 13, maxAge: 99, featured: true, trending: false, popular: false, newGame: true, supportsBot: false, supports2P: false, musicCategory: 'Gaming Music', gradient: 'linear-gradient(135deg,#0f172a,#8b5cf6)', desc: "JavaScript va algoritm boshqotirmalarini yeching!", script: 'code-master.js' },
    { id: 'color-match', title: 'Color Match', icon: '🌈', category: 'puzzle', minAge: 3, maxAge: 99, featured: false, trending: false, popular: false, newGame: true, supportsBot: false, supports2P: false, musicCategory: 'Relax Music', gradient: 'linear-gradient(135deg,#ec4899,#facc15)', desc: "Aniq rang tusini toping va gradientlarni moslashtiring.", script: 'color-match.js' },
    { id: 'tower-defense', title: 'Tower Defense', icon: '🏰', category: 'strategy', minAge: 9, maxAge: 99, featured: true, trending: true, popular: true, newGame: true, supportsBot: false, supports2P: false, musicCategory: 'Action Music', gradient: 'linear-gradient(135deg,#8b5cf6,#ec4899)', desc: "Lazer va muz minoralari qurib bazani dushmanlardan himoya qiling!", script: 'tower-defense.js' }
  ];

  const GAME_ENGINES = {};

  function registerGame(id, initFn) {
    GAME_ENGINES[id] = initFn;
  }

  function getRewardsForDifficulty(diff, game) {
    const mult = diff === 'hard' ? 2.2 : diff === 'medium' ? 1.45 : 1;
    const baseCoins = 45;
    return {
      coins: Math.round(baseCoins * mult),
      diamonds: diff === 'hard' ? 6 : diff === 'medium' ? 3 : 1,
      money: diff === 'hard' ? 30 : diff === 'medium' ? 15 : 8,
      xp: Math.round(65 * mult),
      energyCost: diff === 'hard' ? 8 : diff === 'medium' ? 5 : 3
    };
  }

  function getFilteredGamesByAge(list) {
    const st = window.LUMIGO.storage;
    const ageId = st.getAgeGroup();
    const ageObj = st.AGE_GROUPS.find(a => a.id === ageId);
    if (!ageObj) return list;
    // Show games suitable for user's age bracket; kids see kid-friendly first
    return list.filter(g => ageObj.max >= g.minAge);
  }

  function renderGameCardHTML(g) {
    const t = window.LUMIGO.i18n.t;
    return `
      <div class="game-card" data-game-id="${g.id}">
        <div class="game-thumb" style="background:${g.gradient};">
          <div class="game-badges-top">
            <span class="game-tag">${g.category.toUpperCase()}</span>
            <span class="game-age-pill">${g.minAge}+ yosh</span>
          </div>
          <span class="game-thumb-icon">${g.icon}</span>
        </div>
        <div class="game-info">
          <h3>${g.title}</h3>
          <p>${g.desc}</p>
        </div>
        <div class="game-meta-row">
          <span>${g.supports2P ? '👥 2P / 🤖 Bot' : (g.supportsBot ? '🤖 Vs Bot' : '🎯 Solo')}</span>
          <span>🪙 +45..100</span>
        </div>
        <button class="game-play-btn" onclick="window.LUMIGO.launchGame('${g.id}')">
          ▶ <span>${t('play')}</span>
        </button>
      </div>
    `;
  }

  function loadGameScript(game) {
    return new Promise((resolve, reject) => {
      if (GAME_ENGINES[game.id]) {
        resolve(GAME_ENGINES[game.id]);
        return;
      }
      const inPages = window.location.pathname.includes('/pages/');
      const prefix = inPages ? '../games/' : 'games/';
      const s = document.createElement('script');
      s.src = prefix + game.script;
      s.onload = () => {
        if (GAME_ENGINES[game.id]) resolve(GAME_ENGINES[game.id]);
        else reject(new Error('Game did not register: ' + game.id));
      };
      s.onerror = () => reject(new Error('Failed to load ' + game.script));
      document.body.appendChild(s);
    });
  }

  function launchGame(gameId) {
    const game = GAMES.find(g => g.id === gameId);
    if (!game) return;
    const t = window.LUMIGO.i18n.t;

    let selectedDiff = 'medium';
    let selectedMode = game.supportsBot ? 'bot' : 'single';
    let roomCode = 'LUM-' + Math.floor(1000 + Math.random() * 9000);

    const backdrop = document.createElement('div');
    backdrop.className = 'game-modal-backdrop';
    backdrop.id = 'lumigo-game-modal';

    function renderLauncher() {
      const rw = getRewardsForDifficulty(selectedDiff, game);
      backdrop.innerHTML = `
        <div class="game-arena-shell">
          <div class="game-hud">
            <div class="game-hud-title">
              <span style="font-size:1.5rem;">${game.icon}</span>
              <span>${game.title}</span>
              <span class="badge badge-cyan">${game.category.toUpperCase()}</span>
            </div>
            <button class="btn btn-glass btn-sm" id="gm-close">✕ ${t('exit')}</button>
          </div>
          <div class="game-stage">
            <h2 style="font-size:1.55rem;font-weight:900;margin-bottom:4px;">${t('diff_choose')}</h2>
            <p style="color:var(--text-secondary);font-size:0.9rem;margin-bottom:8px;text-align:center;max-width:560px;">${game.desc}</p>

            <div class="difficulty-grid">
              <button class="diff-btn easy ${selectedDiff === 'easy' ? 'selected' : ''}" data-diff="easy">
                <div style="font-size:1.5rem;">🟢</div>
                <div>${t('diff_easy')}</div>
                <span class="diff-sub">${t('diff_easy_desc')}</span>
              </button>
              <button class="diff-btn medium ${selectedDiff === 'medium' ? 'selected' : ''}" data-diff="medium">
                <div style="font-size:1.5rem;">🔵</div>
                <div>${t('diff_medium')}</div>
                <span class="diff-sub">${t('diff_medium_desc')}</span>
              </button>
              <button class="diff-btn hard ${selectedDiff === 'hard' ? 'selected' : ''}" data-diff="hard">
                <div style="font-size:1.5rem;">🔴</div>
                <div>${t('diff_hard')}</div>
                <span class="diff-sub">${t('diff_hard_desc')}</span>
              </button>
            </div>

            <div class="mode-selector-box">
              <div style="font-size:0.82rem;font-weight:800;margin-bottom:8px;color:var(--cyan);">OFFLINE / ONLINE MODE:</div>
              <div style="display:flex;flex-wrap:wrap;gap:8px;">
                ${!game.supportsBot ? `<button class="tab-btn ${selectedMode === 'single' ? 'active' : ''}" data-mode="single">🎯 ${t('mode_offline_single')}</button>` : ''}
                ${game.supportsBot ? `<button class="tab-btn ${selectedMode === 'bot' ? 'active' : ''}" data-mode="bot">🤖 ${t('mode_offline_bot')}</button>` : ''}
                ${game.supports2P ? `<button class="tab-btn ${selectedMode === '2p' ? 'active' : ''}" data-mode="2p">👥 ${t('mode_offline_2p')}</button>` : ''}
                <button class="tab-btn ${selectedMode === 'room' ? 'active' : ''}" data-mode="room">🌐 ${t('mode_online_room')}</button>
              </div>
              ${selectedMode === 'room' ? `
                <div style="margin-top:10px;padding:10px;border-radius:12px;background:rgba(34,211,238,0.1);border:1px solid rgba(34,211,238,0.3);font-size:0.82rem;">
                  <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:6px;">
                    <strong>Room Code:</strong>
                    <input type="text" id="gm-room-input" class="form-control" value="${roomCode}" style="width:140px;padding:6px 10px;">
                    <button class="btn btn-glass btn-sm" id="gm-new-room">🔄 New</button>
                  </div>
                  <div style="color:var(--text-secondary);">${t('room_notice')}</div>
                </div>
              ` : ''}
            </div>

            <div class="reward-preview-box">
              <div>
                <strong style="color:#fde047;">🏆 ${t('reward_preview')}:</strong>
                +${rw.coins} 🪙 Coins • +${rw.diamonds} 💎 Diamonds • +${rw.money} 💵 Money • +${rw.xp} XP
              </div>
              <div>
                <strong style="color:#fb7185;">⚡ ${t('risk_preview')}:</strong>
                Magʻlubiyatda -${rw.energyCost} Energy
              </div>
            </div>

            <button class="btn btn-hot" id="gm-start-btn" style="padding:14px 34px;font-size:1.05rem;">
              🚀 ${t('start_game')}
            </button>
          </div>
        </div>
      `;

      backdrop.querySelector('#gm-close').onclick = () => backdrop.remove();
      backdrop.querySelectorAll('[data-diff]').forEach(b => {
        b.onclick = () => {
          selectedDiff = b.getAttribute('data-diff');
          renderLauncher();
        };
      });
      backdrop.querySelectorAll('[data-mode]').forEach(b => {
        b.onclick = () => {
          selectedMode = b.getAttribute('data-mode');
          renderLauncher();
        };
      });
      const rInput = backdrop.querySelector('#gm-room-input');
      if (rInput) rInput.oninput = (e) => { roomCode = e.target.value.trim() || 'LUM-1000'; };
      const rNew = backdrop.querySelector('#gm-new-room');
      if (rNew) rNew.onclick = () => { roomCode = 'LUM-' + Math.floor(1000 + Math.random() * 9000); renderLauncher(); };

      backdrop.querySelector('#gm-start-btn').onclick = () => startArena(game, selectedDiff, selectedMode, roomCode, backdrop);
    }

    document.body.appendChild(backdrop);
    renderLauncher();
  }

  async function startArena(game, difficulty, playMode, roomCode, backdrop) {
    const t = window.LUMIGO.i18n.t;
    const rw = getRewardsForDifficulty(difficulty, game);

    if (window.LUMIGO.music && game.musicCategory) {
      window.LUMIGO.music.setCategoryForGame(game.musicCategory);
    }

    backdrop.innerHTML = `
      <div class="game-arena-shell">
        <div class="game-hud">
          <div class="game-hud-title">
            <span>${game.icon}</span>
            <span>${game.title}</span>
            <span class="badge ${difficulty === 'hard' ? 'badge-pink' : difficulty === 'medium' ? 'badge-cyan' : 'badge-lime'}">${difficulty.toUpperCase()}</span>
            ${playMode === 'room' ? `<span class="badge badge-purple">Room: ${roomCode}</span>` : ''}
          </div>
          <div class="game-hud-stats">
            <div class="hud-pill">⭐ <span data-i18n="score">${t('score')}</span>: <span id="hud-score">0</span></div>
            <div class="hud-pill">⏱️ <span data-i18n="time">${t('time')}</span>: <span id="hud-timer">--</span></div>
          </div>
          <div class="game-hud-actions">
            <button class="btn btn-glass btn-sm" id="hud-pause">⏸ ${t('pause')}</button>
            <button class="btn btn-glass btn-sm" id="hud-restart">🔄 ${t('restart')}</button>
            <button class="btn btn-danger btn-sm" id="hud-exit">✕ ${t('exit')}</button>
          </div>
        </div>
        <div class="game-progress-bar"><div class="game-progress-fill" id="hud-progress"></div></div>
        <div class="game-stage" id="arena-stage">
          <div style="color:var(--text-secondary);">Loading game engine...</div>
        </div>
      </div>
    `;

    const shell = backdrop.querySelector('.game-arena-shell');
    const stage = backdrop.querySelector('#arena-stage');
    const scoreEl = backdrop.querySelector('#hud-score');
    const timerEl = backdrop.querySelector('#hud-timer');
    const progressEl = backdrop.querySelector('#hud-progress');
    const pauseBtn = backdrop.querySelector('#hud-pause');
    const restartBtn = backdrop.querySelector('#hud-restart');
    const exitBtn = backdrop.querySelector('#hud-exit');

    let paused = false;
    let finished = false;
    let timerInterval = null;
    let cleanupCbs = [];
    let pauseCbs = [];
    let resumeCbs = [];
    let channel = null;

    if (playMode === 'room' && 'BroadcastChannel' in window) {
      channel = new BroadcastChannel('lumigo_room_' + roomCode);
    }

    function runCleanup() {
      if (timerInterval) clearInterval(timerInterval);
      if (channel) {
        try { channel.close(); } catch (e) {}
      }
      cleanupCbs.forEach(fn => { try { fn(); } catch (e) {} });
      cleanupCbs = [];
    }

    exitBtn.onclick = () => {
      runCleanup();
      backdrop.remove();
    };

    restartBtn.onclick = () => {
      runCleanup();
      startArena(game, difficulty, playMode, roomCode, backdrop);
    };

    pauseBtn.onclick = () => {
      if (finished) return;
      paused = !paused;
      if (paused) {
        pauseBtn.innerHTML = `▶ ${t('resume')}`;
        pauseCbs.forEach(fn => { try { fn(); } catch (e) {} });
        const ov = document.createElement('div');
        ov.className = 'pause-overlay';
        ov.id = 'arena-pause-ov';
        ov.innerHTML = `
          <h2 style="font-size:2.2rem;margin-bottom:14px;">⏸ PAUSED</h2>
          <div style="display:flex;gap:12px;">
            <button class="btn btn-primary" id="ov-resume">▶ ${t('resume')}</button>
            <button class="btn btn-glass" id="ov-restart">🔄 ${t('restart')}</button>
            <button class="btn btn-danger" id="ov-exit">✕ ${t('exit')}</button>
          </div>
        `;
        ov.querySelector('#ov-resume').onclick = () => pauseBtn.click();
        ov.querySelector('#ov-restart').onclick = () => restartBtn.click();
        ov.querySelector('#ov-exit').onclick = () => exitBtn.click();
        shell.appendChild(ov);
      } else {
        pauseBtn.innerHTML = `⏸ ${t('pause')}`;
        const ov = shell.querySelector('#arena-pause-ov');
        if (ov) ov.remove();
        resumeCbs.forEach(fn => { try { fn(); } catch (e) {} });
      }
    };

    const api = {
      stage,
      difficulty,
      playMode,
      roomCode,
      isPaused: () => paused || finished,
      onCleanup: (fn) => cleanupCbs.push(fn),
      onPause: (fn) => pauseCbs.push(fn),
      onResume: (fn) => resumeCbs.push(fn),
      broadcast: (payload) => { if (channel) channel.postMessage(payload); },
      onRoomMessage: (fn) => { if (channel) channel.onmessage = (e) => fn(e.data); },
      setScore: (val) => { scoreEl.textContent = String(val); },
      setProgress: (pct) => { progressEl.style.width = Math.max(0, Math.min(100, pct)) + '%'; },
      setTimerText: (txt) => { timerEl.textContent = txt; },
      startCountdownTimer(seconds, onExpire) {
        if (timerInterval) clearInterval(timerInterval);
        let left = seconds;
        timerEl.textContent = left + 's';
        timerInterval = setInterval(() => {
          if (paused || finished) return;
          left--;
          timerEl.textContent = Math.max(0, left) + 's';
          if (left <= 0) {
            clearInterval(timerInterval);
            if (!finished && onExpire) onExpire();
          }
        }, 1000);
        return () => clearInterval(timerInterval);
      },
      startStopwatch() {
        if (timerInterval) clearInterval(timerInterval);
        let secs = 0;
        timerEl.textContent = '0s';
        timerInterval = setInterval(() => {
          if (paused || finished) return;
          secs++;
          timerEl.textContent = secs + 's';
        }, 1000);
        return () => secs;
      },
      finish({ won, score = 0, draw = false, summary = '' }) {
        if (finished) return;
        finished = true;
        runCleanup();

        const earnedCoins = won ? rw.coins : (draw ? Math.round(rw.coins * 0.4) : 0);
        const earnedDiamonds = won ? rw.diamonds : 0;
        const earnedMoney = won ? rw.money : 0;
        const earnedXP = won ? rw.xp : (draw ? Math.round(rw.xp * 0.5) : 15);

        window.LUMIGO.rewards.trackGameResult({
          gameId: game.id,
          category: game.category,
          won: !!won,
          score,
          xpEarned: earnedXP,
          coinsEarned: earnedCoins,
          diamondsEarned: earnedDiamonds,
          moneyEarned: earnedMoney,
          energyCost: won || draw ? 0 : rw.energyCost
        });

        if (window.LUMIGO.sfx) {
          if (won) window.LUMIGO.sfx.playWin();
          else if (!draw) window.LUMIGO.sfx.playLose();
        }

        const ov = document.createElement('div');
        ov.className = 'result-overlay';
        ov.innerHTML = `
          <div style="font-size:4rem;margin-bottom:8px;">${won ? '🏆' : draw ? '🤝' : '💥'}</div>
          <h2 style="font-size:2rem;font-weight:900;margin-bottom:6px;background:${won ? 'var(--grad-lime)' : 'var(--grad-hot)'};-webkit-background-clip:text;background-clip:text;color:transparent;">
            ${won ? t('win_title') : draw ? t('draw_title') : t('lose_title')}
          </h2>
          ${summary ? `<p style="color:#cbd5e1;margin-bottom:14px;max-width:460px;">${summary}</p>` : ''}
          <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-bottom:20px;">
            <span class="badge badge-cyan">⭐ Score: ${score}</span>
            <span class="badge badge-orange">+${earnedCoins} 🪙 Coins</span>
            ${earnedDiamonds ? `<span class="badge badge-purple">+${earnedDiamonds} 💎 Diamonds</span>` : ''}
            <span class="badge badge-lime">+${earnedXP} XP</span>
            ${!won && !draw ? `<span class="badge badge-pink">-${rw.energyCost} ⚡ Energy</span>` : ''}
          </div>
          <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;">
            <button class="btn btn-primary" id="res-restart">🔄 ${t('restart')}</button>
            <button class="btn btn-glass" id="res-exit">✕ ${t('exit')}</button>
          </div>
        `;
        ov.querySelector('#res-restart').onclick = () => startArena(game, difficulty, playMode, roomCode, backdrop);
        ov.querySelector('#res-exit').onclick = () => backdrop.remove();
        shell.appendChild(ov);
      }
    };

    try {
      const initFn = await loadGameScript(game);

      // 3, 2, 1, GO! Countdown Animation
      const cd = document.createElement('div');
      cd.className = 'countdown-overlay';
      shell.appendChild(cd);

      const steps = ['3', '2', '1', 'GO!'];
      for (let i = 0; i < steps.length; i++) {
        if (!document.body.contains(backdrop)) return;
        cd.innerHTML = `<div class="countdown-number animate-countdown">${steps[i]}</div>`;
        if (window.LUMIGO.sfx) window.LUMIGO.sfx.beep(steps[i] === 'GO!' ? 880 : 520, 0.12, 'triangle', 0.2);
        await new Promise(r => setTimeout(r, steps[i] === 'GO!' ? 450 : 620));
      }
      cd.remove();

      stage.innerHTML = '';
      initFn(api);
    } catch (err) {
      stage.innerHTML = `<div style="color:#fb7185;text-align:center;">Oʻyinni yuklashda xatolik: ${err.message}</div>`;
    }
  }

  window.LUMIGO.GAMES = GAMES;
  window.LUMIGO.registerGame = registerGame;
  window.LUMIGO.launchGame = launchGame;
  window.LUMIGO.getFilteredGamesByAge = getFilteredGamesByAge;
  window.LUMIGO.renderGameCardHTML = renderGameCardHTML;
})();
