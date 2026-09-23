import type { BandInfo, GradeInfo } from "./types";

export const bands: BandInfo[] = [
  {
    id: "primary",
    name: "Primary",
    blurb: "Everyday science that later becomes physics. Short lessons, no heavy symbols.",
    grades: [1, 2, 3, 4, 5],
  },
  {
    id: "middle",
    name: "Middle",
    blurb: "NCERT Science, in the physics chapters: motion, light, heat, electricity, magnets, and sound.",
    grades: [6, 7, 8],
  },
  {
    id: "secondary",
    name: "Secondary",
    blurb: "The Class 9 and 10 physics chapters, with the formulas those classes actually use.",
    grades: [9, 10],
  },
  {
    id: "senior",
    name: "Senior Secondary",
    blurb: "NCERT Physics for Classes 11 and 12, from measurement through semiconductors.",
    grades: [11, 12],
  },
];

export const grades: GradeInfo[] = [
  {
    grade: 1,
    band: "primary",
    label: "Class 1",
    subject: "First ideas",
    summary: "Pushes, pulls, shadows, sounds, and hot and cold.",
  },
  {
    grade: 2,
    band: "primary",
    label: "Class 2",
    subject: "First ideas",
    summary: "How things move, light and dark, floating, and sounds near and far.",
  },
  {
    grade: 3,
    band: "primary",
    label: "Class 3",
    subject: "First ideas",
    summary: "Motion, shadows, making sounds, and warm and cool objects.",
  },
  {
    grade: 4,
    band: "primary",
    label: "Class 4",
    subject: "First ideas",
    summary: "Force, friction you can feel, and how light and sound travel.",
  },
  {
    grade: 5,
    band: "primary",
    label: "Class 5",
    subject: "First ideas",
    summary: "Simple machines, everyday gravity, mirrors, and floating.",
  },
  {
    grade: 6,
    band: "middle",
    label: "Class 6",
    subject: "Science · Physics",
    summary: "Measurement and motion, light and shadows, circuits, and magnets.",
  },
  {
    grade: 7,
    band: "middle",
    label: "Class 7",
    subject: "Science · Physics",
    summary: "Speed and time, heat, current, reflection, and wind and pressure.",
  },
  {
    grade: 8,
    band: "middle",
    label: "Class 8",
    subject: "Science · Physics",
    summary: "Force, pressure, friction, sound, charges, light, and the solar system.",
  },
  {
    grade: 9,
    band: "secondary",
    label: "Class 9",
    subject: "Science · Physics",
    summary: "Motion, Newton’s laws, gravitation, work and energy, and sound.",
  },
  {
    grade: 10,
    band: "secondary",
    label: "Class 10",
    subject: "Science · Physics",
    summary: "Reflection and refraction, the eye, electricity, and magnetic effects.",
  },
  {
    grade: 11,
    band: "senior",
    label: "Class 11",
    subject: "Physics",
    summary: "Mechanics, heat, thermodynamics, oscillations, and waves.",
  },
  {
    grade: 12,
    band: "senior",
    label: "Class 12",
    subject: "Physics",
    summary: "Electrostatics through nuclei and semiconductor electronics.",
  },
];
