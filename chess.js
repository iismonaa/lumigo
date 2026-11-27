(function () {
  window.LUMIGO.registerGame('chess', function (api) {
    const is2P = api.playMode === '2p';
    const GLYPHS = {
      P:'♙', R:'♖', N:'♘', B:'♗', Q:'♕', K:'♔',
      p:'♟', r:'♜', n:'♞', b:'♝', q:'♛', k:'♚'
    };
    const VALUES = { p:10, n:30, b:30, r:50, q:90, k:900 };

    let board = [
      ['r','n','b','q','k','b','n','r'],
      ['p','p','p','p','p','p','p','p'],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['P','P','P','P','P','P','P','P'],
      ['R','N','B','Q','K','B','N','R']
    ];
    let turn = 'w'; // w = uppercase, b = lowercase
    let selected = null;
    let legalTargets = [];
    let score = 0;

    const isWhite = (p) => p && p === p.toUpperCase();
    const sideOf = (p) => !p ? null : (isWhite(p) ? 'w' : 'b');

    function getMoves(r, c) {
      const p = board[r][c];
      if (!p) return [];
      const side = sideOf(p);
      const type = p.toLowerCase();
      const res = [];
      const inBounds = (rr, cc) => rr >= 0 && rr < 8 && cc >= 0 && cc < 8;

      if (type === 'p') {
        const dir = side === 'w' ? -1 : 1;
        const startRow = side === 'w' ? 6 : 1;
        if (inBounds(r + dir, c) && !board[r + dir][c]) {
          res.push([r + dir, c]);
          if (r === startRow && !board[r + 2 * dir][c]) res.push([r + 2 * dir, c]);
        }
        for (const dc of [-1, 1]) {
          if (inBounds(r + dir, c + dc) && board[r + dir][c + dc] && sideOf(board[r + dir][c + dc]) !== side) {
            res.push([r + dir, c + dc]);
          }
        }
      } else if (type === 'n') {
        for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) {
          const nr = r + dr, nc = c + dc;
          if (inBounds(nr, nc) && sideOf(board[nr][nc]) !== side) res.push([nr, nc]);
        }
      } else if (type === 'k') {
        for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
          if (!dr && !dc) continue;
          const nr = r + dr, nc = c + dc;
          if (inBounds(nr, nc) && sideOf(board[nr][nc]) !== side) res.push([nr, nc]);
        }
      } else {
        const dirs = [];
        if (type === 'r' || type === 'q') dirs.push([1,0],[-1,0],[0,1],[0,-1]);
        if (type === 'b' || type === 'q') dirs.push([1,1],[1,-1],[-1,1],[-1,-1]);
        for (const [dr, dc] of dirs) {
          let nr = r + dr, nc = c + dc;
          while (inBounds(nr, nc)) {
            if (!board[nr][nc]) {
              res.push([nr, nc]);
            } else {
              if (sideOf(board[nr][nc]) !== side) res.push([nr, nc]);
              break;
            }
            nr += dr; nc += dc;
          }
        }
      }
      return res;
    }

    api.stage.innerHTML = `
      <div style="text-align:center;">
        <div id="ch-status" class="badge badge-cyan" style="margin-bottom:10px;">Navbat: Oq (Siz)</div>
        <div id="ch-board" class="chess-board" style="margin:0 auto;"></div>
      </div>
    `;
    const statusEl = api.stage.querySelector('#ch-status');
    const boardEl = api.stage.querySelector('#ch-board');

    function applyMove(r1, c1, r2, c2) {
      const target = board[r2][c2];
      let moving = board[r1][c1];
      if (moving === 'P' && r2 === 0) moving = 'Q';
      if (moving === 'p' && r2 === 7) moving = 'q';
      board[r2][c2] = moving;
      board[r1][c1] = '';
      if (target) {
        score += VALUES[target.toLowerCase()] || 10;
        api.setScore(score);
      }
      if (window.LUMIGO.sfx) window.LUMIGO.sfx.beep(480, 0.06);

      if (target === 'k') {
        render();
        api.finish({ won: true, score: score + 200, summary: 'Shoh qoʻlga olindi! Gʻalaba!' });
        return true;
      }
      if (target === 'K') {
        render();
        api.finish({ won: is2P, score, summary: 'Qoralar Oq Shohni qoʻlga oldi!' });
        return true;
      }
      return false;
    }

    function botTurn() {
      const moves = [];
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if (sideOf(board[r][c]) === 'b') {
            for (const [nr, nc] of getMoves(r, c)) {
              const cap = board[nr][nc];
              const weight = (cap ? VALUES[cap.toLowerCase()] * 10 : 0) + (nr > r ? 2 : 0) + Math.random() * (api.difficulty === 'easy' ? 25 : 4);
              moves.push({ r, c, nr, nc, weight });
            }
          }
        }
      }
      if (!moves.length) {
        api.finish({ won: true, score: score + 150, summary: 'Raqibda yurish qolmadi!' });
        return;
      }
      moves.sort((a, b) => b.weight - a.weight);
      const best = moves[0];
      const ended = applyMove(best.r, best.c, best.nr, best.nc);
      if (!ended) {
        turn = 'w';
        statusEl.textContent = 'Navbat: Oq';
        render();
      }
    }

    function render() {
      boardEl.innerHTML = '';
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const sq = document.createElement('button');
          const isLight = (r + c) % 2 === 0;
          const isSel = selected && selected[0] === r && selected[1] === c;
          const isValid = legalTargets.some(([tr, tc]) => tr === r && tc === c);
          sq.className = 'chess-sq ' + (isLight ? 'light' : 'dark') + (isSel ? ' selected' : '') + (isValid ? ' valid-move' : '');
          sq.textContent = board[r][c] ? GLYPHS[board[r][c]] : '';
          sq.onclick = () => {
            if (api.isPaused() || (!is2P && turn === 'b')) return;
            if (isValid && selected) {
              const ended = applyMove(selected[0], selected[1], r, c);
              selected = null;
              legalTargets = [];
              if (ended) return;
              turn = turn === 'w' ? 'b' : 'w';
              statusEl.textContent = `Navbat: ${turn === 'w' ? 'Oq' : 'Qora'}`;
              render();
              if (!is2P && turn === 'b') setTimeout(botTurn, 360);
              return;
            }
            if (sideOf(board[r][c]) === turn) {
              selected = [r, c];
              legalTargets = getMoves(r, c);
            } else {
              selected = null;
              legalTargets = [];
            }
            render();
          };
          boardEl.appendChild(sq);
        }
      }
    }

    api.startStopwatch();
    render();
  });
})();
