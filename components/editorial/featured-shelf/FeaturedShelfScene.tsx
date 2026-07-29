"use client";

import { Canvas, ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export type ShelfArticle = {
  slug: string;
  title: string;
  category: string;
  time: string;
};

type BookDesign = {
  cloth: string;
  foil: string;
  height: number;
  width: number;
  thickness: number;
  lean: number;
};

const DESIGNS: BookDesign[] = [
  { cloth: "#244737", foil: "#d9b779", height: 2.62, width: 1.48, thickness: .34, lean: -.015 },
  { cloth: "#8b4e3d", foil: "#e3c28c", height: 2.42, width: 1.36, thickness: .29, lean: .022 },
  { cloth: "#31485a", foil: "#c8b88b", height: 2.78, width: 1.55, thickness: .38, lean: -.01 },
  { cloth: "#69775c", foil: "#e1c78e", height: 2.54, width: 1.42, thickness: .31, lean: .016 },
  { cloth: "#a17838", foil: "#f0d4a0", height: 2.7, width: 1.5, thickness: .36, lean: -.02 },
  { cloth: "#262f2d", foil: "#caa773", height: 2.48, width: 1.38, thickness: .27, lean: .012 },
  { cloth: "#6b4653", foil: "#dfbd83", height: 2.74, width: 1.48, thickness: .35, lean: -.012 },
  { cloth: "#356264", foil: "#e0c38e", height: 2.56, width: 1.4, thickness: .3, lean: .018 },
  { cloth: "#895843", foil: "#e7c690", height: 2.68, width: 1.46, thickness: .33, lean: -.018 },
  { cloth: "#505c3b", foil: "#d7bb7f", height: 2.5, width: 1.37, thickness: .28, lean: .014 },
];

const SHELF_BASE = .28;

function seededNoise(seed: number) {
  let value = seed + 41;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function wrapTitle(context: CanvasRenderingContext2D, title: string, maxWidth: number, maxLines = 6) {
  const words = title.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (context.measureText(candidate).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, maxLines);
}

function createBookTexture(article: ShelfArticle, design: BookDesign, index: number, face: "front" | "spine") {
  const canvas = document.createElement("canvas");
  canvas.width = face === "front" ? 768 : 256;
  canvas.height = 1024;
  const context = canvas.getContext("2d");
  if (!context) return null;

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;

  const paint = (coverImage?: HTMLImageElement) => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = design.cloth;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const random = seededNoise(index * 97);
    context.globalAlpha = .1;
    for (let mark = 0; mark < 4200; mark += 1) {
      const light = random() > .5;
      context.fillStyle = light ? "#ffffff" : "#000000";
      context.fillRect(random() * canvas.width, random() * canvas.height, random() * 1.8 + .3, random() * 5 + 1);
    }
    context.globalAlpha = 1;
    context.strokeStyle = design.foil;
    context.fillStyle = design.foil;

    if (face === "spine") {
      context.lineWidth = 2;
      context.strokeRect(21, 24, canvas.width - 42, canvas.height - 48);
      context.save();
      context.translate(canvas.width / 2, canvas.height / 2);
      context.rotate(-Math.PI / 2);
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = "600 44px Georgia, serif";
      const spineTitle = article.title.length > 54 ? `${article.title.slice(0, 51)}…` : article.title;
      context.fillText(spineTitle, 0, -5, canvas.height - 220);
      context.restore();
      context.beginPath();
      context.arc(canvas.width / 2, 88, 18, 0, Math.PI * 2);
      context.stroke();
      context.font = "600 22px Arial, sans-serif";
      context.textAlign = "center";
      context.fillText(String(index + 1).padStart(2, "0"), canvas.width / 2, 96);
      texture.needsUpdate = true;
      return;
    }

    context.lineWidth = 2;
    context.strokeRect(42, 42, canvas.width - 84, canvas.height - 84);
    context.font = "600 18px Arial, sans-serif";
    context.letterSpacing = "4px";
    context.fillText("PAPER FOUNDATION INDIA", 68, 91);
    context.textAlign = "right";
    context.fillText(String(index + 1).padStart(2, "0"), canvas.width - 68, 91);

    const imageX = 68;
    const imageY = 142;
    const imageWidth = canvas.width - 136;
    const imageHeight = 430;
    context.save();
    context.beginPath();
    context.rect(imageX, imageY, imageWidth, imageHeight);
    context.clip();
    if (coverImage?.naturalWidth && coverImage.naturalHeight) {
      const scale = Math.max(imageWidth / coverImage.naturalWidth, imageHeight / coverImage.naturalHeight);
      const sourceWidth = imageWidth / scale;
      const sourceHeight = imageHeight / scale;
      const sourceX = (coverImage.naturalWidth - sourceWidth) / 2;
      const sourceY = (coverImage.naturalHeight - sourceHeight) / 2;
      context.drawImage(coverImage, sourceX, sourceY, sourceWidth, sourceHeight, imageX, imageY, imageWidth, imageHeight);
    } else {
      const gradient = context.createLinearGradient(imageX, imageY, imageX + imageWidth, imageY + imageHeight);
      gradient.addColorStop(0, design.foil);
      gradient.addColorStop(1, design.cloth);
      context.fillStyle = gradient;
      context.fillRect(imageX, imageY, imageWidth, imageHeight);
    }
    const wash = context.createLinearGradient(0, imageY, 0, imageY + imageHeight);
    wash.addColorStop(0, "rgba(19,28,23,.02)");
    wash.addColorStop(1, "rgba(19,28,23,.38)");
    context.fillStyle = wash;
    context.fillRect(imageX, imageY, imageWidth, imageHeight);
    context.restore();
    context.strokeStyle = design.foil;
    context.lineWidth = 3;
    context.strokeRect(imageX, imageY, imageWidth, imageHeight);

    context.fillStyle = design.foil;
    context.textAlign = "left";
    context.font = article.title.length > 48 ? "500 45px Georgia, serif" : "500 51px Georgia, serif";
    const titleLines = wrapTitle(context, article.title, imageWidth, 4);
    titleLines.forEach((line, lineIndex) => context.fillText(line, imageX, 650 + lineIndex * 54));

    context.font = "600 19px Arial, sans-serif";
    context.letterSpacing = "3px";
    context.fillText(article.category.toUpperCase(), imageX, 925);
    context.textAlign = "right";
    context.fillText(`${article.time.toUpperCase()} READ`, canvas.width - imageX, 925);
    context.beginPath();
    context.moveTo(imageX, 956);
    context.lineTo(canvas.width - imageX, 956);
    context.stroke();
    texture.needsUpdate = true;
  };

  paint();
  if (face === "front") {
    const coverImage = new Image();
    coverImage.decoding = "async";
    coverImage.onload = () => paint(coverImage);
    coverImage.src = `/images/knowledge/articles/${article.slug}.jpg`;
    texture.userData.coverImage = coverImage;
  }

  return texture;
}

function BookVolume({
  article,
  design,
  index,
  x,
  active,
  inspected,
  reducedMotion,
  onActivate,
  onInspect,
}: {
  article: ShelfArticle;
  design: BookDesign;
  index: number;
  x: number;
  active: boolean;
  inspected: boolean;
  reducedMotion: boolean;
  onActivate: () => void;
  onInspect: () => void;
}) {
  const root = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const textures = useMemo(() => ({
    front: createBookTexture(article, design, index, "front"),
    spine: createBookTexture(article, design, index, "spine"),
  }), [article, design, index]);

  useEffect(() => () => {
    const frontImage = textures.front?.userData.coverImage as HTMLImageElement | undefined;
    if (frontImage) frontImage.onload = null;
    textures.front?.dispose();
    textures.spine?.dispose();
  }, [textures]);

  useFrame((_, delta) => {
    if (!root.current) return;
    const speed = reducedMotion ? 30 : 4.8;
    const hoverLift = hovered && !inspected ? .045 : 0;
    root.current.position.x = THREE.MathUtils.damp(root.current.position.x, inspected ? 0 : x, speed, delta);
    root.current.position.y = THREE.MathUtils.damp(
      root.current.position.y,
      SHELF_BASE + design.height / 2 + hoverLift + (inspected ? .2 : 0),
      speed,
      delta,
    );
    root.current.position.z = THREE.MathUtils.damp(root.current.position.z, inspected ? 2.28 : active ? .09 : 0, speed, delta);
    root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, inspected ? -Math.PI / 2 : 0, speed, delta);
    root.current.rotation.z = THREE.MathUtils.damp(root.current.rotation.z, inspected ? 0 : design.lean, speed, delta);
    const targetScale = inspected ? 1.04 : active || hovered ? 1.018 : 1;
    const nextScale = THREE.MathUtils.damp(root.current.scale.x, targetScale, speed, delta);
    root.current.scale.setScalar(nextScale);
  });

  function activate(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    onActivate();
  }

  function inspect(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();
    if (event.delta > 6) return;
    onActivate();
    onInspect();
  }

  const pageWidth = design.width - .08;
  const pageHeight = design.height - .08;
  const pageThickness = design.thickness - .055;

  return (
    <group
      ref={root}
      name={`featured-book-${article.slug}`}
      position={[x, SHELF_BASE + design.height / 2, 0]}
      rotation={[0, 0, design.lean]}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
        document.documentElement.dataset.bookHover = "true";
      }}
      onPointerOut={() => {
        setHovered(false);
        delete document.documentElement.dataset.bookHover;
      }}
      onPointerDown={activate}
      onClick={inspect}
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[pageThickness, pageHeight, pageWidth]} />
        <meshStandardMaterial color="#e8dfce" roughness={.88} />
      </mesh>

      <mesh position={[design.thickness / 2 - .012, 0, 0]} castShadow>
        <boxGeometry args={[.034, design.height, design.width]} />
        <meshStandardMaterial color={design.cloth} roughness={.74} />
      </mesh>
      <mesh position={[-design.thickness / 2 + .012, 0, 0]} castShadow>
        <boxGeometry args={[.034, design.height, design.width]} />
        <meshStandardMaterial color={design.cloth} roughness={.76} />
      </mesh>
      <mesh position={[0, 0, design.width / 2 - .015]} castShadow>
        <boxGeometry args={[design.thickness, design.height, .052]} />
        <meshStandardMaterial color={design.cloth} roughness={.7} />
      </mesh>

      {textures.spine && (
        <mesh position={[0, 0, design.width / 2 + .013]}>
          <planeGeometry args={[design.thickness * .9, design.height * .94]} />
          <meshStandardMaterial map={textures.spine} roughness={.62} metalness={.06} polygonOffset polygonOffsetFactor={-1} />
        </mesh>
      )}

      {textures.front && (
        <mesh position={[design.thickness / 2 + .007, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[design.width * .94, design.height * .94]} />
          <meshStandardMaterial map={textures.front} roughness={.6} metalness={.08} polygonOffset polygonOffsetFactor={-1} />
        </mesh>
      )}

      <mesh position={[0, design.height / 2 - .045, design.width / 2 + .027]}>
        <boxGeometry args={[design.thickness * .78, .012, .018]} />
        <meshStandardMaterial color={design.foil} metalness={.72} roughness={.26} />
      </mesh>
      <mesh position={[0, -design.height / 2 + .045, design.width / 2 + .027]}>
        <boxGeometry args={[design.thickness * .78, .012, .018]} />
        <meshStandardMaterial color={design.foil} metalness={.72} roughness={.26} />
      </mesh>
    </group>
  );
}

