(function () {
  window.LUMIGO.registerGame('color-match', function (api) {
    const rounds = api.difficulty === 'hard' ? 10 : api.difficulty === 'medium' ? 8 : 6;
    const variance = api.difficulty === 'hard' ? 24 : api.difficulty === 'medium' ? 42 : 68;
    let current = 0;
    let score = 0;

    api.stage.innerHTML = `
      <div style="text-align:center;max-width:500px;width:100%;">
        <p style="color:var(--text-secondary);margin-bottom:10px;">Yuqoridagi namuna rangiga <strong>100% MOS</strong> rangni tanlang! (<span id="clm-r">1</span>/${rounds})</p>
        <div id="clm-target" style="width:140px;height:140px;border-radius:24px;margin:0 auto 18px;border:3px solid #fff;"></div>
        <div id="clm-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;"></div>
      </div>
    `;
    const rEl = api.stage.querySelector('#clm-r');
    const targetEl = api.stage.querySelector('#clm-target');
    const gridEl = api.stage.querySelector('#clm-grid');

    function randByte(min = 30, max = 235) {
      return min + Math.floor(Math.random() * (max - min));
    }
    function clamp(v) { return Math.max(0, Math.min(255, v)); }

    function next() {
      if (current >= rounds) {
        api.finish({ won: score >= rounds * 25, score, summary: `${rounds} ta rang bosqichi yakunlandi!` });
        return;
      }
      current++;
      rEl.textContent = current;
      api.setProgress(((current - 1) / rounds) * 100);

      const r = randByte(), g = randByte(), b = randByte();
      const targetRGB = `rgb(${r}, ${g}, ${b})`;
      targetEl.style.background = targetRGB;

      const options = [{ rgb: targetRGB, ok: true }];
      for (let i = 0; i < 5; i++) {
        const dr = (Math.random() > 0.5 ? 1 : -1) * (variance + Math.floor(Math.random() * 18));
        const dg = (Math.random() > 0.5 ? 1 : -1) * (variance + Math.floor(Math.random() * 18));
        const db = (Math.random() > 0.5 ? 1 : -1) * (variance + Math.floor(Math.random() * 18));
        options.push({ rgb: `rgb(${clamp(r + dr)}, ${clamp(g + dg)}, ${clamp(b + db)})`, ok: false });
      }
      options.sort(() => Math.random() - 0.5);

      gridEl.innerHTML = '';
      options.forEach(opt => {
        const btn = document.createElement('button');
        btn.style.height = '84px';
        btn.style.borderRadius = '16px';
        btn.style.background = opt.rgb;
        btn.style.border = '2px solid rgba(255,255,255,0.25)';
        btn.onclick = () => {
          if (api.isPaused()) return;
          if (opt.ok) {
            score += 40;
            if (window.LUMIGO.sfx) window.LUMIGO.sfx.beep(780, 0.08);
          } else {
            if (window.LUMIGO.sfx) window.LUMIGO.sfx.beep(220, 0.12, 'sawtooth');
          }
          api.setScore(score);
          next();
        };
        gridEl.appendChild(btn);
      });
    }

    api.startCountdownTimer(50, () => {
      api.finish({ won: score >= 140, score, summary: `Vaqt tugadi! Ball: ${score}` });
    });
    next();
  });
})();
