(function () {
  window.LUMIGO.registerGame('typing-speed', function (api) {
    const SENTENCES = {
      easy: [
        'lumigo is a fast neon gaming world',
        'play think and win every day',
        'coding makes games super fun'
      ],
      medium: [
        'train your brain with twenty five neon mini games on lumigo',
        'collect coins and diamonds to unlock cyber frames and skins',
        'javascript canvas powers smooth arcade gameplay in browsers'
      ],
      hard: [
        'professional frontend engineers build fast responsive interactive web games using clean vanilla javascript',
        'mastering speed reaction memory puzzles and tower defense boosts cognitive agility and focus'
      ]
    };
    const pool = SENTENCES[api.difficulty] || SENTENCES.medium;
    const targetText = pool[Math.floor(Math.random() * pool.length)];
    const startTime = Date.now();

    api.stage.innerHTML = `
      <div style="width:100%;max-width:640px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:10px;font-size:0.9rem;">
          <span>⚡ Tezlik: <strong id="ts-wpm">0 WPM</strong></span>
          <span>🎯 Aniqlik: <strong id="ts-acc">100%</strong></span>
        </div>
        <div id="ts-display" style="padding:18px;border-radius:16px;background:var(--bg-input);font-family:var(--font-mono);font-size:1.15rem;line-height:1.7;margin-bottom:14px;"></div>
        <input type="text" id="ts-input" class="form-control" placeholder="Yuqoridagi matnni shu yerga yozing..." autocomplete="off">
      </div>
    `;

    const dispEl = api.stage.querySelector('#ts-display');
    const inputEl = api.stage.querySelector('#ts-input');
    const wpmEl = api.stage.querySelector('#ts-wpm');
    const accEl = api.stage.querySelector('#ts-acc');

    function renderDisplay(typed) {
      let html = '';
      let correct = 0;
      for (let i = 0; i < targetText.length; i++) {
        const ch = targetText[i];
        if (i < typed.length) {
          if (typed[i] === ch) {
            correct++;
            html += `<span style="color:#4ade80;">${ch}</span>`;
          } else {
            html += `<span style="color:#fb7185;background:rgba(244,63,94,0.2);">${ch}</span>`;
          }
        } else if (i === typed.length) {
          html += `<span style="border-bottom:2px solid #22d3ee;">${ch}</span>`;
        } else {
          html += `<span style="color:#94a3b8;">${ch}</span>`;
        }
      }
      dispEl.innerHTML = html;
      const pct = Math.round((correct / targetText.length) * 100);
      api.setProgress(pct);
      const acc = typed.length ? Math.round((correct / typed.length) * 100) : 100;
      accEl.textContent = acc + '%';
      const mins = Math.max(0.05, (Date.now() - startTime) / 60000);
      const wpm = Math.round((correct / 5) / mins);
      wpmEl.textContent = wpm + ' WPM';
      api.setScore(wpm * 3);

      if (typed === targetText) {
        api.finish({
          won: true,
          score: Math.max(100, wpm * 4 + acc),
          summary: `Yakunlandi! Tezlik: ${wpm} WPM • Aniqlik: ${acc}%`
        });
      }
    }

    inputEl.oninput = () => {
      if (api.isPaused()) return;
      renderDisplay(inputEl.value);
    };

    api.startCountdownTimer(api.difficulty === 'hard' ? 50 : 65, () => {
      api.finish({ won: false, score: 40, summary: 'Vaqt tugadi!' });
    });
    renderDisplay('');
    setTimeout(() => inputEl.focus(), 80);
  });
})();
