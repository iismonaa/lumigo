(function () {
  window.LUMIGO.registerGame('speed-reaction', function (api) {
    const rounds = api.difficulty === 'hard' ? 7 : api.difficulty === 'medium' ? 5 : 4;
    const targetMs = api.difficulty === 'hard' ? 350 : api.difficulty === 'medium' ? 450 : 600;

    let currentRound = 0;
    let times = [];
    let state = 'waiting'; // waiting | ready | idle
    let greenAt = 0;
    let waitTimer = null;

    api.stage.innerHTML = `
      <div style="text-align:center;width:100%;max-width:500px;">
        <p style="color:var(--text-secondary);margin-bottom:12px;">Raund: <strong id="sr-rnd">1</strong> / ${rounds} • Maqsad: &lt; ${targetMs}ms o'rtacha</p>
        <button id="sr-pad" style="width:100%;height:240px;border-radius:24px;font-size:1.6rem;font-weight:900;color:#fff;background:linear-gradient(135deg,#dc2626,#991b1b);box-shadow:0 12px 32px rgba(220,38,38,0.35);transition:transform 0.1s;">
          Kuting...
        </button>
        <div id="sr-log" style="margin-top:12px;color:var(--cyan);font-weight:700;"></div>
      </div>
    `;

    const pad = api.stage.querySelector('#sr-pad');
    const rndEl = api.stage.querySelector('#sr-rnd');
    const logEl = api.stage.querySelector('#sr-log');

    function startRound() {
      if (currentRound >= rounds) {
        const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
        const score = Math.max(50, Math.round(800 - avg));
        api.finish({
          won: avg <= targetMs,
          score,
          summary: `O'rtacha reaksiya: ${avg} ms (Talab: ${targetMs} ms)`
        });
        return;
      }
      currentRound++;
      rndEl.textContent = currentRound;
      state = 'waiting';
      pad.style.background = 'linear-gradient(135deg,#dc2626,#991b1b)';
      pad.textContent = 'YASHIL BOʻLISHINI KUTING...';

      const delay = 1100 + Math.random() * 2100;
      waitTimer = setTimeout(() => {
        if (api.isPaused()) return;
        state = 'ready';
        greenAt = performance.now();
        pad.style.background = 'linear-gradient(135deg,#16a34a,#84cc16)';
        pad.textContent = 'HOZIR BOSING! ⚡';
        if (window.LUMIGO.sfx) window.LUMIGO.sfx.beep(880, 0.07);
      }, delay);
    }

    pad.onclick = () => {
      if (api.isPaused()) return;
      if (state === 'waiting') {
        clearTimeout(waitTimer);
        logEl.textContent = 'Juda erta bosdingiz! (+150ms jarima)';
        times.push(targetMs + 150);
        api.setProgress((times.length / rounds) * 100);
        setTimeout(startRound, 700);
      } else if (state === 'ready') {
        const rt = Math.round(performance.now() - greenAt);
        times.push(rt);
        const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
        api.setScore(Math.max(10, 700 - avg));
        api.setProgress((times.length / rounds) * 100);
        logEl.textContent = `Oxirgi reaksiya: ${rt} ms`;
        state = 'idle';
        pad.style.background = 'linear-gradient(135deg,#3b82f6,#8b5cf6)';
        pad.textContent = `${rt} ms!`;
        setTimeout(startRound, 650);
      }
    };

    api.startStopwatch();
    api.onCleanup(() => clearTimeout(waitTimer));
    startRound();
  });
})();
