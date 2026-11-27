(function () {
  window.LUMIGO.registerGame('logic-quest', function (api) {
    const size = api.difficulty === 'hard' ? 5 : api.difficulty === 'medium' ? 4 : 3;
    let grid = Array.from({ length: size }, () => Array(size).fill(true));
    let moves = 0;

    function toggle(r, c) {
      const coords = [[r, c], [r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]];
      coords.forEach(([rr, cc]) => {
        if (rr >= 0 && rr < size && cc >= 0 && cc < size) grid[rr][cc] = !grid[rr][cc];
      });
    }

    // Create a guaranteed solvable puzzle by scrambling from solved state
    const scrambleCount = api.difficulty === 'hard' ? 8 : api.difficulty === 'medium' ? 5 : 3;
    for (let i = 0; i < scrambleCount; i++) {
      toggle(Math.floor(Math.random() * size), Math.floor(Math.random() * size));
    }

    api.stage.innerHTML = `
      <div style="text-align:center;">
        <p style="color:var(--text-secondary);margin-bottom:12px;">Barcha chiroqlarni yoqing (💡)! Har bosish qoʻshnilarini ham oʻzgartiradi.</p>
        <div id="lq-grid" class="logic-grid" style="grid-template-columns:repeat(${size},1fr);margin:0 auto;"></div>
      </div>
    `;
    const gridEl = api.stage.querySelector('#lq-grid');

    function render() {
      gridEl.innerHTML = '';
      let litCount = 0;
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (grid[r][c]) litCount++;
          const btn = document.createElement('button');
          btn.className = 'logic-node' + (grid[r][c] ? ' on' : '');
          btn.textContent = grid[r][c] ? '💡' : '🌑';
          btn.onclick = () => {
            if (api.isPaused()) return;
            toggle(r, c);
            moves++;
            const score = Math.max(50, 320 - moves * 6);
            api.setScore(score);
            if (window.LUMIGO.sfx) window.LUMIGO.sfx.beep(600, 0.06);
            render();
          };
          gridEl.appendChild(btn);
        }
      }
      api.setProgress((litCount / (size * size)) * 100);
      if (litCount === size * size) {
        api.finish({ won: true, score: Math.max(100, 360 - moves * 5), summary: `Barcha tugunlar ${moves} ta yurishda yoqildi!` });
      }
    }

    api.startCountdownTimer(120, () => {
      api.finish({ won: false, score: 40, summary: 'Vaqt tugadi!' });
    });
    render();
  });
})();
