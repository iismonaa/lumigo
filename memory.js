(function () {
  window.LUMIGO.registerGame('memory', function (api) {
    const emojis = ['🚀', '🎮', '💎', '🔥', '⚡', '🦊', '👑', '🐉', '🌟', '🎵', '🧩', '🦄'];
    const pairsCount = api.difficulty === 'hard' ? 12 : api.difficulty === 'medium' ? 8 : 6;
    const cols = api.difficulty === 'hard' ? 6 : 4;
    const timeLimit = api.difficulty === 'hard' ? 95 : api.difficulty === 'medium' ? 75 : 70;

    const chosen = emojis.slice(0, pairsCount);
    const deck = [...chosen, ...chosen].sort(() => Math.random() - 0.5);

    let flipped = [];
    let matched = 0;
    let score = 0;
    let locked = false;

    const grid = document.createElement('div');
    grid.className = 'memory-grid';
    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    api.stage.appendChild(grid);

    api.startCountdownTimer(timeLimit, () => {
      api.finish({ won: false, score, summary: `Vaqt tugadi! ${matched}/${pairsCount} juftlik topildi.` });
    });

    deck.forEach((icon, idx) => {
      const card = document.createElement('button');
      card.className = 'memory-card';
      card.textContent = '❓';
      card.onclick = () => {
        if (api.isPaused() || locked || card.classList.contains('flipped') || card.classList.contains('matched')) return;
        card.classList.add('flipped');
        card.textContent = icon;
        if (window.LUMIGO.sfx) window.LUMIGO.sfx.beep(480, 0.06);
        flipped.push({ card, icon, idx });

        if (flipped.length === 2) {
          locked = true;
          const [a, b] = flipped;
          if (a.icon === b.icon) {
            setTimeout(() => {
              a.card.classList.add('matched');
              b.card.classList.add('matched');
              matched++;
              score += 50;
              api.setScore(score);
              api.setProgress((matched / pairsCount) * 100);
              if (window.LUMIGO.sfx) window.LUMIGO.sfx.beep(780, 0.1);
              flipped = [];
              locked = false;
              if (matched === pairsCount) {
                api.finish({ won: true, score: score + 100, summary: `Barcha ${pairsCount} ta juftlik topildi!` });
              }
            }, 220);
          } else {
            setTimeout(() => {
              a.card.classList.remove('flipped');
              b.card.classList.remove('flipped');
              a.card.textContent = '❓';
              b.card.textContent = '❓';
              score = Math.max(0, score - 5);
              api.setScore(score);
              flipped = [];
              locked = false;
            }, 620);
          }
        }
      };
      grid.appendChild(card);
    });
  });
})();