function CameraOwner({
  inspected,
  activeHeight,
  resetSignal,
  reducedMotion,
}: {
  inspected: boolean;
  activeHeight: number;
  resetSignal: number;
  reducedMotion: boolean;
}) {
  const { camera, gl } = useThree();
  const controls = useRef<OrbitControls | null>(null);
  const settled = useRef(false);
  const target = useMemo(() => new THREE.Vector3(), []);
  const desiredCamera = useMemo(() => new THREE.Vector3(), []);
  const desiredTarget = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    const orbit = new OrbitControls(camera, gl.domElement);
    orbit.enabled = false;
    orbit.enableDamping = true;
    orbit.dampingFactor = .09;
    orbit.rotateSpeed = .52;
    orbit.panSpeed = .48;
    orbit.zoomSpeed = .65;
    orbit.enablePan = true;
    orbit.screenSpacePanning = true;
    orbit.minDistance = 2.35;
    orbit.maxDistance = 5.3;
    orbit.minPolarAngle = .72;
    orbit.maxPolarAngle = 2.22;
    orbit.minAzimuthAngle = -1.35;
    orbit.maxAzimuthAngle = 1.35;
    controls.current = orbit;
    return () => orbit.dispose();
  }, [camera, gl]);

  useEffect(() => {
    settled.current = false;
    if (controls.current) controls.current.enabled = false;
  }, [inspected, resetSignal]);

  useFrame((_, delta) => {
    const orbit = controls.current;
    if (!orbit) return;

    if (inspected && settled.current) {
      orbit.update();
      return;
    }

    const speed = reducedMotion ? 28 : 4.6;
    desiredCamera.set(inspected ? .16 : 0, inspected ? 1.72 : 1.64, inspected ? 5.82 : 6.35);
    desiredTarget.set(0, inspected ? SHELF_BASE + activeHeight / 2 : 1.5, inspected ? 2.24 : .08);
    camera.position.lerp(desiredCamera, 1 - Math.exp(-speed * delta));
    target.copy(orbit.target).lerp(desiredTarget, 1 - Math.exp(-speed * delta));
    orbit.target.copy(target);
    camera.lookAt(target);

    if (inspected && camera.position.distanceTo(desiredCamera) < .035 && orbit.target.distanceTo(desiredTarget) < .035) {
      camera.position.copy(desiredCamera);
      orbit.target.copy(desiredTarget);
      orbit.enabled = true;
      orbit.update();
      settled.current = true;
    }
  });

  return null;
}

