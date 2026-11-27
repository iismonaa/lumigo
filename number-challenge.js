(function () {
  window.LUMIGO.registerGame('number-challenge', function (api) {
    const dim = api.difficulty === 'hard' ? 5 : api.difficulty === 'medium' ? 4 : 3;
    const total = dim * dim;
    const timeLimit = api.difficulty === 'hard' ? 36 : api.difficulty === 'medium' ? 28 : 25;

    const nums = Array.from({ length: total }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
    let expected = 1;
    let score = 0;

    api.stage.innerHTML = `
      <div style="text-align:center;">
        <div style="margin-bottom:12px;font-size:1.15rem;">Keyingi raqam: <strong id="nc-next" class="badge badge-cyan" style="font-size:1.2rem;">1</strong></div>
        <div id="nc-grid" style="display:grid;grid-template-columns:repeat(${dim},64px);gap:8px;justify-content:center;"></div>
      </div>
    `;

    const nextEl = api.stage.querySelector('#nc-next');
    const grid = api.stage.querySelector('#nc-grid');

    nums.forEach(n => {
      const b = document.createElement('button');
      b.className = 'btn btn-glass';
      b.style.height = '64px';
      b.style.fontSize = '1.3rem';
      b.textContent = n;
      b.onclick = () => {
        if (api.isPaused()) return;
        if (n === expected) {
          b.style.background = 'var(--grad-lime)';
          b.style.color = '#062814';
          b.disabled = true;
          score += 20;
          expected++;
          nextEl.textContent = expected <= total ? expected : '✓';
          api.setScore(score);
          api.setProgress(((expected - 1) / total) * 100);
          if (window.LUMIGO.sfx) window.LUMIGO.sfx.beep(500 + expected * 25, 0.06);
          if (expected > total) {
            api.finish({ won: true, score: score + 100, summary: `1 dan ${total} gacha barcha sonlar topildi!` });
          }
        } else {
          score = Math.max(0, score - 5);
          api.setScore(score);
          if (window.LUMIGO.sfx) window.LUMIGO.sfx.beep(200, 0.1, 'sawtooth');
        }
      };
      grid.appendChild(b);
    });

    api.startCountdownTimer(timeLimit, () => {
      api.finish({ won: false, score, summary: `Vaqt tugadi! ${expected - 1}/${total} raqam bosildi.` });
    });
  });
})();
