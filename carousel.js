/* ==========================================================================
   LUMIGO — Auto Carousel (Autoplay, Prev/Next, Dots, Hover Pause, Touch Swipe)
   ========================================================================== */
(function () {
  window.LUMIGO = window.LUMIGO || {};

  function initCarousel(wrapperEl, autoMs = 3600) {
    if (!wrapperEl) return;
    const track = wrapperEl.querySelector('.carousel-track');
    const prevBtn = wrapperEl.querySelector('.carousel-prev');
    const nextBtn = wrapperEl.querySelector('.carousel-next');
    const dotsBox = wrapperEl.querySelector('.carousel-dots');
    const viewport = wrapperEl.querySelector('.carousel-viewport');
    if (!track || !viewport) return;

    const cards = Array.from(track.children);
    if (!cards.length) return;

    let index = 0;
    let timer = null;
    let touchStartX = 0;

    function getVisibleCount() {
      const w = window.innerWidth;
      if (w <= 520) return 1;
      if (w <= 980) return 2;
      if (w <= 1220) return 3;
      return 4;
    }

    function getMaxIndex() {
      return Math.max(0, cards.length - getVisibleCount());
    }

    function buildDots() {
      if (!dotsBox) return;
      const pages = getMaxIndex() + 1;
      dotsBox.innerHTML = '';
      for (let i = 0; i < pages; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === index ? ' active' : '');
        dot.ariaLabel = `Slide ${i + 1}`;
        dot.onclick = () => {
          index = i;
          update();
        };
        dotsBox.appendChild(dot);
      }
    }

    function update() {
      const max = getMaxIndex();
      if (index > max) index = 0;
      if (index < 0) index = max;

      const cardWidth = cards[0].getBoundingClientRect().width || 260;
      const gap = 18;
      track.style.transform = `translateX(-${index * (cardWidth + gap)}px)`;

      if (dotsBox) {
        dotsBox.querySelectorAll('.carousel-dot').forEach((d, i) => {
          d.classList.toggle('active', i === index);
        });
      }
    }

    function next() {
      const max = getMaxIndex();
      index = index >= max ? 0 : index + 1;
      update();
    }

    function prev() {
      const max = getMaxIndex();
      index = index <= 0 ? max : index - 1;
      update();
    }

    function startAuto() {
      stopAuto();
      timer = setInterval(next, autoMs);
    }

    function stopAuto() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    if (nextBtn) nextBtn.onclick = () => { next(); startAuto(); };
    if (prevBtn) prevBtn.onclick = () => { prev(); startAuto(); };

    wrapperEl.addEventListener('mouseenter', stopAuto);
    wrapperEl.addEventListener('mouseleave', startAuto);

    viewport.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      stopAuto();
    }, { passive: true });

    viewport.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) next();
        else prev();
      }
      startAuto();
    }, { passive: true });

    window.addEventListener('resize', () => {
      buildDots();
      update();
    });

    buildDots();
    update();
    startAuto();
  }

  window.LUMIGO.carousel = { initCarousel };
})();
