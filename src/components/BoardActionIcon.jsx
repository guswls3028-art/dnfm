const ICONS = {
  chevronDown: (
    <path d="m7 10 5 5 5-5" />
  ),
  edit: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  message: (
    <path d="M5 5h14v10H9l-4 4Z" />
  ),
  pin: (
    <>
      <path d="m14 4 6 6-3 1-4 4v4l-2 2-2-6-6-2 2-2h4l4-4Z" />
      <path d="m4 20 5-5" />
    </>
  ),
  recommend: (
    <>
      <path d="M12 4v16" />
      <path d="m6 10 6-6 6 6" />
    </>
  ),
  reply: (
    <>
      <path d="m10 8-5 5 5 5" />
      <path d="M5 13h9a5 5 0 0 1 5 5v1" />
    </>
  ),
  report: (
    <>
      <path d="M5 21V4" />
      <path d="M5 5h11l-1 4 1 4H5" />
    </>
  ),
  shield: (
    <path d="M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6Z" />
  ),
  trash: (
    <>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="m6 6 1 15h10l1-15" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </>
  ),
  unlock: (
    <>
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 7.4-2" />
    </>
  ),
};

export default function BoardActionIcon({ name, className = "" }) {
  const icon = ICONS[name];

  if (!icon) return null;

  return (
    <svg
      className={`action-icon${className ? ` ${className}` : ""}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {icon}
    </svg>
  );
}
