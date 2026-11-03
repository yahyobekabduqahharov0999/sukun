import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { Reflector } from "three/examples/jsm/objects/Reflector.js";
import { useSukun } from "../lib/store";

function archGeometry(width: number, height: number, thickness: number) {
  const w = width / 2;
  const base = -height / 2;
  const shoulder = -height * .02;
  const top = height / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-w, base);
  shape.lineTo(-w, shoulder);
  shape.quadraticCurveTo(-w, top * .68, 0, top);
  shape.quadraticCurveTo(w, top * .68, w, shoulder);
  shape.lineTo(w, base);
  shape.lineTo(w - thickness, base);
  shape.lineTo(w - thickness, shoulder);
  shape.quadraticCurveTo(w - thickness, top * .58, 0, top - thickness * 1.65);
  shape.quadraticCurveTo(-w + thickness, top * .58, -w + thickness, shoulder);
  shape.lineTo(-w + thickness, base);
  shape.closePath();
  return new THREE.ExtrudeGeometry(shape, { depth: .12, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: .035, bevelThickness: .035, curveSegments: 32 });
}

function crescentGeometry() {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, 1, Math.PI * .27, Math.PI * 1.73, false);
  shape.absarc(.38, 0, .82, Math.PI * 1.68, Math.PI * .32, true);
  shape.closePath();
  return new THREE.ExtrudeGeometry(shape, { depth: .16, bevelEnabled: true, bevelSegments: 5, bevelSize: .035, bevelThickness: .04, curveSegments: 64 });
}

function mistTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, "rgba(233,228,215,.65)");
  gradient.addColorStop(.35, "rgba(168,185,160,.22)");
  gradient.addColorStop(1, "rgba(7,23,19,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

export default function SanctuaryScene({ home = false }: { home?: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const { state } = useSukun();
  const systemReduced = useReducedMotion();
  const reduced = state.settings.motion === "reduced" || (state.settings.motion === "system" && !!systemReduced);
  const quality = state.settings.scene;

  useEffect(() => {
    if (!host.current || quality === "off") return;
    const container = host.current;
    let renderer: THREE.WebGLRenderer;
    setFailed(false);
    try {
      renderer = new THREE.WebGLRenderer({ antialias: quality === "high", alpha: false, powerPreference: quality === "high" ? "high-performance" : "low-power" });
    } catch {
      setFailed(true);
      return;
    }

    const mobile = window.matchMedia("(max-width: 760px)").matches;
    const high = quality === "high" && !mobile;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, high ? 1.65 : 1.15));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x071713);
    scene.fog = new THREE.FogExp2(0x071713, mobile ? .067 : .052);
    const camera = new THREE.PerspectiveCamera(mobile ? 50 : 42, container.clientWidth / container.clientHeight, .1, 80);
    camera.position.set(0, .65, mobile ? 11.8 : 10);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, .04);
    scene.environment = environment.texture;
    room.dispose();
    pmrem.dispose();

    const world = new THREE.Group();
    scene.add(world);

    const emerald = new THREE.MeshPhysicalMaterial({ color: 0x16483b, metalness: .62, roughness: .24, clearcoat: 1, clearcoatRoughness: .2, envMapIntensity: .75, emissive: 0x071713, emissiveIntensity: .32 });
    const gold = new THREE.MeshPhysicalMaterial({ color: 0xc6a66b, metalness: .9, roughness: .2, clearcoat: .8, envMapIntensity: 1.35, emissive: 0x6f5124, emissiveIntensity: .18 });
    const ivory = new THREE.MeshPhysicalMaterial({ color: 0xe9e4d7, metalness: .32, roughness: .18, transmission: high ? .18 : 0, thickness: .7, transparent: true, opacity: .82, envMapIntensity: 1 });
    const glass = new THREE.MeshPhysicalMaterial({ color: 0xa8b9a0, metalness: .05, roughness: .12, transmission: high ? .86 : .2, thickness: 1.2, transparent: true, opacity: high ? .72 : .32, envMapIntensity: 1.1 });

    const arches = new THREE.Group();
    const centralArch = new THREE.Mesh(archGeometry(6.3, 7.1, .17), emerald);
    centralArch.position.set(0, .55, -3.3);
    arches.add(centralArch);
    const innerArch = new THREE.Mesh(archGeometry(5.25, 6.25, .035), gold);
    innerArch.position.set(0, .45, -3.12);
    arches.add(innerArch);
    [-1, 1].forEach((side) => {
      const arch = new THREE.Mesh(archGeometry(4.6, 6.2, .12), emerald);
      arch.position.set(side * 5.25, .1, -6);
      arch.rotation.y = side * -.28;
      arches.add(arch);
    });
    world.add(arches);

    const emblem = new THREE.Group();
    emblem.position.set(0, .55, -.6);
    const orbitA = new THREE.Mesh(new THREE.TorusGeometry(1.75, .016, 8, 160), gold);
    orbitA.rotation.set(1.12, .18, .2);
    emblem.add(orbitA);
    const orbitB = new THREE.Mesh(new THREE.TorusGeometry(1.48, .011, 8, 140), ivory);
    orbitB.rotation.set(.3, 1.1, -.45);
    emblem.add(orbitB);
    const starPoints: THREE.Vector3[] = [];
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const radius = i % 2 === 0 ? 1.12 : .55;
      starPoints.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, -.2));
    }
    const star = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(starPoints), new THREE.LineBasicMaterial({ color: 0xc6a66b, transparent: true, opacity: .32 }));
    emblem.add(star);
    const sukunRing = new THREE.Mesh(new THREE.TorusGeometry(.14, .032, 16, 48), gold);
    sukunRing.position.set(.4, 1.32, .18);
    emblem.add(sukunRing);
    const sukunDot = new THREE.Mesh(new THREE.SphereGeometry(.04, 16, 16), new THREE.MeshBasicMaterial({ color: 0xf5f0e5 }));
    sukunDot.position.copy(sukunRing.position);
    emblem.add(sukunDot);
    world.add(emblem);

    const crescent = new THREE.Mesh(crescentGeometry(), gold);
    crescent.position.set(mobile ? 2.45 : 3.55, 1.65, -2.15);
    crescent.scale.setScalar(mobile ? .58 : .82);
    crescent.rotation.set(-.08, -.25, -.18);
    world.add(crescent);

    const platform = new THREE.Mesh(new THREE.CylinderGeometry(4.35, 4.65, .1, 96), emerald);
    platform.position.set(0, -2.16, -1.2);
    world.add(platform);
    const floorRing = new THREE.Mesh(new THREE.RingGeometry(2.65, 2.67, 128), new THREE.MeshBasicMaterial({ color: 0xc6a66b, transparent: true, opacity: .22, side: THREE.DoubleSide }));
    floorRing.rotation.x = -Math.PI / 2;
    floorRing.position.set(0, -2.095, -.5);
    world.add(floorRing);

    if (high) {
      const mirror = new Reflector(new THREE.PlaneGeometry(45, 45), { clipBias: .003, textureWidth: 512, textureHeight: 512, color: 0x102c26 });
      mirror.rotation.x = -Math.PI / 2;
      mirror.position.y = -2.23;
      world.add(mirror);
      const veil = new THREE.Mesh(new THREE.PlaneGeometry(45, 45), new THREE.MeshBasicMaterial({ color: 0x071713, transparent: true, opacity: .62, depthWrite: false }));
      veil.rotation.x = -Math.PI / 2;
      veil.position.y = -2.215;
      world.add(veil);
    } else {
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(45, 45), new THREE.MeshPhysicalMaterial({ color: 0x071713, metalness: .75, roughness: .28, envMapIntensity: .4 }));
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -2.23;
      world.add(floor);
    }

    const floaters = new THREE.Group();
    const shapes = [
      { geometry: new THREE.IcosahedronGeometry(.42, 0), material: glass, position: [-3.5, .1, -.5] },
      { geometry: new THREE.OctahedronGeometry(.34, 0), material: gold, position: [3.1, -.65, .4] },
      { geometry: new THREE.TorusGeometry(.38, .045, 12, 64), material: ivory, position: [-2.8, 2.1, -2] },
      { geometry: new THREE.DodecahedronGeometry(.25, 0), material: glass, position: [4.5, 2.8, -4] },
    ] as const;
    shapes.forEach((item, index) => {
      const mesh = new THREE.Mesh(item.geometry, item.material);
      mesh.position.set(item.position[0], item.position[1], item.position[2]);
      mesh.userData.baseY = item.position[1];
      mesh.userData.speed = .18 + index * .045;
      floaters.add(mesh);
    });
    world.add(floaters);

    const count = high ? 620 : mobile ? 170 : 320;
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - .5) * 19;
      positions[i * 3 + 1] = (Math.random() - .5) * 10;
      positions[i * 3 + 2] = (Math.random() - .5) * 15 - 1;
      seeds[i] = Math.random() * Math.PI * 2;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({ color: 0xc6a66b, size: mobile ? .026 : .022, transparent: true, opacity: .58, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true }));
    world.add(particles);

    const texture = mistTexture();
    const mist = new THREE.Group();
    for (let i = 0; i < (mobile ? 5 : 10); i++) {
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, color: i % 2 ? 0xa8b9a0 : 0xe9e4d7, transparent: true, opacity: .035, depthWrite: false, blending: THREE.AdditiveBlending }));
      sprite.position.set((Math.random() - .5) * 15, -1.6 + Math.random() * 4, -2 - Math.random() * 8);
      sprite.scale.set(5 + Math.random() * 5, 2 + Math.random() * 3, 1);
      sprite.userData.baseX = sprite.position.x;
      sprite.userData.speed = .025 + Math.random() * .03;
      mist.add(sprite);
    }
    world.add(mist);

    const shaftMaterial = new THREE.MeshBasicMaterial({ color: 0xc6a66b, transparent: true, opacity: .022, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending });
    [-2.5, 1.8].forEach((x, i) => {
      const shaft = new THREE.Mesh(new THREE.ConeGeometry(2.2, 10, 32, 1, true), shaftMaterial);
      shaft.position.set(x, 3.7, -4 - i);
      shaft.rotation.z = i ? -.2 : .24;
      world.add(shaft);
    });

    scene.add(new THREE.HemisphereLight(0xe9e4d7, 0x071713, 1.1));
    const key = new THREE.DirectionalLight(0xf5f0e5, 2.2);
    key.position.set(-3, 6, 5);
    scene.add(key);
    const rim = new THREE.PointLight(0xc6a66b, 28, 18, 2);
    rim.position.set(3.5, 2, 2);
    scene.add(rim);
    const greenLight = new THREE.PointLight(0x2a8067, 20, 16, 2);
    greenLight.position.set(-4, -1, 1);
    scene.add(greenLight);

    const pointer = new THREE.Vector2();
    const smoothPointer = new THREE.Vector2();
    const onPointer = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth - .5) * 2;
      pointer.y = -(event.clientY / window.innerHeight - .5) * 2;
    };
    if (!reduced) window.addEventListener("pointermove", onPointer, { passive: true });

    const clock = new THREE.Clock();
    let frame = 0;
    let running = true;
    const render = () => {
      if (!running) return;
      const t = reduced ? 0 : clock.getElapsedTime();
      const scroll = window.scrollY / Math.max(window.innerHeight, 1);
      smoothPointer.lerp(pointer, .035);
      emblem.rotation.y = t * .075 + smoothPointer.x * .13;
      emblem.rotation.x = smoothPointer.y * -.07 + Math.sin(t * .24) * .025;
      emblem.position.y = .55 + Math.sin(t * .42) * .09;
      crescent.rotation.z = -.18 + Math.sin(t * .22) * .055;
      crescent.position.y = 1.65 + Math.sin(t * .3 + 1) * .12;
      orbitA.rotation.z = .2 + t * .045;
      orbitB.rotation.z = -.45 - t * .035;
      floaters.children.forEach((object, index) => {
        object.position.y = object.userData.baseY + Math.sin(t * object.userData.speed * 2 + index) * .22;
        object.rotation.x = t * object.userData.speed;
        object.rotation.y = t * object.userData.speed * .8;
      });
      particles.rotation.y = t * .006 + smoothPointer.x * .035;
      particles.position.x = smoothPointer.x * -.12;
      mist.children.forEach((object, index) => { object.position.x = object.userData.baseX + Math.sin(t * object.userData.speed + index) * 1.2; });
      world.rotation.y = smoothPointer.x * .025;
      key.position.x = -3 + smoothPointer.x * 2;
      rim.position.x = 3.5 + smoothPointer.x * 1.2;
      camera.position.x += (smoothPointer.x * .25 - camera.position.x) * .025;
      camera.position.y += ((.65 + smoothPointer.y * .12 + Math.min(scroll, 2) * .16) - camera.position.y) * .025;
      const targetZ = (mobile ? 11.8 : 10) - Math.min(scroll, 1) * 1.35 + Math.max(0, Math.min(scroll - 1, 2)) * .35;
      camera.position.z += (targetZ - camera.position.z) * .025;
      camera.lookAt(0, .3 + Math.min(scroll, 2) * .12, -1.3);
      renderer.render(scene, camera);
      if (!reduced) frame = requestAnimationFrame(render);
    };
    render();

    const onResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      if (reduced) renderer.render(scene, camera);
    };
    const onVisibility = () => {
      if (reduced) return;
      running = !document.hidden;
      if (running) { clock.getDelta(); cancelAnimationFrame(frame); render(); }
      else cancelAnimationFrame(frame);
    };
    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      scene.traverse((object) => {
        if ("geometry" in object && object.geometry instanceof THREE.BufferGeometry) geometries.add(object.geometry);
        if ("material" in object) {
          const material = object.material as THREE.Material | THREE.Material[];
          (Array.isArray(material) ? material : [material]).forEach((m) => materials.add(m));
        }
      });
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      texture.dispose();
      environment.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [quality, reduced]);

  return (
    <div className={`sanctuary-scene ${home ? "is-home" : "is-inner"} ${failed || quality === "off" ? "scene-fallback" : ""}`} aria-hidden="true">
      <div className="css-atmosphere"><span className="css-halo" /><span className="css-arch" /><span className="css-crescent" /><span className="css-mist" /></div>
      <div className="webgl-host" ref={host} />
      <div className="scene-vignette" />
    </div>
  );
}
