(function () {
  window.LUMIGO.registerGame('bubble-shooter', function (api) {
    const W = 400, H = 430, R = 17, COLS = 10;
    const COLORS = ['#ec4899', '#22d3ee', '#facc15', '#84cc16', '#8b5cf6'];
    const rowsInit = api.difficulty === 'hard' ? 5 : api.difficulty === 'medium' ? 4 : 3;
    const targetScore = api.difficulty === 'hard' ? 240 : api.difficulty === 'medium' ? 180 : 120;

    let bubbles = [];
    for (let r = 0; r < rowsInit; r++) {
      for (let c = 0; c < COLS; c++) {
        bubbles.push({
          x: 28 + c * (R * 2 + 2) + (r % 2 ? R * 0.5 : 0),
          y: 28 + r * (R * 1.9),
          color: COLORS[Math.floor(Math.random() * COLORS.length)]
        });
      }
    }

    let aimAngle = -Math.PI / 2;
    let activeShot = null;
    let nextColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    let score = 0;

    api.stage.innerHTML = `
      <div style="text-align:center;">
        <p style="font-size:0.84rem;color:var(--text-secondary);margin-bottom:8px;">Sichqonchani harakatlantirib nishonga oling va bosing! Maqsad: <strong>${targetScore}</strong> ball</p>
        <canvas id="bs-cv" class="game-canvas" width="${W}" height="${H}"></canvas>
      </div>
    `;
    const cv = api.stage.querySelector('#bs-cv');
    const ctx = cv.getContext('2d');

    function shoot(clientX, clientY) {
      if (api.isPaused() || activeShot) return;
      const rect = cv.getBoundingClientRect();
      const mx = (clientX - rect.left) * (W / rect.width);
      const my = (clientY - rect.top) * (H / rect.height);
      const ang = Math.atan2(my - (H - 26), mx - W / 2);
      if (ang > -0.18 || ang < -Math.PI + 0.18) return;
      aimAngle = ang;
      activeShot = {
        x: W / 2,
        y: H - 26,
        vx: Math.cos(ang) * 9,
        vy: Math.sin(ang) * 9,
        color: nextColor
      };
      nextColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    }

    cv.addEventListener('mousemove', (e) => {
      const rect = cv.getBoundingClientRect();
      const mx = (e.clientX - rect.left) * (W / rect.width);
      const my = (e.clientY - rect.top) * (H / rect.height);
      const ang = Math.atan2(my - (H - 26), mx - W / 2);
      if (ang < -0.2 && ang > -Math.PI + 0.2) aimAngle = ang;
    });
    cv.addEventListener('click', (e) => shoot(e.clientX, e.clientY));

    function popCluster(seed) {
      const cluster = [seed];
      const queue = [seed];
      while (queue.length) {
        const curr = queue.shift();
        for (const b of bubbles) {
          if (b.color === seed.color && !cluster.includes(b)) {
            const d = Math.hypot(b.x - curr.x, b.y - curr.y);
            if (d <= R * 2.45) {
              cluster.push(b);
              queue.push(b);
            }
          }
        }
      }
      if (cluster.length >= 3) {
        bubbles = bubbles.filter(b => !cluster.includes(b));
        score += cluster.length * 15;
        api.setScore(score);
        api.setProgress(Math.min(100, (score / targetScore) * 100));
        if (window.LUMIGO.sfx) window.LUMIGO.sfx.beep(780, 0.1);
        if (score >= targetScore || bubbles.length === 0) {
          api.finish({ won: true, score: score + 80, summary: 'Pufakchalar muvaffaqiyatli portlatildi!' });
        }
      }
    }

    let rafId;
    function loop() {
      if (!api.isPaused()) {
        if (activeShot) {
          activeShot.x += activeShot.vx;
          activeShot.y += activeShot.vy;
          if (activeShot.x <= R || activeShot.x >= W - R) activeShot.vx *= -1;
          const hitTop = activeShot.y <= R + 10;
          const hitBubble = bubbles.some(b => Math.hypot(b.x - activeShot.x, b.y - activeShot.y) <= R * 1.9);
          if (hitTop || hitBubble) {
            const landed = { x: activeShot.x, y: activeShot.y, color: activeShot.color };
            bubbles.push(landed);
            activeShot = null;
            popCluster(landed);
            if (landed.y >= H - 68) {
              api.finish({ won: score >= targetScore, score, summary: 'Pufakchalar pastki chiziqqa yetib keldi!' });
              return;
            }
          }
        }
      }

      ctx.fillStyle = '#060a17';
      ctx.fillRect(0, 0, W, H);

      // Aim guide
      ctx.strokeStyle = 'rgba(255,255,255,0.28)';
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(W / 2, H - 26);
      ctx.lineTo(W / 2 + Math.cos(aimAngle) * 120, H - 26 + Math.sin(aimAngle) * 120);
      ctx.stroke();
      ctx.setLineDash([]);

      // Bubbles
      for (const b of bubbles) {
        ctx.beginPath();
        ctx.arc(b.x, b.y, R - 1, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();
      }
      if (activeShot) {
        ctx.beginPath();
        ctx.arc(activeShot.x, activeShot.y, R - 1, 0, Math.PI * 2);
        ctx.fillStyle = activeShot.color;
        ctx.fill();
      }
      // Cannon next bubble
      ctx.beginPath();
      ctx.arc(W / 2, H - 26, R, 0, Math.PI * 2);
      ctx.fillStyle = nextColor;
      ctx.fill();

      rafId = requestAnimationFrame(loop);
    }

    api.onCleanup(() => cancelAnimationFrame(rafId));
    api.startCountdownTimer(95, () => {
      api.finish({ won: score >= targetScore, score, summary: `Vaqt tugadi! Ball: ${score}` });
    });
    loop();
  });
})();
