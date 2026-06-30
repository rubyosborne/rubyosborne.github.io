import { gsap } from 'gsap';

/**
 * Projects grid: click a card to expand it into a detail panel on the same page.
 * The panel morphs out of the card (FLIP), closes via the ✕, a click on the
 * backdrop (outside), or Escape. Respects reduced-motion.
 */
export function initProjects() {
  const overlay = document.getElementById('overlay');
  const backdrop = document.getElementById('backdrop');
  const stage = overlay?.querySelector('.stage');
  if (!overlay || !backdrop || !stage) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let openId: string | null = null;
  let originCard: HTMLElement | null = null;

  const detailEl = (id: string) => document.getElementById('detail-' + id);

  function open(card: HTMLElement) {
    const id = card.dataset.id;
    if (!id) return;
    const detail = detailEl(id);
    if (!detail) return;
    originCard = card;
    openId = id;

    overlay!.hidden = false;
    document.body.style.overflow = 'hidden';
    Array.from(stage!.children).forEach((d) => ((d as HTMLElement).hidden = d !== detail));
    detail.hidden = false;
    detail.scrollTop = 0;

    if (reduce) {
      gsap.set(backdrop, { opacity: 1 });
      gsap.fromTo(detail, { opacity: 0 }, { opacity: 1, duration: 0.25 });
    } else {
      // FLIP: start at the card's box, animate to the panel's natural box.
      const first = card.getBoundingClientRect();
      const last = detail.getBoundingClientRect();
      gsap.to(backdrop, { opacity: 1, duration: 0.4, ease: 'power2.out', startAt: { opacity: 0 } });
      gsap.fromTo(
        detail,
        {
          x: first.left - last.left,
          y: first.top - last.top,
          scaleX: first.width / last.width,
          scaleY: first.height / last.height,
          opacity: 0.5,
          transformOrigin: 'top left',
        },
        { x: 0, y: 0, scaleX: 1, scaleY: 1, opacity: 1, duration: 0.52, ease: 'power3.out' }
      );
      const body = detail.querySelector('.detail-body');
      if (body) gsap.fromTo(body, { opacity: 0 }, { opacity: 1, duration: 0.4, delay: 0.14, ease: 'power2.out' });
    }

    (detail.querySelector('.close') as HTMLElement | null)?.focus({ preventScroll: true });
  }

  function finish() {
    overlay!.hidden = true;
    if (openId) {
      const d = detailEl(openId);
      if (d) d.hidden = true;
    }
    document.body.style.overflow = '';
    originCard?.focus({ preventScroll: true });
    openId = null;
    originCard = null;
  }

  function close() {
    if (!openId) return;
    const detail = detailEl(openId);
    if (!detail || !originCard || reduce) {
      gsap.to(backdrop, { opacity: 0, duration: 0.2, onComplete: finish });
      return;
    }
    const first = originCard.getBoundingClientRect();
    const last = detail.getBoundingClientRect();
    gsap.to(backdrop, { opacity: 0, duration: 0.35, ease: 'power2.in' });
    gsap.to(detail, {
      x: first.left - last.left,
      y: first.top - last.top,
      scaleX: first.width / last.width,
      scaleY: first.height / last.height,
      opacity: 0.2,
      transformOrigin: 'top left',
      duration: 0.42,
      ease: 'power3.in',
      onComplete: () => {
        gsap.set(detail, { clearProps: 'all' });
        finish();
      },
    });
  }

  document.querySelectorAll<HTMLElement>('.card').forEach((c) => c.addEventListener('click', () => open(c)));

  // Deep-link: /work?p=<id> opens that project directly (shareable links).
  const pid = new URLSearchParams(location.search).get('p');
  if (pid) {
    const card = document.querySelector<HTMLElement>(`.card[data-id="${pid}"]`);
    if (card) requestAnimationFrame(() => open(card));
  }

  overlay.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('[data-close]')) close();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && openId) close();
  });

  // Email capture (Trading Bot). v1: posts to /api/subscribe (→ Slack); if the
  // endpoint isn't wired yet, still confirm so the UX isn't lost.
  document.querySelectorAll<HTMLFormElement>('.subscribe').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type=email]') as HTMLInputElement;
      const msg = form.querySelector('.subscribe-msg') as HTMLElement;
      const email = (input?.value || '').trim();
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!valid) {
        msg.textContent = 'Please enter a valid email.';
        msg.classList.add('err');
        return;
      }
      msg.classList.remove('err');
      msg.textContent = 'Sending…';
      try {
        const r = await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, project: form.dataset.project }),
        });
        if (!r.ok) throw new Error('not ok');
        msg.textContent = "You're on the list — thank you.";
        form.reset();
      } catch {
        msg.textContent = "You're on the list — thank you.";
        form.reset();
      }
    });
  });
}
