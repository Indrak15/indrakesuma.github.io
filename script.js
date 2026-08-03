/* ============================================================
   NETWORK GRAPH — signature visual di hero
   Sebuah topologi sederhana: node pusat "IT" terhubung ke
   4 node kategori skill, dengan paket data yang berjalan
   di sepanjang tiap koneksi.
   ============================================================ */
(function () {
  const svg = document.getElementById('network-graph');
  if (!svg) return;

  const NS = 'http://www.w3.org/2000/svg';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const center = { x: 240, y: 200, label: 'IT', color: '#eaf2f7' };
  const nodes = [
    { x: 240, y: 60,  label: 'NET', color: '#2fd8f5' },
    { x: 400, y: 160, label: 'SYS', color: '#3ade7d' },
    { x: 340, y: 340, label: 'SUP', color: '#ffb648' },
    { x: 140, y: 340, label: 'DEV', color: '#ff5fa2' },
    { x: 80,  y: 160, label: 'OPS', color: '#8ea3bd' },
  ];

  function el(tag, attrs) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  // Edges
  nodes.forEach((n, i) => {
    const line = el('line', {
      x1: center.x, y1: center.y, x2: n.x, y2: n.y,
      stroke: '#223452', 'stroke-width': 1.5
    });
    svg.appendChild(line);

    if (!reduceMotion) {
      const packet = el('circle', { r: 3, fill: n.color });
      svg.appendChild(packet);
      animatePacket(packet, center, n, i * 0.6);
    }
  });

  // Center node
  drawNode(center, 15, true);
  // Category nodes
  nodes.forEach(n => drawNode(n, 11, false));

  function drawNode(n, r, isCenter) {
    if (!reduceMotion) {
      const ring = el('circle', {
        cx: n.x, cy: n.y, r: r,
        fill: 'none', stroke: n.color, 'stroke-width': 1, opacity: 0.6
      });
      ring.style.transformOrigin = `${n.x}px ${n.y}px`;
      svg.appendChild(ring);
      animateRing(ring);
    }

    const circle = el('circle', {
      cx: n.x, cy: n.y, r: r,
      fill: '#0a1120', stroke: n.color, 'stroke-width': 2
    });
    svg.appendChild(circle);

    const dot = el('circle', { cx: n.x, cy: n.y, r: 3, fill: n.color });
    svg.appendChild(dot);

    const text = el('text', {
      x: n.x, y: n.y + r + 18,
      'text-anchor': 'middle',
      fill: isCenter ? '#eaf2f7' : '#8ea3bd',
      'font-family': "'JetBrains Mono', monospace",
      'font-size': isCenter ? 12 : 10,
      'letter-spacing': '0.05em'
    });
    text.textContent = n.label;
    svg.appendChild(text);
  }

  function animateRing(ring) {
    let scale = 1, opacity = 0.6;
    const speed = 0.006 + Math.random() * 0.004;
    function frame() {
      scale += speed;
      opacity -= speed * 0.5;
      if (scale > 1.9) { scale = 1; opacity = 0.6; }
      ring.style.transform = `scale(${scale})`;
      ring.setAttribute('opacity', Math.max(opacity, 0));
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function animatePacket(packet, from, to, delay) {
    let t = -delay;
    const speed = 0.006;
    function frame(now) {
      t += speed;
      const progress = ((t % 1) + 1) % 1;
      packet.setAttribute('cx', from.x + (to.x - from.x) * progress);
      packet.setAttribute('cy', from.y + (to.y - from.y) * progress);
      packet.setAttribute('opacity', progress < 0.9 ? 1 : (1 - progress) * 10);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
})();

/* ============================================================
   NAV — highlight link aktif sesuai section yang terlihat
   ============================================================ */
(function () {
  const links = document.querySelectorAll('.nav-links a');
  const sections = Array.from(links)
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if (!sections.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = '#' + entry.target.id;
      const link = document.querySelector(`.nav-links a[href="${id}"]`);
      if (!link) return;
      if (entry.isIntersecting) {
        links.forEach(l => l.style.color = '');
        link.style.color = '#2fd8f5';
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach(s => observer.observe(s));
})();
