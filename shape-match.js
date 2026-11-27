(function () {
  window.LUMIGO.registerGame('shape-match', function (api) {
    const SHAPES = [
      { id: 'circle', icon: '🔵', color: '#22d3ee' },
      { id: 'square', icon: '🟧', color: '#f97316' },
      { id: 'triangle', icon: '🔺', color: '#ec4899' },
      { id: 'star', icon: '⭐', color: '#facc15' }
    ];
    const targetMatches = api.difficulty === 'hard' ? 16 : api.difficulty === 'medium' ? 12 : 8;
    const fallSpeed = api.difficulty === 'hard' ? 3.2 : api.difficulty === 'medium' ? 2.4 : 1.7;

    let currentShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    let y = 30;
    let score = 0;
    let matched = 0;
    let lives = 3;

    api.stage.innerHTML = `
      <div style="text-align:center;width:100%;max-width:440px;">
        <div style="margin-bottom:8px;">Jonlar: <strong id="shm-lives">❤️❤️❤️</strong> • Maqsad: <strong>${targetMatches}</strong></div>
        <canvas id="shm-cv" class="game-canvas" width="360" height="270" style="margin:0 auto 12px;"></canvas>
        <div id="shm-btns" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;"></div>
      </div>
    `;
    const livesEl = api.stage.querySelector('#shm-lives');
    const cv = api.stage.querySelector('#shm-cv');
    const ctx = cv.getContext('2d');
    const btnsEl = api.stage.querySelector('#shm-btns');

    function spawnNew() {
      currentShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      y = 26;
    }

    function checkPick(id) {
      if (api.isPaused()) return;
      if (id === currentShape.id) {
        matched++;
        score += 30;
        api.setScore(score);
        api.setProgress((matched / targetMatches) * 100);
        if (window.LUMIGO.sfx) window.LUMIGO.sfx.beep(760, 0.07);
        if (matched >= targetMatches) {
          api.finish({ won: true, score: score + lives * 25, summary: `${targetMatches} ta shakl muvaffaqiyatli moslandi!` });
          return;
        }
        spawnNew();
      } else {
        lives--;
        livesEl.textContent = '❤️'.repeat(Math.max(0, lives)) || '💔';
        if (window.LUMIGO.sfx) window.LUMIGO.sfx.beep(200, 0.12, 'sawtooth');
        if (lives <= 0) {
          api.finish({ won: false, score, summary: 'Jonlar tugadi!' });
        }
      }
    }

    SHAPES.forEach(s => {
      const b = document.createElement('button');
      b.className = 'btn btn-glass';
      b.style.fontSize = '1.8rem';
      b.textContent = s.icon;
      b.onclick = () => checkPick(s.id);
      btnsEl.appendChild(b);
    });

    let rafId;
    function loop() {
      if (!api.isPaused()) {
        y += fallSpeed;
        if (y > cv.height - 22) {
          lives--;
          livesEl.textContent = '❤️'.repeat(Math.max(0, lives)) || '💔';
          if (lives <= 0) {
            api.finish({ won: false, score, summary: 'Shakl pastga tushib ketdi!' });
            return;
          }
          spawnNew();
        }
      }

      ctx.fillStyle = '#060a17';
      ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.strokeStyle = 'rgba(236,72,153,0.4)';
      ctx.beginPath();
      ctx.moveTo(0, cv.height - 20);
      ctx.lineTo(cv.width, cv.height - 20);
      ctx.stroke();

      ctx.font = '44px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(currentShape.icon, cv.width / 2, y);

      rafId = requestAnimationFrame(loop);
    }

    api.onCleanup(() => cancelAnimationFrame(rafId));
    api.startStopwatch();
    loop();
  });
})();
