(function () {
  window.LUMIGO.registerGame('pattern-master', function (api) {
    const totalQ = api.difficulty === 'hard' ? 10 : api.difficulty === 'medium' ? 8 : 6;
    let current = 0;
    let score = 0;

    function makePuzzle() {
      const type = Math.random() > 0.45 ? 'num' : 'shape';
      if (type === 'num') {
        const start = 2 + Math.floor(Math.random() * 8);
        const step = 2 + Math.floor(Math.random() * (api.difficulty === 'hard' ? 9 : 5));
        const mult = api.difficulty === 'hard' && Math.random() > 0.5;
        const seq = mult
          ? [start, start * 2, start * 4, start * 8]
          : [start, start + step, start + step * 2, start + step * 3];
        const ans = mult ? start * 16 : start + step * 4;
        const opts = Array.from(new Set([ans, ans + 2, ans - 2, ans + step])).slice(0, 4);
        while (opts.length < 4) opts.push(ans + opts.length * 3);
        return { prompt: seq.join('  →  ') + '  →  ❓', ans: String(ans), opts: opts.map(String).sort(() => Math.random() - 0.5) };
      } else {
        const pool = ['🔺', '🟦', '🟣', '⭐', '💎', '🟢'];
        const a = pool[Math.floor(Math.random() * pool.length)];
        const b = pool.filter(x => x !== a)[Math.floor(Math.random() * 5)];
        const seq = [a, b, a, b, a];
        const ans = b;
        const opts = [a, b, ...pool.filter(x => x !== a && x !== b).slice(0, 2)].sort(() => Math.random() - 0.5);
        return { prompt: seq.join('  ') + '  ❓', ans, opts };
      }
    }

    api.stage.innerHTML = `
      <div style="text-align:center;max-width:540px;width:100%;">
        <div id="pm-step" class="badge badge-purple" style="margin-bottom:12px;">1 / ${totalQ}</div>
        <div id="pm-prompt" style="font-size:1.75rem;font-weight:900;padding:24px;border-radius:18px;background:var(--bg-input);margin-bottom:16px;"></div>
        <div id="pm-opts" style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;"></div>
      </div>
    `;

    const stepEl = api.stage.querySelector('#pm-step');
    const promptEl = api.stage.querySelector('#pm-prompt');
    const optsEl = api.stage.querySelector('#pm-opts');

    function next() {
      if (current >= totalQ) {
        api.finish({ won: score >= totalQ * 20, score, summary: `${totalQ} ta qonuniyat tahlil qilindi!` });
        return;
      }
      current++;
      stepEl.textContent = `${current} / ${totalQ}`;
      api.setProgress(((current - 1) / totalQ) * 100);
      const p = makePuzzle();
      promptEl.textContent = p.prompt;
      optsEl.innerHTML = '';
      p.opts.forEach(o => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-primary';
        btn.style.fontSize = '1.3rem';
        btn.textContent = o;
        btn.onclick = () => {
          if (api.isPaused()) return;
          if (o === p.ans) {
            score += 35;
            if (window.LUMIGO.sfx) window.LUMIGO.sfx.beep(760, 0.08);
          } else {
            if (window.LUMIGO.sfx) window.LUMIGO.sfx.beep(220, 0.1, 'sawtooth');
          }
          api.setScore(score);
          next();
        };
        optsEl.appendChild(btn);
      });
    }

    api.startCountdownTimer(65, () => {
      api.finish({ won: score >= 120, score, summary: `Vaqt tugadi! Ball: ${score}` });
    });
    next();
  });
})();
