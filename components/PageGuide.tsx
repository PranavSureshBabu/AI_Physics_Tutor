import { toolByHref } from "@/components/nav";

export function PageGuide({ href }: { href: string }) {
  const tool = toolByHref(href);
  if (!tool) return null;
  return (
    <header className="page-guide">
      <h1 className="page-title">{tool.label}</h1>
    </header>
  );
}
