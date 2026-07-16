"use client";

import { ArrowRight, Quote } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import styles from "./TerminalQuote.module.css";

const SOURCE = "/images/knowledge/forming-sheet.jpg";
const CELL_SIZE = 10;
const COVERAGE = .36;
const TINT = { r: 0, g: 255, b: 102 };

type Cell = { x: number; y: number; luminance: number; edge: number; r: number; g: number; b: number; seed: number };

function hash(x: number, y: number) {
  const value = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

export default function TerminalQuote() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const section = sectionRef.current!;
    if (!canvas || !section) return;
    const context = canvas.getContext("2d", { alpha: false })!;
    if (!context) return;

    const source = document.createElement("canvas");
    const sourceContext = source.getContext("2d", { willReadFrequently: true })!;
    const bloom = document.createElement("canvas");
    const bloomContext = bloom.getContext("2d")!;
    if (!sourceContext || !bloomContext) return;

    const image = new Image();
    image.src = SOURCE;
    let cells: Cell[] = [];
    let raf = 0;
    let visible = true;
    let width = 1;
    let height = 1;
    let lastFrame = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function buildSamples() {
      if (!image.complete || !image.naturalWidth) return;
      const rect = section.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      bloom.width = canvas.width;
      bloom.height = canvas.height;
      source.width = width;
      source.height = height;

      const imageRatio = image.naturalWidth / image.naturalHeight;
      const boxRatio = width / height;
      const drawWidth = boxRatio > imageRatio ? width : height * imageRatio;
      const drawHeight = boxRatio > imageRatio ? width / imageRatio : height;
      sourceContext.clearRect(0, 0, width, height);
      sourceContext.filter = "contrast(1.15) saturate(1)";
      sourceContext.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
      const pixels = sourceContext.getImageData(0, 0, width, height).data;
      const columns = Math.ceil(width / CELL_SIZE);
      const rows = Math.ceil(height / CELL_SIZE);
      const luminanceGrid = new Float32Array(columns * rows);
      const colorGrid = new Uint8ClampedArray(columns * rows * 3);

      for (let row = 0; row < rows; row++) for (let column = 0; column < columns; column++) {
        let r = 0, g = 0, b = 0, count = 0;
        for (let py = row * CELL_SIZE; py < Math.min(height, (row + 1) * CELL_SIZE); py += 2) {
          for (let px = column * CELL_SIZE; px < Math.min(width, (column + 1) * CELL_SIZE); px += 2) {
            const index = (py * width + px) * 4;
            r += pixels[index]; g += pixels[index + 1]; b += pixels[index + 2]; count++;
          }
        }
        r /= count; g /= count; b /= count;
        const gridIndex = row * columns + column;
        luminanceGrid[gridIndex] = (r * .2126 + g * .7152 + b * .0722) / 255;
        colorGrid[gridIndex * 3] = r;
        colorGrid[gridIndex * 3 + 1] = g;
        colorGrid[gridIndex * 3 + 2] = b;
      }

      cells = [];
      for (let row = 0; row < rows; row++) for (let column = 0; column < columns; column++) {
        const gridIndex = row * columns + column;
        const luminance = luminanceGrid[gridIndex];
        const left = luminanceGrid[row * columns + Math.max(0, column - 1)];
        const right = luminanceGrid[row * columns + Math.min(columns - 1, column + 1)];
        const top = luminanceGrid[Math.max(0, row - 1) * columns + column];
        const bottom = luminanceGrid[Math.min(rows - 1, row + 1) * columns + column];
        cells.push({
          x: column * CELL_SIZE,
          y: row * CELL_SIZE,
          luminance,
          edge: Math.min(1, (Math.abs(right - left) + Math.abs(bottom - top)) * 2.4),
          r: colorGrid[gridIndex * 3],
          g: colorGrid[gridIndex * 3 + 1],
          b: colorGrid[gridIndex * 3 + 2],
          seed: hash(column, row),
        });
      }
    }

    function render(time = 0) {
      if (!visible) { raf = requestAnimationFrame(render); return; }
      if (!reducedMotion && time - lastFrame < 45) { raf = requestAnimationFrame(render); return; }
      lastFrame = time;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.globalCompositeOperation = "source-over";
      context.filter = "none";
      context.fillStyle = "#06110b";
      context.fillRect(0, 0, width, height);

      const phase = reducedMotion ? 0 : time * .0035;
      context.globalCompositeOperation = "screen";
      for (const cell of cells) {
        const flicker = reducedMotion ? 0 : (Math.sin(phase * 5 + cell.seed * 31) * .5 + .5) * .18;
        const energy = Math.min(1, Math.max(0, cell.luminance * 1.15 + cell.edge * .4 + flicker));
        if (cell.seed > COVERAGE + energy * .28) continue;
        const threshold = ((Math.floor(cell.x / CELL_SIZE) & 1) + (Math.floor(cell.y / CELL_SIZE) & 1) * 2) / 4;
        if (energy < threshold * .72) continue;
        const tintMix = .45;
        const r = cell.r * (1 - tintMix) + TINT.r * tintMix;
        const g = cell.g * (1 - tintMix) + TINT.g * tintMix;
        const b = cell.b * (1 - tintMix) + TINT.b * tintMix;
        const size = Math.max(1.2, CELL_SIZE * (.2 + energy * .75));
        context.globalAlpha = .24 + energy * .72;
        context.fillStyle = `rgb(${r},${g},${b})`;
        if (cell.edge > .22) context.fillRect(cell.x + 1, cell.y + 1, Math.max(1, size * .28), size);
        else context.fillRect(cell.x + (CELL_SIZE - size) / 2, cell.y + (CELL_SIZE - size) / 2, size, size);
      }
      context.globalAlpha = 1;

      // Bloom.
      bloomContext.setTransform(1, 0, 0, 1, 0, 0);
      bloomContext.clearRect(0, 0, bloom.width, bloom.height);
      bloomContext.filter = `blur(${10 * dpr}px)`;
      bloomContext.globalAlpha = .38;
      bloomContext.drawImage(canvas, 0, 0);
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.globalCompositeOperation = "screen";
      context.globalAlpha = .58;
      context.drawImage(bloom, 0, 0);

      // Chromatic edge, intermittent glitch slices and terminal scan lines.
      context.globalCompositeOperation = "screen";
      context.globalAlpha = .12;
      context.fillStyle = "#ff315c"; context.fillRect(0, 0, 2 * dpr, canvas.height);
      context.fillStyle = "#00d9ff"; context.fillRect(canvas.width - 2 * dpr, 0, 2 * dpr, canvas.height);
      if (!reducedMotion && Math.sin(phase * 2.1) > .92) {
        const sliceY = Math.floor((.2 + hash(Math.floor(time / 180), 4) * .6) * canvas.height);
        const sliceH = Math.max(2, Math.floor(canvas.height * .018));
        context.globalAlpha = .22;
        context.drawImage(canvas, 0, sliceY, canvas.width, sliceH, 8 * dpr, sliceY, canvas.width, sliceH);
      }
      context.globalCompositeOperation = "source-over";
      context.globalAlpha = .12;
      context.fillStyle = "#001f0c";
      for (let y = 0; y < canvas.height; y += Math.max(3, Math.round(4 * dpr))) context.fillRect(0, y, canvas.width, 1);

      // Film grain and vignette.
      context.globalAlpha = .11;
      for (let index = 0; index < 150; index++) {
        const x = hash(index, Math.floor(time / 70)) * canvas.width;
        const y = hash(index + 99, Math.floor(time / 70)) * canvas.height;
        context.fillStyle = index % 2 ? "#fff" : "#000";
        context.fillRect(x, y, 1, 1);
      }
      const vignette = context.createRadialGradient(canvas.width / 2, canvas.height / 2, canvas.height * .15, canvas.width / 2, canvas.height / 2, canvas.width * .67);
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(1, "rgba(0,0,0,.72)");
      context.globalAlpha = 1;
      context.fillStyle = vignette;
      context.fillRect(0, 0, canvas.width, canvas.height);
      raf = requestAnimationFrame(render);
    }

    const resizeObserver = new ResizeObserver(buildSamples);
    const visibilityObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { rootMargin: "120px" });
    image.addEventListener("load", buildSamples);
    resizeObserver.observe(section);
    visibilityObserver.observe(section);
    raf = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(raf);
      image.removeEventListener("load", buildSamples);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, []);

  return <section ref={sectionRef} className={styles.section} aria-labelledby="terminal-quote-title">
    <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
    <div className={styles.terminalBar} aria-hidden="true"><span>PFI://MATERIAL-TRANSMISSION</span><i>LIVE DITHER</i><b>●</b></div>
    <div className={styles.copy}>
      <Quote />
      <p>Field note · 04</p>
      <h2 id="terminal-quote-title">“Paper is not a finish line. <em>It is a material in motion.</em>”</h2>
      <div><span>Follow the fibre before you judge the sheet.</span><Link href="/journey">See how paper is made <ArrowRight /></Link></div>
    </div>
    <span className={styles.coordinates} aria-hidden="true">17.3850° N / 78.4867° E · HYDERABAD</span>
  </section>;
}
