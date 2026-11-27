(function () {
  window.LUMIGO.registerGame('sudoku', function (api) {
    // Base valid solved Sudoku + random row/col band & digit permutation
    const base = [
      [5,3,4,6,7,8,9,1,2],
      [6,7,2,1,9,5,3,4,8],
      [1,9,8,3,4,2,5,6,7],
      [8,5,9,7,6,1,4,2,3],
      [4,2,6,8,5,3,7,9,1],
      [7,1,3,9,2,4,8,5,6],
      [9,6,1,5,3,7,2,8,4],
      [2,8,7,4,1,9,6,3,5],
      [3,4,5,2,8,6,1,7,9]
    ];
    const perm = [1,2,3,4,5,6,7,8,9].sort(() => Math.random() - 0.5);
    const solution = base.map(row => row.map(v => perm[v - 1]));

    const blanksCount = api.difficulty === 'hard' ? 42 : api.difficulty === 'medium' ? 30 : 20;
    const puzzle = solution.map(r => [...r]);
    const given = Array.from({ length: 9 }, () => Array(9).fill(true));

    let removed = 0;
    const indices = Array.from({ length: 81 }, (_, i) => i).sort(() => Math.random() - 0.5);
    for (const idx of indices) {
      if (removed >= blanksCount) break;
      const r = Math.floor(idx / 9), c = idx % 9;
      puzzle[r][c] = 0;
      given[r][c] = false;
      removed++;
    }

    let selected = null;
    let score = 0;

    api.stage.innerHTML = `
      <div style="text-align:center;">
        <div id="sd-grid" class="sudoku-grid" style="margin:0 auto 14px;"></div>
        <div id="sd-pad" style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;"></div>
      </div>
    `;

    const gridEl = api.stage.querySelector('#sd-grid');
    const padEl = api.stage.querySelector('#sd-pad');

    function updateProgress() {
      let filled = 0;
      for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) if (puzzle[r][c] === solution[r][c]) filled++;
      api.setProgress((filled / 81) * 100);
      if (filled === 81) {
        api.finish({ won: true, score: Math.max(150, 350 + score), summary: 'Sudoku toʻliq va toʻgʻri yechildi!' });
      }
    }

    function render() {
      gridEl.innerHTML = '';
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          const val = puzzle[r][c];
          const isGiven = given[r][c];
          const isSel = selected && selected[0] === r && selected[1] === c;
          const isErr = val !== 0 && val !== solution[r][c];
          const cell = document.createElement('button');
          cell.className = 'sudoku-cell' + (isGiven ? ' given' : '') + (isSel ? ' selected' : '') + (isErr ? ' error' : '');
          cell.textContent = val || '';
          cell.onclick = () => {
            if (!isGiven && !api.isPaused()) {
              selected = [r, c];
              render();
            }
          };
          gridEl.appendChild(cell);
        }
      }
    }

    for (let n = 1; n <= 9; n++) {
      const b = document.createElement('button');
      b.className = 'btn btn-primary btn-sm';
      b.textContent = n;
      b.onclick = () => {
        if (!selected || api.isPaused()) return;
        const [r, c] = selected;
        puzzle[r][c] = n;
        if (n === solution[r][c]) score += 15;
        else score = Math.max(0, score - 5);
        api.setScore(score);
        render();
        updateProgress();
      };
      padEl.appendChild(b);
    }

    const hintBtn = document.createElement('button');
    hintBtn.className = 'btn btn-hot btn-sm';
    hintBtn.textContent = '💡 Hint';
    hintBtn.onclick = () => {
      if (!selected || api.isPaused()) return;
      const [r, c] = selected;
      puzzle[r][c] = solution[r][c];
      render();
      updateProgress();
    };
    padEl.appendChild(hintBtn);

    api.startCountdownTimer(api.difficulty === 'hard' ? 360 : 300, () => {
      api.finish({ won: false, score, summary: 'Sudoku vaqti tugadi!' });
    });
    render();
    updateProgress();
  });
})();
