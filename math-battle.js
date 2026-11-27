(function () {
  window.LUMIGO.registerGame('math-battle', function (api) {
    const maxQuestions = api.difficulty === 'hard' ? 14 : api.difficulty === 'medium' ? 10 : 8;
    const botIntervalMs = api.difficulty === 'hard' ? 3800 : api.difficulty === 'medium' ? 5200 : 7000;
    let playerHP = 100;
    let botHP = 100;
    let qCount = 0;
    let score = 0;
    let currentAns = 0;

    api.stage.innerHTML = `
      <div style="width:100%;max-width:520px;text-align:center;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:18px;">
          <div class="panel-card" style="padding:12px;">
            <div>🧑 Siz HP: <strong id="mb-php">100</strong>%</div>
            <div class="progress-track" style="margin-top:6px;"><div class="progress-fill" id="mb-pbar" style="width:100%;"></div></div>
          </div>
          <div class="panel-card" style="padding:12px;">
            <div>🤖 CyberBot HP: <strong id="mb-bhp">100</strong>%</div>
            <div class="progress-track" style="margin-top:6px;"><div class="progress-fill" id="mb-bbar" style="width:100%;background:var(--grad-hot);"></div></div>
          </div>
        </div>
        <div id="mb-q" style="font-size:2.4rem;font-weight:900;padding:24px;border-radius:18px;background:var(--bg-input);margin-bottom:16px;"></div>
        <div id="mb-opts" style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;"></div>
      </div>
    `;

    const pHpEl = api.stage.querySelector('#mb-php');
    const bHpEl = api.stage.querySelector('#mb-bhp');
    const pBar = api.stage.querySelector('#mb-pbar');
    const bBar = api.stage.querySelector('#mb-bbar');
    const qEl = api.stage.querySelector('#mb-q');
    const optsEl = api.stage.querySelector('#mb-opts');

    function updateBars() {
      pHpEl.textContent = Math.max(0, playerHP);
      bHpEl.textContent = Math.max(0, botHP);
      pBar.style.width = Math.max(0, playerHP) + '%';
      bBar.style.width = Math.max(0, botHP) + '%';
      api.setProgress(100 - Math.max(0, botHP));
    }

    function genQuestion() {
      qCount++;
      let a, b, op, ans;
      if (api.difficulty === 'easy') {
        a = 2 + Math.floor(Math.random() * 18);
        b = 1 + Math.floor(Math.random() * 15);
        op = Math.random() > 0.5 ? '+' : '-';
        if (op === '-' && b > a) [a, b] = [b, a];
        ans = op === '+' ? a + b : a - b;
      } else if (api.difficulty === 'medium') {
        const ops = ['+', '-', '×'];
        op = ops[Math.floor(Math.random() * ops.length)];
        a = 4 + Math.floor(Math.random() * 20);
        b = 2 + Math.floor(Math.random() * 12);
        ans = op === '+' ? a + b : op === '-' ? a - b : a * b;
      } else {
        const ops = ['×', '+', '-'];
        op = ops[Math.floor(Math.random() * ops.length)];
        a = 12 + Math.floor(Math.random() * 35);
        b = 3 + Math.floor(Math.random() * 16);
        const c = 2 + Math.floor(Math.random() * 12);
        ans = (op === '×' ? a * b : op === '+' ? a + b : a - b) + c;
        qEl.textContent = `(${a} ${op} ${b}) + ${c} = ?`;
        currentAns = ans;
        renderOpts(ans);
        return;
      }
      currentAns = ans;
      qEl.textContent = `${a} ${op} ${b} = ?`;
      renderOpts(ans);
    }

    function renderOpts(ans) {
      const set = new Set([ans]);
      while (set.size < 4) {
        const delta = Math.floor(Math.random() * 11) - 5;
        if (delta !== 0) set.add(ans + delta);
      }
      const arr = Array.from(set).sort(() => Math.random() - 0.5);
      optsEl.innerHTML = '';
      arr.forEach(val => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-primary';
        btn.style.fontSize = '1.35rem';
        btn.textContent = val;
        btn.onclick = () => {
          if (api.isPaused()) return;
          if (val === currentAns) {
            const dmg = Math.ceil(100 / maxQuestions) + 4;
            botHP -= dmg;
            score += 40;
            if (window.LUMIGO.sfx) window.LUMIGO.sfx.beep(760, 0.08);
          } else {
            playerHP -= 18;
            if (window.LUMIGO.sfx) window.LUMIGO.sfx.beep(210, 0.14, 'sawtooth');
          }
          api.setScore(score);
          updateBars();
          if (botHP <= 0) {
            api.finish({ won: true, score: score + playerHP, summary: 'CyberBot magʻlub etildi!' });
          } else if (playerHP <= 0) {
            api.finish({ won: false, score, summary: 'CyberBot ustun keldi!' });
          } else {
            genQuestion();
          }
        };
        optsEl.appendChild(btn);
      });
    }

    const botTimer = setInterval(() => {
      if (api.isPaused()) return;
      playerHP -= 12;
      updateBars();
      if (playerHP <= 0) {
        api.finish({ won: false, score, summary: 'CyberBot sizdan tezroq zarba berdi!' });
      }
    }, botIntervalMs);

    api.onCleanup(() => clearInterval(botTimer));
    api.startCountdownTimer(65, () => {
      api.finish({ won: botHP < playerHP, score, summary: `Vaqt tugadi! Siz: ${playerHP}% vs Bot: ${botHP}%` });
    });
    genQuestion();
  });
})();
