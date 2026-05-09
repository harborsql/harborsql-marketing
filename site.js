(function () {
  const canvas = document.getElementById("harbor-flow");
  if (!canvas) {
    return;
  }

  const ctx = canvas.getContext("2d");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const palette = {
    ink: "rgba(18, 35, 31, 0.42)",
    muted: "rgba(18, 35, 31, 0.12)",
    teal: "rgba(8, 120, 101, 0.84)",
    coral: "rgba(217, 92, 66, 0.82)",
    gold: "rgba(185, 144, 47, 0.78)",
    plum: "rgba(87, 90, 147, 0.66)",
  };

  let width = 0;
  let height = 0;
  let dpr = 1;
  let nodes = [];
  let packets = [];
  let animationFrame = null;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, Math.floor(rect.width));
    height = Math.max(1, Math.floor(rect.height));
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildScene();
    render(performance.now(), !prefersReducedMotion.matches);
  }

  function buildScene() {
    const left = width * 0.58;
    const centerY = height * 0.47;
    nodes = [
      { label: "client", x: left, y: centerY, r: 24, color: palette.plum },
      { label: "harbor", x: width * 0.74, y: centerY, r: 34, color: palette.teal },
      { label: "catalog", x: width * 0.88, y: height * 0.27, r: 23, color: palette.gold },
      { label: "delta", x: width * 0.9, y: height * 0.67, r: 28, color: palette.coral },
      { label: "metrics", x: width * 0.69, y: height * 0.74, r: 16, color: palette.ink },
    ];

    packets = [
      { from: 0, to: 1, offset: 0.0, color: palette.plum },
      { from: 1, to: 2, offset: 0.28, color: palette.gold },
      { from: 2, to: 1, offset: 0.62, color: palette.gold },
      { from: 1, to: 3, offset: 0.14, color: palette.coral },
      { from: 3, to: 1, offset: 0.78, color: palette.coral },
      { from: 1, to: 0, offset: 0.48, color: palette.teal },
      { from: 1, to: 4, offset: 0.34, color: palette.ink },
    ];
  }

  function drawGrid() {
    ctx.save();
    ctx.strokeStyle = palette.muted;
    ctx.lineWidth = 1;
    const spacing = 36;
    const startX = Math.floor(width * 0.48);
    for (let x = startX; x < width + spacing; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height + spacing; y += spacing) {
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawLinks() {
    const links = [
      [0, 1, palette.plum],
      [1, 2, palette.gold],
      [2, 1, palette.gold],
      [1, 3, palette.coral],
      [3, 1, palette.coral],
      [1, 4, palette.ink],
    ];

    ctx.save();
    links.forEach(([a, b, color]) => {
      const from = nodes[a];
      const to = nodes[b];
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.38;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      const midX = (from.x + to.x) / 2;
      ctx.bezierCurveTo(midX, from.y, midX, to.y, to.x, to.y);
      ctx.stroke();
    });
    ctx.restore();
  }

  function drawNodes(time) {
    ctx.save();
    nodes.forEach((node, index) => {
      const pulse = 1 + Math.sin(time / 900 + index) * 0.04;
      ctx.beginPath();
      ctx.fillStyle = "rgba(255, 255, 255, 0.72)";
      ctx.arc(node.x, node.y, node.r * 1.65 * pulse, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = node.color;
      ctx.arc(node.x, node.y, node.r * pulse, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.78)";
      ctx.lineWidth = 2;
      ctx.arc(node.x, node.y, node.r * 0.55, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.restore();
  }

  function pointOnCurve(from, to, progress) {
    const midX = (from.x + to.x) / 2;
    const p0 = from;
    const p1 = { x: midX, y: from.y };
    const p2 = { x: midX, y: to.y };
    const p3 = to;
    const t = progress;
    const inv = 1 - t;
    return {
      x:
        inv * inv * inv * p0.x +
        3 * inv * inv * t * p1.x +
        3 * inv * t * t * p2.x +
        t * t * t * p3.x,
      y:
        inv * inv * inv * p0.y +
        3 * inv * inv * t * p1.y +
        3 * inv * t * t * p2.y +
        t * t * t * p3.y,
    };
  }

  function drawPackets(time) {
    ctx.save();
    packets.forEach((packet) => {
      const progress = (time / 2600 + packet.offset) % 1;
      const point = pointOnCurve(nodes[packet.from], nodes[packet.to], progress);
      ctx.beginPath();
      ctx.fillStyle = packet.color;
      ctx.shadowColor = packet.color;
      ctx.shadowBlur = 14;
      ctx.arc(point.x, point.y, 4.5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  function render(time, includePackets) {
    ctx.clearRect(0, 0, width, height);
    drawGrid();
    drawLinks();
    drawNodes(time);
    if (includePackets) {
      drawPackets(time);
    }
  }

  function tick(time) {
    render(time, true);
    animationFrame = requestAnimationFrame(tick);
  }

  function start() {
    resize();
    if (!prefersReducedMotion.matches && animationFrame === null) {
      animationFrame = requestAnimationFrame(tick);
    }
  }

  window.addEventListener("resize", resize);
  prefersReducedMotion.addEventListener("change", () => {
    if (animationFrame !== null) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
    start();
  });

  start();
})();
