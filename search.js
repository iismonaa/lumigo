/* ==========================================================================
   LUMIGO — Instant Game Search & Filtering Modal
   ========================================================================== */
(function () {
  window.LUMIGO = window.LUMIGO || {};

  function openSearchModal() {
    const games = window.LUMIGO.GAMES || [];
    const st = window.LUMIGO.storage;
    const ageGroups = st.AGE_GROUPS;
    const activeAge = st.getAgeGroup() || 'All';

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'search-modal';
    modal.innerHTML = `
      <div class="modal-box" style="max-width:860px;">
        <button class="modal-close" id="search-close">✕</button>
        <h2 style="margin-bottom:14px;">🔍 <span data-i18n="search_btn">Search</span> LUMIGO</h2>
        <div style="display:grid;grid-template-columns:1.6fr 1fr 1fr;gap:10px;margin-bottom:16px;">
          <input type="text" id="sr-query" class="form-control" placeholder="O'yin nomi, janr..." autofocus>
          <select id="sr-cat" class="form-control">
            <option value="all">All Categories</option>
            <option value="brain">Brain Training</option>
            <option value="puzzle">Puzzle</option>
            <option value="arcade">Arcade & Action</option>
            <option value="strategy">Strategy</option>
            <option value="multiplayer">Multiplayer</option>
            <option value="code">Coding & Typing</option>
          </select>
          <select id="sr-age" class="form-control">
            <option value="all">All Ages</option>
            ${ageGroups.map(a => `<option value="${a.id}" ${a.id === activeAge ? 'selected' : ''}>${a.label} yosh</option>`).join('')}
          </select>
        </div>
        <div id="sr-results" class="games-grid" style="max-height:55vh;overflow-y:auto;padding-right:4px;"></div>
      </div>
    `;
    document.body.appendChild(modal);

    const qInput = modal.querySelector('#sr-query');
    const cSelect = modal.querySelector('#sr-cat');
    const aSelect = modal.querySelector('#sr-age');
    const resBox = modal.querySelector('#sr-results');

    function renderResults() {
      const q = qInput.value.trim().toLowerCase();
      const cat = cSelect.value;
      const ageId = aSelect.value;
      const ageObj = ageGroups.find(a => a.id === ageId);

      const filtered = games.filter(g => {
        const matchQ = !q || g.title.toLowerCase().includes(q) || g.desc.toLowerCase().includes(q) || g.category.toLowerCase().includes(q);
        const matchCat = cat === 'all' || g.category === cat || (cat === 'multiplayer' && g.supports2P);
        const matchAge = !ageObj || (ageObj.max >= g.minAge);
        return matchQ && matchCat && matchAge;
      });

      if (!filtered.length) {
        resBox.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:30px;color:var(--text-secondary);">Hech qanday oʻyin topilmadi 🔍</div>`;
        return;
      }

      resBox.innerHTML = filtered.map(g => `
        <div class="game-card">
          <div class="game-thumb" style="background:${g.gradient};height:95px;">
            <span class="game-thumb-icon" style="font-size:2.4rem;">${g.icon}</span>
            <div class="game-badges-top">
              <span class="game-tag">${g.category.toUpperCase()}</span>
              <span class="game-age-pill">${g.minAge}+</span>
            </div>
          </div>
          <div class="game-info">
            <h3>${g.title}</h3>
            <p>${g.desc}</p>
          </div>
          <button class="game-play-btn" data-play-id="${g.id}">▶ Play</button>
        </div>
      `).join('');

      resBox.querySelectorAll('[data-play-id]').forEach(btn => {
        btn.onclick = () => {
          modal.remove();
          window.LUMIGO.launchGame(btn.getAttribute('data-play-id'));
        };
      });
    }

    qInput.oninput = renderResults;
    cSelect.onchange = renderResults;
    aSelect.onchange = renderResults;
    modal.querySelector('#search-close').onclick = () => modal.remove();
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

    renderResults();
    setTimeout(() => qInput.focus(), 50);
  }

  window.LUMIGO.search = {
    openSearchModal
  };
})();
