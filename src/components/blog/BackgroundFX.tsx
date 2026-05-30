import { useEffect, useRef, useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StarDef {
  rx: number;
  ry: number;
  s: number;
}

interface Constellation {
  name: string;
  sub: string;
  col: [number, number, number];
  stars: StarDef[];
  lines: [number, number][];
  markSrc?: string;
  draw: (al: number, cx: CanvasRenderingContext2D, W: number, H: number) => void;
}

interface BgStar {
  x: number;
  y: number;
  r: number;
  b: number;
  ts: number;
  tp: number;
  c: [number, number, number];
}

interface Shoot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  len: number;
  life: number;
  dec: number;
  br: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ease = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

const cl = (t: number) => Math.max(0, Math.min(1, t));

const toXY = (rx: number, ry: number, W: number, H: number) => ({
  x: W * 0.12 + rx * W * 0.76,
  y: H * 0.08 + ry * H * 0.84,
});

const starPos = (stars: StarDef[], i: number, W: number, H: number) => {
  const s = stars[i];
  return { x: W * 0.12 + s.rx * W * 0.76, y: H * 0.08 + s.ry * H * 0.84 };
};

const maskCache: Record<string, HTMLImageElement> = {};

function getMask(src: string) {
  if (!maskCache[src]) {
    const img = new Image();
    img.src = src;
    maskCache[src] = img;
  }
  return maskCache[src];
}


function nebula(
  cx: CanvasRenderingContext2D,
  x: number,
  y: number,
  rx2: number,
  ry2: number,
  col: string,
  al: number
) {
  const g = cx.createRadialGradient(x, y, 0, x, y, rx2);
  g.addColorStop(0, `rgba(${col},${al})`);
  g.addColorStop(1, `rgba(${col},0)`);
  cx.save();
  cx.scale(1, ry2 / rx2);
  cx.fillStyle = g;
  cx.beginPath();
  cx.arc(x, (y * rx2) / ry2, rx2, 0, Math.PI * 2);
  cx.fill();
  cx.restore();
}

// ─── Draw functions ───────────────────────────────────────────────────────────

function drawOrion(al: number, cx: CanvasRenderingContext2D, W: number, H: number) {
  cx.save();
  cx.globalAlpha = al;
  const p = (rx: number, ry: number) => toXY(rx, ry, W, H);
  nebula(cx, p(0.5, 0.38).x, p(0.5, 0.38).y, W * 0.11, H * 0.13, "60,120,200", 0.12);
  nebula(cx, p(0.5, 0.2).x, p(0.5, 0.2).y, W * 0.08, H * 0.09, "80,140,220", 0.1);
  nebula(cx, p(0.5, 0.55).x, p(0.5, 0.55).y, W * 0.09, H * 0.1, "40,100,180", 0.09);
  const hd = p(0.535, 0.14);
  nebula(cx, hd.x, hd.y, W * 0.05, W * 0.05, "100,160,250", 0.1);
  cx.strokeStyle = "rgba(80,140,220,0.2)";
  cx.lineWidth = 2;
  [
    [[0.5, 0.16], [0.535, 0.3]],
    [[0.535, 0.3], [0.5, 0.35]],
    [[0.5, 0.35], [0.5, 0.48]],
    [[0.5, 0.28], [0.3, 0.18]],
    [[0.3, 0.18], [0.15, 0.2]],
    [[0.5, 0.28], [0.7, 0.18]],
    [[0.7, 0.18], [0.85, 0.2]],
    [[0.5, 0.48], [0.44, 0.62]],
    [[0.44, 0.62], [0.45, 0.74]],
    [[0.5, 0.48], [0.56, 0.62]],
    [[0.56, 0.62], [0.55, 0.74]],
  ].forEach((pts) => {
    cx.beginPath();
    pts.forEach(([rx, ry], i) => {
      const pp = p(rx, ry);
      i ? cx.lineTo(pp.x, pp.y) : cx.moveTo(pp.x, pp.y);
    });
    cx.stroke();
  });
  cx.restore();
}

function drawLeo(al: number, cx: CanvasRenderingContext2D, W: number, H: number) {
  cx.save();
  cx.globalAlpha = al;
  const p = (rx: number, ry: number) => toXY(rx, ry, W, H);
  nebula(cx, p(0.45, 0.32).x, p(0.45, 0.32).y, W * 0.11, H * 0.1, "200,160,40", 0.12);
  nebula(cx, p(0.6, 0.36).x, p(0.6, 0.36).y, W * 0.13, H * 0.11, "220,180,60", 0.1);
  cx.strokeStyle = "rgba(220,180,60,0.2)";
  cx.lineWidth = 2;
  const mane: [number, number][] = [
    [0.34, 0.2], [0.3, 0.26], [0.28, 0.32], [0.3, 0.38], [0.34, 0.42],
    [0.4, 0.2], [0.44, 0.16], [0.5, 0.15], [0.56, 0.17], [0.58, 0.22],
  ];
  mane.forEach(([rx, ry]) =>
    nebula(cx, p(rx, ry).x, p(rx, ry).y, W * 0.03, W * 0.03, "200,150,30", 0.08)
  );
  cx.beginPath();
  let pp = p(0.35, 0.38);
  cx.moveTo(pp.x, pp.y);
  [[0.3, 0.3], [0.35, 0.22], [0.42, 0.16], [0.52, 0.2], [0.58, 0.24],
   [0.56, 0.32], [0.54, 0.4], [0.48, 0.44]].forEach(([rx, ry]) => {
    pp = p(rx, ry);
    cx.lineTo(pp.x, pp.y);
  });
  cx.stroke();
  cx.beginPath();
  pp = p(0.5, 0.36);
  cx.moveTo(pp.x, pp.y);
  [[0.6, 0.36], [0.7, 0.38], [0.76, 0.48]].forEach(([rx, ry]) => {
    pp = p(rx, ry);
    cx.lineTo(pp.x, pp.y);
  });
  cx.stroke();
  cx.beginPath();
  pp = p(0.5, 0.44);
  cx.moveTo(pp.x, pp.y);
  [[0.55, 0.52], [0.5, 0.6], [0.45, 0.65], [0.4, 0.62]].forEach(([rx, ry]) => {
    pp = p(rx, ry);
    cx.lineTo(pp.x, pp.y);
  });
  cx.stroke();
  cx.restore();
}

function drawScorpius(al: number, cx: CanvasRenderingContext2D, W: number, H: number) {
  cx.save();
  cx.globalAlpha = al;
  const p = (rx: number, ry: number) => toXY(rx, ry, W, H);
  nebula(cx, p(0.42, 0.2).x, p(0.42, 0.2).y, W * 0.12, H * 0.1, "220,40,80", 0.14);
  nebula(cx, p(0.42, 0.5).x, p(0.42, 0.5).y, W * 0.08, H * 0.08, "200,60,80", 0.09);
  nebula(cx, p(0.6, 0.66).x, p(0.6, 0.66).y, W * 0.07, H * 0.07, "180,40,60", 0.08);
  cx.strokeStyle = "rgba(220,60,100,0.2)";
  cx.lineWidth = 2;
  cx.beginPath();
  const h = p(0.42, 0.14);
  cx.moveTo(h.x, h.y);
  [[0.36, 0.16], [0.34, 0.22], [0.38, 0.3], [0.44, 0.3],
   [0.46, 0.22], [0.46, 0.16], [0.42, 0.14]].forEach(([rx, ry]) => {
    const pp = p(rx, ry);
    cx.lineTo(pp.x, pp.y);
  });
  cx.stroke();
  cx.beginPath();
  let pp = p(0.4, 0.3);
  cx.moveTo(pp.x, pp.y);
  [[0.38, 0.4], [0.4, 0.5], [0.44, 0.6], [0.5, 0.68],
   [0.58, 0.72], [0.64, 0.68], [0.62, 0.62]].forEach(([rx, ry]) => {
    pp = p(rx, ry);
    cx.lineTo(pp.x, pp.y);
  });
  cx.stroke();
  [[0.28, 0.22], [0.22, 0.28], [0.54, 0.22], [0.6, 0.28]].forEach(([rx, ry]) =>
    nebula(cx, p(rx, ry).x, p(rx, ry).y, W * 0.022, W * 0.022, "200,60,80", 0.06)
  );
  cx.restore();
}

function drawUrsa(al: number, cx: CanvasRenderingContext2D, W: number, H: number) {
  cx.save();
  cx.globalAlpha = al;
  const p = (rx: number, ry: number) => toXY(rx, ry, W, H);
  nebula(cx, p(0.5, 0.4).x, p(0.5, 0.4).y, W * 0.18, H * 0.15, "60,180,150", 0.1);
  nebula(cx, p(0.35, 0.5).x, p(0.35, 0.5).y, W * 0.13, H * 0.12, "40,160,130", 0.08);
  cx.strokeStyle = "rgba(80,200,160,0.18)";
  cx.lineWidth = 2;
  cx.beginPath();
  let pp = p(0.56, 0.34);
  cx.moveTo(pp.x, pp.y);
  [[0.5, 0.28], [0.44, 0.32], [0.38, 0.36], [0.4, 0.44], [0.44, 0.52],
   [0.52, 0.54], [0.6, 0.54], [0.64, 0.46], [0.66, 0.38], [0.6, 0.34],
   [0.58, 0.32], [0.56, 0.34]].forEach(([rx, ry]) => {
    pp = p(rx, ry);
    cx.lineTo(pp.x, pp.y);
  });
  cx.stroke();
  cx.beginPath();
  pp = p(0.46, 0.38);
  cx.moveTo(pp.x, pp.y);
  [[0.4, 0.32], [0.36, 0.28], [0.3, 0.24], [0.25, 0.28]].forEach(([rx, ry]) => {
    pp = p(rx, ry);
    cx.lineTo(pp.x, pp.y);
  });
  cx.stroke();
  [[0.3, 0.48], [0.26, 0.56], [0.2, 0.54], [0.16, 0.5]].forEach(([rx, ry]) =>
    nebula(cx, p(rx, ry).x, p(rx, ry).y, W * 0.025, H * 0.02, "40,160,120", 0.06)
  );
  cx.restore();
}

function drawCygnus(al: number, cx: CanvasRenderingContext2D, W: number, H: number) {
  cx.save();
  cx.globalAlpha = al;
  const p = (rx: number, ry: number) => toXY(rx, ry, W, H);
  nebula(cx, p(0.5, 0.48).x, p(0.5, 0.48).y, W * 0.07, H * 0.26, "160,200,255", 0.1);
  nebula(cx, p(0.5, 0.2).x, p(0.5, 0.2).y, W * 0.06, H * 0.06, "180,220,255", 0.1);
  nebula(cx, p(0.3, 0.48).x, p(0.3, 0.48).y, W * 0.1, H * 0.05, "140,190,255", 0.08);
  nebula(cx, p(0.7, 0.48).x, p(0.7, 0.48).y, W * 0.1, H * 0.05, "140,190,255", 0.08);
  cx.strokeStyle = "rgba(160,210,255,0.2)";
  cx.lineWidth = 2;
  [
    [p(0.5, 0.16), p(0.5, 0.78)],
    [p(0.14, 0.52), p(0.86, 0.52)],
  ].forEach(([a, b]) => {
    cx.beginPath();
    cx.moveTo(a.x, a.y);
    cx.lineTo(b.x, b.y);
    cx.stroke();
  });
  [
    [p(0.22, 0.44), p(0.14, 0.52)],
    [p(0.78, 0.44), p(0.86, 0.52)],
  ].forEach(([a, b]) => {
    cx.strokeStyle = "rgba(140,190,255,0.12)";
    cx.beginPath();
    cx.moveTo(a.x, a.y);
    cx.lineTo(b.x, b.y);
    cx.stroke();
  });
  cx.restore();
}

function drawTaurus(al: number, cx: CanvasRenderingContext2D, W: number, H: number) {
  cx.save();
  cx.globalAlpha = al;
  const p = (rx: number, ry: number) => toXY(rx, ry, W, H);
  nebula(cx, p(0.5, 0.38).x, p(0.5, 0.38).y, W * 0.16, H * 0.13, "220,130,40", 0.12);
  nebula(cx, p(0.4, 0.25).x, p(0.4, 0.25).y, W * 0.09, H * 0.08, "200,100,30", 0.09);
  nebula(cx, p(0.6, 0.25).x, p(0.6, 0.25).y, W * 0.09, H * 0.08, "200,100,30", 0.09);
  cx.strokeStyle = "rgba(220,140,50,0.2)";
  cx.lineWidth = 2;
  cx.beginPath();
  let pp = p(0.5, 0.32);
  cx.moveTo(pp.x, pp.y);
  [[0.38, 0.22], [0.34, 0.16], [0.3, 0.14], [0.2, 0.16]].forEach(([rx, ry]) => {
    pp = p(rx, ry); cx.lineTo(pp.x, pp.y);
  });
  cx.stroke();
  cx.beginPath();
  pp = p(0.5, 0.32);
  cx.moveTo(pp.x, pp.y);
  [[0.62, 0.22], [0.66, 0.16], [0.7, 0.14], [0.8, 0.16]].forEach(([rx, ry]) => {
    pp = p(rx, ry); cx.lineTo(pp.x, pp.y);
  });
  cx.stroke();
  cx.beginPath();
  pp = p(0.5, 0.32);
  cx.moveTo(pp.x, pp.y);
  [[0.5, 0.38], [0.44, 0.48], [0.44, 0.62]].forEach(([rx, ry]) => {
    pp = p(rx, ry); cx.lineTo(pp.x, pp.y);
  });
  cx.stroke();
  cx.beginPath();
  pp = p(0.5, 0.38);
  cx.moveTo(pp.x, pp.y);
  [[0.56, 0.48], [0.56, 0.62]].forEach(([rx, ry]) => {
    pp = p(rx, ry); cx.lineTo(pp.x, pp.y);
  });
  cx.stroke();
  cx.restore();
}

function drawAquarius(al: number, cx: CanvasRenderingContext2D, W: number, H: number) {
  cx.save();
  cx.globalAlpha = al;
  const p = (rx: number, ry: number) => toXY(rx, ry, W, H);
  nebula(cx, p(0.5, 0.3).x, p(0.5, 0.3).y, W * 0.13, H * 0.12, "60,160,240", 0.11);
  nebula(cx, p(0.5, 0.6).x, p(0.5, 0.6).y, W * 0.15, H * 0.14, "40,120,200", 0.1);
  cx.strokeStyle = "rgba(80,180,255,0.2)";
  cx.lineWidth = 2;
  cx.beginPath();
  let pp = p(0.48, 0.14);
  cx.moveTo(pp.x, pp.y);
  [[0.5, 0.2], [0.52, 0.26], [0.5, 0.34], [0.52, 0.42]].forEach(([rx, ry]) => {
    pp = p(rx, ry); cx.lineTo(pp.x, pp.y);
  });
  cx.stroke();
  cx.beginPath();
  pp = p(0.5, 0.26);
  cx.moveTo(pp.x, pp.y);
  [[0.42, 0.24], [0.36, 0.26]].forEach(([rx, ry]) => {
    pp = p(rx, ry); cx.lineTo(pp.x, pp.y);
  });
  cx.stroke();
  cx.beginPath();
  pp = p(0.5, 0.26);
  cx.moveTo(pp.x, pp.y);
  [[0.58, 0.24], [0.64, 0.26]].forEach(([rx, ry]) => {
    pp = p(rx, ry); cx.lineTo(pp.x, pp.y);
  });
  cx.stroke();
  cx.strokeStyle = "rgba(60,160,240,0.16)";
  [
    [p(0.52, 0.42), p(0.46, 0.52), p(0.38, 0.62), p(0.3, 0.72)],
    [p(0.44, 0.48), p(0.5, 0.54), p(0.54, 0.62), p(0.52, 0.76)],
    [p(0.38, 0.54), p(0.46, 0.6), p(0.48, 0.68)],
  ].forEach((pts) => {
    cx.beginPath();
    pts.forEach((pt, i) => (i ? cx.lineTo(pt.x, pt.y) : cx.moveTo(pt.x, pt.y)));
    cx.stroke();
  });
  cx.restore();
}

function drawPisces(al: number, cx: CanvasRenderingContext2D, W: number, H: number) {
  cx.save();
  cx.globalAlpha = al;
  const p = (rx: number, ry: number) => toXY(rx, ry, W, H);
  nebula(cx, p(0.65, 0.3).x, p(0.65, 0.3).y, W * 0.11, H * 0.08, "80,200,170", 0.1);
  nebula(cx, p(0.35, 0.44).x, p(0.35, 0.44).y, W * 0.11, H * 0.08, "80,200,170", 0.1);
  cx.strokeStyle = "rgba(100,210,180,0.2)";
  cx.lineWidth = 2;
  const e1 = p(0.65, 0.3), e2 = p(0.35, 0.44);
  cx.beginPath();
  cx.ellipse(e1.x, e1.y, W * 0.09, H * 0.07, 0, 0, Math.PI * 2);
  cx.stroke();
  cx.beginPath();
  cx.ellipse(e2.x, e2.y, W * 0.09, H * 0.07, 0.3, 0, Math.PI * 2);
  cx.stroke();
  cx.strokeStyle = "rgba(80,190,160,0.16)";
  cx.lineWidth = 1.5;
  const c1 = p(0.58, 0.34), c2 = p(0.48, 0.42);
  cx.beginPath();
  cx.moveTo(c1.x, c1.y);
  cx.quadraticCurveTo((c1.x + c2.x) / 2, (c1.y + c2.y) / 2 - H * 0.03, c2.x, c2.y);
  cx.stroke();
  cx.restore();
}

// ─── Constellation data ───────────────────────────────────────────────────────

const CONS: Constellation[] = [
  { name: "Orion", sub: "The Hunter", col: [80, 160, 255], draw: drawOrion,
    stars: [{rx:.5,ry:.18,s:3.2},{rx:.62,ry:.22,s:2.8},{rx:.44,ry:.36,s:2.2},{rx:.5,ry:.38,s:2.4},{rx:.56,ry:.36,s:2.2},{rx:.48,ry:.52,s:2.6},{rx:.64,ry:.55,s:2.9},{rx:.38,ry:.28,s:1.8},{rx:.65,ry:.3,s:1.7},{rx:.42,ry:.44,s:1.6}],
    lines: [[0,1],[0,2],[1,3],[2,3],[3,4],[2,5],[4,6],[5,7],[1,8],[3,9]] },
  { name: "Leo", sub: "The Lion", col: [255, 200, 80], draw: drawLeo,
    stars: [{rx:.35,ry:.32,s:3.4},{rx:.42,ry:.22,s:2.1},{rx:.52,ry:.18,s:2.0},{rx:.58,ry:.25,s:2.2},{rx:.55,ry:.35,s:2.3},{rx:.45,ry:.38,s:1.9},{rx:.65,ry:.3,s:2.4},{rx:.72,ry:.4,s:2.8},{rx:.68,ry:.48,s:1.7}],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[3,6],[6,7],[7,8]] },
  { name: "Scorpius", sub: "The Scorpion", col: [255, 80, 120], draw: drawScorpius,
    stars: [{rx:.42,ry:.2,s:3.5},{rx:.38,ry:.27,s:2.0},{rx:.44,ry:.27,s:1.9},{rx:.36,ry:.34,s:2.1},{rx:.34,ry:.42,s:2.2},{rx:.38,ry:.5,s:2.1},{rx:.44,ry:.56,s:2.3},{rx:.5,ry:.62,s:2.4},{rx:.56,ry:.68,s:2.2},{rx:.62,ry:.7,s:2.1},{rx:.66,ry:.64,s:2.3}],
    lines: [[0,1],[0,2],[1,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10]] },
  { name: "Ursa Major", sub: "The Great Bear", col: [100, 200, 180], draw: drawUrsa,
    stars: [{rx:.56,ry:.3,s:2.4},{rx:.62,ry:.35,s:2.2},{rx:.64,ry:.43,s:2.3},{rx:.58,ry:.49,s:2.2},{rx:.5,ry:.45,s:2.6},{rx:.42,ry:.41,s:2.5},{rx:.35,ry:.37,s:2.1},{rx:.44,ry:.28,s:1.8},{rx:.36,ry:.26,s:1.7},{rx:.3,ry:.3,s:1.9}],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[3,7],[7,8],[8,9]] },
  { name: "Cygnus", sub: "The Swan", col: [180, 220, 255], draw: drawCygnus,
    stars: [{rx:.5,ry:.18,s:3.2},{rx:.5,ry:.33,s:2.0},{rx:.5,ry:.48,s:2.8},{rx:.5,ry:.62,s:2.4},{rx:.5,ry:.76,s:2.1},{rx:.3,ry:.48,s:2.2},{rx:.7,ry:.48,s:2.2}],
    lines: [[0,1],[1,2],[2,3],[3,4],[5,2],[2,6]] },
  { name: "Taurus", sub: "The Bull", col: [255, 160, 60], draw: drawTaurus,
    stars: [{rx:.5,ry:.35,s:3.3},{rx:.44,ry:.3,s:2.0},{rx:.54,ry:.3,s:1.9},{rx:.4,ry:.44,s:2.1},{rx:.6,ry:.44,s:2.0},{rx:.32,ry:.2,s:2.4},{rx:.68,ry:.22,s:2.2},{rx:.65,ry:.55,s:2.0},{rx:.55,ry:.58,s:1.8}],
    lines: [[0,1],[0,2],[1,3],[2,4],[1,5],[2,6],[3,7],[4,8]] },
  { name: "Aquarius", sub: "The Water Bearer", col: [80, 180, 255], draw: drawAquarius,
    stars: [{rx:.44,ry:.2,s:2.9},{rx:.56,ry:.23,s:2.5},{rx:.5,ry:.32,s:2.1},{rx:.42,ry:.39,s:2.3},{rx:.5,ry:.44,s:2.0},{rx:.58,ry:.39,s:2.1},{rx:.4,ry:.54,s:2.2},{rx:.5,ry:.59,s:2.4},{rx:.6,ry:.54,s:2.0}],
    lines: [[0,1],[0,2],[2,3],[2,4],[2,5],[3,6],[4,7],[5,8]] },
  { name: "Pisces", sub: "The Fish", col: [120, 200, 180], draw: drawPisces,
    stars: [{rx:.62,ry:.27,s:2.1},{rx:.68,ry:.21,s:1.9},{rx:.72,ry:.29,s:2.0},{rx:.68,ry:.37,s:2.2},{rx:.6,ry:.39,s:1.8},{rx:.52,ry:.37,s:2.0},{rx:.48,ry:.43,s:2.3},{rx:.42,ry:.35,s:1.9},{rx:.35,ry:.29,s:2.0},{rx:.3,ry:.37,s:2.1},{rx:.32,ry:.47,s:1.9}],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,6]] },
];

