(function () {
  window.LUMIGO.registerGame('rock-paper-scissors', function (api) {
    const maxWins = api.difficulty === 'hard' ? 5 : api.difficulty === 'medium' ? 4 : 3;
    const is2P = api.playMode === '2p';
    const items = [
      { id: 'rock', icon: '✊', label: 'Tosh' },
      { id: 'paper', icon: '✋', label: "Qog'oz" },
      { id: 'scissors', icon: '✌️', label: 'Qaychi' }
    ];

    let p1Score = 0;
    let p2Score = 0;
    let p1Pick = null;
    let p1History = [];

    api.stage.innerHTML = `
      <div style="text-align:center;max-width:500px;width:100%;">
        <div style="display:flex;justify-content:space-around;margin-bottom:16px;">
          <div class="panel-card" style="padding:12px 20px;">🧑 1-o'yinchi: <strong id="rps-s1">0</strong></div>
          <div class="panel-card" style="padding:12px 20px;">${is2P ? '🧑 2-oʻyinchi' : '🤖 Bot'}: <strong id="rps-s2">0</strong></div>
        </div>
        <p style="color:var(--text-secondary);margin-bottom:14px;">Birinchi boʻlib <strong>${maxWins}</strong> ochko toʻplagan gʻolib boʻladi!</p>
        <div id="rps-arena" style="padding:20px;border-radius:18px;background:var(--bg-input);margin-bottom:16px;min-height:90px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;font-weight:800;">
          Tanlovingizni bosing!
        </div>
        <div id="rps-btns" style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;"></div>
      </div>
    `;

    const s1El = api.stage.querySelector('#rps-s1');
    const s2El = api.stage.querySelector('#rps-s2');
    const arena = api.stage.querySelector('#rps-arena');
    const btns = api.stage.querySelector('#rps-btns');

    function beats(a, b) {
      return (a === 'rock' && b === 'scissors') || (a === 'paper' && b === 'rock') || (a === 'scissors' && b === 'paper');
    }

    function botChoice() {
      if (api.difficulty === 'hard' && p1History.length >= 2) {
        // Counter player's most frequent move occasionally
        const last = p1History[p1History.length - 1];
        if (Math.random() < 0.45) {
          return last === 'rock' ? 'paper' : last === 'paper' ? 'scissors' : 'rock';
        }
      }
      return items[Math.floor(Math.random() * 3)].id;
    }

    function resolveRound(c1, c2) {
      const i1 = items.find(x => x.id === c1);
      const i2 = items.find(x => x.id === c2);
      let msg = '';
      if (c1 === c2) {
        msg = `${i1.icon} vs ${i2.icon} — Durang!`;
      } else if (beats(c1, c2)) {
        p1Score++;
        msg = `${i1.icon} vs ${i2.icon} — 1-o'yinchi ochko oldi!`;
      } else {
        p2Score++;
        msg = `${i1.icon} vs ${i2.icon} — ${is2P ? "2-o'yinchi" : 'Bot'} ochko oldi!`;
      }
      s1El.textContent = p1Score;
      s2El.textContent = p2Score;
      arena.textContent = msg;
      api.setScore(p1Score * 40);
      api.setProgress((Math.max(p1Score, p2Score) / maxWins) * 100);

      if (p1Score >= maxWins || p2Score >= maxWins) {
        const p1Won = p1Score >= maxWins;
        api.finish({
          won: is2P ? true : p1Won,
          score: p1Score * 50 + 30,
          summary: p1Won ? `1-o'yinchi ${p1Score}:${p2Score} hisobida yutdi!` : `${is2P ? "2-o'yinchi" : 'Bot'} ${p2Score}:${p1Score} hisobida yutdi!`
        });
      }
    }

    items.forEach(it => {
      const b = document.createElement('button');
      b.className = 'btn btn-primary';
      b.style.fontSize = '1.35rem';
      b.style.padding = '14px 22px';
      b.innerHTML = `${it.icon} ${it.label}`;
      b.onclick = () => {
        if (api.isPaused()) return;
        if (window.LUMIGO.sfx) window.LUMIGO.sfx.beep(520, 0.06);
        if (is2P) {
          if (!p1Pick) {
            p1Pick = it.id;
            arena.textContent = "1-o'yinchi tanladi! Endi 2-o'yinchi tanlasin...";
          } else {
            const p2Pick = it.id;
            const first = p1Pick;
            p1Pick = null;
            resolveRound(first, p2Pick);
          }
        } else {
          p1History.push(it.id);
          resolveRound(it.id, botChoice());
        }
      };
      btns.appendChild(b);
    });

    api.startStopwatch();
  });
})();
