(function () {
  window.LUMIGO.registerGame('maze-escape', function (api) {
    const size = api.difficulty === 'hard' ? 17 : api.difficulty === 'medium' ? 13 : 9;
    const cellPx = api.difficulty === 'hard' ? 22 : api.difficulty === 'medium' ? 28 : 36;
    const timeLimit = api.difficulty === 'hard' ? 90 : api.difficulty === 'medium' ? 75 : 65;

    // DFS Maze Generator (1 = wall, 0 = path)
    const maze = Array.from({ length: size }, () => Array(size).fill(1));
    function carve(r, c) {
      maze[r][c] = 0;
      const dirs = [[0, 2], [0, -2], [2, 0], [-2, 0]].sort(() => Math.random() - 0.5);
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr > 0 && nr < size - 1 && nc > 0 && nc < size - 1 && maze[nr][nc] === 1) {
          maze[r + dr / 2][c + dc / 2] = 0;
          carve(nr, nc);
        }
      }
    }
    carve(1, 1);
    const goal = { r: size - 2, c: size - 2 };
    let player = { r: 1, c: 1 };
    let steps = 0;

    api.stage.innerHTML = `
      <div style="text-align:center;">
        <canvas id="maze-cv" class="game-canvas" width="${size * cellPx}" height="${size * cellPx}"></canvas>
        <div class="touch-dpad" style="margin:12px auto 0;">
          <div></div><button class="dpad-btn" data-dir="-1,0">▲</button><div></div>
          <button class="dpad-btn" data-dir="0,-1">◀</button><button class="dpad-btn" data-dir="1,0">▼</button><button class="dpad-btn" data-dir="0,1">▶</button>
        </div>
      </div>
    `;

    const cv = api.stage.querySelector('#maze-cv');
    const ctx = cv.getContext('2d');

    function draw() {
      ctx.clearRect(0, 0, cv.width, cv.height);
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          ctx.fillStyle = maze[r][c] === 1 ? '#1e293b' : '#090f24';
          ctx.fillRect(c * cellPx, r * cellPx, cellPx, cellPx);
        }
      }
      // Exit portal
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(goal.c * cellPx + 3, goal.r * cellPx + 3, cellPx - 6, cellPx - 6);
      // Player
      ctx.fillStyle = '#22d3ee';
      ctx.beginPath();
      ctx.arc(player.c * cellPx + cellPx / 2, player.r * cellPx + cellPx / 2, cellPx * 0.35, 0, Math.PI * 2);
      ctx.fill();
    }

    function move(dr, dc) {
      if (api.isPaused()) return;
      const nr = player.r + dr, nc = player.c + dc;
      if (nr >= 0 && nr < size && nc >= 0 && nc < size && maze[nr][nc] === 0) {
        player = { r: nr, c: nc };
        steps++;
        const dist = Math.abs(goal.r - nr) + Math.abs(goal.c - nc);
        const maxDist = (size - 3) * 2;
        api.setProgress(Math.max(5, ((maxDist - dist) / maxDist) * 100));
        api.setScore(Math.max(50, 400 - steps * 2));
        draw();
        if (nr === goal.r && nc === goal.c) {
          api.finish({ won: true, score: Math.max(120, 450 - steps * 2), summary: `Labirintdan ${steps} ta qadamda chiqdingiz!` });
        }
      }
    }

    const onKey = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w') { e.preventDefault(); move(-1, 0); }
      if (e.key === 'ArrowDown' || e.key === 's') { e.preventDefault(); move(1, 0); }
      if (e.key === 'ArrowLeft' || e.key === 'a') { e.preventDefault(); move(0, -1); }
      if (e.key === 'ArrowRight' || e.key === 'd') { e.preventDefault(); move(0, 1); }
    };
    window.addEventListener('keydown', onKey);
    api.onCleanup(() => window.removeEventListener('keydown', onKey));

    api.stage.querySelectorAll('[data-dir]').forEach(b => {
      b.onclick = () => {
        const [dr, dc] = b.getAttribute('data-dir').split(',').map(Number);
        move(dr, dc);
      };
    });

    api.startCountdownTimer(timeLimit, () => {
      api.finish({ won: false, score: 40, summary: 'Labirintdan chiqishga ulgurmadingiz!' });
    });
    draw();
  });
})();
