export function PhysixMark() {
  return (
    <span className="physix-mark" aria-hidden="true">
      <svg viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="2.4" fill="white" />
        <ellipse cx="16" cy="16" rx="11" ry="4.6" fill="none" stroke="white" strokeWidth="1.6" />
        <ellipse cx="16" cy="16" rx="11" ry="4.6" fill="none" stroke="white" strokeWidth="1.6" transform="rotate(60 16 16)" />
        <ellipse cx="16" cy="16" rx="11" ry="4.6" fill="none" stroke="white" strokeWidth="1.6" transform="rotate(120 16 16)" />
      </svg>
    </span>
  );
}
