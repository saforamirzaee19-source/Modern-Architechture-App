const initials = (n) =>
  String(n || "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");

export default function Avatar({ src, name, size = 44, className = "" }) {
  const style = {
    width: size,
    height: size,
    fontSize: Math.round(size * 0.36),
  };
  return src ? (
    <img className={`avatar ${className}`} style={style} src={src} alt={name} />
  ) : (
    <span
      className={`avatar avatar-fallback ${className}`}
      style={style}
      aria-label={name}
    >
      {initials(name)}
    </span>
  );
}
