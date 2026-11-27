/* ==========================================================================
   LUMIGO — Frontend Demo Authentication (Web Crypto SHA-256 + localStorage)
   ========================================================================== */
(function () {
  window.LUMIGO = window.LUMIGO || {};

  // Pure-JS SHA-256 fallback only when crypto.subtle is unavailable on file://
  function sha256Fallback(str) {
    const utf8 = unescape(encodeURIComponent(str));
    const K = [
      0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
      0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
      0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
      0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
      0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
      0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
      0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
      0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
    ];
    let H = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
    const bytes = [];
    for (let i = 0; i < utf8.length; i++) bytes.push(utf8.charCodeAt(i));
    const bitLen = bytes.length * 8;
    bytes.push(0x80);
    while ((bytes.length % 64) !== 56) bytes.push(0);
    for (let i = 7; i >= 0; i--) bytes.push((bitLen / Math.pow(2, i * 8)) & 0xff);
    const rotr = (n, x) => (x >>> n) | (x << (32 - n));
    for (let off = 0; off < bytes.length; off += 64) {
      const w = new Array(64);
      for (let i = 0; i < 16; i++) {
        w[i] = (bytes[off + i * 4] << 24) | (bytes[off + i * 4 + 1] << 16) | (bytes[off + i * 4 + 2] << 8) | bytes[off + i * 4 + 3];
      }
      for (let i = 16; i < 64; i++) {
        const s0 = rotr(7, w[i - 15]) ^ rotr(18, w[i - 15]) ^ (w[i - 15] >>> 3);
        const s1 = rotr(17, w[i - 2]) ^ rotr(19, w[i - 2]) ^ (w[i - 2] >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
      }
      let [a, b, c, d, e, f, g, h] = H;
      for (let i = 0; i < 64; i++) {
        const S1 = rotr(6, e) ^ rotr(11, e) ^ rotr(25, e);
        const ch = (e & f) ^ (~e & g);
        const t1 = (h + S1 + ch + K[i] + w[i]) | 0;
        const S0 = rotr(2, a) ^ rotr(13, a) ^ rotr(22, a);
        const maj = (a & b) ^ (a & c) ^ (b & c);
        const t2 = (S0 + maj) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
      }
      H = [(H[0]+a)|0,(H[1]+b)|0,(H[2]+c)|0,(H[3]+d)|0,(H[4]+e)|0,(H[5]+f)|0,(H[6]+g)|0,(H[7]+h)|0];
    }
    return H.map(v => (v >>> 0).toString(16).padStart(8, '0')).join('');
  }

  async function hashPassword(password, salt) {
    const input = salt + ':' + password;
    if (window.crypto && window.crypto.subtle) {
      try {
        const encoded = new TextEncoder().encode(input);
        const buf = await window.crypto.subtle.digest('SHA-256', encoded);
        return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
      } catch (e) {
        return sha256Fallback(input);
      }
    }
    return sha256Fallback(input);
  }

  function makeSalt() {
    if (window.crypto && window.crypto.getRandomValues) {
      const arr = new Uint8Array(12);
      window.crypto.getRandomValues(arr);
      return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
    }
    return Math.random().toString(36).slice(2, 14);
  }

  function computeAgeGroupFromBirthdate(birthDate) {
    if (!birthDate) return '18-24';
    const dob = new Date(birthDate);
    if (isNaN(dob.getTime())) return '18-24';
    const now = new Date();
    let age = now.getFullYear() - dob.getFullYear();
    const m = now.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
    const found = window.LUMIGO.storage.AGE_GROUPS.find(g => age >= g.min && age <= g.max);
    return found ? found.id : (age < 3 ? '3-5' : '51+');
  }

  async function register({ username, email, password, birthDate, avatar }) {
    const st = window.LUMIGO.storage;
    const users = st.getUsers();
    const cleanName = (username || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();

    if (cleanName.length < 3) return { ok: false, error: 'Username kamida 3 ta belgi bo‘lishi kerak.' };
    if (!cleanEmail.includes('@')) return { ok: false, error: 'To‘g‘ri email kiriting.' };
    if (!password || password.length < 4) return { ok: false, error: 'Parol kamida 4 ta belgi bo‘lishi kerak.' };
    if (users.some(u => u.username.toLowerCase() === cleanName.toLowerCase())) {
      return { ok: false, error: 'Bu username band!' };
    }
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { ok: false, error: 'Bu email allaqachon ro‘yxatdan o‘tgan!' };
    }

    const salt = makeSalt();
    const passwordHash = await hashPassword(password, salt);
    const ageGroup = computeAgeGroupFromBirthdate(birthDate);

    const newUser = st.createDefaultUser({
      username: cleanName,
      email: cleanEmail,
      passwordHash,
      salt,
      birthDate: birthDate || '2006-01-01',
      ageGroup,
      avatar: avatar || '🦊',
      coins: 300,
      diamonds: 20,
      money: 150,
      xp: 0,
      level: 1,
      wins: 0,
      losses: 0,
      totalGames: 0,
      weeklyScore: 0,
      friends: [],
      friendRequestsIn: [],
      friendRequestsOut: []
    });

    users.push(newUser);
    st.saveUsers(users);
    st.writeJSON(st.KEYS.SESSION, { userId: newUser.id, loggedIn: true });
    st.setAgeGroup(ageGroup);
    st.addNotification('LUMIGO Account', `${cleanName} ro‘yxatdan o‘tdi! (Frontend Demo)`, '🎉');
    window.dispatchEvent(new CustomEvent('lumigo:user-updated', { detail: newUser }));
    return { ok: true, user: newUser };
  }

  async function login({ identifier, password }) {
    const st = window.LUMIGO.storage;
    const users = st.getUsers();
    const key = (identifier || '').trim().toLowerCase();
    const user = users.find(u => u.username.toLowerCase() === key || u.email.toLowerCase() === key);
    if (!user) return { ok: false, error: 'Foydalanuvchi topilmadi.' };

    if (user.passwordHash) {
      const checkHash = await hashPassword(password, user.salt || '');
      if (checkHash !== user.passwordHash) {
        return { ok: false, error: 'Parol noto‘g‘ri!' };
      }
    }
    st.writeJSON(st.KEYS.SESSION, { userId: user.id, loggedIn: true });
    st.setAgeGroup(user.ageGroup);
    window.dispatchEvent(new CustomEvent('lumigo:user-updated', { detail: user }));
    return { ok: true, user };
  }

  function switchDemoUser(userId) {
    const st = window.LUMIGO.storage;
    const users = st.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return false;
    st.writeJSON(st.KEYS.SESSION, { userId: user.id, loggedIn: true });
    st.setAgeGroup(user.ageGroup);
    window.dispatchEvent(new CustomEvent('lumigo:user-updated', { detail: user }));
    return true;
  }

  function logout() {
    const st = window.LUMIGO.storage;
    st.writeJSON(st.KEYS.SESSION, { userId: null, loggedIn: false });
    window.dispatchEvent(new CustomEvent('lumigo:user-updated', { detail: null }));
  }

  async function resetPassword(emailOrUsername, newPassword) {
    const st = window.LUMIGO.storage;
    const users = st.getUsers();
    const key = (emailOrUsername || '').trim().toLowerCase();
    const idx = users.findIndex(u => u.email.toLowerCase() === key || u.username.toLowerCase() === key);
    if (idx === -1) return { ok: false, error: 'Account topilmadi.' };
    if (!newPassword || newPassword.length < 4) return { ok: false, error: 'Yangi parol kamida 4 ta belgi bo‘lsin.' };

    const salt = makeSalt();
    users[idx].salt = salt;
    users[idx].passwordHash = await hashPassword(newPassword, salt);
    st.saveUsers(users);
    return { ok: true };
  }

  function editProfile({ username, avatar, ageGroup }) {
    const st = window.LUMIGO.storage;
    const active = st.getActiveUser();
    if (!active) return null;
    const updated = st.updateActiveUser(u => {
      if (username && username.trim().length >= 3) u.username = username.trim();
      if (avatar) u.avatar = avatar;
      if (ageGroup) u.ageGroup = ageGroup;
      return u;
    });
    if (ageGroup) st.setAgeGroup(ageGroup);
    return updated;
  }

  window.LUMIGO.auth = {
    register,
    login,
    logout,
    resetPassword,
    editProfile,
    switchDemoUser,
    computeAgeGroupFromBirthdate
  };
})();
