(function () {
  window.LUMIGO.registerGame('color-rush', function (api) {
    const COLORS = [
      { name: 'QIZIL', hex: '#ef4444' },
      { name: 'KOʻK', hex: '#3b82f6' },
      { name: 'YASHIL', hex: '#22c55e' },
      { name: 'SARIQ', hex: '#facc15' },
      { name: 'PUSHTI', hex: '#ec4899' },
      { name: 'MOVIY', hex: '#22d3ee' }
    ];
    const totalRounds = api.difficulty === 'hard' ? 18 : api.difficulty === 'medium' ? 14 : 10;
    const timeLimit = api.difficulty === 'hard' ? 28 : api.difficulty === 'medium' ? 32 : 35;

    let round = 0;
    let score = 0;
    let correctColor = null;

    api.stage.innerHTML = `
      <div style="text-align:center;max-width:460px;width:100%;">
        <p style="color:var(--text-secondary);margin-bottom:10px;">Yozuv matniga emas, <strong>MATN RANGIGA</strong> mos tugmani bosing!</p>
        <div id="cr-word" style="font-size:3rem;font-weight:900;padding:24px;border-radius:18px;background:var(--bg-input);margin-bottom:18px;"></div>
        <div id="cr-btns" style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;"></div>
      </div>
    `;

    const wordEl = api.stage.querySelector('#cr-word');
    const btnsEl = api.stage.querySelector('#cr-btns');

    function nextRound() {
      if (round >= totalRounds) {
        api.finish({ won: score >= totalRounds * 15, score, summary: `${round}/${totalRounds} raund yakunlandi!` });
        return;
      }
      round++;
      api.setProgress(((round - 1) / totalRounds) * 100);
      const textItem = COLORS[Math.floor(Math.random() * COLORS.length)];
      correctColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      wordEl.textContent = textItem.name;
      wordEl.style.color = correctColor.hex;

      const choices = [...COLORS].sort(() => Math.random() - 0.5);
      btnsEl.innerHTML = '';
      choices.forEach(c => {
        const b = document.createElement('button');
        b.className = 'btn';
        b.style.background = c.hex;
        b.style.color = '#070b19';
        b.textContent = c.name;
        b.onclick = () => {
          if (api.isPaused()) return;
          if (c.name === correctColor.name) {
            score += 25;
            if (window.LUMIGO.sfx) window.LUMIGO.sfx.beep(720, 0.08);
          } else {
            score = Math.max(0, score - 10);
            if (window.LUMIGO.sfx) window.LUMIGO.sfx.beep(220, 0.12, 'sawtooth');
          }
          api.setScore(score);
          nextRound();
        };
        btnsEl.appendChild(b);
      });
    }

    api.startCountdownTimer(timeLimit, () => {
      api.finish({ won: score >= 150, score, summary: `Vaqt tugadi! Toʻplangan ball: ${score}` });
    });
    nextRound();
  });
})();
