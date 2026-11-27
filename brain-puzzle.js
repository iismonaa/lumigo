(function () {
  window.LUMIGO.registerGame('brain-puzzle', function (api) {
    const size = api.difficulty === 'hard' ? 5 : api.difficulty === 'medium' ? 4 : 3;
    const total = size * size;
    let board = Array.from({ length: total - 1 }, (_, i) => i + 1).concat(0);
    let moves = 0;

    // Shuffle by making valid random moves so solvability is 100% guaranteed
    let emptyIdx = total - 1;
    const shuffleSteps = size * size * 18;
    for (let s = 0; s < shuffleSteps; s++) {
      const r = Math.floor(emptyIdx / size);
      const c = emptyIdx % size;
      const neighbors = [];
      if (r > 0) neighbors.push(emptyIdx - size);
      if (r < size - 1) neighbors.push(emptyIdx + size);
      if (c > 0) neighbors.push(emptyIdx - 1);
      if (c < size - 1) neighbors.push(emptyIdx + 1);
      const pick = neighbors[Math.floor(Math.random() * neighbors.length)];
      [board[emptyIdx], board[pick]] = [board[pick], board[emptyIdx]];
      emptyIdx = pick;
    }

    const wrap = document.createElement('div');
    wrap.style.textAlign = 'center';
    wrap.innerHTML = `<p style="color:var(--text-secondary);margin-bottom:10px;">Raqamlarni 1 dan ${total - 1} gacha tartiblang. Yurishlar: <strong id="bp-moves">0</strong></p>`;
    const grid = document.createElement('div');
    grid.className = 'sliding-grid';
    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    wrap.appendChild(grid);
    api.stage.appendChild(wrap);
    const movesEl = wrap.querySelector('#bp-moves');

    function isSolved() {
      for (let i = 0; i < total - 1; i++) {
        if (board[i] !== i + 1) return false;
      }
      return board[total - 1] === 0;
    }

    function countCorrect() {
      let ok = 0;
      for (let i = 0; i < total - 1; i++) if (board[i] === i + 1) ok++;
      return ok;
    }

    function render() {
      grid.innerHTML = '';
      board.forEach((val, idx) => {
        const tile = document.createElement('button');
        tile.className = 'sliding-tile' + (val === 0 ? ' empty' : '');
        if (size === 5) { tile.style.width = '52px'; tile.style.height = '52px'; tile.style.fontSize = '1.1rem'; }
        tile.textContent = val === 0 ? '' : val;
        tile.onclick = () => {
          if (api.isPaused() || val === 0) return;
          const eIdx = board.indexOf(0);
          const r1 = Math.floor(idx / size), c1 = idx % size;
          const r2 = Math.floor(eIdx / size), c2 = eIdx % size;
          if (Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1) {
            [board[idx], board[eIdx]] = [board[eIdx], board[idx]];
            moves++;
            movesEl.textContent = moves;
            const score = Math.max(50, 400 - moves * 2);
            api.setScore(score);
            api.setProgress((countCorrect() / (total - 1)) * 100);
            if (window.LUMIGO.sfx) window.LUMIGO.sfx.beep(540, 0.05);
            render();
            if (isSolved()) {
              api.finish({ won: true, score, summary: `${size}x${size} puzzle ${moves} ta yurishda yechildi!` });
            }
          }
        };
        grid.appendChild(tile);
      });
    }

    api.startCountdownTimer(size === 5 ? 180 : size === 4 ? 130 : 90, () => {
      api.finish({ won: false, score: countCorrect() * 15, summary: 'Vaqt tugadi!' });
    });
    render();
  });
})();
