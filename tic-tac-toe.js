(function () {
  window.LUMIGO.registerGame('tic-tac-toe', function (api) {
    let board = Array(9).fill('');
    let turn = 'X';
    const is2P = api.playMode === '2p';
    const isRoom = api.playMode === 'room';
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

    api.stage.innerHTML = `
      <div style="text-align:center;">
        <div id="ttt-status" class="badge badge-cyan" style="font-size:1rem;margin-bottom:14px;">Navbat: X</div>
        <div id="ttt-board" class="ttt-board"></div>
      </div>
    `;
    const statusEl = api.stage.querySelector('#ttt-status');
    const boardEl = api.stage.querySelector('#ttt-board');

    function checkWinner(b) {
      for (const [a, c, d] of wins) {
        if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
      }
      return b.every(Boolean) ? 'DRAW' : null;
    }

    function minimax(b, isMax) {
      const w = checkWinner(b);
      if (w === 'O') return 10;
      if (w === 'X') return -10;
      if (w === 'DRAW') return 0;
      let best = isMax ? -999 : 999;
      for (let i = 0; i < 9; i++) {
        if (!b[i]) {
          b[i] = isMax ? 'O' : 'X';
          const val = minimax(b, !isMax);
          b[i] = '';
          best = isMax ? Math.max(best, val) : Math.min(best, val);
        }
      }
      return best;
    }

    function botPick() {
      const empties = board.map((v, i) => v ? -1 : i).filter(i => i !== -1);
      if (!empties.length) return;
      if (api.difficulty === 'easy' || (api.difficulty === 'medium' && Math.random() < 0.45)) {
        makeMove(empties[Math.floor(Math.random() * empties.length)], true);
        return;
      }
      let bestScore = -999, bestIdx = empties[0];
      for (const idx of empties) {
        board[idx] = 'O';
        const sc = minimax(board, false);
        board[idx] = '';
        if (sc > bestScore) { bestScore = sc; bestIdx = idx; }
      }
      makeMove(bestIdx, true);
    }

    function makeMove(idx, fromBotOrRemote = false) {
      if (api.isPaused() || board[idx]) return;
      board[idx] = turn;
      if (isRoom && !fromBotOrRemote) {
        api.broadcast({ type: 'ttt_move', idx, turn });
      }
      if (window.LUMIGO.sfx) window.LUMIGO.sfx.beep(turn === 'X' ? 540 : 420, 0.06);

      const res = checkWinner(board);
      render();
      if (res) {
        if (res === 'DRAW') {
          api.finish({ won: false, draw: true, score: 60, summary: 'Durang natija!' });
        } else {
          const playerWon = is2P ? true : (res === 'X');
          api.finish({
            won: playerWon,
            score: playerWon ? 160 : 30,
            summary: `${res} gʻalaba qozondi!`
          });
        }
        return;
      }

      turn = turn === 'X' ? 'O' : 'X';
      statusEl.textContent = `Navbat: ${turn}`;
      if (!is2P && !isRoom && turn === 'O') {
        setTimeout(botPick, 340);
      }
    }

    if (isRoom) {
      api.onRoomMessage((msg) => {
        if (msg && msg.type === 'ttt_move' && !board[msg.idx]) {
          turn = msg.turn;
          makeMove(msg.idx, true);
        }
      });
    }

    function render() {
      boardEl.innerHTML = '';
      board.forEach((val, idx) => {
        const cell = document.createElement('button');
        cell.className = 'ttt-cell';
        cell.style.color = val === 'X' ? '#22d3ee' : '#ec4899';
        cell.textContent = val;
        cell.onclick = () => {
          if (!is2P && !isRoom && turn === 'O') return;
          makeMove(idx, false);
        };
        boardEl.appendChild(cell);
      });
    }

    api.startStopwatch();
    render();
  });
})();
