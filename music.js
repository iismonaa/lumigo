/* ==========================================================================
   LUMIGO — Music Player (Web Audio Synth Categories + IndexedDB Custom Upload)
   ========================================================================== */
(function () {
  window.LUMIGO = window.LUMIGO || {};

  const BUILTIN_TRACKS = [
    { id: 't_gaming', title: 'Neon Cyber Beat', category: 'Gaming Music', bpm: 122, wave: 'sawtooth', notes: [261.63, 329.63, 392.0, 523.25, 392.0, 329.63] },
    { id: 't_relax', title: 'Starlight Chill', category: 'Relax Music', bpm: 78, wave: 'sine', notes: [220.0, 261.63, 329.63, 392.0, 329.63, 261.63] },
    { id: 't_action', title: 'Turbo Arena Pulse', category: 'Action Music', bpm: 144, wave: 'square', notes: [196.0, 246.94, 293.66, 392.0, 440.0, 392.0] },
    { id: 't_puzzle', title: 'Crystal Logic Flow', category: 'Puzzle Music', bpm: 96, wave: 'triangle', notes: [293.66, 349.23, 440.0, 523.25, 440.0, 349.23] },
    { id: 't_adventure', title: 'Sky Quest Odyssey', category: 'Adventure Music', bpm: 112, wave: 'triangle', notes: [261.63, 293.66, 392.0, 440.0, 523.25, 392.0] }
  ];

  let audioCtx = null;
  let synthTimer = null;
  let noteStep = 0;
  let htmlAudio = null;
  let customTracks = [];
  let state = {
    enabled: true,
    playing: false,
    minimized: true,
    volume: 0.45,
    currentIndex: 0,
    categoryFilter: 'All'
  };

  function getAudioCtx() {
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) audioCtx = new Ctx();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  }

  /* Sound Effects */
  const sfx = {
    beep(freq = 520, dur = 0.08, type = 'sine', vol = 0.14) {
      if (!state.enabled) return;
      const ctx = getAudioCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(vol * state.volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    },
    playWin() {
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => setTimeout(() => sfx.beep(f, 0.16, 'triangle', 0.2), i * 95));
    },
    playLose() {
      [349.23, 311.13, 261.63].forEach((f, i) => setTimeout(() => sfx.beep(f, 0.2, 'sawtooth', 0.15), i * 130));
    },
    playLevelUp() {
      [440, 554.37, 659.25, 880, 1108.73].forEach((f, i) => setTimeout(() => sfx.beep(f, 0.18, 'triangle', 0.24), i * 80));
    }
  };
  window.LUMIGO.sfx = sfx;

  function getAllTracks() {
    const list = [...BUILTIN_TRACKS, ...customTracks];
    if (state.categoryFilter === 'All') return list;
    return list.filter(t => t.category === state.categoryFilter);
  }

  function stopPlayback() {
    if (synthTimer) {
      clearInterval(synthTimer);
      synthTimer = null;
    }
    if (htmlAudio) {
      htmlAudio.pause();
    }
    state.playing = false;
    renderDock();
  }

  function startPlayback() {
    if (!state.enabled) state.enabled = true;
    stopPlayback();
    const tracks = getAllTracks();
    if (!tracks.length) return;
    if (state.currentIndex >= tracks.length) state.currentIndex = 0;
    const track = tracks[state.currentIndex];
    state.playing = true;

    if (track.isCustom && track.blob) {
      if (!htmlAudio) htmlAudio = new Audio();
      if (htmlAudio._objUrl) URL.revokeObjectURL(htmlAudio._objUrl);
      const url = URL.createObjectURL(track.blob);
      htmlAudio._objUrl = url;
      htmlAudio.src = url;
      htmlAudio.loop = true;
      htmlAudio.volume = state.volume;
      htmlAudio.play().catch(() => {
        state.playing = false;
        renderDock();
      });
    } else {
      const ctx = getAudioCtx();
      if (ctx) {
        const intervalMs = Math.round((60 / (track.bpm || 110)) * 500);
        noteStep = 0;
        const playStep = () => {
          if (!state.playing || !state.enabled) return;
          const freq = track.notes[noteStep % track.notes.length];
          noteStep++;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = track.wave || 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          gain.gain.setValueAtTime(0.08 * state.volume, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + intervalMs / 1100);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + intervalMs / 1000);
        };
        playStep();
        synthTimer = setInterval(playStep, intervalMs);
      }
    }
    renderDock();
  }

  function togglePlay() {
    if (state.playing) stopPlayback();
    else startPlayback();
  }

  function toggleMuteAll() {
    state.enabled = !state.enabled;
    if (!state.enabled) stopPlayback();
    else renderDock();
  }

  function nextTrack() {
    const tracks = getAllTracks();
    if (!tracks.length) return;
    state.currentIndex = (state.currentIndex + 1) % tracks.length;
    if (state.playing) startPlayback();
    else renderDock();
  }

  function prevTrack() {
    const tracks = getAllTracks();
    if (!tracks.length) return;
    state.currentIndex = (state.currentIndex - 1 + tracks.length) % tracks.length;
    if (state.playing) startPlayback();
    else renderDock();
  }

  function setCategoryForGame(categoryName) {
    const idx = BUILTIN_TRACKS.findIndex(t => t.category === categoryName);
    if (idx !== -1) {
      state.categoryFilter = 'All';
      state.currentIndex = idx;
      if (state.playing) startPlayback();
      else renderDock();
    }
  }

  async function loadCustomTracks() {
    try {
      const items = await window.LUMIGO.storage.idbGetAll('customMusic');
      customTracks = items.map(item => ({
        id: item.id,
        title: item.title,
        category: item.category || 'Gaming Music',
        blob: item.blob,
        isCustom: true
      }));
      renderDock();
    } catch (e) {
      customTracks = [];
    }
  }

  async function handleFileUpload(file) {
    if (!file) return;
    const item = {
      id: 'cm_' + Date.now(),
      title: file.name.replace(/\.[^/.]+$/, ''),
      category: 'Gaming Music',
      blob: file
    };
    try {
      await window.LUMIGO.storage.idbPut('customMusic', item);
    } catch (e) {
      // Fallback in-memory if IndexedDB blocked
    }
    customTracks.push({ ...item, isCustom: true });
    state.categoryFilter = 'All';
    state.currentIndex = getAllTracks().length - 1;
    startPlayback();
    window.LUMIGO.rewards.toast(`Musiqa yuklandi: ${item.title}`, '🎵');
  }

  function toggleDockExpand() {
    state.minimized = !state.minimized;
    renderDock();
  }

  function renderDock() {
    let dock = document.getElementById('lumigo-music-dock');
    if (!dock) {
      dock = document.createElement('div');
      dock.id = 'lumigo-music-dock';
      dock.className = 'music-dock';
      document.body.appendChild(dock);
    }
    const tracks = getAllTracks();
    const current = tracks[state.currentIndex] || BUILTIN_TRACKS[0];
    dock.classList.toggle('minimized', state.minimized);

    if (state.minimized) {
      dock.innerHTML = `
        <div class="music-dock-header">
          <button class="btn btn-sm btn-primary" id="md-play-mini" title="Play/Pause">${state.playing ? '⏸' : '▶'}</button>
          <span style="font-size:0.82rem;font-weight:700;max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
            🎵 ${current.title}
          </span>
          <button class="icon-btn" style="width:30px;height:30px;" id="md-expand" title="Expand Player">⤢</button>
        </div>
      `;
      dock.querySelector('#md-play-mini').onclick = togglePlay;
      dock.querySelector('#md-expand').onclick = toggleDockExpand;
      return;
    }

    dock.innerHTML = `
      <div class="music-dock-header">
        <div>
          <div style="font-size:0.74rem;color:var(--cyan);font-weight:800;">${current.category} ${current.isCustom ? '(Custom)' : ''}</div>
          <div style="font-size:0.95rem;font-weight:800;">🎵 ${current.title}</div>
        </div>
        <div style="display:flex;gap:6px;">
          <button class="icon-btn" style="width:32px;height:32px;" id="md-mute" title="On/Off">${state.enabled ? '🔊' : '🔇'}</button>
          <button class="icon-btn" style="width:32px;height:32px;" id="md-min" title="Minimize">⤡</button>
        </div>
      </div>

      <div class="music-controls-row">
        <button class="btn btn-glass btn-sm" id="md-prev">⏮</button>
        <button class="btn btn-primary btn-sm" id="md-play" style="flex:1;">${state.playing ? '⏸ Pause' : '▶ Play'}</button>
        <button class="btn btn-glass btn-sm" id="md-next">⏭</button>
      </div>

      <div style="display:flex;align-items:center;gap:8px;margin-top:10px;">
        <span style="font-size:0.8rem;">🔉</span>
        <input type="range" id="md-vol" min="0" max="1" step="0.05" value="${state.volume}" style="flex:1;accent-color:var(--cyan);">
      </div>

      <div style="display:flex;gap:8px;margin-top:10px;align-items:center;">
        <select id="md-cat" class="lang-select" style="flex:1;">
          <option value="All">All Categories</option>
          <option value="Gaming Music">Gaming Music</option>
          <option value="Relax Music">Relax Music</option>
          <option value="Action Music">Action Music</option>
          <option value="Puzzle Music">Puzzle Music</option>
          <option value="Adventure Music">Adventure Music</option>
        </select>
        <label class="btn btn-hot btn-sm" style="cursor:pointer;">
          📁 <span data-i18n="upload_music">Upload</span>
          <input type="file" id="md-upload" accept="audio/*" style="display:none;">
        </label>
      </div>
    `;

    dock.querySelector('#md-min').onclick = toggleDockExpand;
    dock.querySelector('#md-mute').onclick = toggleMuteAll;
    dock.querySelector('#md-play').onclick = togglePlay;
    dock.querySelector('#md-prev').onclick = prevTrack;
    dock.querySelector('#md-next').onclick = nextTrack;
    const vol = dock.querySelector('#md-vol');
    vol.oninput = (e) => {
      state.volume = parseFloat(e.target.value);
      if (htmlAudio) htmlAudio.volume = state.volume;
    };
    const cat = dock.querySelector('#md-cat');
    cat.value = state.categoryFilter;
    cat.onchange = (e) => {
      state.categoryFilter = e.target.value;
      state.currentIndex = 0;
      if (state.playing) startPlayback();
      else renderDock();
    };
    dock.querySelector('#md-upload').onchange = (e) => {
      if (e.target.files && e.target.files[0]) handleFileUpload(e.target.files[0]);
    };
  }

  function initMusic() {
    renderDock();
    loadCustomTracks();
  }

  window.LUMIGO.music = {
    initMusic,
    togglePlay,
    toggleDockExpand,
    setCategoryForGame
  };
})();