function ReadingRoom({
  articles,
  activeIndex,
  inspected,
  reducedMotion,
  resetSignal,
  onActivate,
  onInspect,
  onCloseInspection,
}: {
  articles: ShelfArticle[];
  activeIndex: number;
  inspected: boolean;
  reducedMotion: boolean;
  resetSignal: number;
  onActivate: (index: number) => void;
  onInspect: (index: number) => void;
  onCloseInspection: () => void;
}) {
  const layout = useMemo(() => {
    let cursor = 0;
    const rawPositions = articles.map((_, index) => {
      const design = DESIGNS[index % DESIGNS.length];
      const position = cursor + design.thickness / 2;
      cursor += design.thickness + .075;
      return position;
    });
    const lastDesign = DESIGNS[(articles.length - 1) % DESIGNS.length];
    const contentWidth = (rawPositions.at(-1) ?? 0) + (lastDesign?.thickness ?? .3) / 2;
    const contentMidpoint = contentWidth / 2;
    const shelfLength = contentWidth + .58;
    return {
      positions: rawPositions.map((position) => position - contentMidpoint),
      shelfLength,
      shelfLeft: -shelfLength / 2 + .07,
      shelfRight: shelfLength / 2 - .07,
    };
  }, [articles]);

  return (
    <>
      <color attach="background" args={["#efe5d4"]} />
      <fog attach="fog" args={["#efe5d4", 7.8, 15]} />
      <ambientLight intensity={1.45} color="#fff4db" />
      <directionalLight
        castShadow
        color="#ffdba4"
        intensity={3.25}
        position={[-3.8, 6.5, 6.2]}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={.5}
        shadow-camera-far={15}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-2}
      />
      <pointLight color="#c9915c" intensity={12} position={[4.4, 2.6, 3.8]} distance={9} decay={2} />
      <pointLight color="#8ea38a" intensity={5} position={[-4, 1.2, 1.5]} distance={7} decay={2} />

      <group>
        <mesh position={[0, .18, .02]} receiveShadow>
          <boxGeometry args={[layout.shelfLength, .22, 1.62]} />
          <meshStandardMaterial color="#5b3726" roughness={.58} metalness={.02} />
        </mesh>
        <mesh position={[0, 1.72, -.77]} receiveShadow>
          <boxGeometry args={[layout.shelfLength, 3.18, .12]} />
          <meshStandardMaterial color="#6b4430" roughness={.7} />
        </mesh>
        <mesh position={[0, 3.31, -.28]} castShadow receiveShadow>
          <boxGeometry args={[layout.shelfLength, .14, 1.02]} />
          <meshStandardMaterial color="#513021" roughness={.62} />
        </mesh>
        <mesh position={[layout.shelfLeft, 1.72, -.1]} castShadow receiveShadow>
          <boxGeometry args={[.14, 3.3, 1.5]} />
          <meshStandardMaterial color="#513021" roughness={.62} />
        </mesh>
        <mesh position={[layout.shelfRight, 1.72, -.1]} castShadow receiveShadow>
          <boxGeometry args={[.14, 3.3, 1.5]} />
          <meshStandardMaterial color="#513021" roughness={.62} />
        </mesh>
        <mesh position={[0, .34, .79]} castShadow>
          <boxGeometry args={[layout.shelfLength - .08, .085, .065]} />
          <meshStandardMaterial color="#3c2419" roughness={.44} />
        </mesh>
        <mesh position={[0, .385, .826]}>
          <boxGeometry args={[layout.shelfLength - .18, .012, .012]} />
          <meshStandardMaterial color="#b38450" metalness={.56} roughness={.3} />
        </mesh>

        {articles.map((article, index) => (
          <BookVolume
            key={article.slug}
            article={article}
            design={DESIGNS[index % DESIGNS.length]}
            index={index}
            x={layout.positions[index]}
            active={activeIndex === index}
            inspected={inspected && activeIndex === index}
            reducedMotion={reducedMotion}
            onActivate={() => onActivate(index)}
            onInspect={() => onInspect(index)}
          />
        ))}
      </group>

      <mesh position={[0, -.04, 2.1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow onClick={onCloseInspection}>
        <planeGeometry args={[20, 14]} />
        <shadowMaterial color="#4b2d1d" opacity={.15} transparent />
      </mesh>

      <CameraOwner
        inspected={inspected}
        activeHeight={DESIGNS[activeIndex % DESIGNS.length].height}
        resetSignal={resetSignal}
        reducedMotion={reducedMotion}
      />
    </>
  );
}

export default function FeaturedShelfScene({
  articles,
  activeIndex,
  inspected,
  reducedMotion,
  resetSignal,
  onActivate,
  onInspect,
  onCloseInspection,
}: {
  articles: ShelfArticle[];
  activeIndex: number;
  inspected: boolean;
  reducedMotion: boolean;
  resetSignal: number;
  onActivate: (index: number) => void;
  onInspect: (index: number) => void;
  onCloseInspection: () => void;
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.65]}
      camera={{ position: [0, 1.64, 6.35], fov: 34, near: .1, far: 40 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.08;
      }}
      fallback={<div>The interactive shelf is unavailable. Use the reading catalogue below.</div>}
    >
      <ReadingRoom
        articles={articles}
        activeIndex={activeIndex}
        inspected={inspected}
        reducedMotion={reducedMotion}
        resetSignal={resetSignal}
        onActivate={onActivate}
        onInspect={onInspect}
        onCloseInspection={onCloseInspection}
      />
    </Canvas>
  );
}
