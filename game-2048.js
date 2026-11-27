(function () {
  window.LUMIGO.registerGame('game-2048', function (api) {
    const winTarget = api.difficulty === 'hard' ? 1024 : api.difficulty === 'medium' ? 512 : 256;
    let board = Array.from({ length: 4 }, () => [0, 0, 0, 0]);
    let score = 0;

    function addTile() {
      const empty = [];
      for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if (board[r][c] === 0) empty.push([r, c]);
      if (!empty.length) return;
      const [r, c] = empty[Math.floor(Math.random() * empty.length)];
      board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }

    function tileColor(v) {
      const map = {
        0: 'rgba(255,255,255,0.06)', 2: '#334155', 4: '#475569', 8: '#f97316',
        16: '#ec4899', 32: '#a855f7', 64: '#6366f1', 128: '#3b82f6',
        256: '#06b6d4', 512: '#22c55e', 1024: '#eab308', 2048: '#facc15'
      };
      return map[v] || '#f43f5e';
    }

    api.stage.innerHTML = `
      <div style="text-align:center;">
        <p style="color:var(--text-secondary);margin-bottom:10px;">Maqsadli plitka: <strong>${winTarget}</strong> (Klaviatura strelkalari yoki tugmalar)</p>
        <div id="g2-board" class="g2048-board"></div>
        <div class="touch-dpad" style="margin:12px auto 0;">
          <div></div><button class="dpad-btn" data-mv="up">▲</button><div></div>
          <button class="dpad-btn" data-mv="left">◀</button><button class="dpad-btn" data-mv="down">▼</button><button class="dpad-btn" data-mv="right">▶</button>
        </div>
      </div>
    `;
    const boardEl = api.stage.querySelector('#g2-board');
    boardEl.style.gridTemplateColumns = 'repeat(4, 1fr)';

    function render() {
      boardEl.innerHTML = '';
      let maxTile = 0;
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          const v = board[r][c];
          if (v > maxTile) maxTile = v;
          const cell = document.createElement('div');
          cell.className = 'g2048-cell';
          cell.style.background = tileColor(v);
          cell.textContent = v || '';
          boardEl.appendChild(cell);
        }
      }
      api.setProgress(Math.min(100, (maxTile / winTarget) * 100));
      if (maxTile >= winTarget) {
        api.finish({ won: true, score: score + 150, summary: `${winTarget} plitkasiga yetdingiz!` });
      }
    }

    function slideRow(row) {
      let arr = row.filter(v => v !== 0);
      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i + 1]) {
          arr[i] *= 2;
          score += arr[i];
          arr[i + 1] = 0;
        }
      }
      arr = arr.filter(v => v !== 0);
      while (arr.length < 4) arr.push(0);
      return arr;
    }

    function hasMoves() {
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (board[r][c] === 0) return true;
          if (r < 3 && board[r][c] === board[r + 1][c]) return true;
          if (c < 3 && board[r][c] === board[r][c + 1]) return true;
        }
      }
      return false;
    }

    function move(dir) {
      if (api.isPaused()) return;
      const before = JSON.stringify(board);
      if (dir === 'left') {
        for (let r = 0; r < 4; r++) board[r] = slideRow(board[r]);
      } else if (dir === 'right') {
        for (let r = 0; r < 4; r++) board[r] = slideRow([...board[r]].reverse()).reverse();
      } else if (dir === 'up') {
        for (let c = 0; c < 4; c++) {
          const col = slideRow([board[0][c], board[1][c], board[2][c], board[3][c]]);
          for (let r = 0; r < 4; r++) board[r][c] = col[r];
        }
      } else if (dir === 'down') {
        for (let c = 0; c < 4; c++) {
          const col = slideRow([board[3][c], board[2][c], board[1][c], board[0][c]]).reverse();
          for (let r = 0; r < 4; r++) board[r][c] = col[r];
        }
      }
      if (JSON.stringify(board) !== before) {
        addTile();
        api.setScore(score);
        if (window.LUMIGO.sfx) window.LUMIGO.sfx.beep(440, 0.04);
        render();
        if (!hasMoves()) {
          api.finish({ won: false, score, summary: 'Boshqa yurish qolmadi!' });
        }
      }
    }

    const onKey = (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); move('left'); }
      if (e.key === 'ArrowRight') { e.preventDefault(); move('right'); }
      if (e.key === 'ArrowUp') { e.preventDefault(); move('up'); }
      if (e.key === 'ArrowDown') { e.preventDefault(); move('down'); }
    };
    window.addEventListener('keydown', onKey);
    api.onCleanup(() => window.removeEventListener('keydown', onKey));
    api.stage.querySelectorAll('[data-mv]').forEach(b => b.onclick = () => move(b.getAttribute('data-mv')));

    api.startStopwatch();
    addTile();
    addTile();
    render();
  });
})();