const DUR = [1.8, 1.5, 2.5, 4.0, 2.0];
const TOTAL = DUR.reduce((a, b) => a + b, 0);

function getPhase(t: number): { ph: number; p: number } {
  let acc = 0;
  for (let i = 0; i < DUR.length; i++) {
    if (t < acc + DUR[i]) return { ph: i, p: cl((t - acc) / DUR[i]) };
    acc += DUR[i];
  }
  return { ph: DUR.length - 1, p: 1 };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function BackgroundFX() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLCanvasElement>(null);
  const mcRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    W: 0, H: 0,
    bgStars: [] as BgStar[],
    shoots: [] as Shoot[],
    ci: 0,
    aT: 0,
    lt: null as number | null,
    rafId: 0,
    bgx: null as CanvasRenderingContext2D | null,
  });
  const [label, setLabel] = useState({ name: "Orion", sub: "The Hunter" });
  const [barW, setBarW] = useState(0);

  const paintBg = useCallback((bgx: CanvasRenderingContext2D, W: number, H: number) => {
    bgx.fillStyle = "#020510";
    bgx.fillRect(0, 0, W, H);
    (
      [
        [0.25, 0.3, 0.22, 0.15, [40, 20, 80], 0.04],
        [0.75, 0.6, 0.2, 0.18, [10, 40, 70], 0.05],
        [0.5, 0.15, 0.3, 0.12, [30, 10, 60], 0.03],
        [0.15, 0.7, 0.18, 0.2, [60, 20, 40], 0.03],
        [0.8, 0.25, 0.15, 0.15, [20, 50, 60], 0.04],
      ] as [number, number, number, number, number[], number][]
    ).forEach(([nx, ny, nrx, nry, nc, na]) => {
      const g = bgx.createRadialGradient(nx * W, ny * H, 0, nx * W, ny * H, nrx * W);
      g.addColorStop(0, `rgba(${nc},${na})`);
      g.addColorStop(0.5, `rgba(${nc},${na * 0.4})`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      bgx.save();
      bgx.scale(1, nry / nrx);
      bgx.fillStyle = g;
      bgx.beginPath();
      bgx.arc(nx * W, (ny * H * nrx) / nry, nrx * W, 0, Math.PI * 2);
      bgx.fill();
      bgx.restore();
    });
  }, []);

  const initStars = useCallback((W: number, H: number) => {
    const s = stateRef.current;
    s.bgStars = [];
    for (let i = 0; i < 500; i++) {
      s.bgStars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.3 + 0.3,
        b: Math.random(),
        ts: Math.random() * 2 + 0.5,
        tp: Math.random() * Math.PI * 2,
        c: (Math.random() < 0.3
          ? [180, 200, 255]
          : Math.random() < 0.5
          ? [255, 255, 240]
          : [210, 220, 255]) as [number, number, number],
      });
    }
  }, []);

  const resize = useCallback(() => {
    const wrap = wrapRef.current;
    const bg = bgRef.current;
    const mc = mcRef.current;
    if (!wrap || !bg || !mc) return;
    const W = wrap.offsetWidth;
    const H = wrap.offsetHeight;
    stateRef.current.W = W;
    stateRef.current.H = H;
    bg.width = mc.width = W;
    bg.height = mc.height = H;
    // Re-grab bgx every resize — setting canvas width/height resets the context state
    const bgx = bg.getContext("2d")!;
    stateRef.current.bgx = bgx;
    paintBg(bgx, W, H);
    initStars(W, H);
  }, [paintBg, initStars]);

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);

    const mc = mcRef.current;
    if (!mc) return;
    const cx = mc.getContext("2d")!;
    const s = stateRef.current;

    function drawBgStars(t: number) {
      const bgx = s.bgx;
      if (!bgx) return;
      // Redraw the static nebula background first, then overlay twinkling stars
      paintBg(bgx, s.W, s.H);
      s.bgStars.forEach((star) => {
        const tw = 0.5 + 0.5 * Math.sin(t * star.ts + star.tp);
        const a = 0.3 + 0.7 * tw * star.b;
        const [r, g, b] = star.c;
        bgx.beginPath();
        bgx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        bgx.fillStyle = `rgba(${r},${g},${b},${a})`;
        bgx.fill();
        if (star.r > 1 && tw > 0.8) {
          const gl = bgx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.r * 5);
          gl.addColorStop(0, `rgba(${r},${g},${b},${a * 0.25})`);
          gl.addColorStop(1, "rgba(0,0,0,0)");
          bgx.fillStyle = gl;
          bgx.beginPath();
          bgx.arc(star.x, star.y, star.r * 5, 0, Math.PI * 2);
          bgx.fill();
        }
      });
    }

    function spawnShoot() {
      if (Math.random() < 0.004 && s.shoots.length < 3) {
        const a = (0.1 + Math.random() * 0.3) * Math.PI;
        const spd = 4 + Math.random() * 3;
        s.shoots.push({
          x: Math.random() * s.W * 0.7,
          y: Math.random() * s.H * 0.35,
          vx: Math.cos(a) * spd,
          vy: Math.sin(a) * spd,
          len: 90 + Math.random() * 110,
          life: 1,
          dec: 0.012 + Math.random() * 0.012,
          br: 0.5 + Math.random() * 0.5,
        });
      }
    }

    function drawShoots() {
      s.shoots = s.shoots.filter((sh) => {
        sh.x += sh.vx;
        sh.y += sh.vy;
        sh.life -= sh.dec;
        if (sh.life <= 0) return false;
        const mag = Math.sqrt(sh.vx * sh.vx + sh.vy * sh.vy);
        const bx = sh.x - (sh.vx * sh.len) / mag;
        const by = sh.y - (sh.vy * sh.len) / mag;
        const g = cx.createLinearGradient(sh.x, sh.y, bx, by);
        g.addColorStop(0, `rgba(220,240,255,${sh.life * sh.br * 0.9})`);
        g.addColorStop(0.3, `rgba(180,210,255,${sh.life * sh.br * 0.4})`);
        g.addColorStop(1, "rgba(100,150,255,0)");
        cx.strokeStyle = g;
        cx.lineWidth = 1.5;
        cx.beginPath();
        cx.moveTo(sh.x, sh.y);
        cx.lineTo(bx, by);
        cx.stroke();
        return true;
      });
    }

    function drawStars(c: Constellation, a: number, t: number) {
      c.stars.forEach((star, i) => {
        const p = starPos(c.stars, i, s.W, s.H);
        const tw = 0.7 + 0.3 * Math.sin(t * 1.5 + i * 2.3);
        const [r, g, b] = c.col;
        const al = a * tw;
        const rs = star.s * 1.5;
        const gl = cx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rs * 5);
        gl.addColorStop(0, `rgba(255,255,255,${al})`);
        gl.addColorStop(0.2, `rgba(${r},${g},${b},${al * 0.8})`);
        gl.addColorStop(0.6, `rgba(${r},${g},${b},${al * 0.2})`);
        gl.addColorStop(1, "rgba(0,0,0,0)");
        cx.fillStyle = gl;
        cx.beginPath();
        cx.arc(p.x, p.y, rs * 5, 0, Math.PI * 2);
        cx.fill();
        cx.fillStyle = `rgba(255,255,255,${al})`;
        cx.beginPath();
        cx.arc(p.x, p.y, rs * 0.55, 0, Math.PI * 2);
        cx.fill();
        cx.strokeStyle = `rgba(255,255,255,${al * 0.5})`;
        cx.lineWidth = 0.5;
        const sp2 = rs * 4;
        cx.beginPath();
        cx.moveTo(p.x - sp2, p.y);
        cx.lineTo(p.x + sp2, p.y);
        cx.stroke();
        cx.beginPath();
        cx.moveTo(p.x, p.y - sp2);
        cx.lineTo(p.x, p.y + sp2);
        cx.stroke();
      });
    }

    function drawLines(c: Constellation, a: number, prog: number) {
      const [r, g, b] = c.col;
      const n = Math.floor(prog * c.lines.length);
      const frac = prog * c.lines.length - n;
      for (let i = 0; i < n; i++) {
        const [ai, bi] = c.lines[i];
        const pa = starPos(c.stars, ai, s.W, s.H);
        const pb = starPos(c.stars, bi, s.W, s.H);
        const gl = cx.createLinearGradient(pa.x, pa.y, pb.x, pb.y);
        gl.addColorStop(0, `rgba(${r},${g},${b},${a * 0.45})`);
        gl.addColorStop(0.5, `rgba(${Math.min(r+40,255)},${Math.min(g+40,255)},${Math.min(b+20,255)},${a * 0.65})`);
        gl.addColorStop(1, `rgba(${r},${g},${b},${a * 0.45})`);
        cx.strokeStyle = gl;
        cx.lineWidth = 0.8;
        cx.beginPath();
        cx.moveTo(pa.x, pa.y);
        cx.lineTo(pb.x, pb.y);
        cx.stroke();
      }
      if (n < c.lines.length && frac > 0) {
        const [ai, bi] = c.lines[n];
        const pa = starPos(c.stars, ai, s.W, s.H);
        const pb = starPos(c.stars, bi, s.W, s.H);
        cx.strokeStyle = `rgba(${r},${g},${b},${a * 0.45})`;
        cx.lineWidth = 0.8;
        cx.beginPath();
        cx.moveTo(pa.x, pa.y);
        cx.lineTo(pa.x + (pb.x - pa.x) * frac, pa.y + (pb.y - pa.y) * frac);
        cx.stroke();
      }
    }

    function render(ts: number) {
      const dt = s.lt !== null ? Math.min((ts - s.lt) / 1000, 0.05) : 0;
      s.lt = ts;
      s.aT += dt;
      if (s.aT >= TOTAL) {
        s.aT = 0;
        s.ci = (s.ci + 1) % CONS.length;
        const c = CONS[s.ci];
        setLabel({ name: c.name, sub: c.sub });
      }
      setBarW((s.aT / TOTAL) * 100);

      const { ph, p } = getPhase(s.aT);
      const ep = ease(p);
      let sA = 0, lA = 0, fA = 0, mF = 1;
      if (ph === 0) { sA = ep; }
      else if (ph === 1) { sA = 1; lA = ep; }
      else if (ph === 2) { sA = 1; lA = 1; fA = ep * 0.11; }
      else if (ph === 3) { sA = 1; lA = 1; fA = 0.11; }
      else { mF = 1 - ep; sA = 1 - ep; lA = 1 - ep; fA = 0.11 * (1 - ep); }

      cx.clearRect(0, 0, s.W, s.H);
      cx.save();
      cx.globalAlpha = mF;
      drawBgStars(ts / 1000);
      spawnShoot();
      drawShoots();
      const c = CONS[s.ci];
      if (fA > 0) c.draw(fA, cx, s.W, s.H);
      if (lA > 0) drawLines(c, lA, lA);
      if (sA > 0) drawStars(c, sA, ts / 1000);
      cx.restore();
      s.rafId = requestAnimationFrame(render);
    }

    s.rafId = requestAnimationFrame(render);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(s.rafId);
    };
  }, [resize]);

  const handlePrev = () => {
    const s = stateRef.current;
    s.ci = (s.ci - 1 + CONS.length) % CONS.length;
    s.aT = 0;
    setLabel({ name: CONS[s.ci].name, sub: CONS[s.ci].sub });
  };

  const handleNext = () => {
    const s = stateRef.current;
    s.ci = (s.ci + 1) % CONS.length;
    s.aT = 0;
    setLabel({ name: CONS[s.ci].name, sub: CONS[s.ci].sub });
  };

  return (
    <div
      ref={wrapRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.45,
      }}
    >
      <canvas ref={bgRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} />
      <canvas ref={mcRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} />
    </div>
  );
}