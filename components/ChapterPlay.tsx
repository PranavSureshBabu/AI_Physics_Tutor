function kindFor(chapterId: string) {
  if (/light|shadow|mirror|eye|colour|color|ray/.test(chapterId)) return "shadow";
  if (/sound|wave/.test(chapterId)) return "sound";
  if (/heat|warm|hot/.test(chapterId)) return "heat";
  if (/float|air|fluid/.test(chapterId)) return "float";
  if (/sky|earth|day|grav|sun/.test(chapterId)) return "sky";
  if (/magnet|electric|cell|current/.test(chapterId)) return "magnet";
  if (/motion|travel|speed|friction/.test(chapterId)) return "roll";
  return "push";
}

export function ChapterPlay({ chapterId, title }: { chapterId: string; title: string }) {
  const kind = kindFor(chapterId);
  return (
    <figure className={`play-scene play-${kind}`}>
      <div className="play-stage" role="img" aria-label={`A short moving picture for ${title}`}>
        <span className="play-a" />
        <span className="play-b" />
        <span className="play-c" />
      </div>
    </figure>
  );
}

export function scenePhoto(chapterId: string) {
  if (/force|push|pull|machine|pulley/.test(chapterId)) return "/scenes/scene-push.jpg";
  if (/friction/.test(chapterId)) return "/scenes/scene-friction.jpg";
  if (/shadow|light|mirror/.test(chapterId)) return "/scenes/scene-shadow.jpg";
  if (/sound/.test(chapterId)) return "/scenes/scene-sound.jpg";
  if (/magnet/.test(chapterId)) return "/scenes/scene-magnet.jpg";
  if (/heat|warm|hot/.test(chapterId)) return "/scenes/scene-heat.jpg";
  if (/motion|travel|speed|sky/.test(chapterId)) return "/scenes/scene-motion.jpg";
  return null;
}
