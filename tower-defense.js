(function () {
  window.LUMIGO.registerGame('tower-defense', function (api) {
    const W = 520, H = 320;
    const totalWaves = api.difficulty === 'hard' ? 6 : api.difficulty === 'medium' ? 5 : 4;
    const enemyHpBase = api.difficulty === 'hard' ? 60 : api.difficulty === 'medium' ? 45 : 32;

    const path = [
      { x: 0, y: 70 },
      { x: 140, y: 70 },
      { x: 140, y: 240 },
      { x: 340, y: 240 },
      { x: 340, y: 110 },
      { x: 520, y: 110 }
    ];

    const TOWER_TYPES = {
      laser: { name: 'Laser', cost: 40, range: 110, dmg: 12, rate: 26, color: '#22d3ee' },
      frost: { name: 'Frost', cost: 50, range: 95, dmg: 6, rate: 30, slow: 0.5, color: '#8b5cf6' },
      plasma: { name: 'Plasma', cost: 75, range: 130, dmg: 26, rate: 46, color: '#ec4899' }
    };

    let selectedType = 'laser';
    let gold = 120;
    let baseHP = 10;
    let wave = 1;
    let score = 0;
    let towers = [];
    let enemies = [];
    let bullets = [];
    let spawnLeft = 6;
    let spawnTick = 0;
    let frame = 0;

    api.stage.innerHTML = `
      <div style="text-align:center;width:100%;">
        <div style="display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin-bottom:8px;align-items:center;">
          <span class="badge badge-orange">🪙 Gold: <strong id="td-gold">120</strong></span>
          <span class="badge badge-pink">❤️ Base: <strong id="td-hp">10</strong></span>
          <span class="badge badge-cyan">🌊 Wave: <strong id="td-wave">1</strong>/${totalWaves}</span>
          <button class="btn btn-sm btn-primary" data-tt="laser">⚡ Laser (40)</button>
          <button class="btn btn-sm btn-glass" data-tt="frost">❄️ Frost (50)</button>
          <button class="btn btn-sm btn-glass" data-tt="plasma">🔥 Plasma (75)</button>
        </div>
        <canvas id="td-cv" class="game-canvas" width="${W}" height="${H}"></canvas>
        <p style="font-size:0.78rem;color:var(--text-secondary);margin-top:6px;">Minora qoʻyish uchun yoʻldan tashqari boʻsh joyni bosing!</p>
      </div>
    `;

    const goldEl = api.stage.querySelector('#td-gold');
    const hpEl = api.stage.querySelector('#td-hp');
    const waveEl = api.stage.querySelector('#td-wave');
    const cv = api.stage.querySelector('#td-cv');
    const ctx = cv.getContext('2d');

    api.stage.querySelectorAll('[data-tt]').forEach(btn => {
      btn.onclick = () => {
        selectedType = btn.getAttribute('data-tt');
        api.stage.querySelectorAll('[data-tt]').forEach(b => b.className = 'btn btn-sm btn-glass');
        btn.className = 'btn btn-sm btn-primary';
      };
    });

    function distToSegment(px, py, x1, y1, x2, y2) {
      const dx = x2 - x1, dy = y2 - y1;
      const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy || 1)));
      return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
    }

    cv.onclick = (e) => {
      if (api.isPaused()) return;
      const rect = cv.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (W / rect.width);
      const y = (e.clientY - rect.top) * (H / rect.height);
      const spec = TOWER_TYPES[selectedType];
      if (gold < spec.cost) return;

      for (let i = 0; i < path.length - 1; i++) {
        if (distToSegment(x, y, path[i].x, path[i].y, path[i + 1].x, path[i + 1].y) < 26) return;
      }
      if (towers.some(t => Math.hypot(t.x - x, t.y - y) < 28)) return;

      gold -= spec.cost;
      goldEl.textContent = gold;
      towers.push({ x, y, type: selectedType, cd: 0, ...spec });
      if (window.LUMIGO.sfx) window.LUMIGO.sfx.beep(620, 0.06);
    };

    function spawnEnemy() {
      const hp = enemyHpBase + wave * 18;
      enemies.push({
        x: path[0].x,
        y: path[0].y,
        wp: 1,
        hp,
        maxHp: hp,
        speed: 1.15 + wave * 0.14,
        slowTimer: 0
      });
    }

    let rafId;
    function loop() {
      if (!api.isPaused()) {
        frame++;
        if (spawnLeft > 0) {
          spawnTick++;
          if (spawnTick >= 46) {
            spawnTick = 0;
            spawnLeft--;
            spawnEnemy();
          }
        } else if (enemies.length === 0) {
          if (wave >= totalWaves) {
            api.finish({ won: true, score: score + baseHP * 25, summary: `Barcha ${totalWaves} toʻlqin qaytarildi!` });
            return;
          }
          wave++;
          waveEl.textContent = wave;
          spawnLeft = 5 + wave * 2;
          gold += 35;
          goldEl.textContent = gold;
          api.setProgress(((wave - 1) / totalWaves) * 100);
        }

        // Move enemies
        for (let i = enemies.length - 1; i >= 0; i--) {
          const en = enemies[i];
          const target = path[en.wp];
          if (!target) {
            enemies.splice(i, 1);
            baseHP--;
            hpEl.textContent = Math.max(0, baseHP);
            if (baseHP <= 0) {
              api.finish({ won: false, score, summary: 'Baza himoyasi yorib oʻtildi!' });
              return;
            }
            continue;
          }
          const spd = en.slowTimer > 0 ? en.speed * 0.55 : en.speed;
          if (en.slowTimer > 0) en.slowTimer--;
          const dx = target.x - en.x, dy = target.y - en.y;
          const dist = Math.hypot(dx, dy);
          if (dist <= spd) {
            en.x = target.x; en.y = target.y; en.wp++;
          } else {
            en.x += (dx / dist) * spd;
            en.y += (dy / dist) * spd;
          }
        }

        // Towers fire
        for (const t of towers) {
          if (t.cd > 0) { t.cd--; continue; }
          const target = enemies.find(en => Math.hypot(en.x - t.x, en.y - t.y) <= t.range);
          if (target) {
            t.cd = t.rate;
            bullets.push({ x: t.x, y: t.y, target, dmg: t.dmg, slow: t.slow || 0, color: t.color });
          }
        }

        // Move bullets
        for (let i = bullets.length - 1; i >= 0; i--) {
          const b = bullets[i];
          if (!enemies.includes(b.target)) { bullets.splice(i, 1); continue; }
          const dx = b.target.x - b.x, dy = b.target.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 10) {
            b.target.hp -= b.dmg;
            if (b.slow) b.target.slowTimer = 50;
            bullets.splice(i, 1);
            if (b.target.hp <= 0) {
              const idx = enemies.indexOf(b.target);
              if (idx !== -1) enemies.splice(idx, 1);
              gold += 14;
              score += 20;
              goldEl.textContent = gold;
              api.setScore(score);
            }
          } else {
            b.x += (dx / dist) * 7;
            b.y += (dy / dist) * 7;
          }
        }
      }

      // Draw
      ctx.fillStyle = '#060a17';
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 28;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      path.slice(1).forEach(pt => ctx.lineTo(pt.x, pt.y));
      ctx.stroke();

      for (const t of towers) {
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.range, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = t.color;
        ctx.beginPath();
        ctx.arc(t.x, t.y, 12, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const en of enemies) {
        ctx.fillStyle = en.slowTimer > 0 ? '#a5f3fc' : '#f43f5e';
        ctx.beginPath();
        ctx.arc(en.x, en.y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(en.x - 10, en.y - 16, 20 * Math.max(0, en.hp / en.maxHp), 3);
      }

      for (const b of bullets) {
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(loop);
    }

    api.onCleanup(() => cancelAnimationFrame(rafId));
    api.startStopwatch();
    loop();
  });
})();
