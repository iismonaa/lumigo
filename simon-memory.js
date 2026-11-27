(function () {
  window.LUMIGO.registerGame('simon-memory', function (api) {
    const targetLevels = api.difficulty === 'hard' ? 8 : api.difficulty === 'medium' ? 6 : 4;
    const flashMs = api.difficulty === 'hard' ? 320 : api.difficulty === 'medium' ? 430 : 540;
    const pads = [
      { id: 0, color: '#22c55e', freq: 329.63 },
      { id: 1, color: '#ef4444', freq: 440.0 },
      { id: 2, color: '#facc15', freq: 554.37 },
      { id: 3, color: '#3b82f6', freq: 659.25 }
    ];

    let sequence = [];
    let userIdx = 0;
    let showing = false;
    let score = 0;

    api.stage.innerHTML = `
      <div style="text-align:center;">
        <div id="sm-msg" class="badge badge-cyan" style="margin-bottom:16px;font-size:0.95rem;">Kuzating... (Maqsad: ${targetLevels} bosqich)</div>
        <div class="simon-grid" id="sm-grid"></div>
      </div>
    `;
    const msgEl = api.stage.querySelector('#sm-msg');
    const grid = api.stage.querySelector('#sm-grid');

    const padEls = pads.map(p => {
      const btn = document.createElement('button');
      btn.className = 'simon-pad';
      btn.style.background = p.color;
      btn.style.color = p.color;
      btn.onclick = () => onPadClick(p.id);
      grid.appendChild(btn);
      return btn;
    });

    function lightPad(id, ms = 260) {
      const el = padEls[id];
      el.classList.add('lit');
      if (window.LUMIGO.sfx) window.LUMIGO.sfx.beep(pads[id].freq, ms / 1000, 'triangle', 0.18);
      setTimeout(() => el.classList.remove('lit'), ms);
    }

    async function nextSequence() {
      showing = true;
      userIdx = 0;
      sequence.push(Math.floor(Math.random() * 4));
      msgEl.textContent = `Bosqich ${sequence.length} / ${targetLevels} — Kuzating!`;
      await new Promise(r => setTimeout(r, 450));
      for (const id of sequence) {
        if (api.isPaused()) return;
        lightPad(id, flashMs * 0.75);
        await new Promise(r => setTimeout(r, flashMs));
      }
      showing = false;
      msgEl.textContent = 'Endi siz qaytaring!';
    }

    function onPadClick(id) {
      if (api.isPaused() || showing) return;
      lightPad(id, 200);
      if (id === sequence[userIdx]) {
        userIdx++;
        if (userIdx === sequence.length) {
          score += sequence.length * 25;
          api.setScore(score);
          api.setProgress((sequence.length / targetLevels) * 100);
          if (sequence.length >= targetLevels) {
            api.finish({ won: true, score: score + 100, summary: `${targetLevels} bosqichli ketma-ketlikni bexato bajardingiz!` });
          } else {
            setTimeout(nextSequence, 500);
          }
        }
      } else {
        api.finish({ won: false, score, summary: `Xato tugma! ${sequence.length - 1} bosqich bajarildi.` });
      }
    }

    api.startStopwatch();
    nextSequence();
  });
})();
