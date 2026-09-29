export function chapterPicture(chapterId: string, kind: "anime" | "photo") {
  return `/chapters/${chapterId}-${kind}.jpg`;
}

export function chapterGallery(chapterId: string) {
  const pictures = [chapterPicture(chapterId, "anime"), chapterPicture(chapterId, "photo")];
  if (/motion|speed|travel|force|push|pull|machine|pulley/.test(chapterId)) {
    pictures.push("/scenes/scene-motion.jpg", "/scenes/scene-push.jpg", "/scenes/scene-pull.jpg");
  } else if (/friction/.test(chapterId)) {
    pictures.push("/scenes/scene-friction.jpg", "/scenes/scene-push.jpg");
  } else if (/light|shadow|mirror|ray|eye|colour|color/.test(chapterId)) {
    pictures.push("/scenes/scene-shadow.jpg");
  } else if (/sound|wave/.test(chapterId)) {
    pictures.push("/scenes/scene-sound.jpg");
  } else if (/magnet|electric|cell|current/.test(chapterId)) {
    pictures.push("/scenes/scene-magnet.jpg");
  } else if (/heat|warm|hot/.test(chapterId)) {
    pictures.push("/scenes/scene-heat.jpg");
  } else if (/sky|grav|earth/.test(chapterId)) {
    pictures.push("/scenes/scene-motion.jpg");
  }
  return [...new Set(pictures)];
}

export function ChapterScene({
  chapterId,
  title,
  kind,
  className,
}: {
  chapterId: string;
  title: string;
  kind: "anime" | "photo";
  className?: string;
}) {
  const label = kind === "anime" ? `${title} illustration` : `${title} photograph`;
  return <img className={className ?? "chapter-scene"} src={chapterPicture(chapterId, kind)} alt={label} />;
}
