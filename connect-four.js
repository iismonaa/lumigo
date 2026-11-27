(function () {
  window.LUMIGO.registerGame('connect-four', function (api) {
    const ROWS = 6, COLS = 7;
    const is2P = api.playMode === '2p';
    let grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    let turn = 1; // 1 = Player (Yellow), 2 = Bot/P2 (Pink)
    let moves = 0;

    api.stage.innerHTML = `
      <div style="text-align:center;">
        <div id="c4-status" class="badge badge-orange" style="margin-bottom:12px;">Navbat: 🟡 1-o'yinchi</div>
        <div id="c4-board" class="c4-board" style="margin:0 auto;"></div>
      </div>
    `;
    const statusEl = api.stage.querySelector('#c4-status');
    const boardEl = api.stage.querySelector('#c4-board');

    function dropRow(c) {
      for (let r = ROWS - 1; r >= 0; r--) if (grid[r][c] === 0) return r;
      return -1;
    }

    function checkWin(p) {
      const dirs = [[0,1],[1,0],[1,1],[1,-1]];
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (grid[r][c] !== p) continue;
          for (const [dr, dc] of dirs) {
            let cnt = 0;
            for (let k = 0; k < 4; k++) {
              const nr = r + dr * k, nc = c + dc * k;
              if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && grid[nr][nc] === p) cnt++;
            }
            if (cnt === 4) return true;
          }
        }
      }
      return false;
    }

    function botCol() {
      const validCols = [];
      for (let c = 0; c < COLS; c++) if (dropRow(c) !== -1) validCols.push(c);
      if (!validCols.length) return -1;
      if (api.difficulty !== 'easy') {
        // Winning move check
        for (const c of validCols) {
          const r = dropRow(c);
          grid[r][c] = 2;
          const win = checkWin(2);
          grid[r][c] = 0;
          if (win) return c;
        }
        // Block player winning move
        for (const c of validCols) {
          const r = dropRow(c);
          grid[r][c] = 1;
          const blk = checkWin(1);
          grid[r][c] = 0;
          if (blk) return c;
        }
      }
      return validCols[Math.floor(Math.random() * validCols.length)];
    }

    function playCol(c) {
      if (api.isPaused()) return;
      const r = dropRow(c);
      if (r === -1) return;
      grid[r][c] = turn;
      moves++;
      if (window.LUMIGO.sfx) window.LUMIGO.sfx.beep(turn === 1 ? 520 : 390, 0.07);
      render();

      if (checkWin(turn)) {
        const won = is2P ? true : (turn === 1);
        api.finish({ won, score: won ? 180 : 40, summary: `${turn === 1 ? "🟡 1-o'yinchi" : (is2P ? "🔴 2-o'yinchi" : '🤖 Bot')} 4 tasini ketma-ket tizdi!` });
        return;
      }
      if (moves === ROWS * COLS) {
        api.finish({ won: false, draw: true, score: 70, summary: 'Taxta toʻldi — durang!' });
        return;
      }
      turn = turn === 1 ? 2 : 1;
      statusEl.textContent = turn === 1 ? "Navbat: 🟡 1-o'yinchi" : (is2P ? "Navbat: 🔴 2-o'yinchi" : 'Navbat: 🤖 Bot...');
      if (!is2P && turn === 2) {
        setTimeout(() => playCol(botCol()), 380);
      }
    }

    function render() {
      boardEl.innerHTML = '';
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const cell = document.createElement('button');
          cell.className = 'c4-cell' + (grid[r][c] === 1 ? ' p1' : grid[r][c] === 2 ? ' p2' : '');
          cell.onclick = () => {
            if (!is2P && turn === 2) return;
            playCol(c);
          };
          boardEl.appendChild(cell);
        }
      }
    }

    api.startStopwatch();
    render();
  });
})();
