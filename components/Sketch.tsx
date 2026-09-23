"use client";

import { useId, type ReactNode } from "react";
import type { SketchName } from "@/content/types";

const ink = "#1c2433";
const sea = "#2f6bff";
const coral = "#ff6a45";
const mint = "#0e9b78";
const sun = "#e7a61a";
const lilac = "#6d5ef5";
const wash = "#e7eeff";
const sand = "#f4ecdf";

function T({
  x,
  y,
  children,
  fill = ink,
  size = 13,
  anchor = "middle",
}: {
  x: number;
  y: number;
  children: ReactNode;
  fill?: string;
  size?: number;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text x={x} y={y} fill={fill} fontSize={size} fontWeight={700} textAnchor={anchor} fontFamily="Nunito, Segoe UI, sans-serif">
      {children}
    </text>
  );
}

function Plate({
  label,
  caption,
  draw,
}: {
  label: string;
  caption?: string;
  draw: (arrow: string) => ReactNode;
}) {
  const uid = useId().replace(/:/g, "");
  const marker = `mk${uid}`;
  return (
    <figure className="figure">
      <svg className="sketch" viewBox="0 0 360 210" role="img" aria-label={label}>
        <defs>
          <marker id={marker} markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
            <path d="M0 0 L7 3 L0 6 Z" fill="context-stroke" />
          </marker>
        </defs>
        <rect x="1" y="1" width="358" height="208" rx="14" fill="#fffdf8" stroke="#eadfce" />
        {draw(`url(#${marker})`)}
      </svg>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

const FIGURES: Record<SketchName, { label: string; draw: (arrow: string) => ReactNode }> = {
  push: {
    label: "A hand pushing a box",
    draw: (arrow) => (
      <>
        <rect x="150" y="78" width="70" height="52" rx="6" fill="#ffe8e2" stroke={coral} strokeWidth="3" />
        <T x={185} y={109}>box</T>
        <path d="M70 104h62" stroke={sea} strokeWidth="4" markerEnd={arrow} />
        <circle cx="48" cy="104" r="16" fill={wash} stroke={sea} strokeWidth="3" />
        <T x={48} y={108} fill={sea}>F</T>
        <T x={185} y={156}>away from you</T>
      </>
    ),
  },
  pull: {
    label: "A pull on a rope",
    draw: (arrow) => (
      <>
        <rect x="200" y="78" width="70" height="52" rx="6" fill={wash} stroke={sea} strokeWidth="3" />
        <path d="M188 104H90" stroke={coral} strokeWidth="4" markerEnd={arrow} />
        <circle cx="62" cy="104" r="16" fill="#fff1ea" stroke={coral} strokeWidth="3" />
        <T x={62} y={108} fill={coral}>you</T>
        <T x={180} y={160}>toward you</T>
      </>
    ),
  },
  shadow: {
    label: "A shadow formed by blocked light",
    draw: () => (
      <>
        <circle cx="58" cy="52" r="22" fill={sun} />
        <T x={58} y={56}>Sun</T>
        <path d="M80 58 L150 92 L250 150" stroke={sun} strokeWidth="3" />
        <path d="M70 74 L150 120 L250 168" stroke={sun} strokeWidth="3" />
        <rect x="136" y="88" width="28" height="48" rx="4" fill={lilac} />
        <T x={150} y={78} size={12}>object</T>
        <ellipse cx="248" cy="162" rx="46" ry="12" fill="#d9d3c8" />
        <T x={248} y={190}>shadow</T>
      </>
    ),
  },
  motion: {
    label: "Distance and displacement",
    draw: (arrow) => (
      <>
        <path d="M40 150 C90 60 150 60 180 110 S250 160 320 70" fill="none" stroke={sea} strokeWidth="3" />
        <path d="M40 150 L320 70" stroke={coral} strokeWidth="3" strokeDasharray="7 5" markerEnd={arrow} />
        <circle cx="40" cy="150" r="5" fill={ink} />
        <circle cx="320" cy="70" r="5" fill={ink} />
        <T x={150} y={48} fill={sea}>distance along the path</T>
        <T x={180} y={128} fill={coral}>displacement</T>
      </>
    ),
  },
  circuit: {
    label: "A simple closed circuit",
    draw: () => (
      <>
        <path d="M70 50 H290 V160 H70 Z" fill="none" stroke={ink} strokeWidth="3" />
        <rect x="158" y="38" width="44" height="24" rx="3" fill={coral} />
        <T x={180} y={55} fill="white" size={12}>cell</T>
        <path d="M70 90 h18 M88 100 h18" stroke={ink} strokeWidth="3" />
        <T x={48} y={100} size={12}>switch</T>
        <circle cx="290" cy="105" r="16" fill="none" stroke={sun} strokeWidth="4" />
        <T x={290} y={146} size={12}>bulb</T>
      </>
    ),
  },
  magnet: {
    label: "A bar magnet and its field",
    draw: (arrow) => (
      <>
        <rect x="130" y="78" width="100" height="36" fill={coral} />
        <rect x="180" y="78" width="50" height="36" fill={sea} />
        <T x={155} y={101} fill="white">N</T>
        <T x={205} y={101} fill="white">S</T>
        <path d="M230 96 C290 40 300 150 230 120" fill="none" stroke={mint} strokeWidth="2.5" markerEnd={arrow} />
        <path d="M130 96 C70 40 60 150 130 120" fill="none" stroke={mint} strokeWidth="2.5" />
        <T x={180} y={180} size={12}>field lines outside the magnet</T>
      </>
    ),
  },
  mirror: {
    label: "Reflection from a concave mirror",
    draw: (arrow) => (
      <>
        <path d="M250 30 C190 70 190 140 250 180" fill="none" stroke={ink} strokeWidth="4" />
        <path d="M40 70 H230" stroke={sea} strokeWidth="2.5" markerEnd={arrow} />
        <path d="M230 70 L150 105" stroke={sea} strokeWidth="2.5" markerEnd={arrow} />
        <path d="M40 140 H230" stroke={lilac} strokeWidth="2.5" markerEnd={arrow} />
        <path d="M230 140 L150 105" stroke={lilac} strokeWidth="2.5" markerEnd={arrow} />
        <circle cx="150" cy="105" r="4" fill={coral} />
        <T x={150} y={128} size={12}>F</T>
        <T x={70} y={58} size={12} fill={sea}>parallel rays</T>
      </>
    ),
  },
  wave: {
    label: "A transverse wave with wavelength marked",
    draw: () => (
      <>
        <path d="M20 110 C50 50 80 50 110 110 S170 170 200 110 260 50 290 110 340 170 360 110" fill="none" stroke={sea} strokeWidth="3" />
        <path d="M110 110 H290" stroke={coral} strokeWidth="2" />
        <path d="M110 100 v20 M290 100 v20" stroke={coral} strokeWidth="2" />
        <T x={200} y={98} fill={coral} size={12}>wavelength λ</T>
        <T x={78} y={42} size={12}>crest</T>
        <T x={168} y={188} size={12}>trough</T>
      </>
    ),
  },
  pendulum: {
    label: "A simple pendulum",
    draw: () => (
      <>
        <path d="M80 36 H220" stroke={ink} strokeWidth="4" />
        <path d="M150 36 L210 150" stroke={ink} strokeWidth="2" />
        <path d="M150 36 L150 156" stroke={sea} strokeWidth="2" strokeDasharray="4 4" />
        <circle cx="210" cy="156" r="14" fill={coral} />
        <T x={168} y={90} fill={sea} size={12}>L</T>
        <T x={180} y={190} size={12}>bob</T>
      </>
    ),
  },
  heat: {
    label: "Heat flowing along a metal rod",
    draw: (arrow) => (
      <>
        <rect x="40" y="88" width="280" height="22" rx="8" fill="#f0d2c6" stroke={coral} strokeWidth="2" />
        <circle cx="70" cy="99" r="22" fill={coral} />
        <T x={70} y={103} fill="white" size={12}>hot</T>
        <circle cx="290" cy="99" r="22" fill={sea} />
        <T x={290} y={103} fill="white" size={12}>cold</T>
        <path d="M110 70 H250" stroke={sun} strokeWidth="3" markerEnd={arrow} />
        <T x={180} y={60} fill={sun} size={12}>heat flow</T>
      </>
    ),
  },
  gravity: {
    label: "Weight toward the centre of the Earth",
    draw: (arrow) => (
      <>
        <circle cx="180" cy="118" r="48" fill="#d9efe4" stroke={mint} strokeWidth="3" />
        <T x={180} y={122}>Earth</T>
        <circle cx="180" cy="42" r="10" fill={coral} />
        <path d="M180 54 V78" stroke={coral} strokeWidth="3" markerEnd={arrow} />
        <T x={230} y={70} fill={coral} size={12}>weight</T>
      </>
    ),
  },
  float: {
    label: "Weight and upthrust on a floating block",
    draw: (arrow) => (
      <>
        <path d="M20 130 H340" stroke={sea} strokeWidth="3" />
        <path d="M20 130 Q40 122 60 130 T100 130 T140 130 T180 130 T220 130 T260 130 T300 130 T340 130 V190 H20 Z" fill="#d7ebff" />
        <rect x="145" y="96" width="70" height="48" fill="#ffe8e2" stroke={coral} strokeWidth="3" />
        <path d="M180 96 V62" stroke={mint} strokeWidth="3" markerEnd={arrow} />
        <path d="M180 144 V178" stroke={coral} strokeWidth="3" markerEnd={arrow} />
        <T x={250} y={74} fill={mint} size={12}>upthrust</T>
        <T x={250} y={176} fill={coral} size={12}>weight</T>
      </>
    ),
  },
  lever: {
    label: "A lever and its fulcrum",
    draw: () => (
      <>
        <path d="M40 90 L320 130" stroke={ink} strokeWidth="6" />
        <path d="M170 118 L190 168 H150 Z" fill={sea} />
        <T x={170} y={190} size={12}>fulcrum</T>
        <circle cx="70" cy="84" r="12" fill={coral} />
        <T x={70} y={64} size={12}>load</T>
        <path d="M300 100 V70" stroke={mint} strokeWidth="3" />
        <T x={300} y={60} size={12}>effort</T>
      </>
    ),
  },
  slope: {
    label: "An inclined plane",
    draw: () => (
      <>
        <path d="M40 170 L300 170 L300 70 Z" fill={sand} stroke={ink} strokeWidth="3" />
        <rect x="150" y="92" width="36" height="28" transform="rotate(-24 168 106)" fill={coral} />
        <T x={90} y={150}>slope</T>
        <T x={200} y={50} size={12}>longer path, smaller push</T>
      </>
    ),
  },
  reflection: {
    label: "Reflection of a ray from a plane mirror",
    draw: (arrow) => (
      <>
        <path d="M250 24 V186" stroke={ink} strokeWidth="6" />
        <path d="M250 24 v8 M250 48 v8 M250 72 v8 M250 96 v8 M250 120 v8 M250 144 v8 M250 168 v8" stroke={ink} strokeWidth="3" />
        <path d="M250 110 H70" stroke={ink} strokeWidth="1.5" strokeDasharray="4 4" />
        <path d="M70 50 L250 110" stroke={sea} strokeWidth="3" markerEnd={arrow} />
        <path d="M250 110 L90 170" stroke={coral} strokeWidth="3" markerEnd={arrow} />
        <T x={120} y={70} fill={sea} size={12}>incident</T>
        <T x={130} y={160} fill={coral} size={12}>reflected</T>
        <T x={300} y={110} size={12}>normal</T>
      </>
    ),
  },
  refraction: {
    label: "A ray bending into glass",
    draw: (arrow) => (
      <>
        <rect x="40" y="100" width="280" height="80" fill="#e7eefc" stroke={sea} strokeWidth="2" />
        <T x={180} y={128} fill={sea}>glass</T>
        <path d="M180 20 V190" stroke={ink} strokeWidth="1.5" strokeDasharray="4 4" />
        <path d="M90 30 L180 100" stroke={coral} strokeWidth="3" markerEnd={arrow} />
        <path d="M180 100 L230 180" stroke={coral} strokeWidth="3" markerEnd={arrow} />
        <T x={110} y={48} size={12}>air</T>
        <T x={250} y={80} size={12}>normal</T>
      </>
    ),
  },
  lens: {
    label: "A convex lens focusing parallel rays",
    draw: (arrow) => (
      <>
        <path d="M170 30 Q210 105 170 180 Q130 105 170 30" fill="#e7eefc" stroke={sea} strokeWidth="3" />
        <path d="M30 70 H155" stroke={coral} strokeWidth="2.5" markerEnd={arrow} />
        <path d="M190 78 L300 105" stroke={coral} strokeWidth="2.5" markerEnd={arrow} />
        <path d="M30 140 H155" stroke={lilac} strokeWidth="2.5" markerEnd={arrow} />
        <path d="M190 132 L300 105" stroke={lilac} strokeWidth="2.5" markerEnd={arrow} />
        <circle cx="300" cy="105" r="4" fill={ink} />
        <T x={318} y={100} size={12}>F</T>
      </>
    ),
  },
  eye: {
    label: "A simple diagram of the eye",
    draw: () => (
      <>
        <ellipse cx="180" cy="105" rx="110" ry="62" fill="#fff4ec" stroke={ink} strokeWidth="3" />
        <path d="M78 105 Q110 78 140 105 Q110 132 78 105" fill="#d7ebff" stroke={sea} strokeWidth="3" />
        <T x={108} y={96} size={11} fill={sea}>lens</T>
        <path d="M250 70 Q280 105 250 140" fill="#f7d0dc" stroke={coral} strokeWidth="3" />
        <T x={228} y={100} size={11}>retina</T>
        <path d="M40 80 L90 98 M40 130 L90 112" stroke={sun} strokeWidth="2" />
      </>
    ),
  },
  prism: {
    label: "Dispersion by a prism",
    draw: () => (
      <>
        <path d="M70 160 L180 40 L290 160 Z" fill="#f7f4ff" stroke={lilac} strokeWidth="3" />
        <path d="M20 100 H130" stroke={ink} strokeWidth="3" />
        <path d="M230 90 L340 70" stroke="#d23b3b" strokeWidth="3" />
        <path d="M232 110 L340 130" stroke={sea} strokeWidth="3" />
        <T x={40} y={88} size={12}>white</T>
        <T x={330} y={60} fill="#d23b3b" size={12}>red</T>
        <T x={330} y={150} fill={sea} size={12}>violet</T>
      </>
    ),
  },
  pressure: {
    label: "The same force on two different areas",
    draw: (arrow) => (
      <>
        <rect x="50" y="120" width="90" height="28" fill={sand} stroke={ink} strokeWidth="2" />
        <rect x="210" y="132" width="40" height="16" fill={sand} stroke={ink} strokeWidth="2" />
        <path d="M95 70 V112" stroke={coral} strokeWidth="3" markerEnd={arrow} />
        <path d="M230 70 V124" stroke={coral} strokeWidth="3" markerEnd={arrow} />
        <T x={95} y={58}>same force</T>
        <T x={95} y={176} size={12}>large area</T>
        <T x={230} y={176} size={12}>small area</T>
      </>
    ),
  },
  friction: {
    label: "Friction opposing sliding",
    draw: (arrow) => (
      <>
        <path d="M30 150 H330" stroke={ink} strokeWidth="4" />
        <path d="M30 150 q8 8 0 0 M70 150 q8 8 0 0 M110 150 q8 8 0 0 M150 150 q8 8 0 0 M190 150 q8 8 0 0 M230 150 q8 8 0 0 M270 150 q8 8 0 0" stroke={ink} strokeWidth="2" />
        <rect x="120" y="100" width="70" height="48" fill={wash} stroke={sea} strokeWidth="3" />
        <path d="M190 124 H270" stroke={mint} strokeWidth="3" markerEnd={arrow} />
        <path d="M120 124 H50" stroke={coral} strokeWidth="3" markerEnd={arrow} />
        <T x={250} y={110} fill={mint} size={12}>motion</T>
        <T x={70} y={110} fill={coral} size={12}>friction</T>
      </>
    ),
  },
  sound: {
    label: "A vibrating fork sending a sound wave",
    draw: () => (
      <>
        <path d="M70 40 v50 M70 120 v50 M70 90 h24 M94 50 v80" stroke={ink} strokeWidth="4" />
        <path d="M130 105 h20 M170 90 q20 15 0 30 M210 78 q28 27 0 54 M255 66 q36 39 0 78" fill="none" stroke={sea} strokeWidth="3" />
        <T x={70} y={30} size={12}>fork</T>
        <ellipse cx="310" cy="105" rx="22" ry="30" fill="#fff1ea" stroke={coral} strokeWidth="2" />
        <T x={310} y={160} size={12}>ear</T>
      </>
    ),
  },
  echo: {
    label: "Sound reflecting from a wall",
    draw: (arrow) => (
      <>
        <path d="M280 30 V180" stroke={ink} strokeWidth="8" />
        <circle cx="60" cy="110" r="16" fill={coral} />
        <T x={60} y={114} fill="white" size={11}>you</T>
        <path d="M80 96 L268 70" stroke={sea} strokeWidth="3" markerEnd={arrow} />
        <path d="M268 140 L80 124" stroke={lilac} strokeWidth="3" markerEnd={arrow} />
        <T x={170} y={70} fill={sea} size={12}>going</T>
        <T x={170} y={160} fill={lilac} size={12}>coming back</T>
      </>
    ),
  },
  projectile: {
    label: "The path of a projectile",
    draw: (arrow) => (
      <>
        <path d="M30 170 H330 M30 170 V30" stroke={ink} strokeWidth="2" />
        <path d="M40 160 Q140 20 300 160" fill="none" stroke={sea} strokeWidth="3" />
        <path d="M150 78 H210" stroke={mint} strokeWidth="3" markerEnd={arrow} />
        <path d="M150 78 V130" stroke={coral} strokeWidth="3" markerEnd={arrow} />
        <T x={250} y={70} fill={mint} size={12}>vx constant</T>
        <T x={118} y={130} fill={coral} size={12}>g down</T>
      </>
    ),
  },
  circular: {
    label: "Centripetal force in circular motion",
    draw: (arrow) => (
      <>
        <circle cx="180" cy="108" r="58" fill="none" stroke={sea} strokeWidth="3" />
        <circle cx="238" cy="108" r="8" fill={coral} />
        <path d="M230 108 H190" stroke={coral} strokeWidth="3" markerEnd={arrow} />
        <T x={180} y={96} size={12}>centre</T>
        <T x={180} y={190} size={12}>force toward the centre</T>
      </>
    ),
  },
  satellite: {
    label: "A satellite orbiting Earth",
    draw: (arrow) => (
      <>
        <circle cx="170" cy="110" r="36" fill="#d9efe4" stroke={mint} strokeWidth="3" />
        <T x={170} y={114} size={12}>Earth</T>
        <ellipse cx="170" cy="110" rx="90" ry="48" fill="none" stroke={sea} strokeWidth="2" />
        <circle cx="250" cy="86" r="7" fill={coral} />
        <path d="M258 78 L286 62" stroke={coral} strokeWidth="3" markerEnd={arrow} />
        <T x={300} y={58} size={12}>velocity</T>
      </>
    ),
  },
  spring: {
    label: "A mass on a spring",
    draw: () => (
      <>
        <path d="M150 24 H210" stroke={ink} strokeWidth="4" />
        <path d="M180 24 v16 l14 10 -28 10 28 10 -28 10 28 10 -14 10 v10" fill="none" stroke={sea} strokeWidth="3" />
        <rect x="158" y="128" width="44" height="36" fill={coral} />
        <T x={180} y={186} size={12}>extension x</T>
      </>
    ),
  },
  capacitor: {
    label: "A parallel-plate capacitor",
    draw: () => (
      <>
        <rect x="120" y="40" width="16" height="120" fill={sea} />
        <rect x="210" y="40" width="16" height="120" fill={coral} />
        <T x={100} y={104} fill={sea}>+</T>
        <T x={250} y={104} fill={coral}>−</T>
        <T x={168} y={104} size={12}>d</T>
        <path d="M136 150 H210" stroke={ink} strokeWidth="2" />
        <T x={173} y={190} size={12}>opposite charges</T>
      </>
    ),
  },
  field: {
    label: "Electric field lines of a positive charge",
    draw: (arrow) => (
      <>
        <circle cx="180" cy="105" r="18" fill={coral} />
        <T x={180} y={110} fill="white">+</T>
        <path d="M198 105 H300" stroke={sea} strokeWidth="2.5" markerEnd={arrow} />
        <path d="M162 105 H60" stroke={sea} strokeWidth="2.5" markerEnd={arrow} />
        <path d="M180 87 V30" stroke={sea} strokeWidth="2.5" markerEnd={arrow} />
        <path d="M180 123 V180" stroke={sea} strokeWidth="2.5" markerEnd={arrow} />
        <T x={180} y={202} size={12}>lines leave a positive charge</T>
      </>
    ),
  },
  transformer: {
    label: "A transformer with two coils",
    draw: () => (
      <>
        <rect x="150" y="40" width="60" height="120" rx="8" fill="#efe6d6" stroke={ink} strokeWidth="2" />
        <path d="M120 55 q-20 12 0 24 q-20 12 0 24 q-20 12 0 24 q-20 12 0 24" fill="none" stroke={sea} strokeWidth="3" />
        <path d="M240 55 q20 12 0 24 q20 12 0 24 q20 12 0 24 q20 12 0 24" fill="none" stroke={coral} strokeWidth="3" />
        <T x={80} y={190} size={12} fill={sea}>primary</T>
        <T x={270} y={190} size={12} fill={coral}>secondary</T>
      </>
    ),
  },
  atom: {
    label: "Energy levels in the Bohr model",
    draw: () => (
      <>
        <circle cx="90" cy="110" r="10" fill={coral} />
        <circle cx="90" cy="110" r="28" fill="none" stroke={sea} strokeWidth="2" />
        <circle cx="90" cy="110" r="48" fill="none" stroke={lilac} strokeWidth="2" />
        <circle cx="90" cy="110" r="68" fill="none" stroke={mint} strokeWidth="2" />
        <T x={170} y={50} anchor="start" size={12}>n = 3</T>
        <T x={170} y={90} anchor="start" size={12}>n = 2</T>
        <T x={170} y={120} anchor="start" size={12}>n = 1</T>
        <T x={200} y={170} size={12}>energy increases outward</T>
      </>
    ),
  },
  nucleus: {
    label: "A sample remaining after half-lives",
    draw: () => (
      <>
        <path d="M40 170 H320 M40 170 V30" stroke={ink} strokeWidth="2" />
        <path d="M40 50 C120 50 140 110 180 110 S260 150 320 150" fill="none" stroke={coral} strokeWidth="3" />
        <T x={70} y={42} size={12}>N₀</T>
        <T x={190} y={100} size={12}>N₀/2</T>
        <T x={250} y={190} size={12}>time in half-lives</T>
      </>
    ),
  },
  diode: {
    label: "Forward and reverse bias of a diode",
    draw: (arrow) => (
      <>
        <path d="M70 70 H150" stroke={ink} strokeWidth="3" />
        <path d="M150 50 L190 70 L150 90 Z" fill={sea} />
        <path d="M190 50 V90 M190 70 H270" stroke={ink} strokeWidth="3" />
        <T x={160} y={40} size={12}>forward</T>
        <path d="M70 150 H150" stroke={ink} strokeWidth="3" />
        <path d="M190 130 L150 150 L190 170 Z" fill={coral} />
        <path d="M150 130 V170" stroke={ink} strokeWidth="3" />
        <path d="M190 150 H250" stroke={ink} strokeWidth="3" markerEnd={arrow} />
        <T x={160} y={190} size={12}>reverse, little current</T>
      </>
    ),
  },
  solar: {
    label: "Planets around the Sun, not to scale",
    draw: () => (
      <>
        <circle cx="70" cy="105" r="28" fill={sun} />
        <T x={70} y={109} size={12}>Sun</T>
        <ellipse cx="70" cy="105" rx="70" ry="40" fill="none" stroke={sea} />
        <ellipse cx="70" cy="105" rx="120" ry="62" fill="none" stroke={lilac} />
        <ellipse cx="70" cy="105" rx="165" ry="82" fill="none" stroke={mint} />
        <circle cx="138" cy="92" r="5" fill={sea} />
        <circle cx="186" cy="70" r="7" fill={lilac} />
        <circle cx="228" cy="150" r="6" fill={mint} />
        <T x={250} y={30} size={12}>not to scale</T>
      </>
    ),
  },
  daynight: {
    label: "Day and night on the Earth",
    draw: () => (
      <>
        <circle cx="70" cy="70" r="22" fill={sun} />
        <T x={70} y={110} size={12}>Sun</T>
        <circle cx="210" cy="110" r="48" fill={ink} />
        <path d="M210 62 A48 48 0 0 1 210 158 A40 48 0 0 0 210 62" fill={sun} />
        <T x={186} y={114} size={12}>day</T>
        <T x={246} y={114} fill="white" size={12}>night</T>
      </>
    ),
  },
  measure: {
    label: "A ruler measuring a length",
    draw: () => (
      <>
        <rect x="40" y="90" width="280" height="36" rx="4" fill="#fff8e8" stroke={sun} strokeWidth="3" />
        {Array.from({ length: 13 }, (_, index) => (
          <path key={index} d={`M${52 + index * 22} 90 v${index % 2 === 0 ? 18 : 10}`} stroke={ink} strokeWidth="2" />
        ))}
        <path d="M52 150 H272" stroke={sea} strokeWidth="3" />
        <T x={162} y={176} fill={sea}>0 to 10, with a unit</T>
      </>
    ),
  },
  graph: {
    label: "A distance-time graph for steady speed",
    draw: () => (
      <>
        <path d="M50 170 H320 M50 170 V30" stroke={ink} strokeWidth="2" />
        <path d="M50 160 L250 50" stroke={sea} strokeWidth="3" />
        <T x={300} y={186} size={12}>time</T>
        <T x={40} y={24} size={12}>distance</T>
        <T x={180} y={90} fill={sea} size={12}>constant speed</T>
      </>
    ),
  },
  storm: {
    label: "Air moving toward low pressure",
    draw: (arrow) => (
      <>
        <circle cx="180" cy="105" r="28" fill="#fff4e5" stroke={sun} strokeWidth="3" />
        <T x={180} y={109} size={12}>low</T>
        <path d="M40 60 L140 90" stroke={sea} strokeWidth="3" markerEnd={arrow} />
        <path d="M40 150 L140 120" stroke={sea} strokeWidth="3" markerEnd={arrow} />
        <path d="M320 60 L220 90" stroke={sea} strokeWidth="3" markerEnd={arrow} />
        <path d="M320 150 L220 120" stroke={sea} strokeWidth="3" markerEnd={arrow} />
        <T x={180} y={190} size={12}>from high pressure toward low</T>
      </>
    ),
  },
  charge: {
    label: "Like charges repel and unlike charges attract",
    draw: (arrow) => (
      <>
        <circle cx="80" cy="70" r="18" fill={coral} />
        <circle cx="150" cy="70" r="18" fill={coral} />
        <T x={80} y={75} fill="white">+</T>
        <T x={150} y={75} fill="white">+</T>
        <path d="M62 70 H30" stroke={coral} strokeWidth="3" markerEnd={arrow} />
        <path d="M168 70 H200" stroke={coral} strokeWidth="3" markerEnd={arrow} />
        <circle cx="230" cy="150" r="18" fill={sea} />
        <circle cx="300" cy="150" r="18" fill={coral} />
        <T x={230} y={155} fill="white">−</T>
        <T x={300} y={155} fill="white">+</T>
        <path d="M248 150 H282" stroke={mint} strokeWidth="3" markerEnd={arrow} />
        <T x={115} y={110} size={12}>repel</T>
        <T x={265} y={190} size={12}>attract</T>
      </>
    ),
  },
  fuse: {
    label: "A fuse in the live wire",
    draw: () => (
      <>
        <path d="M40 70 H120" stroke={coral} strokeWidth="3" />
        <rect x="120" y="56" width="70" height="28" rx="8" fill="#fff4e5" stroke={sun} strokeWidth="3" />
        <T x={155} y={75} size={12}>fuse</T>
        <path d="M190 70 H320" stroke={coral} strokeWidth="3" />
        <rect x="230" y="110" width="60" height="40" fill={wash} stroke={sea} strokeWidth="2" />
        <T x={260} y={134} size={12}>lamp</T>
        <path d="M260 110 V70" stroke={ink} strokeWidth="2" />
        <T x={50} y={58} fill={coral} size={12}>live</T>
        <T x={40} y={170} size={12}>too much current melts the fuse</T>
      </>
    ),
  },
  rainbow: {
    label: "A primary rainbow",
    draw: () => (
      <>
        <path d="M40 170 A140 140 0 0 1 320 170" fill="none" stroke="#d23b3b" strokeWidth="6" />
        <path d="M55 170 A125 125 0 0 1 305 170" fill="none" stroke={sun} strokeWidth="6" />
        <path d="M70 170 A110 110 0 0 1 290 170" fill="none" stroke={sea} strokeWidth="6" />
        <circle cx="300" cy="40" r="16" fill={sun} />
        <T x={70} y={196} fill="#d23b3b" size={12}>red outside</T>
        <T x={250} y={196} fill={sea} size={12}>violet inside</T>
      </>
    ),
  },
  pulley: {
    label: "A fixed pulley",
    draw: () => (
      <>
        <path d="M180 20 V48" stroke={ink} strokeWidth="3" />
        <circle cx="180" cy="78" r="28" fill="none" stroke={sea} strokeWidth="4" />
        <path d="M152 78 V170 M208 78 V150" stroke={ink} strokeWidth="3" />
        <rect x="188" y="150" width="36" height="28" fill={coral} />
        <T x={120} y={160} size={12}>pull down</T>
        <T x={250} y={164} size={12}>load</T>
      </>
    ),
  },
  gas: {
    label: "Gas molecules striking a container wall",
    draw: (arrow) => (
      <>
        <rect x="70" y="36" width="220" height="140" fill="#f7f8ff" stroke={ink} strokeWidth="3" />
        <circle cx="120" cy="80" r="8" fill={sea} />
        <circle cx="180" cy="120" r="8" fill={coral} />
        <circle cx="230" cy="70" r="8" fill={mint} />
        <path d="M230 70 L275 70" stroke={mint} strokeWidth="2" markerEnd={arrow} />
        <T x={180} y={198} size={12}>hits on the wall make pressure</T>
      </>
    ),
  },
  solid: {
    label: "A rod stretched by a force",
    draw: (arrow) => (
      <>
        <rect x="80" y="80" width="160" height="36" fill={sand} stroke={ink} strokeWidth="3" />
        <path d="M240 98 H310" stroke={coral} strokeWidth="3" markerEnd={arrow} />
        <path d="M80 98 H30" stroke={sea} strokeWidth="3" markerEnd={arrow} />
        <T x={160} y={150} size={12}>original length L</T>
        <T x={160} y={64} size={12}>force on each end</T>
      </>
    ),
  },
  emwave: {
    label: "An electromagnetic wave",
    draw: () => (
      <>
        <path d="M30 105 H330" stroke={ink} strokeWidth="2" />
        <path d="M40 105 C70 55 100 55 130 105 S190 155 220 105 280 55 320 105" fill="none" stroke={sea} strokeWidth="3" />
        <path d="M40 105 C70 145 100 145 130 105 S190 65 220 105 280 145 320 105" fill="none" stroke={coral} strokeWidth="3" />
        <T x={90} y={48} fill={sea} size={12}>E</T>
        <T x={90} y={176} fill={coral} size={12}>B</T>
        <T x={250} y={40} size={12}>travel →</T>
      </>
    ),
  },
  slits: {
    label: "Young's double slit",
    draw: () => (
      <>
        <rect x="70" y="40" width="12" height="130" fill={ink} />
        <path d="M70 78 h12 M70 122 h12" stroke="#fffdf8" strokeWidth="6" />
        <path d="M82 84 L280 50 M82 128 L280 160 M82 84 L280 160 M82 128 L280 50" stroke={sea} strokeWidth="1.5" />
        <path d="M300 36 V174" stroke={ink} strokeWidth="3" />
        <circle cx="300" cy="70" r="4" fill={sun} />
        <circle cx="300" cy="105" r="4" fill={sun} />
        <circle cx="300" cy="140" r="4" fill={sun} />
        <T x={180} y={196} size={12}>bright fringes</T>
      </>
    ),
  },
  photo: {
    label: "The photoelectric effect",
    draw: (arrow) => (
      <>
        <rect x="40" y="70" width="120" height="70" fill="#efe6d6" stroke={ink} strokeWidth="2" />
        <T x={100} y={110} size={12}>metal</T>
        <path d="M200 50 L150 90" stroke={sun} strokeWidth="3" markerEnd={arrow} />
        <T x={230} y={48} size={12}>photon</T>
        <circle cx="250" cy="120" r="8" fill={sea} />
        <path d="M180 100 L242 118" stroke={sea} strokeWidth="2" markerEnd={arrow} />
        <T x={250} y={156} size={12}>electron</T>
      </>
    ),
  },
  vector: {
    label: "Adding two vectors tip to tail",
    draw: (arrow) => (
      <>
        <path d="M50 150 L170 70" stroke={sea} strokeWidth="3" markerEnd={arrow} />
        <path d="M170 70 L280 110" stroke={coral} strokeWidth="3" markerEnd={arrow} />
        <path d="M50 150 L280 110" stroke={mint} strokeWidth="3" strokeDasharray="6 4" markerEnd={arrow} />
        <T x={90} y={90} fill={sea} size={12}>A</T>
        <T x={230} y={78} fill={coral} size={12}>B</T>
        <T x={140} y={150} fill={mint} size={12}>A + B</T>
      </>
    ),
  },
  freefall: {
    label: "Free fall with air resistance ignored",
    draw: (arrow) => (
      <>
        <circle cx="120" cy="40" r="10" fill={coral} />
        <circle cx="120" cy="80" r="10" fill={coral} opacity="0.7" />
        <circle cx="120" cy="130" r="10" fill={coral} opacity="0.45" />
        <path d="M150 50 V160" stroke={sea} strokeWidth="3" markerEnd={arrow} />
        <T x={210} y={100}>g downward</T>
        <T x={180} y={190} size={12}>speed increases on the way down</T>
      </>
    ),
  },
  work: {
    label: "A force moving an object",
    draw: (arrow) => (
      <>
        <rect x="70" y="80" width="60" height="44" fill={wash} stroke={sea} strokeWidth="3" />
        <path d="M130 102 H250" stroke={coral} strokeWidth="3" markerEnd={arrow} />
        <path d="M70 150 H250" stroke={ink} strokeWidth="2" />
        <T x={190} y={70} fill={coral}>force</T>
        <T x={160} y={176} size={12}>displacement in the same direction</T>
      </>
    ),
  },
  collision: {
    label: "Two bodies colliding",
    draw: (arrow) => (
      <>
        <circle cx="90" cy="110" r="28" fill="#ffe8e2" stroke={coral} strokeWidth="3" />
        <circle cx="230" cy="110" r="36" fill={wash} stroke={sea} strokeWidth="3" />
        <path d="M120 110 H175" stroke={coral} strokeWidth="3" markerEnd={arrow} />
        <T x={90} y={114}>m</T>
        <T x={230} y={114}>M</T>
        <T x={180} y={180} size={12}>the pair of forces is equal and opposite</T>
      </>
    ),
  },
  ac: {
    label: "An alternating voltage",
    draw: () => (
      <>
        <path d="M30 105 H330 M180 30 V180" stroke={ink} strokeWidth="2" />
        <path d="M40 105 C70 40 110 40 140 105 S200 170 230 105 290 40 330 105" fill="none" stroke={sea} strokeWidth="3" />
        <T x={300} y={28} size={12}>time</T>
        <T x={40} y={40} size={12}>voltage</T>
        <T x={180} y={200} size={12}>direction keeps changing</T>
      </>
    ),
  },
};

export function Sketch({ name, caption }: { name: SketchName; caption?: string }) {
  const figure = FIGURES[name];
  return <Plate label={figure.label} caption={caption} draw={figure.draw} />;
}
