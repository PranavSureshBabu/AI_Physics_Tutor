export type Bench = {
  title: string;
  note: string;
  ids: string[];
};

const benches: Record<number, Bench> = {
  6: {
    title: "Speed calculator",
    note: "Class 6 measures a journey. Enter distance and time, or two parts of a trip.",
    ids: ["speed", "average-speed"],
  },
  7: {
    title: "Journey calculator",
    note: "Class 7 compares a whole trip with one steady speed. Average speed is not the same sum as Class 6.",
    ids: ["average-speed", "speed", "acceleration"],
  },
  8: {
    title: "Pressure and sound calculator",
    note: "Class 8 works with force on an area, liquid depth, friction, and how far a sound travels.",
    ids: ["pressure", "liquid-pressure", "friction", "wave-speed", "echo-distance"],
  },
  9: {
    title: "Motion and energy calculator",
    note: "Class 9 uses the equations of motion, Newton’s second law, work, and kinetic energy.",
    ids: ["v-uat", "s-uat", "v2-uas", "newton-second", "momentum", "work", "kinetic-energy", "density"],
  },
  10: {
    title: "Light and circuit calculator",
    note: "Class 10 uses mirrors, lenses, Ohm’s law, and electric power. It does not start from a speed sum.",
    ids: ["mirror-formula", "lens-formula", "lens-power", "refractive-index", "ohms-law", "series-resistance", "electric-power", "joule-heat"],
  },
  11: {
    title: "Mechanics calculator",
    note: "Class 11 adds oscillations, heat capacity, circular motion, and the equations you rearrange for u, a, or t.",
    ids: ["pendulum-period", "spring-period", "heat-capacity", "centripetal", "centripetal-force", "v-uat", "v2-uas", "work", "power"],
  },
  12: {
    title: "Fields and quanta calculator",
    note: "Class 12 calculates charges, the photoelectric effect, matter waves, fringes, transformers, and half-life.",
    ids: ["coulomb", "einstein-photo", "de-broglie", "young-fringe", "transformer", "half-life"],
  },
};

export function benchFor(grade: number): Bench | null {
  return benches[grade] ?? null;
}

export function promptsFor(grade: number): string[] {
  if (grade <= 2) return ["I push a swing. What happens?", "A ball is still on the floor. How can I make it move?"];
  if (grade <= 5) return ["Why is a morning shadow often long?", "Why can a heavy child balance a light child on a seesaw?"];
  if (grade === 6) return ["A car travels 100 m in 20 s. Find its speed.", "A bus covers 120 km in 2 hours. What is its speed?"];
  if (grade === 7) return ["30 km/h for 2 hours and 60 km/h for 1 hour. Find the average speed.", "A scooter moves at 8 m/s for 5 s. How far does it go?"];
  if (grade === 8) return ["A 40 N force acts on 0.2 m². Find the pressure.", "Sound travels at 340 m/s and an echo returns in 2 s. How far is the wall?"];
  if (grade === 9) return ["A body starts from rest and accelerates at 2 m/s² for 5 s. Find the final velocity.", "A 3 kg box accelerates at 4 m/s². Find the force."];
  if (grade === 10) return ["A current of 2 A flows through a 5 ohm resistor. Find the potential difference.", "An object is 20 cm from a mirror of focal length 10 cm. Find the image distance."];
  if (grade === 11) return ["A simple pendulum is 1 m long. Take g = 9.8 m/s². Find its time period.", "A 2 kg body moves in a circle of radius 0.5 m at 4 m/s. Find the centripetal force."];
  return ["Light of frequency 6 × 10^14 Hz falls on a metal with work function 2 eV. Discuss the photoelectric emission.", "A charge of 2 μC is 0.3 m from a charge of 3 μC in air. Find the force."];
}
