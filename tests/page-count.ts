import { chaptersForGrade } from "../content/curriculum";
import { chapterPages } from "../lib/lesson";

for (let grade = 1; grade <= 12; grade += 1) {
  const counts = chaptersForGrade(grade).map((chapter) => `${chapter.title}:${chapterPages(chapter, grade).length}`);
  console.log(`class ${grade}  ${counts.join("  ")}`);
}
