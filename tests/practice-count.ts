import { chaptersForGrade } from "../content/curriculum";
import { practiceForGrade } from "../lib/practice-set";
import { revisionTopics } from "../lib/revision-sheet";

for (let grade = 1; grade <= 12; grade += 1) {
  const practice = practiceForGrade(grade);
  const chapters = chaptersForGrade(grade);
  const authored = chapters.reduce((sum, chapter) => sum + chapter.topics.reduce((inner, topic) => inner + topic.practice.length, 0), 0);
  const sheets = chapters.flatMap((chapter) => revisionTopics(chapter, grade));
  const points = sheets.reduce((sum, topic) => sum + topic.points.length, 0);
  const more = sheets.reduce((sum, topic) => sum + topic.more.length, 0);
  console.log(`class ${grade}: practice ${practice.length} (was ${authored}), points ${points}, also ${more}`);
  if (practice.length <= authored) throw new Error(`class ${grade} practice did not grow`);
  if (sheets.some((topic) => topic.points.length === 0 || topic.more.length === 0)) {
    const thin = sheets.filter((topic) => topic.more.length === 0).map((topic) => topic.id);
    if (thin.length) console.log("  no extra lines:", thin.join(", "));
  }
}
