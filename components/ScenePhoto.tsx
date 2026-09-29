import type { SketchName } from "@/content/types";

const SCENES: Partial<Record<SketchName, string>> = {
  push: "/scenes/scene-push.jpg",
  pull: "/scenes/scene-pull.jpg",
  friction: "/scenes/scene-friction.jpg",
  slope: "/scenes/scene-friction.jpg",
  lever: "/scenes/scene-pull.jpg",
  shadow: "/scenes/scene-shadow.jpg",
  daynight: "/scenes/scene-shadow.jpg",
  solar: "/scenes/scene-shadow.jpg",
  sound: "/scenes/scene-sound.jpg",
  echo: "/scenes/scene-sound.jpg",
  wave: "/scenes/scene-sound.jpg",
  magnet: "/scenes/scene-magnet.jpg",
  field: "/scenes/scene-magnet.jpg",
  heat: "/scenes/scene-heat.jpg",
  motion: "/scenes/scene-motion.jpg",
  projectile: "/scenes/scene-motion.jpg",
  gravity: "/scenes/scene-motion.jpg",
};

export function ScenePhoto({ name, alt }: { name: SketchName; alt: string }) {
  const src = SCENES[name];
  if (!src) return null;
  return <img className="scene-photo" src={src} alt={alt} />;
}
