(function () {
  window.LUMIGO.registerGame('word-hunter', function (api) {
    const WORDS_BANK = ['LUMIGO', 'NEON', 'GAME', 'BRAIN', 'CYBER', 'PIXEL', 'LOGIC', 'QUEST', 'SMART', 'FLASH'];
    const wordCount = api.difficulty === 'hard' ? 6 : api.difficulty === 'medium' ? 5 : 4;
    const size = api.difficulty === 'hard' ? 10 : 8;
    const targets = WORDS_BANK.slice(0, wordCount);

    const grid = Array.from({ length: size }, () => Array(size).fill(''));
    const wordCells = {};

    // Place words horizontally or vertically cleanly
    targets.forEach((word, wIdx) => {
      let placed = false;
      for (let attempt = 0; attempt < 60 && !placed; attempt++) {
        const horiz = Math.random() > 0.45;
        const r = Math.floor(Math.random() * (horiz ? size : size - word.length + 1));
        const c = Math.floor(Math.random() * (horiz ? size - word.length + 1 : size));
        let ok = true;
        for (let i = 0; i < word.length; i++) {
          const ch = grid[horiz ? r : r + i][horiz ? c + i : c];
          if (ch !== '' && ch !== word[i]) { ok = false; break; }
        }
        if (ok) {
          wordCells[word] = [];
          for (let i = 0; i < word.length; i++) {
            const rr = horiz ? r : r + i;
            const cc = horiz ? c + i : c;
            grid[rr][cc] = word[i];
            wordCells[word].push(`${rr},${cc}`);
          }
          placed = true;
        }
      }
      if (!placed) {
        // Guaranteed fallback row placement
        const rr = wIdx % size;
        wordCells[word] = [];
        for (let i = 0; i < word.length && i < size; i++) {
          grid[rr][i] = word[i];
          wordCells[word].push(`${rr},${i}`);
        }
      }
    });

    const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!grid[r][c]) grid[r][c] = alpha[Math.floor(Math.random() * alpha.length)];
      }
    }

    let selected = [];
    let foundWords = new Set();
    let foundKeys = new Set();
    let score = 0;

    api.stage.innerHTML = `
      <div style="text-align:center;">
        <div id="wh-targets" style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:12px;"></div>
        <div id="wh-grid" class="word-grid" style="grid-template-columns:repeat(${size},1fr);margin:0 auto;"></div>
        <p style="font-size:0.8rem;color:var(--text-secondary);margin-top:10px;">Harflarni ketma-ket bosing, soʻz toʻliq boʻlganda avtomatik topiladi!</p>
      </div>
    `;

    const tBox = api.stage.querySelector('#wh-targets');
    const gBox = api.stage.querySelector('#wh-grid');

    function renderTargets() {
      tBox.innerHTML = targets.map(w => `
        <span class="badge ${foundWords.has(w) ? 'badge-lime' : 'badge-purple'}" style="${foundWords.has(w) ? 'text-decoration:line-through;' : ''}">${w}</span>
      `).join('');
    }

    function renderGrid() {
      gBox.innerHTML = '';
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          const key = `${r},${c}`;
          const btn = document.createElement('button');
          btn.className = 'word-cell' + (foundKeys.has(key) ? ' found' : selected.includes(key) ? ' selected' : '');
          btn.textContent = grid[r][c];
          btn.onclick = () => {
            if (api.isPaused()) return;
            if (selected.includes(key)) {
              selected = selected.filter(k => k !== key);
            } else {
              selected.push(key);
            }
            const formed = selected.map(k => {
              const [rr, cc] = k.split(',').map(Number);
              return grid[rr][cc];
            }).join('');

            const matchedWord = targets.find(w => !foundWords.has(w) && formed === w);
            if (matchedWord) {
              foundWords.add(matchedWord);
              selected.forEach(k => foundKeys.add(k));
              selected = [];
              score += 60;
              api.setScore(score);
              api.setProgress((foundWords.size / targets.length) * 100);
              if (window.LUMIGO.sfx) window.LUMIGO.sfx.beep(820, 0.12);
              renderTargets();
              if (foundWords.size === targets.length) {
                api.finish({ won: true, score: score + 80, summary: 'Barcha yashirin soʻzlar topildi!' });
                return;
              }
            } else if (formed.length > 8) {
              selected = [];
            }
            renderGrid();
          };
          gBox.appendChild(btn);
        }
      }
    }

    api.startCountdownTimer(110, () => {
      api.finish({ won: false, score, summary: `${foundWords.size}/${targets.length} soʻz topildi.` });
    });
    renderTargets();
    renderGrid();
  });
})();
