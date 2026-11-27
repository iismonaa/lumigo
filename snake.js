(function () {
  window.LUMIGO.registerGame('snake', function (api) {
    const gridCount = 18;
    const cell = 20;
    const speedMs = api.difficulty === 'hard' ? 88 : api.difficulty === 'medium' ? 120 : 155;
    const targetScore = api.difficulty === 'hard' ? 180 : api.difficulty === 'medium' ? 130 : 90;

    let snake = [{ x: 9, y: 9 }, { x: 8, y: 9 }, { x: 7, y: 9 }];
    let dir = { x: 1, y: 0 };
    let nextDir = { x: 1, y: 0 };
    let obstacles = api.difficulty === 'hard' ? [{ x: 4, y: 4 }, { x: 13, y: 4 }, { x: 4, y: 13 }, { x: 13, y: 13 }] : [];
    let food = spawnFood();
    let score = 0;

    function spawnFood() {
      while (true) {
        const pt = { x: Math.floor(Math.random() * gridCount), y: Math.floor(Math.random() * gridCount) };
        const busy = snake.some(s => s.x === pt.x && s.y === pt.y) || obstacles.some(o => o.x === pt.x && o.y === pt.y);
        if (!busy) return pt;
      }
    }

    api.stage.innerHTML = `
      <div style="text-align:center;">
        <p style="color:var(--text-secondary);font-size:0.84rem;margin-bottom:8px;">Gʻalaba maqsadi: <strong>${targetScore}</strong> ball</p>
        <canvas id="snk-cv" class="game-canvas" width="${gridCount * cell}" height="${gridCount * cell}"></canvas>
        <div class="touch-dpad" style="margin:10px auto 0;">
          <div></div><button class="dpad-btn" data-d="0,-1">▲</button><div></div>
          <button class="dpad-btn" data-d="-1,0">◀</button><button class="dpad-btn" data-d="0,1">▼</button><button class="dpad-btn" data-d="1,0">▶</button>
        </div>
      </div>
    `;
    const cv = api.stage.querySelector('#snk-cv');
    const ctx = cv.getContext('2d');

    function setDir(x, y) {
      if (dir.x + x === 0 && dir.y + y === 0) return;
      nextDir = { x, y };
    }

    const onKey = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w') { e.preventDefault(); setDir(0, -1); }
      if (e.key === 'ArrowDown' || e.key === 's') { e.preventDefault(); setDir(0, 1); }
      if (e.key === 'ArrowLeft' || e.key === 'a') { e.preventDefault(); setDir(-1, 0); }
      if (e.key === 'ArrowRight' || e.key === 'd') { e.preventDefault(); setDir(1, 0); }
    };
    window.addEventListener('keydown', onKey);
    api.stage.querySelectorAll('[data-d]').forEach(b => {
      b.onclick = () => {
        const [x, y] = b.getAttribute('data-d').split(',').map(Number);
        setDir(x, y);
      };
    });

    function draw() {
      ctx.fillStyle = '#060a17';
      ctx.fillRect(0, 0, cv.width, cv.height);

      // Obstacles
      ctx.fillStyle = '#f43f5e';
      obstacles.forEach(o => ctx.fillRect(o.x * cell + 2, o.y * cell + 2, cell - 4, cell - 4));

      // Food
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(food.x * cell + cell / 2, food.y * cell + cell / 2, cell * 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Snake
      snake.forEach((seg, i) => {
        ctx.fillStyle = i === 0 ? '#22d3ee' : '#22c55e';
        ctx.fillRect(seg.x * cell + 1, seg.y * cell + 1, cell - 2, cell - 2);
      });
    }

    const loop = setInterval(() => {
      if (api.isPaused()) return;
      dir = nextDir;
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
      const hitWall = head.x < 0 || head.x >= gridCount || head.y < 0 || head.y >= gridCount;
      const hitSelf = snake.some(s => s.x === head.x && s.y === head.y);
      const hitObs = obstacles.some(o => o.x === head.x && o.y === head.y);

      if (hitWall || hitSelf || hitObs) {
        api.finish({ won: score >= targetScore, score, summary: `Iloncha urildi! Yakuniy ball: ${score}` });
        return;
      }

      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        score += 15;
        api.setScore(score);
        api.setProgress(Math.min(100, (score / targetScore) * 100));
        if (window.LUMIGO.sfx) window.LUMIGO.sfx.beep(720, 0.06);
        food = spawnFood();
        if (score >= targetScore) {
          api.finish({ won: true, score: score + 80, summary: `Maqsad (${targetScore} ball) zabt etildi!` });
          return;
        }
      } else {
        snake.pop();
      }
      draw();
    }, speedMs);

    api.onCleanup(() => {
      clearInterval(loop);
      window.removeEventListener('keydown', onKey);
    });
    api.startStopwatch();
    draw();
  });
})();
