/* ==========================================================================
   LUMIGO — Storage & IndexedDB Manager (Local Frontend Persistence)
   ========================================================================== */
(function () {
  window.LUMIGO = window.LUMIGO || {};

  const KEYS = {
    USERS: 'lumigo_users_v1',
    SESSION: 'lumigo_session_v1',
    AGE_GROUP: 'lumigo_age_group_v1',
    THEME: 'lumigo_theme_v1',
    LANG: 'lumigo_lang_v1',
    NOTIFS: 'lumigo_notifications_v1',
    RECENT_GAMES: 'lumigo_recent_games_v1',
    DAILY: 'lumigo_daily_v1',
    TOURNAMENT: 'lumigo_tournament_v1',
    INTRO_SEEN: 'lumigo_intro_seen_session_v1'
  };

  const AGE_GROUPS = [
    { id: '3-5', label: '3–5', min: 3, max: 5, emoji: '🧸', color: 'linear-gradient(135deg,#22c55e,#84cc16)', kidsSafe: true, descKey: 'age_3_5' },
    { id: '6-8', label: '6–8', min: 6, max: 8, emoji: '🚀', color: 'linear-gradient(135deg,#06b6d4,#3b82f6)', kidsSafe: true, descKey: 'age_6_8' },
    { id: '9-12', label: '9–12', min: 9, max: 12, emoji: '🎮', color: 'linear-gradient(135deg,#8b5cf6,#6366f1)', kidsSafe: true, descKey: 'age_9_12' },
    { id: '13-15', label: '13–15', min: 13, max: 15, emoji: '⚡', color: 'linear-gradient(135deg,#ec4899,#a855f7)', kidsSafe: false, descKey: 'age_13_15' },
    { id: '16-17', label: '16–17', min: 16, max: 17, emoji: '🔥', color: 'linear-gradient(135deg,#f97316,#ec4899)', kidsSafe: false, descKey: 'age_16_17' },
    { id: '18-24', label: '18–24', min: 18, max: 24, emoji: '🏆', color: 'linear-gradient(135deg,#3b82f6,#22d3ee)', kidsSafe: false, descKey: 'age_18_24' },
    { id: '25-35', label: '25–35', min: 25, max: 35, emoji: '🧠', color: 'linear-gradient(135deg,#7c3aed,#22d3ee)', kidsSafe: false, descKey: 'age_25_35' },
    { id: '36-50', label: '36–50', min: 36, max: 50, emoji: '♟️', color: 'linear-gradient(135deg,#0ea5e9,#10b981)', kidsSafe: false, descKey: 'age_36_50' },
    { id: '51+', label: '51+', min: 51, max: 120, emoji: '👑', color: 'linear-gradient(135deg,#eab308,#f97316)', kidsSafe: false, descKey: 'age_51_plus' }
  ];

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  function createDefaultUser(overrides) {
    const base = {
      id: 'u_' + Math.random().toString(36).slice(2, 10),
      username: 'PlayerOne',
      email: 'player@lumigo.demo',
      passwordHash: '',
      salt: '',
      birthDate: '2006-05-15',
      ageGroup: '18-24',
      avatar: '🦊',
      frame: 'frame-default',
      bgTheme: '',
      effect: '',
      coins: 350,
      diamonds: 25,
      money: 150,
      energy: 100,
      xp: 120,
      level: 1,
      wins: 4,
      losses: 1,
      totalGames: 5,
      weeklyScore: 420,
      streak: 1,
      online: true,
      lastPlayedGames: ['memory', 'snake', 'game-2048'],
      triedGames: ['memory', 'snake', 'game-2048'],
      achievements: ['first_win'],
      inventory: ['avatar_fox', 'frame_default'],
      friends: ['u_cyberfox', 'u_pixelqueen'],
      friendRequestsIn: ['u_neonninja'],
      friendRequestsOut: [],
      isDemoSeed: false,
      createdAt: Date.now()
    };
    return Object.assign(base, overrides || {});
  }

  function ensureSeedData() {
    let users = readJSON(KEYS.USERS, null);
    if (!users || !Array.isArray(users) || users.length === 0) {
      // Pre-computed demo password hash placeholder; demo switch works directly
      users = [
        createDefaultUser({
          id: 'u_playerone',
          username: 'PlayerOne',
          email: 'player@lumigo.demo',
          avatar: '🎮',
          ageGroup: '18-24',
          coins: 450,
          diamonds: 30,
          money: 200,
          xp: 380,
          level: 3,
          wins: 8,
          losses: 2,
          totalGames: 10,
          weeklyScore: 890,
          friends: ['u_cyberfox', 'u_pixelqueen'],
          friendRequestsIn: ['u_neonninja'],
          isDemoSeed: true
        }),
        createDefaultUser({
          id: 'u_cyberfox',
          username: 'CyberFox',
          email: 'cyberfox@lumigo.demo',
          avatar: '🦊',
          frame: 'frame-neon-cyan',
          ageGroup: '18-24',
          coins: 1920,
          diamonds: 110,
          money: 640,
          xp: 5600,
          level: 22,
          wins: 48,
          losses: 11,
          totalGames: 59,
          weeklyScore: 2840,
          online: true,
          friends: ['u_playerone', 'u_pixelqueen'],
          friendRequestsIn: [],
          isDemoSeed: true
        }),
        createDefaultUser({
          id: 'u_pixelqueen',
          username: 'PixelQueen',
          email: 'pixelqueen@lumigo.demo',
          avatar: '👑',
          frame: 'frame-royal-gold',
          ageGroup: '25-35',
          coins: 3400,
          diamonds: 215,
          money: 980,
          xp: 12400,
          level: 52,
          wins: 94,
          losses: 18,
          totalGames: 112,
          weeklyScore: 4120,
          online: true,
          friends: ['u_playerone', 'u_cyberfox'],
          friendRequestsIn: [],
          isDemoSeed: true
        }),
        createDefaultUser({
          id: 'u_neonninja',
          username: 'NeonNinja',
          email: 'ninja@lumigo.demo',
          avatar: '🥷',
          frame: 'frame-cyber-pink',
          ageGroup: '16-17',
          coins: 1280,
          diamonds: 65,
          money: 410,
          xp: 2950,
          level: 14,
          wins: 29,
          losses: 9,
          totalGames: 38,
          weeklyScore: 2190,
          online: false,
          friends: ['u_stargamer'],
          friendRequestsOut: ['u_playerone'],
          isDemoSeed: true
        }),
        createDefaultUser({
          id: 'u_stargamer',
          username: 'StarGamer',
          email: 'star@lumigo.demo',
          avatar: '🚀',
          ageGroup: '9-12',
          coins: 960,
          diamonds: 48,
          money: 300,
          xp: 1850,
          level: 10,
          wins: 21,
          losses: 7,
          totalGames: 28,
          weeklyScore: 1640,
          online: true,
          friends: ['u_neonninja'],
          isDemoSeed: true
        })
      ];
      writeJSON(KEYS.USERS, users);
    }

    let session = readJSON(KEYS.SESSION, null);
    if (!session || !users.some(u => u.id === session.userId)) {
      session = { userId: users[0].id, loggedIn: true };
      writeJSON(KEYS.SESSION, session);
    }
  }

  function getUsers() {
    ensureSeedData();
    return readJSON(KEYS.USERS, []);
  }

  function saveUsers(users) {
    return writeJSON(KEYS.USERS, users);
  }

  function getActiveUser() {
    ensureSeedData();
    const session = readJSON(KEYS.SESSION, null);
    const users = getUsers();
    if (!session || !session.loggedIn) return null;
    return users.find(u => u.id === session.userId) || users[0];
  }

  function updateActiveUser(updater) {
    const users = getUsers();
    const active = getActiveUser();
    if (!active) return null;
    const idx = users.findIndex(u => u.id === active.id);
    if (idx === -1) return null;
    const updated = typeof updater === 'function' ? updater({ ...users[idx] }) : { ...users[idx], ...updater };
    users[idx] = updated;
    saveUsers(users);
    window.dispatchEvent(new CustomEvent('lumigo:user-updated', { detail: updated }));
    return updated;
  }

  function setAgeGroup(ageId) {
    localStorage.setItem(KEYS.AGE_GROUP, ageId);
    const active = getActiveUser();
    if (active) {
      updateActiveUser({ ageGroup: ageId });
    }
    window.dispatchEvent(new CustomEvent('lumigo:age-updated', { detail: ageId }));
  }

  function getAgeGroup() {
    const stored = localStorage.getItem(KEYS.AGE_GROUP);
    if (stored) return stored;
    const active = getActiveUser();
    return active ? active.ageGroup : null;
  }

  function isKidsMode() {
    const age = getAgeGroup() || '18-24';
    const meta = AGE_GROUPS.find(a => a.id === age);
    return meta ? meta.kidsSafe : false;
  }

  function addNotification(title, body, icon = '🔔') {
    const list = readJSON(KEYS.NOTIFS, []);
    list.unshift({
      id: 'n_' + Date.now() + Math.random().toString(36).slice(2, 5),
      title,
      body,
      icon,
      unread: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    writeJSON(KEYS.NOTIFS, list.slice(0, 25));
    window.dispatchEvent(new CustomEvent('lumigo:notif-updated'));
  }

  function getNotifications() {
    return readJSON(KEYS.NOTIFS, []);
  }

  function markAllNotifsRead() {
    const list = getNotifications().map(n => ({ ...n, unread: false }));
    writeJSON(KEYS.NOTIFS, list);
    window.dispatchEvent(new CustomEvent('lumigo:notif-updated'));
  }

  /* IndexedDB wrapper for custom audio files & custom code scripts */
  const DB_NAME = 'lumigo_indexed_db';
  const DB_VERSION = 1;

  function openDB() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        reject(new Error('IndexedDB unsupported'));
        return;
      }
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('customMusic')) {
          db.createObjectStore('customMusic', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('customCode')) {
          db.createObjectStore('customCode', { keyPath: 'id' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function idbPut(storeName, item) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      tx.objectStore(storeName).put(item);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }

  async function idbGetAll(storeName) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const req = tx.objectStore(storeName).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async function idbDelete(storeName, id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      tx.objectStore(storeName).delete(id);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }

  ensureSeedData();

  window.LUMIGO.storage = {
    KEYS,
    AGE_GROUPS,
    readJSON,
    writeJSON,
    createDefaultUser,
    getUsers,
    saveUsers,
    getActiveUser,
    updateActiveUser,
    setAgeGroup,
    getAgeGroup,
    isKidsMode,
    addNotification,
    getNotifications,
    markAllNotifsRead,
    idbPut,
    idbGetAll,
    idbDelete
  };
})();
