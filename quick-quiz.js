(function () {
  window.LUMIGO.registerGame('quick-quiz', function (api) {
    const BANK = [
      { q: 'Yer Quyosh tizimidagi nechanchi sayyora?', o: ['2-chi', '3-chi', '4-chi', '5-chi'], a: 1 },
      { q: 'HTML nimaning qisqartmasi?', o: ['HyperText Markup Language', 'High Tech Mode Link', 'Home Tool Markup List', 'Hyperlink Text Main'], a: 0 },
      { q: 'Bir kunda necha daqiqa bor?', o: ['1200', '1440', '1600', '720'], a: 1 },
      { q: 'Qaysi rang kamalakda yoʻq?', o: ['Sariq', 'Qora', 'Binafsha', 'Koʻk'], a: 1 },
      { q: 'Oʻzbekiston poytaxti qaysi shahar?', o: ['Samarqand', 'Buxoro', 'Toshkent', 'Xiva'], a: 2 },
      { q: '8 × 12 nechaga teng?', o: ['86', '96', '104', '92'], a: 1 },
      { q: 'Kompyuterning "miyasi" qaysi qism?', o: ['Monitor', 'CPU (Protsessor)', 'Klaviatura', 'Sichqoncha'], a: 1 },
      { q: 'Suvning kimyoviy formulasi?', o: ['CO2', 'H2O', 'O2', 'NaCl'], a: 1 },
      { q: 'Shaxmat taxtasida nechta katak bor?', o: ['48', '56', '64', '72'], a: 2 },
      { q: 'JavaScriptda oʻzgaruvchi eʼlon qilish kalit soʻzi?', o: ['let', 'var_int', 'dim', 'def'], a: 0 }
    ];
    const total = api.difficulty === 'hard' ? 10 : api.difficulty === 'medium' ? 7 : 5;
    const questions = [...BANK].sort(() => Math.random() - 0.5).slice(0, total);
    let idx = 0;
    let correct = 0;
    let score = 0;

    api.stage.innerHTML = `
      <div style="text-align:center;max-width:580px;width:100%;">
        <div id="qq-num" class="badge badge-cyan" style="margin-bottom:10px;">Savol 1 / ${total}</div>
        <h3 id="qq-q" style="font-size:1.35rem;padding:20px;border-radius:16px;background:var(--bg-input);margin-bottom:16px;"></h3>
        <div id="qq-opts" style="display:grid;gap:10px;"></div>
      </div>
    `;
    const numEl = api.stage.querySelector('#qq-num');
    const qEl = api.stage.querySelector('#qq-q');
    const optsEl = api.stage.querySelector('#qq-opts');

    function renderQ() {
      if (idx >= questions.length) {
        api.finish({ won: correct >= Math.ceil(total * 0.6), score, summary: `${correct}/${total} savolga toʻgʻri javob berdingiz!` });
        return;
      }
      const item = questions[idx];
      numEl.textContent = `Savol ${idx + 1} / ${total}`;
      qEl.textContent = item.q;
      api.setProgress((idx / total) * 100);
      optsEl.innerHTML = '';
      item.o.forEach((opt, i) => {
        const b = document.createElement('button');
        b.className = 'btn btn-glass';
        b.style.justifyContent = 'flex-start';
        b.textContent = opt;
        b.onclick = () => {
          if (api.isPaused()) return;
          if (i === item.a) {
            correct++;
            score += 45;
            if (window.LUMIGO.sfx) window.LUMIGO.sfx.beep(780, 0.08);
          } else {
            if (window.LUMIGO.sfx) window.LUMIGO.sfx.beep(220, 0.12, 'sawtooth');
          }
          api.setScore(score);
          idx++;
          renderQ();
        };
        optsEl.appendChild(b);
      });
    }

    api.startCountdownTimer(api.difficulty === 'hard' ? 45 : 65, () => {
      api.finish({ won: correct >= Math.ceil(total * 0.6), score, summary: `Vaqt tugadi! Toʻgʻri javoblar: ${correct}/${total}` });
    });
    renderQ();
  });
})();
