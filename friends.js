/* ==========================================================================
   LUMIGO — Mobile Legends Style Friends System & Child Safety Controls
   ========================================================================== */
(function () {
  window.LUMIGO = window.LUMIGO || {};

  function getActive() {
    return window.LUMIGO.storage.getActiveUser();
  }

  function sendFriendRequest(targetUserId) {
    const st = window.LUMIGO.storage;
    if (st.isKidsMode()) {
      return { ok: false, error: 'Bolalar xavfsiz rejimida notanishlarga do‘stlik so‘rovi cheklangan.' };
    }
    const active = getActive();
    if (!active || active.id === targetUserId) return { ok: false, error: 'Noto‘g‘ri foydalanuvchi.' };

    const users = st.getUsers();
    const me = users.find(u => u.id === active.id);
    const target = users.find(u => u.id === targetUserId);
    if (!me || !target) return { ok: false, error: 'Foydalanuvchi topilmadi.' };
    if ((me.friends || []).includes(targetUserId)) return { ok: false, error: 'Allaqachon do‘stsiz!' };

    me.friendRequestsOut = Array.from(new Set([...(me.friendRequestsOut || []), targetUserId]));
    target.friendRequestsIn = Array.from(new Set([...(target.friendRequestsIn || []), me.id]));
    st.saveUsers(users);
    st.addNotification('Do‘stlik so‘rovi', `${target.username} ga so‘rov yuborildi.`, '🤝');
    window.dispatchEvent(new CustomEvent('lumigo:user-updated', { detail: me }));
    return { ok: true };
  }

  function acceptFriendRequest(fromUserId) {
    const st = window.LUMIGO.storage;
    const active = getActive();
    if (!active) return false;
    const users = st.getUsers();
    const me = users.find(u => u.id === active.id);
    const sender = users.find(u => u.id === fromUserId);
    if (!me || !sender) return false;

    me.friendRequestsIn = (me.friendRequestsIn || []).filter(id => id !== fromUserId);
    sender.friendRequestsOut = (sender.friendRequestsOut || []).filter(id => id !== me.id);
    me.friends = Array.from(new Set([...(me.friends || []), fromUserId]));
    sender.friends = Array.from(new Set([...(sender.friends || []), me.id]));

    st.saveUsers(users);
    st.addNotification('Yangi do‘st!', `${sender.username} do‘stlar ro‘yxatingizga qo‘shildi!`, '🎉');
    window.dispatchEvent(new CustomEvent('lumigo:user-updated', { detail: me }));
    return true;
  }

  function rejectFriendRequest(fromUserId) {
    const st = window.LUMIGO.storage;
    const active = getActive();
    if (!active) return false;
    const users = st.getUsers();
    const me = users.find(u => u.id === active.id);
    const sender = users.find(u => u.id === fromUserId);
    if (!me) return false;
    me.friendRequestsIn = (me.friendRequestsIn || []).filter(id => id !== fromUserId);
    if (sender) sender.friendRequestsOut = (sender.friendRequestsOut || []).filter(id => id !== me.id);
    st.saveUsers(users);
    window.dispatchEvent(new CustomEvent('lumigo:user-updated', { detail: me }));
    return true;
  }

  function removeFriend(friendId) {
    const st = window.LUMIGO.storage;
    const active = getActive();
    if (!active) return false;
    const users = st.getUsers();
    const me = users.find(u => u.id === active.id);
    const other = users.find(u => u.id === friendId);
    if (!me) return false;
    me.friends = (me.friends || []).filter(id => id !== friendId);
    if (other) other.friends = (other.friends || []).filter(id => id !== me.id);
    st.saveUsers(users);
    window.dispatchEvent(new CustomEvent('lumigo:user-updated', { detail: me }));
    return true;
  }

  function inviteFriendToGame(friendId, gameName) {
    const st = window.LUMIGO.storage;
    if (st.isKidsMode()) {
      window.LUMIGO.rewards.toast('Bolalar xavfsiz rejimida takliflar cheklangan.', '🛡️');
      return null;
    }
    const users = st.getUsers();
    const friend = users.find(u => u.id === friendId);
    const code = 'LUM-' + Math.floor(1000 + Math.random() * 9000);
    st.addNotification('Oʻyin taklifi!', `${friend ? friend.username : 'Do‘st'} ga ${gameName || 'LUMIGO'} xona kodi (${code}) yuborildi (Lokal Demo).`, '🎮');
    window.LUMIGO.rewards.toast(`Taklif yuborildi! Room: ${code}`, '📨');
    return code;
  }

  function openFriendProfileModal(userId) {
    const st = window.LUMIGO.storage;
    const user = st.getUsers().find(u => u.id === userId);
    if (!user) return;
    const rank = window.LUMIGO.levels.getRankTitle(user.level || 1);
    const winRate = user.totalGames ? Math.round((user.wins / user.totalGames) * 100) : 0;

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.innerHTML = `
      <div class="modal-box" style="max-width:460px;">
        <button class="modal-close" onclick="this.closest('.modal-backdrop').remove()">✕</button>
        <div style="text-align:center;margin-bottom:16px;">
          <div class="podium-avatar ${user.frame || 'frame-default'}" style="width:82px;height:82px;font-size:2.4rem;">
            ${user.avatar}
          </div>
          <h2 style="margin-top:10px;">${user.username}</h2>
          <p style="color:var(--text-secondary);font-size:0.86rem;">
            ${user.online ? '🟢 Online' : '⚫ Offline'} • ${rank.badge} Level ${user.level} (${rank.title})
          </p>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;text-align:center;margin-bottom:18px;">
          <div class="panel-card" style="padding:12px;"><strong>${user.wins}</strong><div style="font-size:0.75rem;color:var(--text-secondary);">Wins</div></div>
          <div class="panel-card" style="padding:12px;"><strong>${winRate}%</strong><div style="font-size:0.75rem;color:var(--text-secondary);">Win Rate</div></div>
          <div class="panel-card" style="padding:12px;"><strong>${user.weeklyScore}</strong><div style="font-size:0.75rem;color:var(--text-secondary);">Weekly Pts</div></div>
        </div>
        <div style="display:flex;gap:10px;justify-content:center;">
          <button class="btn btn-primary btn-sm" id="modal-invite-btn">🎮 Invite to Game</button>
          <button class="btn btn-glass btn-sm" onclick="this.closest('.modal-backdrop').remove()">Close</button>
        </div>
      </div>
    `;
    modal.querySelector('#modal-invite-btn').onclick = () => {
      inviteFriendToGame(user.id, 'Arena');
      modal.remove();
    };
    document.body.appendChild(modal);
  }

  window.LUMIGO.friends = {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    inviteFriendToGame,
    openFriendProfileModal
  };
})();
