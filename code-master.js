(function () {
  window.LUMIGO.registerGame('code-master', function (api) {
    const CHALLENGES = [
      { code: 'const a = [1, 2, 3];\nconsole.log(a.length * 2);', opts: ['3', '6', '5', 'undefined'], ans: 1 },
      { code: 'let x = 5;\nx += 3;\nconsole.log(x % 3);', opts: ['2', '3', '1', '0'], ans: 0 },
      { code: 'const s = "LUMIGO";\nconsole.log(s.slice(0, 4));', opts: ['LUMI', 'LUMIG', 'MIGO', 'LUG'], ans: 0 },
      { code: 'function f(n) { return n <= 1 ? 1 : n * f(n - 1); }\nconsole.log(f(4));', opts: ['12', '16', '24', '8'], ans: 2 },
      { code: 'const nums = [2, 4, 6];\nconsole.log(nums.reduce((a, b) => a + b, 0));', opts: ['10', '12', '48', '6'], ans: 1 },
      { code: 'console.log(typeof null === "object");', opts: ['true', 'false', 'null', 'Error'], ans: 0 },
      { code: 'const m = new Set([1, 2, 2, 3]);\nconsole.log(m.size);', opts: ['4', '3', '2', '1'], ans: 1 }
    ];
    const total = api.difficulty === 'hard' ? 7 : api.difficulty === 'medium' ? 5 : 4;
    const list = [...CHALLENGES].sort(() => Math.random() - 0.5).slice(0, total);
    let idx = 0;
    let correct = 0;
    let score = 0;

    api.stage.innerHTML = `
      <div style="width:100%;max-width:580px;">
        <div id="cm-step" class="badge badge-purple" style="margin-bottom:10px;">Kod 1 / ${total}</div>
        <pre id="cm-code" style="padding:16px;border-radius:14px;background:#060a17;color:#a5f3fc;font-family:var(--font-mono);overflow-x:auto;border:1px solid rgba(34,211,238,0.35);margin-bottom:14px;"></pre>
        <p style="font-size:0.86rem;color:var(--text-secondary);margin-bottom:10px;">Ushbu JavaScript kodi konsolga nima chiqaradi?</p>
        <div id="cm-opts" style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;"></div>
      </div>
    `;
    const stepEl = api.stage.querySelector('#cm-step');
    const codeEl = api.stage.querySelector('#cm-code');
    const optsEl = api.stage.querySelector('#cm-opts');

    function render() {
      if (idx >= list.length) {
        api.finish({ won: correct >= Math.ceil(total * 0.6), score, summary: `${correct}/${total} ta dasturlash masalasi toʻgʻri yechildi!` });
        return;
      }
      const item = list[idx];
      stepEl.textContent = `Kod ${idx + 1} / ${total}`;
      codeEl.textContent = item.code;
      api.setProgress((idx / total) * 100);
      optsEl.innerHTML = '';
      item.opts.forEach((opt, i) => {
        const b = document.createElement('button');
        b.className = 'btn btn-primary';
        b.style.fontFamily = 'var(--font-mono)';
        b.textContent = opt;
        b.onclick = () => {
          if (api.isPaused()) return;
          if (i === item.ans) {
            correct++;
            score += 50;
            if (window.LUMIGO.sfx) window.LUMIGO.sfx.beep(780, 0.08);
          } else {
            if (window.LUMIGO.sfx) window.LUMIGO.sfx.beep(220, 0.12, 'sawtooth');
          }
          api.setScore(score);
          idx++;
          render();
        };
        optsEl.appendChild(b);
      });
    }

    api.startCountdownTimer(75, () => {
      api.finish({ won: correct >= Math.ceil(total * 0.6), score, summary: `Vaqt tugadi! ${correct}/${total} toʻgʻri.` });
    });
    render();
  });
})();
